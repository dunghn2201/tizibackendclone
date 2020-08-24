var route = require("express").Router();
var Province = require("../../../controllers/admin/Province");

route.get("/", Province.getAll);
route.get("/:id", Province.getAbout);
route.patch("/", Province.update);

module.exports = route;
