var Model = require("../Model");

class ProductPriority extends Model{
    async active(data){
        var sql = `UPDATE product_priority SET status = !status WHERE id=?`;
        var value = [data.id];
        return this.querySuper(sql, value, "activeProductPriority")
    }
    where(data){
        var user = `pp.id_user=${data.id_user}`;

        var search = ``;
        if(data.search) search = `(p.name LIKE BINARY '%${data.search}%' OR p.name LIKE '%${data.search}%')`;

        var status = ``;
        if(data.status != 'tat-ca-trang-thai' && data.status != 2) status = `pp.status=${data.status}`;
        
        var time = `(pp.time_from <= NOW() AND pp.time_to >= NOW())`;
        if(data.status == 'tat-ca-trang-thai') time = ``;
        else if(data.status == 2) time = `(pp.time_to <= NOW())`;

        return [user, search, status, time].reduce((result, val)=>{
            if(val) result += ` AND ${val}`;
            return result;
        });
    }
    limit(data){
        return `LIMIT ${(data.page - 1) * data.pageSize},${data.pageSize}`;
    }
    async count(where){
        var sql = `SELECT COUNT(p.id) AS count_product
        FROM product_priority AS pp 
        LEFT JOIN product as p ON pp.id_product=p.id
        
        where ${ where }`;
        return await this.query(sql, "countProductPriority");
    }
    async search(data){
        var where = this.where(data);
        var sql = `SELECT
        pp.id, pp.id_product, p.name, p.price, p.id_group_image as image,
        cp.name as category_product,
        cpp.name as category_priority,
        province.name as province,
        district.name as district,
        pp.time_from, pp.time_to, pp.status

        FROM product_priority AS pp 
        LEFT JOIN product as p ON pp.id_product=p.id
        LEFT JOIN category as cp ON p.id_category=cp.id
        LEFT JOIN category as cpp ON pp.id_category=cpp.id
        LEFT JOIN province as district ON pp.id_province=district.id
        LEFT JOIN province ON district.parent_id=province.id
        
        where ${ where }
        ORDER BY pp.status DESC ${ this.limit(data) }`;
        
        var product = await this.query(sql, "searchProductPriority");
        var count = await this.count(where);
        return {product: product, count: count[0].count_product};
    }
    async create(data){
        var sql = `INSERT INTO product_priority(id_user,id_province, id_category, id_product, time_from, time_to) VALUES(?,?,?,?,?,?)`;
        var value = [data.id_user,data.id_province, data.id_category, data.id_product, data.date_from, data.date_to];
        
        return await this.querySuper(sql, value, "createProductPriority");
    }
    async delete(data){
        var sql = `DELETE FROM product_priority WHERE id=? AND id_user=?`;
        var value = [data.id, data.id_user];
        
        return await this.querySuper(sql, value, "deleteProductPriority");
    }
}

module.exports = ProductPriority;