var route = require("express").Router();
var AboutFooter = require("../../../controllers/admin/AboutFooter");

route.get("/", AboutFooter.getAll);
route.get("/:id", AboutFooter.about);
route.post("/", AboutFooter.create);
route.patch("/", AboutFooter.update);
route.delete("/", AboutFooter.delete);

module.exports = route;