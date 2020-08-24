const Model = require("../Model");

class AboutFooter extends Model{
    async create(data){
        var sql = `INSERT INTO about_footer(id_group,name,url) VALUES(?,?,?)`;
        var value = [data.id_group,data.name,data.url];
        return await this.querySuper(sql, value, "createAboutFooter");
    }
    async about(data){
        var sql = `SELECT * FROM about_footer WHERE id=?`;
        var value = [data.id];
        return await this.querySuper(sql, value,"AboutFooter");
    }
    async getAll(){
        var sql = `SELECT * FROM about_footer`;
        return await this.query(sql, "getAllAboutFooter");
    }
    async update(data){
        var sql = `UPDATE about_footer SET name=?, url=?, link=?, title=?, description=?, detail=? WHERE id=?`;
        var value = [data.name, data.url, data.link, data.title, data.description, data.detail, data.id];
        return await this.querySuper(sql, value, "updateAboutFooter");
    }
    async delete(data){
        var sql = `DELETE FROM about_footer WHERE id=?`;
        var value = [data.id];
        return await this.querySuper(sql, value, "deleteAboutFooter");
    }
}

module.exports = AboutFooter;