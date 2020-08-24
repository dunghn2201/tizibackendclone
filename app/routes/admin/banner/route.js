var route = require("express").Router();
var Banner = require("../../../controllers/admin/Banner");

route.get("/", Banner.getAll);
route.get("/:id", Banner.getAbout);
route.post("/", Banner.create);
route.put("/", Banner.updateStatus);
route.patch("/", Banner.update);
route.delete("/", Banner.delete);

module.exports = route;