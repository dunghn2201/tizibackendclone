const Model = require("../Model");

class ProductFollow extends Model{
    async getAll(data){
        var sql = `SELECT id_product FROM product_follow WHERE id_user=?`;
        var value = [data.id_user];
        return await this.querySuper(sql, value, "getAllProductFollow");
    }
    async check(data){
        var sql = `SELECT COUNT(id) AS count_product FROM product_follow WHERE id_product=? AND id_user=?`;
        var value = [data.id_product, data.id_user];
        return this.querySuper(sql, value, "checkProductFollow");
    }
    async create(data){
        var sql = `INSERT INTO product_follow(id_product,id_user) VALUES(?,?)`;
        var value = [data.id_product, data.id_user];
        return this.querySuper(sql, value, "createProductFollow");
    }
    where(data){
        var user = `pf.id_user=${data.id_user}`;

        var search = ``;
        if(data.search) search = `(p.name LIKE BINARY '%${data.search}%' OR p.name LIKE '%${data.search}%')`;

        return [user, search].reduce((result, val)=>{
            if(val) result += ` AND ${val}`;
            return result;
        });
    }
    limit(data){
        return `LIMIT ${(data.page - 1) * data.pageSize},${data.pageSize}`;
    }
    async count(where){
        var sql = `SELECT COUNT(p.id) AS count_product
        FROM product_follow as pf
        LEFT JOIN product as p ON pf.id_product=p.id 
        LEFT JOIN category as c ON p.id_category=c.id
        LEFT JOIN province as district ON p.id_province=district.id
        LEFT JOIN province ON district.parent_id=province.id
        LEFT JOIN user as u ON p.id_user=u.id
        
        where ${ where }`;
        return await this.query(sql, "countProductFollow");
    }
    async search(data){
        var where = this.where(data);
        var sql = `SELECT
        pf.id, pf.id_product,
        p.name, p.url, p.price, p.id_group_image as image, p.address, p.updated_at as date,
        c.url as url_category, c.name as category,
        province.url as url_province,
        district.url as url_district

        FROM product_follow as pf
        LEFT JOIN product as p ON pf.id_product=p.id 
        LEFT JOIN category as c ON p.id_category=c.id
        LEFT JOIN province as district ON p.id_province=district.id
        LEFT JOIN province ON district.parent_id=province.id
        LEFT JOIN user as u ON p.id_user=u.id
        
        where ${ where }
        ORDER BY id DESC ${ this.limit(data) }`;
        
        var product = await this.query(sql, "searchProductFollow");
        var count = await this.count(where);
        return {product: product, count: count[0].count_product};
    }
}

module.exports = ProductFollow;