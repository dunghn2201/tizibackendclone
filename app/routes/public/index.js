const route = require('express').Router();
const category = require("./category");
const province = require("./province");
const product = require("./product");
const productfeedback = require("./productfeedback");
const store = require("./store");
const productpriority = require("./productpriority");
const productfollow = require("./productfollow");
const banner = require("./banner");

route.use("/category", category);
route.use("/province", province);
route.use("/product", product);
route.use("/productfeedback", productfeedback);
route.use("/store", store);
route.use("/productpriority", productpriority);
route.use("/product-follow", productfollow);
route.use("/banner", banner);

module.exports = route;