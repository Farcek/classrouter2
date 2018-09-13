import { ClassrouterFactory } from "..";
import { ControllerMetadata } from "../controller/metadata";
import { ActionMetadata } from "../action/metadata";
import { HttpMethod } from "../common/http-method.enum";
import { ParamMetadata, ArgumentMetadata } from "../param/metadata";
export declare class ApiDocSwagger {
    factory: ClassrouterFactory;
    constructor(factory: ClassrouterFactory);
    buildParam(p: ParamMetadata | ArgumentMetadata, paramType: string): {
        name: string;
        in: string;
        schema: {
            type: string;
        };
    };
    actionMap(aMeta: ActionMetadata, basePath: string): void;
    parseMethod(m: HttpMethod): "get" | "delete" | "post" | "put" | "options";
    addPath(path: string, method: string, dda: any): void;
    controllerMap(cMeta: ControllerMetadata, basePath: string): void;
    addDefinitions(name: string, cls: any): void;
    swaggerJson: {
        "swagger": string;
        "info": {
            "title": string;
            "description": string;
            "termsOfService": string;
            "contact": {
                "name": string;
                "url": string;
                "email": string;
            };
            "license": {
                "name": string;
                "url": string;
            };
            "version": string;
        };
        "servers": {
            "url": string;
            "description": string;
        }[];
        "host": string;
        "basePath": string;
        "schemes": string[];
        "consumes": string[];
        "produces": string[];
        "paths": {};
        "definitions": {
            "Pet": {
                "type": string;
                "required": string[];
                "properties": {
                    "id": {
                        "type": string;
                    };
                    "name": {
                        "type": string;
                    };
                    "tag": {
                        "type": string;
                    };
                };
            };
        };
    };
    action(): (req: any, res: any) => any;
}
