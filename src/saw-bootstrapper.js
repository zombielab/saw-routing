"use strict";

import config from "saw-config";
import router from "saw-routing";

class Bootstrapper {
    static bootstrap(app) {
        app.use(async(ctx, next) => {
            app.emit("routing: route.register", router);

            return await router.dispatch(ctx, next);
        });
    }
}

export default Bootstrapper;