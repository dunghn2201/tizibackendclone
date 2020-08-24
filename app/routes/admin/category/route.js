const route = require("express").Router();
const category = require("../../../controllers/admin/Category");

route.post("/", category.create);
route.get("/", category.getAll);
route.patch("/", category.update);
route.patch("/show", category.show);// ẩn/hiện danh mục con
route.get("/:id", category.getSingle);
route.delete("/:id", category.delete);

module.exports = route;
