const route = require("express").Router();
const Province = require("../../../controllers/public/Province");

route.get("/", Province.getAll);

module.exports = route;