"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _route = require("./route");

var _route2 = _interopRequireDefault(_route);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $routes = {},
    $named_routes = {},
    $methods = ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"];

function requireHandler(path) {
    var obj = require(path);

    if (typeof obj["__esModule"] !== "undefined" && obj["__esModule"] === true) {
        return obj.default;
    }

    if (typeof obj["default"] !== "undefined") {
        return obj.default;
    }

    return obj;
}

function makeRoute(methods, uri, handler, options) {
    var callable;

    // Validating route methods
    for (let method of methods) {
        if ($methods.indexOf(method) < 0) {
            throw new Error(`Invalid route method [${ method }].`);
        }
    }

    // Resolve route callback
    if (typeof handler === "string") {
        callable = (() => {
            var _ref = (0, _asyncToGenerator3.default)(function* () {
                var [path, method] = handler.split("@"),
                    object = new (requireHandler(path))();

                return yield object[method];
            });

            return function callable() {
                return _ref.apply(this, arguments);
            };
        })();
    } else if (typeof handler === "object" && Array.isArray(handler)) {
        callable = (() => {
            var _ref2 = (0, _asyncToGenerator3.default)(function* () {
                var [path, method] = handler,
                    object = new (requireHandler(path))();

                return yield object[method];
            });

            return function callable() {
                return _ref2.apply(this, arguments);
            };
        })();
    } else if (typeof handler === "object") {
        // TODO: ?
    } else if (typeof handler === "function") {
        callable = (() => {
            var _ref3 = (0, _asyncToGenerator3.default)(function* () {
                return yield handler;
            });

            return function callable() {
                return _ref3.apply(this, arguments);
            };
        })();
    } else {
        throw new Error("Invalid route callback.");
    }

    return new _route2.default(methods, uri, callable, options);
}

function addRoute(methods, uri, handler, options) {
    var route = makeRoute(methods, uri, handler, options);

    for (var method of methods) {
        if (typeof $routes[method] !== "undefined") {
            $routes[method][uri] = route;
        }
    }

    if (route.name !== null) {
        $named_routes[route.name] = route;
    }

    return route;
}

class Router {
    constructor() {
        for (var verb of $methods) {
            $routes[verb] = {};
        }
    }

    get(uri, handler, options = {}) {
        return addRoute(["GET", "HEAD"], uri, handler, options);
    }

    post(uri, handler, options = {}) {
        return addRoute(["POST"], uri, handler, options);
    }

    put(uri, handler, options = {}) {
        return addRoute(["PUT"], uri, handler, options);
    }

    patch(uri, handler, options = {}) {
        return addRoute(["PATCH"], uri, handler, options);
    }

    delete(uri, handler, options = {}) {
        return addRoute(["DELETE"], uri, handler, options);
    }

    only(methods, uri, handler, options = {}) {
        return addRoute(methods, uri, handler, options);
    }

    any(uri, handler, options = {}) {
        return addRoute($methods, uri, handler, options);
    }

    // TODO:
    group() {}

    named(name) {
        if (typeof $named_routes[name] !== "undefined") {
            return $named_routes[name];
        }

        throw new Error(`Route [${ name }] not registered.`);
    }

    match(request) {
        var routes = typeof $routes[request.method] !== "undefined" ? $routes[request.method] : [];

        for (let k in routes) {
            if (routes.hasOwnProperty(k)) {
                var route = routes[k];

                if (route.matches(request) === true) {
                    return route;
                }
            }
        }

        return null;
    }

    dispatch(ctx, next) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            ctx.request.route = null;
            ctx.request.params = {};

            var route = _this.match(ctx.request);

            if (route === null) {
                ctx.throw(404);
            }

            ctx.request.route = route;
            ctx.request.params = route.resolve(ctx.request);

            return yield route.handle(ctx, next);
        })();
    }

    get routes() {
        return $routes;
    }
}

exports.default = Router;
//# sourceMappingURL=router.js.map