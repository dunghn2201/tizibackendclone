var route = require("express").Router();
var ProductFeedback = require("../../../controllers/admin/ProductFeedback");

route.get("/:id_product", ProductFeedback.about)

module.exports = route;