import "reflect-metadata";
import { Container, ContainerInstance } from "typedi";

import { IControllerType } from "./controller/interface";
import { ControllerMetadata, getControllerMetadata } from "./controller/metadata";

import { IAction, IActionType } from "./action/interface";
import { ActionMetadata, getActionMetadata } from "./action/metadata";
import { IPipeTransform } from "./pipe/interface";
import { IResponseFilter, IFilterParam } from "./response/interface";

import { ParamMetadata } from "./param/metadata";
import { Paramtype } from "./common/paramtype.enum";

import { HttpException, ServerException } from "./exceptions";
import { HttpMethod } from "./common/http-method.enum";
import * as express from "express";


const uuid = require('uuid');

export interface IFactoryOptions {
    basepath?: string
    app: express.Application
    controllerTypes: IControllerType[]
    responseFilters: IResponseFilter[]

    /**
     * error action omno. app-routed zalgagdana
     */
    notFoundHandler?: (req: any, res: any, next: any) => void
}
export class ClassrouterFactory {

    app: express.Application;
    basepath?: string

    controllerTypes: IControllerType[]

    responseFilters: IResponseFilter[]
    notFoundHandler?: (req: any, res: any, next: any) => void

    constructor(options: IFactoryOptions) {
        this.basepath = options.basepath;
        this.app = options.app;
        this.controllerTypes = options.controllerTypes;
        this.responseFilters = options.responseFilters;
        this.notFoundHandler = options.notFoundHandler;
    }

    log(...msg: any[]) {
        console.log(...msg);
    }
    logError(error: HttpException) {
        console.log(`--------------- ${error.name} -------------------`)
        console.log(error.message)
        console.log(error.stack)
    }

    async setupController(ctrlType: IControllerType, parent: express.Router, basePath: string) {
        let cMeta = getControllerMetadata(ctrlType);
        if (cMeta) {
            const router = express.Router();

            let befores = cMeta.beforeMiddlewares.map(f => f());
            if (befores.length > 0) router.use(befores);

            await Promise.all(cMeta.actions.map(async (actionType) => {
                await this.setupAction(actionType, router, `${basePath}${cMeta.path}`);
            }));

            await Promise.all(cMeta.childControllers.map(async (cType) => {
                await this.setupController(cType, router, `${basePath}${cMeta.path}`);
            }));

            parent.use(cMeta.path, router);
        } else {
            throw new Error(`not found controller meta ${ctrlType}`);
        }
    }


    defaultValue(ins: any, property: string) {
        if (ins && property in ins) {
            return ins[property];
        }
        return undefined;
    }

    async resolveValue(type: Paramtype, fieldnames: string[], req: express.Request, defaultValue: any) {

        let find = (store: any) => {
            if (fieldnames.length == 0) {
                return store
            }
            for (let f of fieldnames) {
                if (f in store) {
                    return store[f];
                }
            }
            return defaultValue;
        }

        if (type == Paramtype.Body) {
            return find(req.body);
        } else if (type == Paramtype.Query) {
            return find(req.query);
        } else if (type == Paramtype.Path) {
            return find(req.params);
        } else if (type == Paramtype.Cookie) {
            return find(req.cookies);
        } else if (type == Paramtype.Header) {
            return find(req.headers);
        } else if (type == Paramtype.Request) {
            return find(req);
        }
    }

    transformValue(startValue: any, pipes: IPipeTransform[]) {
        return pipes.reduce((p, pipe) => p.then(v => pipe.transform(v)), Promise.resolve(startValue))
    }
    async result(actionResult: any, req: express.Request, res: express.Response) {

        let param: IFilterParam = {
            actionResult: actionResult,
            expressRes: res,
            expressReq: req,
            handled: false
        }

        for (const filter of this.responseFilters) {
            await filter.filter(param);
            if (param.handled) {
                return;
            }
        }

        if (actionResult) {
            res.status(200).json(actionResult);
        } else {
            res.end();
        }
    }

    errorParse(error: any) {
        if (error instanceof HttpException) {
            return error;
        }

        if (error instanceof Error) {
            return new ServerException(error.message)
        }

        if (typeof error === 'string') {
            return new ServerException(error)
        }

        return new ServerException(error.message || '' + error)
    }

    async  actinHandle(actionType: IActionType, aMeta: ActionMetadata) {



        const action = async (container: ContainerInstance, req: express.Request, res: express.Response) => {

            try {
                let actionInstance = container.get(actionType);
                try {
                    // bind properies
                    await Promise.all(aMeta.properties.map(async (prop) => {
                        let defaultvalue = this.defaultValue(actionInstance, prop.propery);
                        let initVal = await this.resolveValue(prop.type, prop.fieldname, req, defaultvalue);
                        let value = await this.transformValue(initVal, prop.pipes);
                        (<any>actionInstance)[prop.propery] = value;
                    }));

                    // bind arguments
                    let actionArgs = await Promise.all(aMeta.actionArguments.map(async (prop) => {
                        let initVal = await this.resolveValue(prop.type, prop.fieldname, req, undefined);
                        let value = await this.transformValue(initVal, prop.pipes);
                        return value;
                    }));


                    let result = await Promise.resolve(actionInstance.action(...actionArgs));

                    await this.result(result, req, res);

                } catch (error) {
                    //let _err = this.errorParse(error);

                    if (actionInstance.onError && typeof actionInstance.onError === 'function') {
                        let errorArgs = await Promise.all(aMeta.errorArguments.map(async (prop) => {
                            let initVal = await this.resolveValue(prop.type, prop.fieldname, req, undefined);
                            let value = await this.transformValue(initVal, prop.pipes);
                            return value;
                        }));
                        // remove first arg
                        errorArgs.splice(0, 1);

                        let result = await Promise.resolve(actionInstance.onError(error, ...errorArgs));
                        await this.result(result, req, res);
                    } else {
                        throw error;
                    }
                }
            } catch (error) {
                let _err = this.errorParse(error);
                this.logError(_err);
                await this.result(_err, req, res);
            }
        }

        return (req: express.Request, res: express.Response) => {
            const rid = uuid();
            action(Container.of(rid), req, res)
                .then(() => {
                    Container.reset(rid);
                })
        }

    }

    async setupAction(actionType: IActionType, router: express.Router, basepath: string) {

        let aMeta = getActionMetadata(actionType);
        let handle = await this.actinHandle(actionType, aMeta);
        let befores = aMeta.beforeMiddlewares.map(f => f());
        let handlers = [...befores, handle];

        aMeta.paths.map(path => {
            if (aMeta.method == HttpMethod.Get) {
                router.get(path, handlers);
                this.log(`register action: GET ${basepath}-${path}`);
            } else if (aMeta.method == HttpMethod.Post) {
                router.post(path, handlers);
                this.log(`register action: POST ${basepath}-${path}`);
            } else if (aMeta.method == HttpMethod.Put) {
                router.put(path, handlers);
                this.log(`register action: PUT ${basepath}-${path}`);
            } else if (aMeta.method == HttpMethod.Delete) {
                router.delete(path, handlers);
                this.log(`register action: DEL ${basepath}-${path}`);
            } else if (aMeta.method == HttpMethod.All) {
                router.all(path, handlers);
                this.log(`register action: ALL ${basepath}-${path}`);
            } else {
                throw new Error("not suported method");
            }
        });

    }

    setupErrorhandle() {

        if (this.notFoundHandler) {
            this.app.use(this.notFoundHandler);
        }

        this.app.use((err: any, req: any, res: any, next: any) => {
            let _err = this.errorParse(err);
            this.result(_err, req, res);
        })
    }

    async initlize() {
        await Promise.all(this.controllerTypes.map(async (ctrlType) => {
            await this.setupController(ctrlType, this.app, this.basepath || '');
        }));

        this.setupErrorhandle();
    }


}