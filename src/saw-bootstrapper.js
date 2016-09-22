"use strict";

import config from "saw-config";
import router from "saw-routing";

class Bootstrapper {
    static bootstrap(app) {
        app.on("route.register", function (router) {
            router.get("/", function (ctx, next) {
                ctx.body = "bonjour";
            });

            router.get("/", (ctx, next) => {
                ctx.body = "bonsoir";

                return next();
            });
        });

        // Dispatch request to router
        app.use(async (ctx, next) => {
            app.emit("route.register", router);

            return await router.dispatch(ctx, next);
        });
    }
}

export default Bootstrapper;