"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _sawConfig = require("saw-config");

var _sawConfig2 = _interopRequireDefault(_sawConfig);

var _sawRouting = require("saw-routing");

var _sawRouting2 = _interopRequireDefault(_sawRouting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Bootstrapper {
    static bootstrap(app) {
        app.on("route.register", function (collection) {
            collection.get("/", function () {
                return "bonjour";
            });
        });

        //
        app.emit("route.register", _sawRouting2.default);

        // Dispatch router
        app.use((() => {
            var _ref = (0, _asyncToGenerator3.default)(function* (ctx, next) {
                return yield _sawRouting2.default.dispatch(ctx, next);
            });

            return function (_x, _x2) {
                return _ref.apply(this, arguments);
            };
        })());

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

exports.default = Bootstrapper;
//# sourceMappingURL=saw-bootstrapper.js.map