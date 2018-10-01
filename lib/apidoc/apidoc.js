"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../controller/metadata");
const metadata_2 = require("../action/metadata");
const paramtype_enum_1 = require("../common/paramtype.enum");
const http_method_enum_1 = require("../common/http-method.enum");
const metadata_3 = require("../param/metadata");
const common_1 = require("@napp/common");
const path_to_regexp_1 = require("path-to-regexp");
const openapi_1 = require("./openapi");
class ApiDocSwagger {
    constructor(startController) {
        this.swaggerJson = {
            openapi: "3.0.0",
            info: {
                "version": "1.0.1",
                "title": "Api Service"
            },
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
            ],
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
            paths: {},
            components: {
                schemas: {}
            }
        };
        let mainController = this.mainController = startController || ApiDocSwagger.mainControllerClass;
        if (!mainController) {
            throw new TypeError("not registered mainController");
        }
        ;
        let info = Reflect.getMetadata("api:doc:info", mainController);
        if (info) {
            this.swaggerJson.info = info;
        }
        let servers = Reflect.getMetadata("api:doc:servers", mainController);
        if (servers) {
            this.swaggerJson.servers = servers;
        }
        let cMeta = metadata_1.getControllerMetadata(mainController);
        this.controllerMap(cMeta, '', '');
    }
    buildParam(p, paramType, aMeta, requestBody) {
        if (p instanceof metadata_3.ParamMetadata) {
            let variableMeta = common_1.ReflectVariable.getVariableMeta(aMeta.actionClass, p.propery);
            if (variableMeta && p.fieldname.length) {
                let dMeta = common_1.ReflectDescription.getMeta(aMeta.actionClass, p.propery);
                return {
                    name: p.fieldname.join(" | ") || "*",
                    summary: `${p.fieldname} - summary`,
                    description: dMeta && dMeta.Description || "",
                    in: paramType,
                    schema: openapi_1.schemaFactoryForMeta(variableMeta, this.swaggerJson.components.schemas)
                };
            }
            if (variableMeta && p.fieldname.length == 0) {
                let properyDescriptionMeta = common_1.ReflectDescription.getMeta(aMeta.actionClass, p.propery);
                let modelDescriptionMeta = variableMeta.TypeRef && common_1.ReflectDescription.getMeta(variableMeta.TypeRef);
                requestBody.description = (properyDescriptionMeta && properyDescriptionMeta.Description) || (modelDescriptionMeta && modelDescriptionMeta.Description) || "";
                requestBody.required = true;
                requestBody.content = {
                    "application/json": {
                        schema: openapi_1.schemaFactoryForMeta(variableMeta, this.swaggerJson.components.schemas)
                    }
                };
                return false;
            }
        }
        if (p instanceof metadata_3.ParamMetadata) {
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
    buildResponse(responseMetas) {
        if (responseMetas.length == 0) {
            return {
                "default": {
                    "description": "not defined response"
                }
            };
        }
        let rest = {};
        responseMetas.map((it) => {
            let status = "" + (it.status || 'default');
            let dMeta = common_1.ReflectDescription.getMeta(it.type);
            let description = it.description || (dMeta && dMeta.Description) || "";
            let mt = it.mediaType || "application/json";
            let schema = openapi_1.schemaFactory(it.type, it.isArray || false, this.swaggerJson.components.schemas);
            rest[status] = {
                description,
                content: {
                    [mt]: {
                        schema
                    }
                }
            };
        });
        return rest;
    }
    actionMap(aMeta, basePath, controller) {
        let params = [];
        let requestBody = {};
        aMeta.properties.map(p => {
            let m;
            if (p.type == paramtype_enum_1.Paramtype.Path) {
                m = this.buildParam(p, "path", aMeta, requestBody);
            }
            else if (p.type == paramtype_enum_1.Paramtype.Query) {
                m = this.buildParam(p, "query", aMeta, requestBody);
            }
            else if (p.type == paramtype_enum_1.Paramtype.Header) {
                m = this.buildParam(p, "header", aMeta, requestBody);
            }
            else if (p.type == paramtype_enum_1.Paramtype.Cookie) {
                m = this.buildParam(p, "cookie", aMeta, requestBody);
            }
            else if (p.type == paramtype_enum_1.Paramtype.Body) {
                m = this.buildParam(p, "body", aMeta, requestBody);
            }
            if (m) {
                params.push(m);
            }
        });
        aMeta.actionArguments.map(arg => {
            let m;
            if (arg.type == paramtype_enum_1.Paramtype.Path) {
                m = this.buildParam(arg, "path", aMeta, requestBody);
            }
            else if (arg.type == paramtype_enum_1.Paramtype.Query) {
                m = this.buildParam(arg, "query", aMeta, requestBody);
            }
            else if (arg.type == paramtype_enum_1.Paramtype.Header) {
                m = this.buildParam(arg, "header", aMeta, requestBody);
            }
            else if (arg.type == paramtype_enum_1.Paramtype.Cookie) {
                m = this.buildParam(arg, "cookie", aMeta, requestBody);
            }
            else if (arg.type == paramtype_enum_1.Paramtype.Body) {
                m = this.buildParam(arg, "body", aMeta, requestBody);
            }
            if (m) {
                params.push(m);
            }
        });
        let resMeta = Reflect.getMetadata("api:doc:response", aMeta.actionClass.prototype, "action") || [];
        let resp = this.buildResponse(resMeta);
        let descClassMeta = common_1.ReflectDescription.getMeta(aMeta.actionClass);
        let descActionMeta = common_1.ReflectDescription.getMeta(aMeta.actionClass, "action");
        aMeta.paths.map(actionPath => {
            let pOptions = {
                summary: descClassMeta && descClassMeta.Description || "",
                description: descActionMeta && descActionMeta.Description || "",
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
    parseMethod(m) {
        if (m == http_method_enum_1.HttpMethod.Get) {
            return "get";
        }
        if (m == http_method_enum_1.HttpMethod.Delete) {
            return "delete";
        }
        if (m == http_method_enum_1.HttpMethod.Post) {
            return "post";
        }
        if (m == http_method_enum_1.HttpMethod.Put) {
            return "put";
        }
        return "options";
    }
    addPath(path, method, dda) {
        var paths = this.swaggerJson.paths;
        let tokens = path_to_regexp_1.parse(path);
        let newPath = tokens.map((r) => {
            if (r.name) {
                return `${r.prefix}{${r.name}}`;
            }
            return r.toString();
        }).join('');
        var pp = paths[newPath] || (paths[newPath] = {});
        pp[method] = dda;
    }
    controllerMap(cMeta, basePath, controller) {
        let controllerName = controller && cMeta.name ? `${controller}.${cMeta.name}` : cMeta.name;
        cMeta.actions.map((aClass) => {
            let aMeta = metadata_2.getActionMetadata(aClass);
            this.actionMap(aMeta, `${basePath}${cMeta.path}`, controllerName);
        });
        cMeta.childControllers.map((ctrlType) => {
            let chMeta = metadata_1.getControllerMetadata(ctrlType);
            this.controllerMap(chMeta, `${basePath}${cMeta.path}`, controllerName);
        });
    }
    action() {
        return (req, res) => res.json(this.swaggerJson);
    }
}
exports.ApiDocSwagger = ApiDocSwagger;
//# sourceMappingURL=apidoc.js.map