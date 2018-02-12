"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpException extends Error {
    constructor(name, message, status) {
        super(message);
        this.name = name;
        this.message = message;
        this.status = status;
        Object.setPrototypeOf(this, new.target.prototype);
    }
    toJSON() {
        var alt = {};
        var self = this;
        Object.getOwnPropertyNames(self)
            .map((key) => {
            if (key === 'stack')
                return;
            if (key === 'status')
                return;
            alt[key] = self[key];
        });
        return alt;
    }
}
exports.HttpException = HttpException;
//# sourceMappingURL=http.exception.js.map