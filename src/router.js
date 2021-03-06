"use strict";

import url from "./url";
import Route from "./route";

var $routes = {},
    $all_routes = [],
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

function makeRoute(methods, uri, handler, options) {
    var callable;

    // Validating route methods
    for (let method of methods) {
        if ($methods.indexOf(method) < 0) {
            throw new Error(`Invalid route method [${method}].`);
        }
    }

    // Resolve route callback
    if (typeof handler === "string") {
        callable = async function () {
            var [path, method] = handler.split("@"),
                object = new (requireHandler(path));

            return await object[method];
        };
    } else if (typeof handler === "object" && Array.isArray(handler)) {
        callable = async function () {
            var [path, method] = handler,
                object = new (requireHandler(path));

            return await object[method];
        };
    } else if (typeof handler === "object") {
        // TODO: ?
    } else if (typeof handler === "function") {
        callable = async function () {
            return await handler;
        };
    } else {
        throw new Error("Invalid route callback.");
    }

    return new Route(methods, uri, callable, options);
}

function addRoute(methods, uri, handler, options) {
    var route = makeRoute(methods, uri, handler, options);

    for (var method of methods) {
        if (typeof $routes[method] !== "undefined") {
            $routes[method][uri] = route;
        }
    }

    $all_routes.push(route);

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
    group() {

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

    async dispatch(ctx, next) {
        var route = this.match(ctx.request);

        if (route === null) {
            ctx.throw(404);
        }

        ctx.request.route = route;
        ctx.request.params = route.resolve(ctx.request);

        return await route.handle(ctx, next);
    }

    get routes() {
        return $all_routes;
    }
}

export default Router;