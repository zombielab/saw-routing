"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _route = require("./route");

var _route2 = _interopRequireDefault(_route);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $routes = {},
    $methods = ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"];

function makeRoute(methods, uri, action) {
    var callable;

    // Validating route methods
    for (let method of methods) {
        if ($methods.indexOf(method) < 0) {
            throw new Error(`Invalid route method: ${ method }.`);
        }
    }

    // Resolve route callback
    if (typeof action === "string") {
        callable = (() => {
            var _ref = (0, _asyncToGenerator3.default)(function* () {
                var [path, method] = action.split("@"),
                    object = new (require(path))();

                return yield object[method];
            });

            return function callable() {
                return _ref.apply(this, arguments);
            };
        })();
    } else if (typeof action === "object" && Array.isArray(action)) {
        callable = (() => {
            var _ref2 = (0, _asyncToGenerator3.default)(function* () {
                var [path, method] = action,
                    object = new (require(path))();

                return yield object[method];
            });

            return function callable() {
                return _ref2.apply(this, arguments);
            };
        })();
    } else if (typeof action === "object") {
        // TODO:
    } else if (typeof action === "function") {
        callable = (() => {
            var _ref3 = (0, _asyncToGenerator3.default)(function* () {
                return yield action;
            });

            return function callable() {
                return _ref3.apply(this, arguments);
            };
        })();
    } else {
        throw new Error("Invalid route callback.");
    }

    return new _route2.default(methods, uri, callable);
}

function addRoute(methods, uri, action) {
    var route = makeRoute(methods, uri, action);

    for (var method of methods) {
        if (typeof $routes[method] !== "undefined") {
            $routes[method][uri] = route;
        }
    }

    return route;
}

class Router {
    constructor() {
        for (var verb of $methods) {
            $routes[verb] = {};
        }
    }

    get(uri, action) {
        return addRoute(["GET", "HEAD"], uri, action);
    }

    post(uri, action) {
        return addRoute(["POST"], uri, action);
    }

    put(uri, action) {
        return addRoute(["PUT"], uri, action);
    }

    patch(uri, action) {
        return addRoute(["PATCH"], uri, action);
    }

    delete(uri, action) {
        return addRoute(["DELETE"], uri, action);
    }

    only(methods, uri, action) {
        return addRoute(methods, uri, action);
    }

    any(uri, action) {
        return addRoute($methods, uri, action);
    }

    // TODO:
    group() {}

    find(request) {
        var routes = typeof $routes[request.method] !== "undefined" ? $routes[request.method] : [];

        for (let k in routes) {
            if (routes.hasOwnProperty(k)) {
                var route = routes[k],
                    regexp = new RegExp(`^${ route.path }$`),
                    match = regexp.exec(request.path);

                if (match !== null) {
                    return route;
                }
            }
        }

        return null;
    }

    match(request) {
        var routes = typeof $routes[request.method] !== "undefined" ? $routes[request.method] : [];

        for (let k in routes) {
            if (routes.hasOwnProperty(k)) {
                var route = routes[k],
                    path = route.path;

                var keys = [],
                    values = [],
                    pattern = path.replace(/(?:{(\w+)})/g, function (_, val) {
                    keys.push(val);

                    return "(\\w+)";
                });

                request.path.replace(new RegExp(`^${ pattern }$`), function (_, val) {
                    values.push(val);
                });

                var params = {};

                for (let key in keys) {
                    params[keys[key]] = values[key];
                }

                if ((0, _keys2.default)(params).length > 0) {
                    return [route, params];
                }
            }
        }

        throw new Error("No route matching this request.");
    }

    dispatch(ctx, next) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            ctx.request.route = null;
            ctx.request.params = {};

            try {
                var [route, params] = _this.match(ctx.request);
            } catch (error) {
                ctx.throw(404);
            }

            ctx.request.route = route;
            ctx.request.params = params;

            return yield route.handle(ctx, next);
        })();
    }

    get routes() {
        return $routes;
    }
}

exports.default = Router;
//# sourceMappingURL=router.js.map