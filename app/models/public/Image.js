var Model = require("../Model");

class Image extends Model{
    async create(data){
        var sql = `INSERT INTO image(id_group_image, name, is_default) VALUES ?`
        var value = [data];
        return await this.querySuper(sql, value, "createImage");
    }
    async getGroup(data){
        var sql = `SELECT * FROM image WHERE id_group_image=?`
        var value = [data];
        return await this.querySuper(sql, value, "getGroupImage");
    }
}

module.exports = Image;