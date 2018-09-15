"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ApiModel(opt) {
    return (target) => {
    };
}
exports.ApiModel = ApiModel;
function ApiModelPropery(opt) {
    return (target, property) => {
    };
}
exports.ApiModelPropery = ApiModelPropery;
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
        console.log("meta", property, "==>", meta);
    };
}
exports.apiResponse = apiResponse;
//# sourceMappingURL=decoders.js.map