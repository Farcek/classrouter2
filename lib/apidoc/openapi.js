"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@napp/common");
function typeMap(vt) {
    if (vt === common_1.VariablePrimitiveType.Boolean)
        return { type: "boolean" };
    if (vt === common_1.VariablePrimitiveType.Date)
        return { type: "string", format: "date" };
    if (vt === common_1.VariablePrimitiveType.Float)
        return { type: "number" };
    if (vt === common_1.VariablePrimitiveType.Int)
        return { type: "integer" };
    if (vt === common_1.VariablePrimitiveType.String)
        return { type: "string" };
    return { type: "null" };
}
function schemaFactoryForMeta(vMeta, schemas) {
    if (vMeta.IsArray && vMeta.ArrayElement) {
        return {
            type: 'array',
            items: schemaFactoryForMeta(vMeta.ArrayElement, schemas)
        };
    }
    if (vMeta.IsPrimary) {
        return typeMap(vMeta.Type);
    }
    else {
        return schemaFactory(vMeta.TypeRef, false, schemas);
    }
}
exports.schemaFactoryForMeta = schemaFactoryForMeta;
function schemaFactory(refType, isArray, schemas) {
    if (isArray) {
        return {
            type: 'array',
            items: schemaFactory(refType, false, schemas)
        };
    }
    let refMeta = common_1.ReflectVariable.factoryVariableMeta(refType);
    if (refMeta.IsPrimary) {
        return typeMap(refMeta.Type);
    }
    let nMeta = common_1.ReflectName.getNameMeta(refType);
    if (!(nMeta.Name in schemas)) {
        let schema = schemas[nMeta.Name] = {
            "type": "object",
            "required": [],
            properties: {}
        };
        let pMeta = common_1.ReflectProperty.GetProperiesMeta(refType);
        pMeta.map((p) => {
            let vMeta = common_1.ReflectVariable.getVariableMeta(refType, p);
            if (vMeta) {
                schema.properties[p] = schemaFactoryForMeta(vMeta, schemas);
            }
        });
    }
    return { $ref: `#/components/schemas/${nMeta.Name}` };
}
exports.schemaFactory = schemaFactory;
//# sourceMappingURL=openapi.js.map