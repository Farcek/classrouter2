"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("../controller/metadata");
const metadata_2 = require("../action/metadata");
const paramtype_enum_1 = require("../common/paramtype.enum");
const http_method_enum_1 = require("../common/http-method.enum");
class ApiDocSwagger {
    constructor(factory) {
        this.factory = factory;
        this.swaggerJson = {
            "swagger": "2.0",
            "info": {
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
                },
                "version": "1.0.1"
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
            "host": "petstore.swagger.io",
            "basePath": "/api",
            "schemes": [
                "http"
            ],
            "consumes": [
                "application/json"
            ],
            "produces": [
                "application/json"
            ],
            "paths": {},
            "definitions": {
                "Pet": {
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
                }
            }
        };
        factory.controllerTypes.map((ctrlType) => {
            let cMeta = metadata_1.getControllerMetadata(ctrlType);
            this.controllerMap(cMeta, factory.basepath || '');
        });
    }
    buildParam(p, paramType) {
        return {
            name: p.fieldname.join(" | "),
            in: paramType,
            schema: {
                type: p.refType.toString(),
            }
        };
    }
    actionMap(aMeta, basePath) {
        let params = [];
        aMeta.properties.map(p => {
            if (p.type == paramtype_enum_1.Paramtype.Path) {
                params.push(this.buildParam(p, "path"));
            }
            else if (p.type == paramtype_enum_1.Paramtype.Query) {
                params.push(this.buildParam(p, "query"));
            }
            else if (p.type == paramtype_enum_1.Paramtype.Header) {
                params.push(this.buildParam(p, "header"));
            }
            else if (p.type == paramtype_enum_1.Paramtype.Cookie) {
                params.push(this.buildParam(p, "cookie"));
            }
        });
        aMeta.actionArguments.map(arg => {
            if (arg.type == paramtype_enum_1.Paramtype.Path) {
                params.push(this.buildParam(arg, "path"));
            }
            else if (arg.type == paramtype_enum_1.Paramtype.Query) {
                params.push(this.buildParam(arg, "query"));
            }
            else if (arg.type == paramtype_enum_1.Paramtype.Header) {
                params.push(this.buildParam(arg, "header"));
            }
            else if (arg.type == paramtype_enum_1.Paramtype.Cookie) {
                params.push(this.buildParam(arg, "cookie"));
            }
        });
        aMeta.paths.map(p => {
            var m = this.addPath(`${basePath}${p}`, this.parseMethod(aMeta.method), {
                summary: "my summary",
                description: "my desc",
                parameters: params,
                responses: {
                    "default": {
                        "description": "Unexpected error",
                        "content": {
                            "application/json": {
                                "type": "array",
                                "schema": {
                                    "$ref": "#/components/schemas/ErrorModel"
                                }
                            }
                        }
                    }
                }
            });
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
        var pp = paths[path] || (paths[path] = {});
        pp[method] = dda;
    }
    controllerMap(cMeta, basePath) {
        cMeta.actions.map((aClass) => {
            let aMeta = metadata_2.getActionMetadata(aClass);
            this.actionMap(aMeta, `${basePath}${cMeta.path}`);
        });
        cMeta.childControllers.map((ctrlType) => {
            let chMeta = metadata_1.getControllerMetadata(ctrlType);
            this.controllerMap(chMeta, `${basePath}${cMeta.path}`);
        });
    }
    addDefinitions(name, cls) {
        var d = this.swaggerJson.definitions;
        d[name] = {
            "type": "object",
            "required": [
                "name"
            ],
            "properties": {
                "name": {
                    "type": "string"
                },
                "address": {
                    "$ref": "#/components/schemas/Address"
                },
                "age": {
                    "type": "integer",
                    "format": "int32",
                    "minimum": 0
                }
            }
        };
    }
    action() {
        return (req, res) => res.json(this.swaggerJson);
    }
}
exports.ApiDocSwagger = ApiDocSwagger;
//# sourceMappingURL=apidoc.js.map