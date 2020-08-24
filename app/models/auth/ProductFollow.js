var Model = require("../Model");

class ProductPriority extends Model{
    where(data){
        var user = `pf.id_user=${data.id_user}`;

        var search = ``;
        if(data.search) search = `(p.name LIKE BINARY '%${data.search}%' OR p.name LIKE '%${data.search}%')`;

        var category = ``;
        if(data.id_category != 'tat-ca-danh-muc') category = `p.id_category IN (${data.id_category.reduce((res,val)=>{
            if(res){
                if(val) return `${res},${val}`;
                else return res;
            }else if(val) return val;
        },``)})`;

        return [user, search, category].reduce((result, val)=>{
            if(val) result += ` AND ${val}`;
            return result;
        });
    }
    limit(data){
        return `LIMIT ${(data.page - 1) * data.pageSize},${data.pageSize}`;
    }
    async count(where){
        var sql = `SELECT COUNT(pf.id) AS count_product
        FROM product_follow AS pf 
        LEFT JOIN product as p ON pf.id_product=p.id
        LEFT JOIN category as c ON p.id_category=c.id
        LEFT JOIN province as district ON p.id_province=district.id
        LEFT JOIN province ON district.parent_id=province.id
        
        where ${ where }`;
        return await this.query(sql, "countProductFollow");
    }
    async search(data){
        var where = this.where(data);
        var sql = `SELECT
        pf.id, pf.id_product, p.name, p.url, p.price, p.id_group_image as image, p.address, p.updated_at as date,
        c.url as url_category, c.name as category,
        province.url as url_province, province.name as province,
        district.url as url_district, district.name as district

        FROM product_follow AS pf 
        LEFT JOIN product as p ON pf.id_product=p.id
        LEFT JOIN category as c ON p.id_category=c.id
        LEFT JOIN province as district ON p.id_province=district.id
        LEFT JOIN province ON district.parent_id=province.id
        
        where ${ where }
        ORDER BY id DESC ${ this.limit(data) }`;
        
        var product = await this.query(sql, "searchProductFollow");
        var count = await this.count(where);
        return {product: product, count: count[0].count_product};
    }
    async delete(data){
        var sql = `DELETE FROM product_follow WHERE id_product=? AND id_user=?`;
        var value = [data.id_product, data.id_user];
        return await this.querySuper(sql, value, "deleteProductFollow");
    }
}

module.exports = ProductPriority;