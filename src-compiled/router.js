"use strict";

// import helpers from "saw-support/helpers";

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
    $verbs = ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
    $request;

function makeRoute(methods, uri, action) {
    var callable;

    // Validating route methods
    for (let method of methods) {
        if ($verbs.indexOf(method) < 0) {
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
            $routes[method].push(route);
        }
    }

    return route;
}

class Router {
    constructor() {
        for (var verb of $verbs) {
            $routes[verb] = [];
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

    match(methods, uri, action) {
        return addRoute(methods, uri, action);
    }

    all(uri, action) {
        return addRoute($verbs, uri, action);
    }

    // TODO:
    group() {}

    find(request) {
        var routes = typeof $routes[request.method] !== "undefined" ? $routes[request.method] : [];

        for (let route of routes) {
            var regexp = new RegExp(route.path),
                match = regexp.exec(request.path);

            if (match !== null && match.index === 0) {
                return route;
            }
        }

        return null;
    }

    dispatch(ctx, next) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            var route = null;

            $request = ctx;

            if ($verbs.indexOf(ctx.method) >= 0) {
                route = _this.find(ctx);
            }

            // TODO: autoformat responses ?
            if (route !== null) {
                // var response = await route.handle(ctx, next);
                //
                // if (typeof response !== "undefined") {
                //     if (typeof response === "string") {
                //         ctx.body = response;
                //     } else if (typeof response === "object") {
                //         ctx.type = "application/json";
                //         ctx.body = JSON.parse(response);
                //     } else {
                //         return response;
                //     }
                // }
                //
                // return next();

                var response = yield route.handle(ctx, next);

                return typeof response !== "undefined" ? response : next();
            }

            throw new _notFoundHttpError2.default();
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