"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_method_enum_1 = require("../common/http-method.enum");
const metaname_1 = require("../common/metaname");
const $ = {
    i: 0
};
class ActionMetadata {
    constructor() {
        this.method = http_method_enum_1.HttpMethod.Get;
        this.paths = ['/'];
        this.properties = [];
        this.actionArguments = [];
        this.errorArguments = [];
        this.beforeMiddlewares = [];
        console.log('action meta' + $.i++);
    }
}
exports.ActionMetadata = ActionMetadata;
function createActionMetadata(target) {
    if (Reflect.hasMetadata(metaname_1.Metaname.Action, target)) {
        throw new Error(`already created ActionMetadata. targer object "${target}"`);
    }
    let meta = new ActionMetadata();
    Reflect.defineMetadata(metaname_1.Metaname.Action, meta, target);
    return meta;
}
exports.createActionMetadata = createActionMetadata;
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
    meta = new ActionMetadata();
    Reflect.defineMetadata(metaname_1.Metaname.Action, meta, target);
    return meta;
}
exports.getOrCreateActionMetadata = getOrCreateActionMetadata;
//# sourceMappingURL=metadata.js.map