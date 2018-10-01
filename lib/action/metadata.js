"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_method_enum_1 = require("../common/http-method.enum");
const metaname_1 = require("../common/metaname");
const $ = {
    i: 0
};
class ActionMetadata {
    constructor(actionClass) {
        this.actionClass = actionClass;
        this.method = http_method_enum_1.HttpMethod.Get;
        this.paths = ['/'];
        this.properties = [];
        this.actionArguments = [];
        this.errorArguments = [];
        this.beforeMiddlewares = [];
    }
}
exports.ActionMetadata = ActionMetadata;
function getActionMetadata(target) {
    let meta = Reflect.getOwnMetadata(metaname_1.Metaname.Action, target);
    if (meta) {
        return meta;
    }
    throw new Error(`not found ActionMetadata. targer object "${target}"`);
}
exports.getActionMetadata = getActionMetadata;
function getOrCreateActionMetadata(target) {
    let meta = Reflect.getOwnMetadata(metaname_1.Metaname.Action, target);
    if (meta) {
        return meta;
    }
    meta = new ActionMetadata(target);
    Reflect.defineMetadata(metaname_1.Metaname.Action, meta, target);
    return meta;
}
exports.getOrCreateActionMetadata = getOrCreateActionMetadata;
//# sourceMappingURL=metadata.js.map