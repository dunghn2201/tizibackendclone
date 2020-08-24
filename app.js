const express = require("express");
const path = require("path");
var morgan = require("morgan");
var fileupload = require("express-fileupload");
var cors = require("cors");

var database = require("./config/mysql");
var mysql = database.dbConnection(); 

var app = express();
var port = process.env.PORT || 8000;

var socket = require("./app/socket");

mysql.connect(function(error){
    if(error) throw error;
    else{
        global.mysql=mysql;
        app.use(fileupload());
        app.use(express.json());
		app.use(cors());
        app.use(morgan("dev"));
        app.use("/image", express.static(path.join(__dirname, "./app/files")));
        app.use("", require("./app/routes"));
        var server = app.listen(port, function(){
            console.log("Server dang chay: http://localhost:" + port);
        });
        var io = require("socket.io")(server);
        io.on('connection', socket);
    }
});
