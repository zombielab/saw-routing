"use strict";

var $methods = new WeakMap(),
    $uri = new WeakMap(),
    $action = new WeakMap(),
    $name = new WeakMap();

class Route {
    constructor(methods, uri, action, name = null) {
        $methods.set(this, methods);
        $uri.set(this, uri);
        $action.set(this, action);
        $name.set(this, name);
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
}

export default Route;