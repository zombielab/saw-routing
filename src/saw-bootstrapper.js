"use strict";

import config from "saw-config";
import router from "saw-routing";
import url from "saw-routing/lib/url";

class Bootstrapper {
    static bootstrap(app) {
        app.use(async(ctx, next) => {
            url.router = router;
            url.request = ctx.request;

            ctx.request.route = null;
            ctx.request.params = {};

            app.emit("routing: route.register", router);

            return await router.dispatch(ctx, next);
        });
    }
}

export default Bootstrapper;