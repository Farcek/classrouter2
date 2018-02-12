"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const view_filter_1 = require("./response/view.filter");
exports.ViewResponseFilter = view_filter_1.ViewResponseFilter;
const redirect_filter_1 = require("./response/redirect.filter");
exports.RedirectResponseFilter = redirect_filter_1.RedirectResponseFilter;
const file_filter_1 = require("./response/file.filter");
exports.FileResponseFilter = file_filter_1.FileResponseFilter;
const exception_filter_1 = require("./response/exception.filter");
exports.ExceptionResponseFilter = exception_filter_1.ExceptionResponseFilter;
exports.viewFilter = new view_filter_1.ViewResponseFilter();
exports.redirectFilter = new redirect_filter_1.RedirectResponseFilter();
exports.exceptionFilter = new exception_filter_1.ExceptionResponseFilter();
/**
 * viewFilter, redirectFilter, exceptionFilter
 */
exports.defaultFilters = [exports.viewFilter, exports.redirectFilter, exports.exceptionFilter];
//# sourceMappingURL=responses.js.map