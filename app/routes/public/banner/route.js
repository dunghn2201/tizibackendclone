var route = require("express").Router();
var Banner = require("../../../controllers/public/Banner");

route.get("/", Banner.getAll);

module.exports = route;