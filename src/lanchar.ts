import { IFilterParam, Classtype, IPipeTransform, IResponseFilter, ILogger, IExpressRequest, IExpressResponse, IExpressNext, IErrorParser } from './interface';
import { ArgumentParamMeta, ActionMethodMeta, ActionClassMeta, PropertyParamMeta, MethodMeta } from './metadata';
import { Paramtype } from './common';
import { ExceptionConvert } from '@napp/exception';




export class Lanchar {

    constructor(private logger: ILogger, private errorParser: IErrorParser) {

    }

    controllers: any = {};

    defaultResponse?: IResponseFilter;
    responseFilters: IResponseFilter[] = [];


    async response(actionResult: any, req: IExpressRequest, res: IExpressResponse) {

        let param: IFilterParam = {
            actionResult,
            expressRes: res,
            expressReq: req,
            handled: false,

            refilter: async (result) => {
                return await this.response(result, req, res);
            }
        }

        for (const filter of this.responseFilters) {
            try {
                await filter.filter(param);
            } catch (error) {
                this.logger('error', "the filter cannot send response", { actionResult, filter })
                throw ExceptionConvert(error);
            }

            if (param.handled) {
                return;
            }
        }


        if (this.defaultResponse) {
            try {
                await this.defaultResponse.filter(param);
            } catch (error) {
                this.logger('error', "default filter cannot send response", { actionResult, filter: this.defaultResponse })
                throw ExceptionConvert(error);
            }

            if (param.handled) {
                return;
            }
        }

        throw new Error('not handled response filter');
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

    resolveValue(type: Paramtype, fieldnames: string[], req: IExpressRequest) {


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

    async  propertiesInject(inst: any, propery: PropertyParamMeta[], req: IExpressRequest) {
        for (let p of propery) {
            let starter = this.resolveValue(p.paramtype, p.reqFieldnames, req);

            if (starter.resolve) {
                let value = await this.transformValue(starter.value, p.pipes);
                inst[p.propertyName] = value;
            }
        }
    }
    async  classaction(classMeta: ActionClassMeta,
        req: IExpressRequest,
        res: IExpressResponse,
        next: IExpressNext) {

        let ins = new classMeta.Actionclass();

        // console.log('333333 ', ins)

        try {
            await this.propertiesInject(ins, classMeta.properyParams, req);
            let r = await this.methodExecut(ins, { error: null }, classMeta.actionMethod, req);

            await this.response(r, req, res);

        } catch (error) {

            try {
                if (classMeta.errorHandle1) {
                    let r = await this.methodCall(ins, classMeta.errorHandle1, [error]);
                    return await this.response(r, req, res);
                }

                // console.log('66666666')

                for (let { instanceOf, when, meta } of classMeta.errorMethods) {
                    if (instanceOf && (error instanceof instanceOf)) {
                        let r = await this.methodExecut(ins, { error }, meta, req);
                        return await this.response(r, req, res);

                    }
                    if (when && typeof when == 'function' && when(error)) {
                        let r = await this.methodExecut(ins, { error }, meta, req);
                        return await this.response(r, req, res);
                    }
                }
                // console.log('55555555555555')
                if (classMeta.errorHandle2) {
                    let r = await this.methodCall(ins, classMeta.errorHandle2, [error]);
                    return await this.response(r, req, res);
                }

                next(error);
            } catch (error) {
                console.log('cannot execut error handle', error);
                res.end("cannot execut error handle");
            }
        }
    }



    async  methodaction(actionmethodMeta: ActionMethodMeta,
        req: IExpressRequest,
        res: IExpressResponse,
        next: IExpressNext) {

        //let ins = this.getCont(actionmethodMeta.fullname, actionmethodMeta.Controllerclass);
        let ins = new actionmethodMeta.Controllerclass();
        try {

            let r = await this.methodExecut(ins, { error: null }, actionmethodMeta.methodMeta, req)
            await this.response(r, req, res);
        } catch (error) {

            try {
                if (actionmethodMeta.errorHandle) {
                    let r = await this.methodCall(ins, actionmethodMeta.errorHandle, [error]);
                    return await this.response(r, req, res);

                }

                for (let { instanceOf, when, meta } of actionmethodMeta.errorMethods) {
                    if (instanceOf && (error instanceof instanceOf)) {
                        let r = await this.methodExecut(ins, { error }, meta, req);
                        await this.response(r, req, res);
                        return;
                    }
                    if (when && typeof when == 'function' && when(error)) {
                        let r = await this.methodExecut(ins, { error }, meta, req);
                        return await this.response(r, req, res);
                    }
                }

                next(error);
            } catch (error) {
                console.log('cannot execut error handle', error);
                res.end('cannot execut error handle');
            }
        }
    }



    async  argumentBuild(argumentMetas: ArgumentParamMeta[], req: IExpressRequest) {

        //console.log('argumentMetas', argumentMetas, req.body)

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

    async  methodExecut(ins: Object, errParam: { error: any }, meta: MethodMeta, req: IExpressRequest) {
        let args = await this.argumentBuild(meta.argumentParams, req);
        if (errParam.error) {
            args[0] = errParam.error;
        }
        return this.methodCall(ins, meta.methodname, args);
    }
}