var route = require("express").Router();
var ProductFollow = require("../../../controllers/public/ProductFollow");

route.get("/", ProductFollow.search);
route.get("/:id_user", ProductFollow.getAll);
route.post("/", ProductFollow.create);

module.exports = route;