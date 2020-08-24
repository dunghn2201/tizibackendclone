var route = require("express").Router();
var User = require("../../../controllers/admin/User");

route.get("/", User.search);
route.get("/count-all", User.countAll);

module.exports = route;