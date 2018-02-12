"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_method_enum_1 = require("../common/http-method.enum");
const metadata_1 = require("./metadata");
function createActionDecoder(method) {
    return (options) => {
        return (target) => {
            let meta = metadata_1.getOrCreateActionMetadata(target);
            meta.method = method;
            if (options) {
                if (options.path && Array.isArray(options.path)) {
                    meta.paths = options.path;
                }
                else if (options.path && typeof options.path === 'string') {
                    meta.paths = [options.path];
                }
                if (options.befores && Array.isArray(options.befores))
                    meta.beforeMiddlewares = options.befores;
            }
        };
    };
}
exports.Get = createActionDecoder(http_method_enum_1.HttpMethod.Get);
exports.Post = createActionDecoder(http_method_enum_1.HttpMethod.Post);
exports.Put = createActionDecoder(http_method_enum_1.HttpMethod.Put);
exports.Delete = createActionDecoder(http_method_enum_1.HttpMethod.Delete);
exports.All = createActionDecoder(http_method_enum_1.HttpMethod.All);
//# sourceMappingURL=decoders.js.map