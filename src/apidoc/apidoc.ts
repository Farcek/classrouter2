import { getControllerMetadata, ControllerMetadata } from "../controller/metadata";
import { getActionMetadata, ActionMetadata } from "../action/metadata";
import { Paramtype } from "../common/paramtype.enum";
import { HttpMethod } from "../common/http-method.enum";
import { ParamMetadata, ArgumentMetadata } from "../param/metadata";
import { ReflectVariable, ReflectDescription, ClassType, ReflectMeta } from "@napp/common";

import { schemaFactoryForMeta, schemaFactory } from "./openapi";

export interface IApiDocInfo {
    title: string;
    version: string;

    description?: string;

    termsOfService?: string;
    contact?: {
        name: string;
        url: string;
        email: string;
    };

    license?: {
        name: string;
        url?: string;
    }
}

export interface IApiDocServers {
    [index: number]: { url: string, description: string }
}

export interface IApiDocResponse {
    type: ClassType;
    description?: string;

    /**
     * 
     */
    mediaType?: string;

    isArray?: boolean;

    status?: number;

}

export class ApiDocSwagger {

    swaggerJson = {
        openapi: "3.0.0",
        info: {
            "version": "1.0.1",
            "title": "Api Service"
        } as IApiDocInfo,
        "servers": [
            {
                "url": "https://dev-server.com/v1",
                "description": "Development server"
            },
            {
                "url": "https://staging-server.com/v1",
                "description": "Staging server"
            },
            {
                "url": "https://api.prod-server.com/v1",
                "description": "Production server"
            }
        ] as IApiDocServers,
        // "host": "petstore.swagger.io",
        // "basePath": "/api",
        "schemes": [
            "http",
            "https"
        ],
        "consumes": [
            "application/json"
        ],
        "produces": [
            "application/json"
        ],
        paths: {

        },
        components: {
            schemas: {

            }
        }

    }

    constructor(public mainController: ClassType) {


        let info: IApiDocInfo = Reflect.getMetadata("api:doc:info", mainController)


        if (info) {
            this.swaggerJson.info = info;
        }

        let servers: IApiDocServers = Reflect.getMetadata("api:doc:servers", mainController)


        if (servers) {
            this.swaggerJson.servers = servers;
        }


        let cMeta = getControllerMetadata(mainController);
        this.controllerMap(cMeta, '', '');
    }

    buildParam(p: ParamMetadata | ArgumentMetadata, paramType: string, aMeta: ActionMetadata, requestBody: any) {

        if (p instanceof ParamMetadata) {

            let variableMeta = ReflectVariable.getVariableMeta(aMeta.actionClass, p.propery);

            if (variableMeta && p.fieldname.length) {

                let dMeta = ReflectDescription.getMeta(aMeta.actionClass, p.propery);

                console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa", p.propery, variableMeta, )

                return {
                    name: p.fieldname.join(" | ") || "*",
                    summary: `${p.fieldname} - su`,
                    description: dMeta && dMeta.Description || "",
                    in: paramType,
                    schema: schemaFactoryForMeta(variableMeta, this.swaggerJson.components.schemas)
                };
            }

            if (variableMeta && p.fieldname.length == 0) {
                let properyDescriptionMeta = ReflectDescription.getMeta(aMeta.actionClass, p.propery);
                let modelDescriptionMeta = variableMeta.TypeRef && ReflectDescription.getMeta(variableMeta.TypeRef);

                requestBody.description = (properyDescriptionMeta && properyDescriptionMeta.Description) || (modelDescriptionMeta && modelDescriptionMeta.Description) || "";
                requestBody.required = true;
                requestBody.content = {
                    "application/json": {
                        schema: schemaFactoryForMeta(variableMeta, this.swaggerJson.components.schemas)
                    }
                };

                return false;
            }
        }

        if (p instanceof ParamMetadata) {

            return {
                name: p.fieldname.join(" | "),
                description: "my pram description",
                in: paramType,
                schema: {
                    type: "string",
                }
            };

        }
    }

    buildResponse(responseMetas: IApiDocResponse[]) {
        if (responseMetas.length == 0) {
            return {
                "default": {
                    "description": "not defined response"
                }
            }
        }

        let rest: any = {};

        responseMetas.map((it) => {
            let status = "" + (it.status || 200);

            let dMeta = ReflectDescription.getMeta(it.type);


            let description = it.description || (dMeta && dMeta.Description) || "";
            let mt = it.mediaType || "application/json";
            let schema = schemaFactory(it.type, it.isArray || false, this.swaggerJson.components.schemas);
            rest[status] = {
                description,
                content: {
                    [mt]: {
                        schema
                    }
                }
            }
        });

        return rest;
    }
    actionMap(aMeta: ActionMetadata, basePath: string, controller: string) {
        let params: any[] = [];
        let requestBody: any = {};
        aMeta.properties.map(p => {
            let m: any;
            if (p.type == Paramtype.Path) {
                m = this.buildParam(p, "path", aMeta, requestBody);
            } else if (p.type == Paramtype.Query) {
                m = this.buildParam(p, "query", aMeta, requestBody);
            } else if (p.type == Paramtype.Header) {
                m = this.buildParam(p, "header", aMeta, requestBody);
            } else if (p.type == Paramtype.Cookie) {
                m = this.buildParam(p, "cookie", aMeta, requestBody);
            } else if (p.type == Paramtype.Body) {
                m = this.buildParam(p, "body", aMeta, requestBody);
            }

            if (m) {
                params.push(m);
            }
        });
        aMeta.actionArguments.map(arg => {
            let m: any;
            if (arg.type == Paramtype.Path) {
                m = this.buildParam(arg, "path", aMeta, requestBody);
            } else if (arg.type == Paramtype.Query) {
                m = this.buildParam(arg, "query", aMeta, requestBody);
            } else if (arg.type == Paramtype.Header) {
                m = this.buildParam(arg, "header", aMeta, requestBody);
            } else if (arg.type == Paramtype.Cookie) {
                m = this.buildParam(arg, "cookie", aMeta, requestBody);
            } else if (arg.type == Paramtype.Body) {
                m = this.buildParam(arg, "body", aMeta, requestBody);
            }
            if (m) {
                params.push(m);
            }
        });


        let resMeta: IApiDocResponse[] = Reflect.getMetadata("api:doc:response", aMeta.actionClass.prototype, "action") || [];

        let resp = this.buildResponse(resMeta);

        aMeta.paths.map(actionPath => {
            let pOptions: any = {
                summary: "my summary",
                description: "my desc",
                parameters: params,
                tags: [controller],

                responses: resp
            };

            if (requestBody && requestBody.content) {
                pOptions.requestBody = requestBody;
            }


            this.addPath(`${basePath}${actionPath}`, this.parseMethod(aMeta.method), pOptions);
        });


    }

    parseMethod(m: HttpMethod) {
        if (m == HttpMethod.Get) {
            return "get";
        }
        if (m == HttpMethod.Delete) {
            return "delete";
        }
        if (m == HttpMethod.Post) {
            return "post";
        }
        if (m == HttpMethod.Put) {
            return "put";
        }

        return "options";
    }

    addPath(path: string, method: string, dda: any) {
        var paths: any = this.swaggerJson.paths;

        var pp = paths[path] || (paths[path] = {});
        pp[method] = dda;
    }
    controllerMap(cMeta: ControllerMetadata, basePath: string, controller: string) {
        let controllerName = controller && cMeta.name ? `${controller}.${cMeta.name}` : cMeta.name;
        cMeta.actions.map((aClass) => {
            let aMeta = getActionMetadata(aClass);
            this.actionMap(aMeta, `${basePath}${cMeta.path}`, controllerName);
        });

        cMeta.childControllers.map((ctrlType) => {
            let chMeta = getControllerMetadata(ctrlType);
            this.controllerMap(chMeta, `${basePath}${cMeta.path}`, controllerName);
        });
    }





    action() {
        return (req: any, res: any) => res.json(this.swaggerJson);
    }
}

