const route = require("express").Router();
const Category = require("../../../controllers/public/Category");

route.get("/", Category.getAll);
route.get("/allcountparent", Category.getAllCountParent);
route.get("/:id", Category.getAbout);

module.exports = route;