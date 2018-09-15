"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const metadata_1 = require("./metadata");
function Controller(option) {
    return (target) => {
        let meta = metadata_1.createControllerMetadata(target);
        if (option.name)
            meta.name = option.name;
        if (option.path)
            meta.path = option.path;
        if (Array.isArray(option.actions))
            meta.actions = option.actions;
        if (Array.isArray(option.controllers))
            meta.childControllers = option.controllers;
        if (Array.isArray(option.befores))
            meta.beforeMiddlewares = option.befores;
    };
}
exports.Controller = Controller;
//# sourceMappingURL=decoders.js.map