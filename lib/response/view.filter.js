"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const view_response_1 = require("./view.response");
class ViewResponseFilter {
    filter(params) {
        let { actionResult, expressRes } = params;
        if (actionResult instanceof view_response_1.ViewResponse) {
            expressRes.contentType(actionResult.contentType || 'html');
            expressRes.status(actionResult.statusCode || 200);
            if (actionResult.headers) {
                Object.keys(actionResult.headers).map(key => {
                    expressRes.header(key, actionResult.headers[key]);
                });
            }
            expressRes.render(actionResult.viewname, actionResult.data || {});
            params.handled = true;
        }
    }
}
exports.ViewResponseFilter = ViewResponseFilter;
//# sourceMappingURL=view.filter.js.map