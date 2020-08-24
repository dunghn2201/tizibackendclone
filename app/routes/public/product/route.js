const route = require("express").Router();
const Product = require("../../../controllers/public/Product");

route.get("/", Product.search);
route.post("/", Product.create);
route.get("/:id", Product.about);

module.exports = route;