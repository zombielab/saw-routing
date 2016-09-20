"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _helpers = require("saw-support/helpers");

var _helpers2 = _interopRequireDefault(_helpers);

var _route = require("./route");

var _route2 = _interopRequireDefault(_route);

var _notFoundHttpError = require("./error/not-found-http-error");

var _notFoundHttpError2 = _interopRequireDefault(_notFoundHttpError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $routes = {},
    $verbs = ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
    $prefix = "/";

function makeRoute(methods, uri, action) {
    var callable;

    switch (typeof action) {
        case "string":
            callable = function () {
                var [path, method] = action.split("@"),
                    object = new (require(path))();

                return object[method];
            };
            break;

        case "object":
            if (Array.isArray(action) === true) {
                callable = function () {
                    var [path, method] = action,
                        object = new (require(path))();

                    return object[method];
                };
            } else {
                callable = function () {
                    var object = new (require(action.path))();

                    return object[action.method];
                };
            }
            break;

        case "function":
            callable = action;
            break;

        default:
            throw new Error("Invalid route callback.");
            break;
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

    get(uri, action = null) {
        return addRoute(["GET", "HEAD"], uri, action);
    }

    post(uri, action = null) {
        return addRoute(["POST"], uri, action);
    }

    put(uri, action = null) {
        return addRoute(["PUT"], uri, action);
    }

    patch(uri, action = null) {
        return addRoute(["PATCH"], uri, action);
    }

    delete(uri, action = null) {
        return addRoute(["DELETE"], uri, action);
    }

    any(uri, action = null) {
        return addRoute($verbs, uri, action);
    }

    is() {}

    match(request) {}

    prefix(uri) {
        if (uri.charAt(0) == "/") {
            uri = uri.substr(1, uri.length - 1);
        }

        if (uri.charAt(uri.length - 1) == "/") {
            uri = uri.substr(0, uri.length - 1);
        }

        return "/" + $prefix + "/" + uri;
    }

    match(request) {
        if ($verbs.indexOf(request.method) >= 0) {
            var routes = typeof $routes[request.method] !== "undefined" ? $routes[request.method] : [];

            for (let route of routes) {
                var regexp = new RegExp(this.prefix(route.uri)),
                    match = regexp.exec(request.path);

                if (match !== null && match.index === 0) {
                    return route;
                }
            }
        }

        throw new _notFoundHttpError2.default();
    }

    get routes() {
        return $routes;
    }
}

exports.default = Router;
//# sourceMappingURL=router.js.map