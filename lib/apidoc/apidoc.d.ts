import { ControllerMetadata } from "../controller/metadata";
import { ActionMetadata } from "../action/metadata";
import { HttpMethod } from "../common/http-method.enum";
import { ParamMetadata, ArgumentMetadata } from "../param/metadata";
import { ClassType } from "@napp/common";
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
    };
}
export interface IApiDocServers {
    [index: number]: {
        url: string;
        description: string;
    };
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
export declare class ApiDocSwagger {
    mainController: ClassType;
    swaggerJson: {
        openapi: string;
        info: IApiDocInfo;
        "servers": IApiDocServers;
        "schemes": string[];
        "consumes": string[];
        "produces": string[];
        paths: {};
        components: {
            schemas: {};
        };
    };
    constructor(mainController: ClassType);
    buildParam(p: ParamMetadata | ArgumentMetadata, paramType: string, aMeta: ActionMetadata, requestBody: any): false | {
        name: string;
        summary: string;
        description: string;
        in: string;
        schema: any;
    } | {
        name: string;
        description: string;
        in: string;
        schema: {
            type: string;
        };
        summary?: undefined;
    } | undefined;
    buildResponse(responseMetas: IApiDocResponse[]): any;
    actionMap(aMeta: ActionMetadata, basePath: string, controller: string): void;
    parseMethod(m: HttpMethod): "get" | "delete" | "post" | "put" | "options";
    addPath(path: string, method: string, dda: any): void;
    controllerMap(cMeta: ControllerMetadata, basePath: string, controller: string): void;
    action(): (req: any, res: any) => any;
}
