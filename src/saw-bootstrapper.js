"use strict";

import config from "saw-config";
import router from "saw-routing";

class Bootstrapper {
    static bootstrap(app) {
        app.on("route.register", function (collection) {
            collection.get("/", function () {
                return "bonjour";
            });
        });

        //
        app.emit("route.register", router);

        // Dispatch router
        app.use(router.dispatch);

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