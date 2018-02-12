"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_exception_1 = require("./http.exception");
const http_status_enum_1 = require("../common/http-status.enum");
const names = require("./names");
class AuthenticationException extends http_exception_1.HttpException {
    constructor() {
        super(names.$$AuthenticationException, 'requared authentication', http_status_enum_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.AuthenticationException = AuthenticationException;
class AuthorizationException extends http_exception_1.HttpException {
    constructor(message) {
        super(names.$$AuthorizationException, message, http_status_enum_1.HttpStatus.UNAUTHORIZED);
    }
}
exports.AuthorizationException = AuthorizationException;
//# sourceMappingURL=security.exception.js.map