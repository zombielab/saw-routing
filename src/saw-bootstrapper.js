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

        app.use(async (ctx, next) => {
            app.emit("route.register", router.routes);

            var route = router.match(ctx.request);

            console.log(route.uri);

            return next();
        });
    }
}

export default Bootstrapper;