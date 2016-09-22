"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _route = require("./route");

var _route2 = _interopRequireDefault(_route);

var _notFoundHttpError = require("./error/not-found-http-error");

var _notFoundHttpError2 = _interopRequireDefault(_notFoundHttpError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $routes = {},
    $methods = ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
    $request;

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

function match_all(pattern, input) {
    var result = [];
    input.replace(pattern, function (_, val) {
        result.push(val);
    });
    return result;
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

                var match = match_all(new RegExp(`^${ path.replace(/({\w+})/g, "(\\w+)") }$`), request.path);

                if (match.length > 0) {
                    return [route, match];
                }
            }
        }

        throw new Error("No route matching this request.");
    }

    dispatch(ctx, next) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            $request = ctx;

            ctx.route = null;
            ctx.route_params = [];

            try {
                var [route, params] = _this.match(ctx);
            } catch (error) {
                throw new _notFoundHttpError2.default();
            }

            ctx.route = route;
            ctx.route_params = params;

            return yield route.handle(ctx, next);
        })();
    }

    get request() {
        return $request;
    }

    get routes() {
        return $routes;
    }
}

exports.default = Router;
//# sourceMappingURL=router.js.map