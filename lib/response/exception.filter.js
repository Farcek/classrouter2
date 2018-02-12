"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_exception_1 = require("../exception/http.exception");
class ExceptionResponseFilter {
    filter(params) {
        let { actionResult, expressRes } = params;
        if (actionResult instanceof http_exception_1.HttpException) {
            expressRes.status(actionResult.status);
            expressRes.json(actionResult);
            params.handled = true;
        }
    }
}
exports.ExceptionResponseFilter = ExceptionResponseFilter;
//# sourceMappingURL=exception.filter.js.map