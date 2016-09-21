"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _from = require("babel-runtime/core-js/array/from");

var _from2 = _interopRequireDefault(_from);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _weakMap = require("babel-runtime/core-js/weak-map");

var _weakMap2 = _interopRequireDefault(_weakMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $methods = new _weakMap2.default(),
    $uri = new _weakMap2.default(),
    $action = new _weakMap2.default(),
    $name = new _weakMap2.default(),
    $prefix = new _weakMap2.default(),
    $bindings = new _weakMap2.default();

function trim(string) {
    if (string.charAt(0) == "/") {
        string = string.substr(1, string.length - 1);
    }

    if (string.charAt(string.length - 1) == "/") {
        string = string.substr(0, string.length - 1);
    }

    return string;
}

class Route {
    constructor(methods, uri, action) {
        $methods.set(this, methods);
        $uri.set(this, trim(uri));
        $action.set(this, action);
        $name.set(this, null);
        $prefix.set(this, null);
        $bindings.set(this, {});
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

    get prefix() {
        return $prefix.get(this);
    }

    set prefix(value) {
        $prefix.set(this, trim(value));
    }

    get bindings() {
        return $bindings.get(this);
    }

    get path() {
        return ($prefix.get(this) !== null ? "/" + $prefix.get(this) : "") + "/" + $uri.get(this);
    }

    handle() {
        var _this = this,
            _arguments = arguments;

        return (0, _asyncToGenerator3.default)(function* () {
            var handler = yield $action.get(_this).call();

            return yield handler.apply(_this, (0, _from2.default)(_arguments));
        })();
    }
}

exports.default = Route;
//# sourceMappingURL=route.js.map