import { IApiDocInfo, IApiDocServers, IApiDocResponse } from "./apidoc";
import { ClassType } from "@napp/common";


export interface IApiModel {
    name: string
    description: string
}
export function ApiModel(opt: IApiModel) {
    return (target: object) => {

    }
}

export interface IApiModelPropery {

}

export function ApiModelPropery(opt: IApiModelPropery) {
    return (target: object, property: string) => {

    }
}


export function apiInfo(info: IApiDocInfo) {
    return Reflect.metadata("api:doc:info", info);
}

export function apiServers(servers: IApiDocServers) {
    return Reflect.metadata("api:doc:servers", servers);
}


export interface IOptionApiResponse {
    description?: string;
    mediaType?: string;

    status?: number;

    isArray?: boolean;

}
export function apiResponse(type: ClassType, option?: IOptionApiResponse) {

    return (target: object, property: string) => {
        let t = (target.constructor as ClassType).prototype;

        let metadata: IApiDocResponse = {
            type,
            description: option && option.description,
            mediaType: option && option.mediaType,
            status: option && option.status,
            isArray: option && option.isArray
        }

        let meta = Reflect.getMetadata("api:doc:response", t, property) as IApiDocResponse[] | null;

        if (meta) {
            meta.push(metadata);
        } else {
            Reflect.defineMetadata("api:doc:response", [metadata], t, property);
        }

        console.log("meta", property, "==>", meta);

    };
}


