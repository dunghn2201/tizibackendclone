var Model = require("../Model");

class Category extends Model{
    async getAbout(data){
        var sql = `SELECT * FROM category WHERE id=? OR url=?`;
        var value = [data.id, data.id];
        return await this.querySuper(sql, value, "getAbout");
    }
    async getAll(){
        var sql = `SELECT * FROM category`;
        return await this.query(sql, "getAll");
    }
    async getAllCountParent(){
        var sql = `SELECT c.name as text, c.id, cc.count as disabled, c.parent_id FROM category as c LEFT JOIN category_count as cc ON c.id=cc.parent_id`;
        return await this.query(sql, "getAllCountParent");
    }
}
module.exports = Category;