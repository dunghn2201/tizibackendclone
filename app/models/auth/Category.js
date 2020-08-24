var Model = require("../Model");

class Category extends Model{
    async getAll(){
        var sql = `SELECT * FROM category`;
        return await this.query(sql, "getAll");
    }
}
module.exports = Category;