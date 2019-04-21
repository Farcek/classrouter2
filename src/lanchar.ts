import express from 'express';
import { IFilterParam, Classtype, IPipeTransform, IResponseFilter } from './interface';
import { ArgumentParamMeta, ActionMethodMeta, ActionClassMeta, PropertyParamMeta, MethodMeta } from './metadata';
import { Paramtype } from './common';
import { Container } from 'inversify';

class ResponseFilterError {
    constructor(public error: any, public filter: IResponseFilter) {

    }
}

export class Lanchar {

    constructor(public container: Container) {

    }

    controllers: any = {};

    defaultResponse?: IResponseFilter;
    responseFilters: IResponseFilter[] = []
    async response(actionResult: any, req: express.Request,
        res: express.Response,
        next: express.NextFunction) {

        let param: IFilterParam = {
            actionResult,
            expressRes: res,
            expressReq: req,
            handled: false
        }

        for (const filter of this.responseFilters) {
            try {
                await filter.filter(param);
            } catch (error) {
                throw new ResponseFilterError(error, filter);
            }

            if (param.handled) {
                return;
            }
        }


        if (this.defaultResponse) {
            try {
                await this.defaultResponse.filter(param);
            } catch (error) {
                throw new ResponseFilterError(error, this.defaultResponse);
            }

            if (param.handled) {
                return;
            }
        }

        res.end('not handled response filter');
    }

    transformValue(startValue: any, pipes: IPipeTransform[]) {
        return pipes.reduce((p, pipe) => p.then(v => pipe.transform(v)), Promise.resolve(startValue))
    }

    findValue(store: any, fieldnames: string[]) {
        if (fieldnames.length == 0) {
            return {
                resolve: true,
                value: store
            };
        }
        for (let f of fieldnames) {
            if (f in store) {
                return {
                    resolve: true,
                    value: store[f]
                };
            }
        }
        return {
            resolve: false,
            value: undefined
        };
    }

    resolveValue(type: Paramtype, fieldnames: string[], req: express.Request) {


        if (type == Paramtype.Body) {
            return this.findValue(req.body, fieldnames);
        } else if (type == Paramtype.Query) {
            return this.findValue(req.query, fieldnames);
        } else if (type == Paramtype.Path) {
            return this.findValue(req.params, fieldnames);
        } else if (type == Paramtype.Cookie) {
            return this.findValue(req.cookies, fieldnames);
        } else if (type == Paramtype.Header) {
            return this.findValue(req.headers, fieldnames);
        } else if (type == Paramtype.Request) {
            return this.findValue(req, fieldnames);
        }
        return {
            resolve: false,
            value: undefined
        };
    }

    async  propertiesInject(inst: any, propery: PropertyParamMeta[], req: express.Request) {
        for (let p of propery) {
            let starter = this.resolveValue(p.paramtype, p.reqFieldnames, req);

            if (starter.resolve) {
                let value = await this.transformValue(starter.value, p.pipes);
                inst[p.propertyName] = value;
            }
        }
    }
    async  classaction(classMeta: ActionClassMeta,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction) {

        let ins = this.container.get(classMeta.Actionclass);

        try {
            await this.propertiesInject(ins, classMeta.properyParams, req);
            let r = await this.methodExecut(ins, { error: null }, classMeta.actionMethod, req)
            await this.response(r, req, res, next);
        } catch (error) {

            if (error instanceof ResponseFilterError) {
                console.log('cannot send response filter error', error.error, error.filter);
                res.end();
                return;
            }

            if (classMeta.errorHandle1) {
                let r = await this.methodCall(ins, classMeta.errorHandle1, [error]);
                await this.response(r, req, res, next);
                return;
            }

            for (let { instanceOf, when, meta } of classMeta.errorMethods) {
                if (instanceOf && (error instanceof instanceOf)) {
                    let r = await this.methodExecut(ins, { error }, meta, req);
                    await this.response(r, req, res, next);
                    return;
                }
                if (when && typeof when == 'function' && when(error)) {
                    let r = await this.methodExecut(ins, { error }, meta, req);
                    await this.response(r, req, res, next);
                    return;
                }
            }
            if (classMeta.errorHandle2) {
                let r = await this.methodCall(ins, classMeta.errorHandle2, [error]);
                await this.response(r, req, res, next);
            }

        }
    }



    // getCont(name: string, cClass: Classtype) {
    //     if (name in this.controllers) {
    //         return this.controllers[name];
    //     }

    //     return this.controllers[name] = new cClass();
    // }

    async  methodaction(actionmethodMeta: ActionMethodMeta,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction) {

        //let ins = this.getCont(actionmethodMeta.fullname, actionmethodMeta.Controllerclass);
        let ins = this.container.get(actionmethodMeta.Controllerclass);
        try {

            let r = await this.methodExecut(ins, { error: null }, actionmethodMeta.methodMeta, req)
            await this.response(r, req, res, next);
        } catch (error) {

            if (error instanceof ResponseFilterError) {
                console.log('cannot send response filter error', error.error, error.filter);
                res.end();
                return;
            }

            if (actionmethodMeta.errorHandle) {
                let r = await this.methodCall(ins, actionmethodMeta.errorHandle, [error]);
                await this.response(r, req, res, next);
                return;
            }

            for (let { instanceOf, when, meta } of actionmethodMeta.errorMethods) {
                if (instanceOf && (error instanceof instanceOf)) {
                    let r = await this.methodExecut(ins, { error }, meta, req);
                    await this.response(r, req, res, next);
                    return;
                }
                if (when && typeof when == 'function' && when(error)) {
                    let r = await this.methodExecut(ins, { error }, meta, req);
                    await this.response(r, req, res, next);
                    return;
                }
            }
        }
    }



    async  argumentBuild(argumentMetas: ArgumentParamMeta[], req: express.Request) {
        let args: any[] = [];
        for (let p of argumentMetas) {
            let starter = this.resolveValue(p.paramtype, p.reqFieldnames, req);

            if (starter.resolve) {
                let value = await this.transformValue(starter.value, p.pipes);
                args[p.argIndex] = value;
            }
        }
        return args
    }


    async methodCall(ins: any, method: string, args: any[]) {
        try {

            if (method in ins && typeof ins[method] === 'function') {
                let fn: Function = ins[method];
                let r = fn.apply(ins, args);

                return await Promise.resolve(r);
            }
            console.log('not found method', method, ins);
            throw new Error('not found method. method:' + method);
        } catch (error) {
            throw error;
        }
    }

    async  methodExecut(ins: Object, errParam: { error: any }, meta: MethodMeta, req: express.Request) {
        let args = await this.argumentBuild(meta.argumentParams, req);
        if (errParam.error) {
            args[0] = errParam.error;
        }
        return this.methodCall(ins, meta.methodname, args);
    }
}