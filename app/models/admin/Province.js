const Model = require("../Model");

class Province extends Model{
    async getAll(){
        var sql = `SELECT * FROM province ORDER BY stt ASC`;
        return await this.query(sql, "getAllProvince");
    }
    async getAbout(data){
        var sql = `SELECT * FROM province WHERE id=?`;
        var value = [data.id]; 
        return await this.querySuper(sql, value, "getAboutProvince");
    }
    async update(data){
        var sql = `UPDATE province SET stt=?, name=?, url=?, price=? WHERE id=?`;
        var value = [data.stt, data.name, data.url, data.price, data.id]; 
        return await this.querySuper(sql, value, "updateProvince");
    }
}

module.exports = Province;