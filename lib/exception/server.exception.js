"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_exception_1 = require("./http.exception");
const http_status_enum_1 = require("../common/http-status.enum");
const names = require("./names");
class ServerException extends http_exception_1.HttpException {
    constructor(message) {
        super(names.$$ServerException, message, http_status_enum_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
exports.ServerException = ServerException;
//# sourceMappingURL=server.exception.js.map