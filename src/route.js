"use strict";

var $methods = new WeakMap(),
    $uri = new WeakMap(),
    $action = new WeakMap(),
    $name = new WeakMap(),
    $prefix = new WeakMap(),
    $bindings = new WeakMap();

function trim(string) {
    if (string.charAt(0) == "/") {
        string = string.substr(1, string.length - 1);
    }

    if (string.charAt(string.length - 1) == "/") {
        string = string.substr(0, string.length - 1);
    }

    return string;
}

class Route {
    constructor(methods, uri, action) {
        $methods.set(this, methods);
        $uri.set(this, trim(uri));
        $action.set(this, action);
        $name.set(this, null);
        $prefix.set(this, null);
        $bindings.set(this, {});
    }

    get methods() {
        return $methods.get(this);
    }

    get uri() {
        return $uri.get(this);
    }

    get action() {
        return $action.get(this);
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
        $prefix.set(this, trim(value));
    }

    get bindings() {
        return $bindings.get(this);
    }

    get path() {
        return ($prefix.get(this) !== null ? "/" + $prefix.get(this) : "") + "/" + $uri.get(this);
    }

    async handle() {
        var handler = await ($action.get(this)).call();

        // Bindings values to handler
        for (let k in $bindings.get(this)) {
            if ($bindings.get(this).hasOwnProperty(k)) {
                handler[k] = $bindings.get(this)[k];
            }
        }

        return await handler.apply(handler, Array.from(arguments));
    }
}

export default Route;