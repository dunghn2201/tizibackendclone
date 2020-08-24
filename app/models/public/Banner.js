var Model = require("../Model");

class Banner extends Model{
    async getAll(data){
        var sql = `SELECT * FROM banner WHERE status=1`;
        return await this.query(sql, "getAllBanner");
    }
}

module.exports = Banner;