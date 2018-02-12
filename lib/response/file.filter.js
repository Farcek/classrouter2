"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_response_1 = require("./file.response");
class FileResponseFilter {
    constructor(root) {
        this.root = root;
    }
    filter(params) {
        let { actionResult, expressRes } = params;
        if (actionResult instanceof file_response_1.FileResponse) {
            if (actionResult.contentType) {
                expressRes.contentType(actionResult.contentType);
            }
            if (actionResult.statusCode) {
                expressRes.status(actionResult.statusCode);
            }
            if (actionResult.headers) {
                Object.keys(actionResult.headers).map(key => {
                    expressRes.header(key, actionResult.headers[key]);
                });
            }
            expressRes.sendFile(actionResult.filename, {
                root: this.root
            });
            params.handled = true;
        }
    }
}
exports.FileResponseFilter = FileResponseFilter;
//# sourceMappingURL=file.filter.js.map