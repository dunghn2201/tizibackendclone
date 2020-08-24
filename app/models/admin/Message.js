var Model = require("../Model");

class Message extends Model{
    async delete(data){
        var arrId_product = data.reduce((res, val)=>{
            return res + `,${val}`;
        });
        var sql = `DELETE FROM message WHERE id_product IN (${arrId_product})`;
        return await this.query(sql, "deleteMessage");
    }
}

module.exports = Message;