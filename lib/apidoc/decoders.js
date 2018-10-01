"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apidoc_1 = require("./apidoc");
const common_1 = require("@napp/common");
// export interface IApiModel {
//     name: string
//     description: string
// }
// export function ApiModel(opt: IApiModel) {
//     return (target: object) => {
//     }
// }
// export interface IApiModelPropery {
// }
// export function ApiModelPropery(opt: IApiModelPropery) {
//     return (target: object, property: string) => {
//     }
// }
function apiInfo(info) {
    return Reflect.metadata("api:doc:info", info);
}
exports.apiInfo = apiInfo;
function apiServers(servers) {
    return Reflect.metadata("api:doc:servers", servers);
}
exports.apiServers = apiServers;
function apiResponse(type, option) {
    return (target, property) => {
        let t = target.constructor.prototype;
        let metadata = {
            type,
            description: option && option.description,
            mediaType: option && option.mediaType,
            status: option && option.status,
            isArray: option && option.isArray
        };
        let meta = Reflect.getMetadata("api:doc:response", t, property);
        if (meta) {
            meta.push(metadata);
        }
        else {
            Reflect.defineMetadata("api:doc:response", [metadata], t, property);
        }
    };
}
exports.apiResponse = apiResponse;
function ApiMainController() {
    return common_1.ReflectDecoratorFactory.ClassDecorator((target) => {
        apidoc_1.ApiDocSwagger.mainControllerClass = target;
    });
}
exports.ApiMainController = ApiMainController;
//# sourceMappingURL=decoders.js.map