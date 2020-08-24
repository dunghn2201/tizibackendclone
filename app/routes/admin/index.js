const route = require('express').Router();
const category = require("./category");
const province = require("./province");
const product = require("./product");
const productfeedback = require("./productfeedback");
const banner = require("./banner");
const user = require("./user");
const aboutfooter = require("./aboutfooter");

route.use("/banner", banner);
route.use("/category", category);
route.use("/province", province);
route.use("/product", product);
route.use("/productfeedback", productfeedback);
route.use("/user", user);
route.use("/about-footer", aboutfooter);

module.exports = route;