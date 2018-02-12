"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_exception_1 = require("./http.exception");
const http_status_enum_1 = require("../common/http-status.enum");
const names = require("./names");
class NotFoundException extends http_exception_1.HttpException {
    constructor(message) {
        super(names.$$NotFoundException, message, http_status_enum_1.HttpStatus.NOT_FOUND);
    }
}
exports.NotFoundException = NotFoundException;
//# sourceMappingURL=notfound.exception.js.map