"use strict";

import HttpError from "./http-error";

class NotFoundHttpError extends HttpError {
    constructor(message = "Not found.", status = 404, expose = true) {
        super(message, status, expose);
    }
}

export default NotFoundHttpError;