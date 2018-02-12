"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RedirectResponse {
    constructor(uri, temp = true) {
        this.uri = uri;
        this.statusCode = temp ? 302 : 301;
    }
}
exports.RedirectResponse = RedirectResponse;
//# sourceMappingURL=redirect.response.js.map