"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_exception_1 = require("./http.exception");
const http_status_enum_1 = require("../common/http-status.enum");
const names = require("./names");
class InvalidMessageException extends http_exception_1.HttpException {
    constructor(message) {
        super(names.$$InvalidMessageException, message, http_status_enum_1.HttpStatus.BAD_REQUEST);
    }
}
exports.InvalidMessageException = InvalidMessageException;
class InvalidPropertiesException extends http_exception_1.HttpException {
    constructor(properties) {
        super(names.$$InvalidPropertiesException, `Invalid properties ${Object.keys(properties).length}`, http_status_enum_1.HttpStatus.BAD_REQUEST);
        this.properties = properties;
    }
}
exports.InvalidPropertiesException = InvalidPropertiesException;
//# sourceMappingURL=invalid.exception.js.map