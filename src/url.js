"use strict";

import querystring from "querystring";
import config from "saw-config";

var $base_url = config.get("app.url", ""),
    $request,
    $router;


// function getRouteDomain(route, params) {
//
// }
//
// function toRoute(route, $parameters, $absolute)
// {
//     $parameters = formatParameters($parameters);
//
//     $domain = getRouteDomain(route, $parameters);
//
//     $uri = strtr(rawurlencode($this->addQueryString($this->trimUrl(
//         $root = $this->replaceRoot(route, $domain, $parameters),
//         $this->replaceRouteParameters($route->uri(), $parameters)
//     ), $parameters)), $this->dontEncode);
//
//     return $absolute ? $uri : '/'.ltrim(str_replace($root, '', $uri), '/');
// }

function replaceRouteParameters(route, params = {}) {
    var path = route.uri,
        defaults = route.defaults;

    path = path.replace(/(?:{(.*?)\?})/g, function (_, val) {
        var param = params[val];

        if (typeof param === "undefined" && typeof defaults[val] !== "undefined") {
            param = defaults[val];
        }

        delete params[val];

        return typeof param !== "undefined" ? param : "";
    });

    path = path.replace(/(?:{(.*?)})/g, function (_, val) {
        var param = params[val];

        if (typeof param !== "undefined") {
            delete params[val];

            return param;
        }

        throw new Error(`Required route param [${val}] is missing.`);
    });

    return route.prefix !== null ? route.prefix + "/" + path : path;
}

function getRouteDomain(route, params) {

}

function toRoute(route, params, relative) {
    var path = replaceRouteParameters(route, params),
        query = querystring.stringify(params),
        protocol = route.secure === true ? "https" : (route.secure === false ? "http" : $request.protocol),
        host = "",
        port = $request.port,
        fragment = "";

    if (query.length > 0) {
        path = path + "?" + query;
    }

    return relative === true ? `${port}${path}${fragment}` : `${protocol}://${host}${port}${path}${fragment}`;
}

class Url {
    constructor(request = null, router = null) {
        this.request = request;
        this.router = router;
    }

    full() {
        return $request.href;
    }

    current() {
        return $request.path;
    }

    previous() {
        var referer = $request.headers["referer"];

        // TODO: get previous url from session
        var url = typeof referer !== "undefined" ? this.to(referer) : "";

        return typeof url !== "undefined" ? url : this.to("/");
    }

    to(path, extra = {}, secure = null) {

    }

    route(name, params = {}, relative = false) {
        for (var i in $router.routes) {
            if ($router.routes.hasOwnProperty(i)) {
                var route = $router.routes[i];

                if (route.name == name) {
                    return toRoute(route, Object.assign({}, params), relative);
                }
            }
        }

        throw new Error(`Route [${name}] not registered.`);
    }

    get request() {
        return $request;
    }

    set request(value) {
        $request = value;
    }

    get router() {
        return $router;
    }

    set router(value) {
        $router = value;
    }
}

var UrlGenerator = new Url();

export default UrlGenerator;