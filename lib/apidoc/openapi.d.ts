import { ClassType, VariableMeta } from "@napp/common";
export declare function schemaFactoryForMeta(vMeta: VariableMeta, schemas: {
    [key: string]: any;
}): any;
export declare function schemaFactory(refType: ClassType, isArray: boolean, schemas: {
    [key: string]: any;
}): any;
