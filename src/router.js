"use strict";

import Route from "./route";

var $routes = {},
    $methods = [
        "GET",
        "HEAD",
        "POST",
        "PUT",
        "PATCH",
        "DELETE"
    ];

function requireHandler(path) {
    var obj = require(path);

    if ((typeof obj["__esModule"] !== "undefined") && (obj["__esModule"] === true)) {
        return obj.default;
    }

    if (typeof obj["default"] !== "undefined") {
        return obj.default;
    }

    return obj;
}

function makeRoute(methods, uri, action) {
    var callable;

    // Validating route methods
    for (let method of methods) {
        if ($methods.indexOf(method) < 0) {
            throw new Error(`Invalid route method: ${method}.`);
        }
    }

    // Resolve route callback
    if (typeof action === "string") {
        callable = async function () {
            var [path, method] = action.split("@"),
                object = new (requireHandler(path));

            return await object[method];
        };
    } else if (typeof action === "object" && Array.isArray(action)) {
        callable = async function () {
            var [path, method] = action,
                object = new (requireHandler(path));

            return await object[method];
        };
    } else if (typeof action === "object") {
        // TODO:
    } else if (typeof action === "function") {
        callable = async function () {
            return await action;
        };
    } else {
        throw new Error("Invalid route callback.");
    }

    return new Route(methods, uri, callable);
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
    group() {

    }

    find(request) {
        var routes = typeof $routes[request.method] !== "undefined" ? $routes[request.method] : [];

        for (let k in routes) {
            if (routes.hasOwnProperty(k)) {
                var route = routes[k],
                    regexp = new RegExp(`^${route.path}$`),
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

                request.path.replace(new RegExp(`^${pattern}$`), function (_, val) {
                    values.push(val);
                });

                var params = {};

                for (let key in keys) {
                    params[keys[key]] = values[key];
                }

                if (Object.keys(params).length > 0) {
                    return [route, params];
                }
            }
        }

        throw new Error("No route matching this request.");
    }

    async dispatch(ctx, next) {
        ctx.request.route = null;
        ctx.request.params = {};

        try {
            var [route, params] = this.match(ctx.request);
        } catch (error) {
            ctx.throw(404);
        }

        ctx.request.route = route;
        ctx.request.params = params;

        return await route.handle(ctx, next);
    }

    get routes() {
        return $routes;
    }
}

export default Router;