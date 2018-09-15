"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metaname_1 = require("../common/metaname");
class ControllerMetadata {
    constructor() {
        this.name = "";
        this.path = '/';
        this.actions = [];
        this.childControllers = [];
        //parentController: IControllerType | null
        this.beforeMiddlewares = [];
    }
}
exports.ControllerMetadata = ControllerMetadata;
function createControllerMetadata(target) {
    if (Reflect.hasMetadata(metaname_1.Metaname.Action, target)) {
        throw new Error(`already created ControllerMetadata. targer object "${target}"`);
    }
    let meta = new ControllerMetadata();
    Reflect.defineMetadata(metaname_1.Metaname.Controller, meta, target);
    return meta;
}
exports.createControllerMetadata = createControllerMetadata;
function getControllerMetadata(target) {
    let meta = Reflect.getOwnMetadata(metaname_1.Metaname.Controller, target);
    if (meta) {
        return meta;
    }
    throw new Error(`not found ControllerMetadata. targer object "${target}"`);
}
exports.getControllerMetadata = getControllerMetadata;
//# sourceMappingURL=metadata.js.map