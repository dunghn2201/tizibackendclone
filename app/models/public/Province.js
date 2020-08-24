var Model = require("../Model");

class Province extends Model{
    async getAll(){
        var sql = `SELECT * FROM province ORDER BY stt ASC`;
        return this.query(sql, "getAll");
    }
}

module.exports = Province;