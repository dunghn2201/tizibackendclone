var Model = require("../Model");
class Category extends Model{
    async checkName(data){
        let sql = `SELECT COUNT(id) AS count FROM category WHERE url=?`;
        let value = [
            data.url
        ];
        return await this.querySuper(sql, value, "checkName");
    }
    async create(data){
        let sql = `INSERT INTO category(name, url, title, icon, parent_id, other) VALUES
                    (?,?,?,?,?,?)`;
        let value = [
            data.name,
            data.url,
            data.title,
            data.icon,
            data.parent_id,
            data.other
        ];
        return await this.querySuper(sql, value, "create");
    }
    async update(data){
        let sql = `UPDATE category SET name=?, url=?, title=?, icon=?, parent_id=?, other=? WHERE id=?`;
        let value = [
            data.name,
            data.url,
            data.title,
            data.icon,
            data.parent_id,
            data.other,
            data.id
        ];
        return await this.querySuper(sql, value, "update");
    }
    async delete(data){
        let sql = `DELETE FROM category WHERE id IN ?`;
        let value = [[data]];
        return await this.querySuper(sql, value, "delete");
    }
    async getAll(){
        let sql = `SELECT * FROM category`;
        return await this.query(sql, "getAll");
    }
    async getSingle(data){
        let sql = `SELECT * FROM category WHERE id=?`;
        let value = [
            data.id
        ];
        return await this.querySuper(sql, value, "getSingle");
    }
    async getListIdDel(){
        let sql = `SELECT id, icon, parent_id FROM category`;
        return await this.query(sql, "getListIdDel");
    }
    async show(data){
        let sql = `UPDATE category SET open=? WHERE id=?`;
        let value = [data.open,data.id];
        return await this.querySuper(sql, value, "show");
    }
}
module.exports = Category;