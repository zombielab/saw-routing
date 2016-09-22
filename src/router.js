"use strict";

import Route from "./route";
import NotFoundHttpError from "./error/not-found-http-error";

var $routes = {},
    $methods = [
        "GET",
        "HEAD",
        "POST",
        "PUT",
        "PATCH",
        "DELETE"
    ],
    $request;

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
                object = new (require(path));

            return await object[method];
        };
    } else if (typeof action === "object" && Array.isArray(action)) {
        callable = async function () {
            var [path, method] = action,
                object = new (require(path));

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

    match(methods, uri, action) {
        return addRoute(methods, uri, action);
    }

    all(uri, action) {
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

                if (match !== null && match.index === 0) {
                    return route;
                }
            }
        }

        return null;
    }

    async dispatch(ctx, next) {
        var route = null;

        $request = ctx;

        if ($methods.indexOf(ctx.method) >= 0) {
            route = this.find(ctx);
        }

        if (route !== null) {
            return await route.handle(ctx, next);
        }

        throw new NotFoundHttpError;
    }

    get request() {
        return $request;
    }

    get routes() {
        return $routes;
    }
}

export default Router;