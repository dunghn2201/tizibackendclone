const Model = require("../Model");

class ProductFeedback extends Model{
    async create(data){
        var sql = `INSERT INTO product_feedback(id_product, id_user, content)
        VALUES (?,?,?)`;
        var value = [data.id_product, data.id_user, data.content];
        return await this.querySuper(sql, value, "createProductFeedback");
    }
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
        return this.query(sql, "deleteProductFeedback");
    }
}

module.exports = ProductFeedback;