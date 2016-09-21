"use strict";

import config from "saw-config";
import router from "saw-routing";

class Bootstrapper {
    static bootstrap(app) {
        app.on("route.register", function (collection) {
            // collection.get("/", function () {
            //     return "bonjour";
            // });

            // collection.get("/", function (ctx, next) {
            //     ctx.body = "bonjour";
            //
            //     return next();
            // });

            collection.get("/", function (ctx, next) {
                ctx.body = "bonjour";
            });

            collection.get("/", (ctx, next) => {
                ctx.body = "bonsoir";

                return next();
            });
        });

        //
        app.emit("route.register", router);

        // Dispatch router
        app.use(async (ctx, next) => {
            return await router.dispatch(ctx, next);
        });

        // app.use(async (ctx, next) => {
        //     app.emit("route.register", router);
        //
        //     var route = router.match(ctx.request);
        //
        //     console.log(route.uri);
        //
        //     return next();
        // });
    }
}

export default Bootstrapper;