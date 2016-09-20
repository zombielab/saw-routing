"use strict";

class HttpError extends Error {
    constructor(message, status = 500, expose = false) {
        super();

        this.name = this.constructor.name;
        this.message = message;
        this.status = status;
        this.expose = false;
    }
}

export default HttpError;