var Model = require("../Model");

class Banner extends Model{
    async create(data){
        var sql = `INSERT INTO banner(name, url, image) VALUES (?,?,?)`;
        var value = [data.name, data.url, data.image];
        return await this.querySuper(sql, value, "createBanner");
    }
    async getAll(data){
        var sql = `SELECT * FROM banner`;
        return await this.query(sql, "getAllBanner");
    }
    async getAbout(data){
        var sql = `SELECT * FROM banner WHERE id=?`;
        var value = [data.id];
        return await this.querySuper(sql, value, "getAboutBanner");
    }
    async update(data){
        var sql = `UPDATE banner SET name=?, url=?, image=? WHERE id=?`;
        var value = [data.name, data.url, data.image, data.id];
        return await this.querySuper(sql, value, "updateBanner");
    }
    async updateStatus(data){
        var sql = `UPDATE banner SET status=? WHERE id=?`;
        var value = [data.status, data.id];
        return await this.querySuper(sql, value, "updateStatusBanner");
    }
    async delete(data){
        var sql = `DELETE FROM banner WHERE id=?`;
        var value = [data.id];
        return await this.querySuper(sql, value, "getAllBanner");
    }
}

module.exports = Banner;