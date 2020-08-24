var route = require("express").Router();
var Product = require("../../../controllers/admin/Product");

route.get("/", Product.search);
route.get("/:id_product", Product.about);
route.put("/", Product.updateStatus);
route.delete("/", Product.delete);

module.exports = route;