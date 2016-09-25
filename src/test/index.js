"use strict";

import router from "../../index";

router.get("/", function (ctx) {
    console.log("YES");
});

// router.get("/user/{id}", function (ctx) {
//     console.log(ctx.request.params);
// });

router.get("/user/{id?}",
    function (ctx) {
        console.log(ctx.request.params);
    },
    {
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

var test = async() => {
    return await router.dispatch(ctx);
};

test().then((oi) => {
    // console.log();
}).catch((error) => {
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