var Model = require("../Model");

class About extends Model{
    async create(data){
        var sql = `INSERT INTO about(name, url, image) VALUES (?,?,?)`;
        var value = [data.name, data.url, data.image];
        return await this.querySuper(sql, value, "createBanner");
    }
    async getAll(data){
        var sql = `SELECT * FROM about`;
        return await this.query(sql, "getAllAbout");
    }
}

module.exports = About;