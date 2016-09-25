"use strict";

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _index = require("../../index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_index2.default.get("/", function (ctx) {
    console.log("YES");
});

// router.get("/user/{id}", function (ctx) {
//     console.log(ctx.request.params);
// });

_index2.default.get("/user/{id?}", function (ctx) {
    console.log(ctx.request.params);
}, {
    where: {
        id: "[0-9]+"
    },
    default: {
        id: 999
    }
});

// console.log(router.routes.all());

// var ctx = {
//     request : {
//         path: "/",
//         method: "GET"
//     }
// };

var ctx = {
    request: {
        path: "/user/52",
        method: "GET"
    }
};

var test = (() => {
    var _ref = (0, _asyncToGenerator3.default)(function* () {
        return yield _index2.default.dispatch(ctx);
    });

    return function test() {
        return _ref.apply(this, arguments);
    };
})();

test().then(oi => {
    // console.log();
}).catch(error => {
    // throw error;
    console.error(error);
});

// app.on("route.register", function (router) {
//     router.get("/", function (ctx, next) {
//         ctx.body = "bonjour";
//     });
//
//     router.get("test/{id?}", "app/src-compiled/controllers/test@test", {
//         where: {
//             id: "[0-9]+"
//         },
//         default: {
//             id: 52525252
//         },
//         prefix: "fr",
//         name: "test"
//     });
// });
//# sourceMappingURL=index.js.map