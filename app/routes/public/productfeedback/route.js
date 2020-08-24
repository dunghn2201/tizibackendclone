var route = require("express").Router();
var ProductFeedback = require("../../../controllers/public/ProductFeedback");

route.post("/", ProductFeedback.create);

module.exports = route;