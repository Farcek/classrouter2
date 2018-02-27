"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typedi_1 = require("typedi");
const metadata_1 = require("./controller/metadata");
const metadata_2 = require("./action/metadata");
const paramtype_enum_1 = require("./common/paramtype.enum");
const exceptions_1 = require("./exceptions");
const http_method_enum_1 = require("./common/http-method.enum");
const express = require("express");
const uuid = require('uuid');
class ClassrouterFactory {
    constructor(options) {
        this.basepath = options.basepath;
        this.app = options.app;
        this.controllerTypes = options.controllerTypes;
        this.responseFilters = options.responseFilters;
    }
    log(...msg) {
        console.log(...msg);
    }
    logError(error) {
        console.log(`--------------- ${error.name} -------------------`);
        console.log(error.message);
        console.log(error.stack);
    }
    setupController(ctrlType, parent, basePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let cMeta = metadata_1.getControllerMetadata(ctrlType);
            if (cMeta) {
                const router = express.Router();
                let befores = cMeta.beforeMiddlewares.map(f => f());
                if (befores.length > 0)
                    router.use(befores);
                yield Promise.all(cMeta.actions.map((actionType) => __awaiter(this, void 0, void 0, function* () {
                    yield this.setupAction(actionType, router, `${basePath}${cMeta.path}`);
                })));
                yield Promise.all(cMeta.childControllers.map((cType) => __awaiter(this, void 0, void 0, function* () {
                    yield this.setupController(cType, router, `${basePath}${cMeta.path}`);
                })));
                parent.use(cMeta.path, router);
            }
            else {
                throw new Error(`not found controller meta ${ctrlType}`);
            }
        });
    }
    resolveValue(type, fieldnames, req) {
        return __awaiter(this, void 0, void 0, function* () {
            let find = (store) => {
                for (let f of fieldnames) {
                    if (f in store) {
                        return store[f];
                    }
                }
                return store;
            };
            if (type == paramtype_enum_1.Paramtype.Body) {
                return find(req.body);
            }
            else if (type == paramtype_enum_1.Paramtype.Query) {
                return find(req.query);
            }
            else if (type == paramtype_enum_1.Paramtype.Path) {
                return find(req.params);
            }
            else if (type == paramtype_enum_1.Paramtype.Cookie) {
                return find(req.cookies);
            }
            else if (type == paramtype_enum_1.Paramtype.Header) {
                return find(req.headers);
            }
            else if (type == paramtype_enum_1.Paramtype.Request) {
                return find(req);
            }
        });
    }
    transformValue(startValue, pipes) {
        return pipes.reduce((p, pipe) => p.then(v => pipe.transform(v)), Promise.resolve(startValue));
    }
    result(actionResult, req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let param = {
                actionResult: actionResult,
                expressRes: res,
                expressReq: req,
                handled: false
            };
            for (const filter of this.responseFilters) {
                yield filter.filter(param);
                if (param.handled) {
                    return;
                }
            }
            if (actionResult) {
                res.status(200).json(actionResult);
            }
            else {
                res.end();
            }
        });
    }
    errorParse(error) {
        if (error instanceof exceptions_1.HttpException) {
            return error;
        }
        if (error instanceof Error) {
            return new exceptions_1.ServerException(error.message);
        }
        if (typeof error === 'string') {
            return new exceptions_1.ServerException(error);
        }
        return new exceptions_1.ServerException(error.message || '' + error);
    }
    actinHandle(actionType, aMeta) {
        return __awaiter(this, void 0, void 0, function* () {
            const action = (container, req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let actionInstance = container.get(actionType);
                    try {
                        // bind properies
                        yield Promise.all(aMeta.properties.map((prop) => __awaiter(this, void 0, void 0, function* () {
                            let initVal = yield this.resolveValue(prop.type, prop.fieldname, req);
                            let value = yield this.transformValue(initVal, prop.pipes);
                            actionInstance[prop.propery] = value;
                        })));
                        // bind arguments
                        let actionArgs = yield Promise.all(aMeta.actionArguments.map((prop) => __awaiter(this, void 0, void 0, function* () {
                            let initVal = yield this.resolveValue(prop.type, prop.fieldname, req);
                            let value = yield this.transformValue(initVal, prop.pipes);
                            return value;
                        })));
                        let result = yield Promise.resolve(actionInstance.action(...actionArgs));
                        yield this.result(result, req, res);
                    }
                    catch (error) {
                        //let _err = this.errorParse(error);
                        if (actionInstance.onError && typeof actionInstance.onError === 'function') {
                            let errorArgs = yield Promise.all(aMeta.errorArguments.map((prop) => __awaiter(this, void 0, void 0, function* () {
                                let initVal = yield this.resolveValue(prop.type, prop.fieldname, req);
                                let value = yield this.transformValue(initVal, prop.pipes);
                                return value;
                            })));
                            // remove first arg
                            errorArgs.splice(0, 1);
                            let result = yield Promise.resolve(actionInstance.onError(error, ...errorArgs));
                            yield this.result(result, req, res);
                        }
                        else {
                            throw error;
                        }
                    }
                }
                catch (error) {
                    let _err = this.errorParse(error);
                    this.logError(_err);
                    yield this.result(_err, req, res);
                }
            });
            return (req, res) => {
                const rid = uuid();
                action(typedi_1.Container.of(rid), req, res)
                    .then(() => {
                    typedi_1.Container.reset(rid);
                });
            };
        });
    }
    setupAction(actionType, router, basepath) {
        return __awaiter(this, void 0, void 0, function* () {
            let aMeta = metadata_2.getActionMetadata(actionType);
            let handle = yield this.actinHandle(actionType, aMeta);
            let befores = aMeta.beforeMiddlewares.map(f => f());
            let handlers = [...befores, handle];
            aMeta.paths.map(path => {
                if (aMeta.method == http_method_enum_1.HttpMethod.Get) {
                    router.get(path, handlers);
                    this.log(`register action: GET ${basepath}-${path}`);
                }
                else if (aMeta.method == http_method_enum_1.HttpMethod.Post) {
                    router.post(path, handlers);
                    this.log(`register action: POST ${basepath}-${path}`);
                }
                else if (aMeta.method == http_method_enum_1.HttpMethod.Put) {
                    router.put(path, handlers);
                    this.log(`register action: PUT ${basepath}-${path}`);
                }
                else if (aMeta.method == http_method_enum_1.HttpMethod.Delete) {
                    router.delete(path, handlers);
                    this.log(`register action: DEL ${basepath}-${path}`);
                }
                else if (aMeta.method == http_method_enum_1.HttpMethod.All) {
                    router.all(path, handlers);
                    this.log(`register action: ALL ${basepath}-${path}`);
                }
                else {
                    throw new Error("not suported method");
                }
            });
        });
    }
    setupErrorhandle() {
        this.app.use((err, req, res, next) => {
            let _err = this.errorParse(err);
            this.result(_err, req, res);
        });
    }
    initlize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(this.controllerTypes.map((ctrlType) => __awaiter(this, void 0, void 0, function* () {
                yield this.setupController(ctrlType, this.app, this.basepath || '');
            })));
            this.setupErrorhandle();
        });
    }
}
exports.ClassrouterFactory = ClassrouterFactory;
//# sourceMappingURL=factory.js.map