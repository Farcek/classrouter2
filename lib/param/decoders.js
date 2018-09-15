"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paramtype_enum_1 = require("../common/paramtype.enum");
const metadata_1 = require("../action/metadata");
const metadata_2 = require("./metadata");
function createParamDecoder(type) {
    return (fieldname, ...pipes) => {
        return (target, property, parameterIndex) => {
            let reqName = [];
            let _pipes;
            if (fieldname && typeof fieldname === 'string') {
                reqName = [fieldname];
            }
            if (fieldname && Array.isArray(fieldname)) {
                reqName = fieldname;
            }
            if (fieldname && fieldname.transform) {
                _pipes = [fieldname, ...pipes];
            }
            else {
                _pipes = pipes;
            }
            var refType = Reflect.getMetadata("design:type", target, property);
            console.log(refType);
            let actionMeta = metadata_1.getOrCreateActionMetadata(target.constructor);
            if (typeof parameterIndex === 'number') {
                let meta = new metadata_2.ArgumentMetadata();
                meta.fieldname = reqName;
                meta.refType = refType;
                meta.index = parameterIndex;
                meta.pipes = _pipes;
                meta.type = type;
                if (property === 'action') {
                    actionMeta.actionArguments[parameterIndex] = meta;
                }
                else if (property === 'onError') {
                    actionMeta.errorArguments[parameterIndex] = meta;
                }
            }
            else {
                let paramMeta = new metadata_2.ParamMetadata();
                paramMeta.fieldname = reqName;
                paramMeta.refType = refType;
                paramMeta.pipes = _pipes;
                paramMeta.propery = property;
                paramMeta.type = type;
                actionMeta.properties.push(paramMeta);
            }
        };
    };
}
exports.BodyParam = createParamDecoder(paramtype_enum_1.Paramtype.Body);
exports.PathParam = createParamDecoder(paramtype_enum_1.Paramtype.Path);
exports.QueryParam = createParamDecoder(paramtype_enum_1.Paramtype.Query);
exports.HeaderParam = createParamDecoder(paramtype_enum_1.Paramtype.Header);
exports.CookieParam = createParamDecoder(paramtype_enum_1.Paramtype.Cookie);
exports.RequestParam = createParamDecoder(paramtype_enum_1.Paramtype.Request);
//# sourceMappingURL=decoders.js.map