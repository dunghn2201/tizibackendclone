var route = require("express").Router();
var Store = require("../../../controllers/public/Store");

route.get("/product", Store.product);
route.get("/product/all", Store.allProduct);
route.get("/:url", Store.aboutUser);

module.exports = route;