const Model = require("../Model");

class ProductFeedback extends Model{
    async about(id_product){
        var sql = `SELECT  pf.created_at, user.email AS username, pf.content
        FROM product_feedback AS pf
            LEFT JOIN user ON pf.id_user=user.id
        WHERE pf.id_product=?`;
        var value = [id_product];
        return await this.querySuper(sql, value, "aboutProductFeedback");
    }
    async delete(data){
        var id_product = data.reduce((result, val)=>{
            if(result && val){
                result += `,${val}`;
            }
            return result;
        });
        var where = `WHERE id_product IN (${id_product})`;
        var sql = `DELETE FROM product_feedback ${where}`;
        return this.query(sql, "activeProduct");
    }
}

module.exports = ProductFeedback;