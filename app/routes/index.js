const route = require("express").Router();
const public = require("./public"); 
const admin = require('./admin'); 
const auth = require('./auth'); 

const {checkToken} = require("../validation/admin/token");

var date = require("../util/date");

route.use("/public", public);
route.use("/admin", checkToken, admin);
route.use("/auth", auth);
route.get("/", (request, response)=>{
    return response.json({
        time: date()
    })
});

module.exports = route; 