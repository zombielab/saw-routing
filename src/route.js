"use strict";

import {trim} from "saw-support/lib/helpers";

var $methods = new WeakMap(),
    $uri = new WeakMap(),
    $handler = new WeakMap(),
    $name = new WeakMap(),
    $prefix = new WeakMap(),
    $bindings = new WeakMap(),
    $wheres = new WeakMap(),
    $defaults = new WeakMap(),
    $compiled = new WeakMap(),
    $secure = new WeakMap();

function prefix($this) {
    return $prefix.get($this) !== null ? "/" + $prefix.get($this) : "";
}

function compileRoute($this) {
    var regexp = $uri.get($this),
        keys = [],
        required = [],
        optional = [];

    regexp = regexp.replace(/(?:{(.*?)\?})/g, function (_, val) {
        keys.push(val);
        optional.push(val);

        if (typeof $wheres.get($this)[val] !== "undefined") {
            return "(" + $wheres.get($this)[val] + ")?";
        }

        return "(.*?)?";
    });

    regexp = regexp.replace(/(?:{(.*?)})/g, function (_, val) {
        keys.push(val);
        required.push(val);

        if (typeof $wheres.get($this)[val] !== "undefined") {
            return "(" + $wheres.get($this)[val] + ")";
        }

        return "(.*?)";
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
        $uri.set(this, trim(uri, "/"));
        $handler.set(this, handler);
        $name.set(this, null);
        $prefix.set(this, null);
        $bindings.set(this, {});
        $wheres.set(this, {});
        $defaults.set(this, {});
        $compiled.set(this, null);
        $secure.set(this, null);

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
                    $prefix.set(this, trim(options[i], "/"));
                }

                if (i == "secure") {
                    $secure.set(this, options[i]);
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
        $prefix.set(this, trim(value, "/"));
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

    get secure() {
        return $secure.get(this);
    }

    set secure(value) {
        $secure.set(this, value);
    }

    matches(request) {
        var compiled = compileRoute(this),
            regexp = prefix(this) + "/" + compiled.regexp;

        if ($methods.get(this).indexOf(request.method) < 0) {
            return false;
        }

        if ((new RegExp(`^${regexp}$`)).exec(request.path) === null) {
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

        request.path.replace(new RegExp(`^${regexp}$`), function (_, val) {
            values.push(val);
        });

        for (let key in keys) {
            if (typeof values[key] !== "undefined") {
                params[keys[key]] = values[key];
            }
        }

        return params;
    }

    async handle() {
        var handler = await($handler.get(this)).call();

        // Bindings values to handler right before the calling
        for (let i in $bindings.get(this)) {
            if ($bindings.get(this).hasOwnProperty(i)) {
                handler[i] = $bindings.get(this)[i];
            }
        }

        return await handler.apply(handler, Array.from(arguments));
    }
}

export default Route;