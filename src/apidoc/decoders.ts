import { IApiDocInfo, IApiDocServers, IApiDocResponse, ApiDocSwagger } from "./apidoc";
import { ClassType, ReflectDecoratorFactory, ReflectMeta, BaseMeta } from "@napp/common";
import { type } from "os";
import { ApiSecuritySchemas, ApiSecurityUse, APIDOCKEY_securitySchema, APIDOCKEY_securityUse } from "./common";

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


    };
}

export function apiMainController() {
    return ReflectDecoratorFactory.ClassDecorator((target) => {
        ApiDocSwagger.mainControllerClass = target;
    });
}



export function apiSecurityDefine(authName: string, type: 'bearer' | 'basic') {
    return ReflectDecoratorFactory.ClassDecorator((target) => {
        let meta = ReflectMeta.GetMeta<ApiSecuritySchemas>(APIDOCKEY_securitySchema, target);
        if (meta) {
            meta.schemas.push({ authName, type });
        } else {
            meta = new ApiSecuritySchemas();
            meta.schemas.push({ authName, type });
            ReflectMeta.SetMeta(APIDOCKEY_securitySchema, meta, target);
        }
    });
}

export function apiSecurityUse(authName: string) {
    return ReflectDecoratorFactory.ClassDecorator((target) => {
        let meta = new ApiSecurityUse();
        meta.name = authName;
        ReflectMeta.SetMeta(APIDOCKEY_securityUse, meta, target);
    });
}