"use strict";

import config from "saw-config";
import router from "saw-routing";

class Bootstrapper {
    static bootstrap(app) {
        app.on("route.register", function (router) {
            router.get("/", function (ctx, next) {
                ctx.body = "bonjour";
            });

            router.get("test/{id}", "app/src-compiled/controllers/test@test", {
                where: {
                    id: "[0-9]+"
                },
                prefix: "fr",
                name: "test"
            });
        });

        // Dispatch request to router
        app.use(async(ctx, next) => {
            app.emit("route.register", router);

            return await router.dispatch(ctx, next);
        });

        app.use(async(ctx, next) => {
            ctx.body += "--- NEXT !";
        });
    }
}

export default Bootstrapper;