import { ClassType, ReflectProperty, ReflectVariable, VariablePrimitiveType, ReflectName, NameMeta, VariableMeta } from "@napp/common";



function typeMap(vt: VariablePrimitiveType) {
    if (vt === VariablePrimitiveType.Boolean) return { type: "boolean" };
    if (vt === VariablePrimitiveType.Date) return { type: "date" };
    if (vt === VariablePrimitiveType.Float) return { type: "float" };
    if (vt === VariablePrimitiveType.Int) return { type: "int" };
    if (vt === VariablePrimitiveType.String) return { type: "string" };

    return { type: "null" };

}


export function schemaFactoryForMeta(vMeta: VariableMeta, schemas: { [key: string]: any }) {
    if (vMeta.IsPrimary) {
        return typeMap(vMeta.Type);
    } else {
        return schemaFactory(vMeta.TypeRef, schemas);
    }
}
export function schemaFactory(refType: ClassType, schemas: { [key: string]: any }) {


    let refMeta = ReflectVariable.factoryVariableMeta(refType);

    

    if (refMeta.IsPrimary) {
        return typeMap(refMeta.Type);
    }

    let nMeta = ReflectName.getNameMeta(refType) as NameMeta;

    if (!(nMeta.Name in schemas)) {
        let schema = schemas[nMeta.Name] = {
            "type": "object",
            "required": [],
            properties: {} as any
        };

        let pMeta = ReflectProperty.GetProperiesMeta(refType);
        pMeta.map((p) => {
            let vMeta = ReflectVariable.getVariableMeta(refType, p);
            if (vMeta) {
                schema.properties[p] = schemaFactoryForMeta(vMeta, schemas);
            }
        });
    }



    return { $ref: `#/components/schemas/${nMeta.Name}` };
}