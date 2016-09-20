"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _weakMap = require("babel-runtime/core-js/weak-map");

var _weakMap2 = _interopRequireDefault(_weakMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $methods = new _weakMap2.default(),
    $uri = new _weakMap2.default(),
    $action = new _weakMap2.default(),
    $name = new _weakMap2.default();

class Route {
    constructor(methods, uri, action, name = null) {
        $methods.set(this, methods);
        $uri.set(this, uri);
        $action.set(this, action);
        $name.set(this, name);
    }

    get methods() {
        return $methods.get(this);
    }

    get uri() {
        return $uri.get(this);
    }

    get action() {
        return $action.get(this);
    }

    get name() {
        return $name.get(this);
    }

    set name(value) {
        $name.set(this, value);
    }
}

exports.default = Route;
//# sourceMappingURL=route.js.map