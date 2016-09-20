"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _httpError = require("./http-error");

var _httpError2 = _interopRequireDefault(_httpError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NotFoundHttpError extends _httpError2.default {
    constructor(message = "Not found.", status = 404, expose = true) {
        super(message, status, expose);
    }
}

exports.default = NotFoundHttpError;
//# sourceMappingURL=not-found-http-error.js.map