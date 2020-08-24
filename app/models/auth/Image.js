var Model = require("../Model");

class Image extends Model{
    async create(data){
        var sql = `INSERT INTO image(id_group_image, name, is_default) VALUES ?`;
        var value = [data];
        return await this.querySuper(sql, value, "createImage");
    }
    async aboutGroup(data){
        var sql = `SELECT * FROM image WHERE id_group_image = ?`;
        var value = [data];
        return await this.querySuper(sql, value, "aboutGroupImage");
    }
    async isDelete(data){
        var sql = `SELECT COUNT(id) AS count_image FROM image WHERE id_group_image IN (
            SELECT id_group_image FROM product WHERE id_user=? AND id_group_image=?
        ) AND name=?`;
        var value = [data.id_user, data.id_group_image, data.name];
        return await this.querySuper(sql, value, "isDeleteImage");
    }
    async defaultImage(data){
        var sql = `UPDATE image SET is_default=0 WHERE id_group_image=? AND id!=?;
        UPDATE image SET is_default=1 WHERE id=?;`
        var value = [data.id_group_image, data.id, data.id];
        return await this.querySuper(sql, value, "defaultImage");
    }
    async deleteGroup(data){
        var sql = `DELETE FROM image WHERE id_group_image=?`;
        var value = [data];
        return await this.querySuper(sql, value, "deleteGroupImageImage");
    }
    async delete(data){
        var sql = `DELETE FROM image WHERE name=?`;
        var value = [data.name];
        return await this.querySuper(sql, value, "deleteImage");
    }
}

module.exports = Image;