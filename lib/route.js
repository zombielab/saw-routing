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
    $handler = new _weakMap2.default(),
    $name = new _weakMap2.default(),
    $prefix = new _weakMap2.default(),
    $bindings = new _weakMap2.default(),
    $wheres = new _weakMap2.default(),
    $defaults = new _weakMap2.default(),
    $compiled = new _weakMap2.default();

function trim(string) {
    if (string.charAt(0) == "/") {
        string = string.substr(1, string.length - 1);
    }

    if (string.charAt(string.length - 1) == "/") {
        string = string.substr(0, string.length - 1);
    }

    return string;
}

function prefix($this) {
    return $prefix.get($this) !== null ? "/" + $prefix.get($this) : "";
}

function compileRoute($this) {
    var regexp = $uri.get($this),
        keys = [],
        required = [],
        optional = [];

    regexp = regexp.replace(/(?:{(\w+)\?})/g, function (_, val) {
        keys.push(val);
        optional.push(val);

        if (typeof $wheres.get($this)[val] !== "undefined") {
            return "(" + $wheres.get($this)[val] + ")?";
        }

        return "(\\w+)?";
    });

    regexp = regexp.replace(/(?:{(\w+)})/g, function (_, val) {
        keys.push(val);
        required.push(val);

        if (typeof $wheres.get($this)[val] !== "undefined") {
            return "(" + $wheres.get($this)[val] + ")";
        }

        return "(\\w+)";
    });

    var compiled = {
        regexp: regexp,
        keys: keys,
        required: required,
        optional: optional
    };

    $compiled.set($this, compiled);

    return compiled;
}

class Route {
    constructor(methods, uri, handler, options = {}) {
        $methods.set(this, methods);
        $uri.set(this, trim(uri));
        $handler.set(this, handler);
        $name.set(this, null);
        $prefix.set(this, null);
        $bindings.set(this, {});
        $wheres.set(this, {});
        $defaults.set(this, {});
        $compiled.set(this, null);

        for (var i in options) {
            if (options.hasOwnProperty(i)) {
                if (i == "where") {
                    $wheres.set(this, options[i]);
                }

                if (i == "default") {
                    $defaults.set(this, options[i]);
                }

                if (i == "name") {
                    $name.set(this, options[i]);
                }

                if (i == "prefix") {
                    $prefix.set(this, trim(options[i]));
                }
            }
        }
    }

    get methods() {
        return $methods.get(this);
    }

    get uri() {
        return $uri.get(this);
    }

    get handler() {
        return $handler.get(this);
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

    get wheres() {
        return $wheres.get(this);
    }

    get defaults() {
        return $defaults.get(this);
    }

    get bindings() {
        return $bindings.get(this);
    }

    get compiled() {
        return $compiled.get(this);
    }

    get path() {
        return prefix(this) + "/" + $uri.get(this);
    }

    matches(request) {
        var compiled = compileRoute(this),
            regexp = prefix(this) + "/" + compiled.regexp;

        if ($methods.get(this).indexOf(request.method) < 0) {
            return false;
        }

        if (new RegExp(`^${ regexp }$`).exec(request.path) === null) {
            return false;
        }

        return true;
    }

    resolve(request) {
        var params = $defaults.get(this),
            compiled = compileRoute(this);

        var regexp = prefix(this) + "/" + compiled.regexp,
            keys = compiled.keys,
            values = [];

        request.path.replace(new RegExp(`^${ regexp }$`), function (_, val) {
            values.push(val);
        });

        for (let key in keys) {
            if (typeof values[key] !== "undefined") {
                params[keys[key]] = values[key];
            }
        }

        return params;
    }

    parse(params = {}, prefixed = true) {
        var path = $uri.get(this);

        path = path.replace(/(?:{(\w+)\?})/g, function (_, val) {
            if (typeof params[val] !== "undefined") {
                return params[val];
            }

            return "";
        });

        path = path.replace(/(?:{(\w+)})/g, function (_, val) {
            if (typeof params[val] !== "undefined") {
                return params[val];
            }

            throw new Error(`Required route param [${ val }] is missing.`);
        });

        return prefixed === true ? prefix(this) + "/" + path : path;
    }

    handle() {
        var _this = this,
            _arguments = arguments;

        return (0, _asyncToGenerator3.default)(function* () {
            var handler = yield $handler.get(_this).call();

            // Bindings values to handler right before the calling
            for (let i in $bindings.get(_this)) {
                if ($bindings.get(_this).hasOwnProperty(i)) {
                    handler[i] = $bindings.get(_this)[i];
                }
            }

            return yield handler.apply(handler, (0, _from2.default)(_arguments));
        })();
    }
}

exports.default = Route;
//# sourceMappingURL=route.js.map