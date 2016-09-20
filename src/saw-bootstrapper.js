"use strict";

import config from "saw-config";
import router from "saw-routing";

class Bootstrapper {
    static bootstrap(app) {
        app.use(async (ctx, next) => {
            var route = router.match(ctx.request);

            console.log(route.uri);

            return next();
        });
    }
}

export default Bootstrapper;