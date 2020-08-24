var config = require("../setting.json");
var mysql = require("mysql");

module.exports = {
    dbConnection: function(){
        var connection = mysql.createConnection({
            host     : config.mysql.host,
            user     : config.mysql.user,
            password : config.mysql.password,
            database : config.mysql.database,
            multipleStatements: true,
            charset : "utf8mb4"
        });
        return connection;
    }
}