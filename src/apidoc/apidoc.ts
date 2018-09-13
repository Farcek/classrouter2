import { ClassrouterFactory } from "..";
import { getControllerMetadata, ControllerMetadata } from "../controller/metadata";
import { getActionMetadata, ActionMetadata } from "../action/metadata";
import { Paramtype } from "../common/paramtype.enum";
import { HttpMethod } from "../common/http-method.enum";
import { ParamMetadata, ArgumentMetadata } from "../param/metadata";
import { ReflectVariable, ReflectDescription } from "@napp/common";

import { VariableMeta } from "@napp/common";
import { VariablePrimitiveType } from "@napp/common";
import { schemaFactory, schemaFactoryForMeta } from "./openapi";

export class ApiDocSwagger {
    constructor(public factory: ClassrouterFactory) {

        factory.controllerTypes.map((ctrlType) => {
            let cMeta = getControllerMetadata(ctrlType);
            this.controllerMap(cMeta, factory.basepath || '', '');
        });
    }



    // factoryTypeSchema(type: VariableMeta) {
    //     if (type.Type === VariableType.Primitive) {
    //         var t = "void";
    //         switch (type.Refrence as VariablePrimitiveType) {
    //             case VariablePrimitiveType.Boolean: t = "boolean"; break;
    //             case VariablePrimitiveType.Date: t = "date"; break;
    //             case VariablePrimitiveType.Float: t = "float"; break;
    //             case VariablePrimitiveType.Int: t = "int"; break;
    //             case VariablePrimitiveType.String: t = "string"; break;
    //             case VariablePrimitiveType.Symbol: t = "symbol"; break;
    //         }
    //         return { type: t };
    //     }
    //     return {
    //         $ref: ""
    //     }
    // }

    buildParam(p: ParamMetadata | ArgumentMetadata, paramType: string, aMeta: ActionMetadata) {

        if (p instanceof ParamMetadata) {
            let pMeta = ReflectVariable.getVariableMeta(aMeta.actionClass, p.propery);

            if (pMeta && p.fieldname) {
                
                return {
                    name: p.fieldname.join(" | "),
                    summary: `${p.fieldname} - su`,
                    description: ReflectDescription.getMeta(aMeta.actionClass, p.propery) || "",
                    in: paramType,
                    schema: schemaFactoryForMeta(pMeta, this.swaggerJson.components.schemas)
                }
            }
        }




        // let r = this.buildModel(<any>p.refType);
        return {
            name: p.fieldname.join(" | "),
            description: "my pram description",
            in: paramType,
            schema: {
                type: "string",
            }
        }
    }
    actionMap(aMeta: ActionMetadata, basePath: string, controller: string) {
        let params: any[] = [];
        aMeta.properties.map(p => {
            if (p.type == Paramtype.Path) {
                params.push(this.buildParam(p, "path", aMeta));
            } else if (p.type == Paramtype.Query) {
                params.push(this.buildParam(p, "query", aMeta));
            } else if (p.type == Paramtype.Header) {
                params.push(this.buildParam(p, "header", aMeta));
            } else if (p.type == Paramtype.Cookie) {
                params.push(this.buildParam(p, "cookie", aMeta));
            }
        });
        aMeta.actionArguments.map(arg => {
            if (arg.type == Paramtype.Path) {
                params.push(this.buildParam(arg, "path", aMeta));
            } else if (arg.type == Paramtype.Query) {
                params.push(this.buildParam(arg, "query", aMeta));
            } else if (arg.type == Paramtype.Header) {
                params.push(this.buildParam(arg, "header", aMeta));
            } else if (arg.type == Paramtype.Cookie) {
                params.push(this.buildParam(arg, "cookie", aMeta));
            }
        });



        aMeta.paths.map(p => {
            this.addPath(`${basePath}${p}`, this.parseMethod(aMeta.method), {
                summary: "my summary",
                description: "my desc",
                parameters: params,
                tags: [controller],
                responses: {
                    "200": {
                        description: "pet response",
                        content: {
                            "application/json": {
                                "schema": {
                                    $ref: '#/components/schemas/Pet'
                                }
                            }
                        }
                    },
                    "default": {
                        "description": "Unexpected error",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Error"
                                }
                            }
                        }
                    }
                }
            });
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



    swaggerJson = {
        openapi: "3.0.0",
        "info": {
            "version": "1.0.1",
            "title": "Sample Pet Store App",
            "description": "This is a sample server for a pet store.",
            "termsOfService": "http://example.com/terms/",
            "contact": {
                "name": "API Support",
                "url": "http://www.example.com/support",
                "email": "support@example.com"
            },
            "license": {
                "name": "Apache 2.0",
                "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
            }
        },
        "servers": [
            {
                "url": "https://development.gigantic-server.com/v1",
                "description": "Development server"
            },
            {
                "url": "https://staging.gigantic-server.com/v1",
                "description": "Staging server"
            },
            {
                "url": "https://api.gigantic-server.com/v1",
                "description": "Production server"
            }
        ],
        // "host": "petstore.swagger.io",
        // "basePath": "/api",
        // "schemes": [
        //     "http"
        // ],
        // "consumes": [
        //     "application/json"
        // ],
        // "produces": [
        //     "application/json"
        // ],
        paths: {

        },
        components: {
            schemas: {
                Pet: {
                    "type": "object",
                    "required": [
                        "id",
                        "name"
                    ],
                    "properties": {
                        "id": {
                            "type": "integer"
                        },
                        "name": {
                            "type": "string"
                        },
                        "tag": {
                            "type": "string"
                        }
                    }
                },
                Error: {
                    "type": "object",
                    "required": [
                        "code",
                        "message"
                    ],
                    "properties": {
                        "code": {
                            "type": "integer"
                        },
                        "message": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        // "definitions": {
        //     "Pet": {
        //         "type": "object",
        //         "required": [
        //             "id",
        //             "name"
        //         ],
        //         "properties": {
        //             "id": {
        //                 "type": "integer"
        //             },
        //             "name": {
        //                 "type": "string"
        //             },
        //             "tag": {
        //                 "type": "string"
        //             }
        //         }
        //     }
        // }
    }

    action() {
        return (req: any, res: any) => res.json(this.swaggerJson);
    }
}

