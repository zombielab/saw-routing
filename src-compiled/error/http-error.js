"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class HttpError extends Error {
    constructor(message, status = 500, expose = false) {
        super();

        this.name = this.constructor.name;
        this.message = message;
        this.status = status;
        this.expose = false;
    }
}

exports.default = HttpError;
//# sourceMappingURL=http-error.js.map