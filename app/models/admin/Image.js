var Model = require("../Model");

class Image extends Model{
    async getGroup(data){
        var id_group_image = data.reduce((result, val)=>{
            if(result){
                return `${result},'${val}'`;
            }else return `'${val}'`;
        }, ``);
        var where = `WHERE id_group_image IN (${id_group_image})`;
        var sql = `SELECT name FROM image ${where}`;
        return await this.query(sql, "getGroupImage");
    }
    async delete(data){
        var id_group_image = data.reduce((result, val)=>{
            if(result){
                if(val) result += `,'${val}'`;
            }else{
                if(val) result = `'${val}'`;
            }
            return result;
        }, '');
        var where = `WHERE id_group_image IN (${id_group_image})`;
        var sql = `DELETE FROM image ${where}`;
        
        return await this.query(sql, "deleteImage");
    }
}

module.exports = Image;