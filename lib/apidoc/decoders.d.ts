import { IApiDocInfo, IApiDocServers } from "./apidoc";
import { ClassType } from "@napp/common";
export interface IApiModel {
    name: string;
    description: string;
}
export declare function ApiModel(opt: IApiModel): (target: object) => void;
export interface IApiModelPropery {
}
export declare function ApiModelPropery(opt: IApiModelPropery): (target: object, property: string) => void;
export declare function apiInfo(info: IApiDocInfo): {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export declare function apiServers(servers: IApiDocServers): {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
};
export interface IOptionApiResponse {
    description?: string;
    mediaType?: string;
    status?: number;
    isArray?: boolean;
}
export declare function apiResponse(type: ClassType, option?: IOptionApiResponse): (target: object, property: string) => void;
