"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redirect_response_1 = require("./redirect.response");
class RedirectResponseFilter {
    filter(params) {
        let { actionResult, expressRes } = params;
        if (actionResult instanceof redirect_response_1.RedirectResponse) {
            expressRes.redirect(actionResult.statusCode, actionResult.uri);
            params.handled = true;
        }
    }
}
exports.RedirectResponseFilter = RedirectResponseFilter;
//# sourceMappingURL=redirect.filter.js.map