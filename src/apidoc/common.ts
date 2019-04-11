import { BaseMeta } from "@napp/common";

export class ApiSecuritySchemas extends BaseMeta {
    schemas: { authName: string, type: string }[] = [];
}

export class ApiSecurityUse extends BaseMeta {
    name: string = "";
}

export const APIDOCKEY_securitySchema = "api:doc:security:schema";
export const APIDOCKEY_securityUse = "api:doc:security:use";