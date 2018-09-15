import { ClassType, ReflectProperty, ReflectVariable, VariablePrimitiveType, ReflectName, NameMeta, VariableMeta } from "@napp/common";






function typeMap(vt: VariablePrimitiveType) {
    if (vt === VariablePrimitiveType.Boolean) return { type: "boolean" };
    if (vt === VariablePrimitiveType.Date) return { type: "string", format: "date" };
    if (vt === VariablePrimitiveType.Float) return { type: "number" };
    if (vt === VariablePrimitiveType.Int) return { type: "integer" };
    if (vt === VariablePrimitiveType.String) return { type: "string" };

    return { type: "null" };

}


export function schemaFactoryForMeta(vMeta: VariableMeta, schemas: { [key: string]: any }): any {
    if (vMeta.IsArray && vMeta.ArrayElement) {
        return {
            type: 'array',
            items: schemaFactoryForMeta(vMeta.ArrayElement, schemas)
        };
    }
    if (vMeta.IsPrimary) {
        return typeMap(vMeta.Type);
    } else {
        return schemaFactory(vMeta.TypeRef, false, schemas);
    }
}
export function schemaFactory(refType: ClassType, isArray: boolean, schemas: { [key: string]: any }): any {

    if (isArray) {
        return {
            type: 'array',
            items: schemaFactory(refType, false, schemas)
        }
    }

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
            console.log("vMeta", p, vMeta);
            if (vMeta) {
                schema.properties[p] = schemaFactoryForMeta(vMeta, schemas);
            }
        });
    }



    return { $ref: `#/components/schemas/${nMeta.Name}` };
}