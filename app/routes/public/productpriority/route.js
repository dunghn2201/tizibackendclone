var route = require("express").Router();
var ProductPriority = require("../../../controllers/public/ProductPriority");

route.get("/", ProductPriority.search);

module.exports = route;