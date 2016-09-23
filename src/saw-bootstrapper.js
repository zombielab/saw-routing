"use strict";

import config from "saw-config";
import router from "saw-routing";

class Bootstrapper {
    static bootstrap(app) {
        app.on("route.register", function (router) {
            router.get("/", function (ctx, next) {
                ctx.body = "bonjour";
            });

            router.get("/test/{id}", (ctx, next) => {
                ctx.body = "bonsoir: ";
                ctx.body += ctx.route_params["id"];

                return next();
            });
        });

        // Dispatch request to router
        app.use(async(ctx, next) => {
            app.emit("route.register", router);

            return await router.dispatch(ctx, next);
        });

        app.use(async(ctx, next) => {
            ctx.body += "--- OI !";
        });
    }
}

export default Bootstrapper;