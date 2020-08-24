const Model = require("../Model");

class Store extends Model{
    async countProduct(data){
        var sql = `SELECT status, COUNT(status) as count_product FROM (
            SELECT * FROM product WHERE id_user=? AND status NOT IN (0,3)
        ) AS test GROUP BY status`;
        var value = [data.id];
        return await this.querySuper(sql, value, "countProductStore");
    }
    async aboutUser(data){
        var sql = `SELECT 
        user.id, user.name_store, url_store, user.avata, user.fullname, user.email, user.phone, user.address, user.facebook, user.zalo, user.created_at,
        user_group.id as id_group, user_group.name as group_name,
        user.username
        FROM user LEFT JOIN user_group ON user.id_group = user_group.id
        WHERE user.url_store=?`;
        var value = [data.url];
        return await this.querySuper(sql, value, "aboutUserStore");
    }
    limit(data){
        return `LIMIT ${(data.page - 1)*data.pageSize},${data.pageSize}`;
    }
    async count(data){
        var sql = `SELECT COUNT(p.id) as count_product
        FROM product as p LEFT JOIN category as c ON p.id_category=c.id
        LEFT JOIN province as district ON p.id_province=district.id
        LEFT JOIN province ON district.parent_id=province.id
        LEFT JOIN user as u ON p.id_user=u.id
        LEFT JOIN user_group as ug ON u.id_group=ug.id
        
        where u.url_store=? AND p.status=1`;
        var value = [data.url_store];
        return await this.querySuper(sql, value, "countProductAllStore");
    }
    async product(data){
        var sql = `SELECT
        p.id, p.name, p.url, p.price, p.id_group_image as image, p.address, p.updated_at as date,
        c.url as url_category, c.name as category,
        province.url as url_province, province.name as province,
        district.url as url_district, district.name as district,
        u.username

        FROM product as p LEFT JOIN category as c ON p.id_category=c.id
        LEFT JOIN province as district ON p.id_province=district.id
        LEFT JOIN province ON district.parent_id=province.id
        LEFT JOIN user as u ON p.id_user=u.id
        LEFT JOIN user_group as ug ON u.id_group=ug.id
        
        where u.url_store=? AND p.status=1
        ORDER BY date DESC
        ${this.limit(data)}`;
        var value = [data.url_store];
        var products = await this.querySuper(sql, value, "productStore");
        var count_product = await this.count(data);
        return {
            products: products,
            count_product: count_product[0].count_product
        }
    }
    async allProduct(data){
        var sql = `SELECT
        p.id, p.name, p.url, p.price, p.id_group_image as image, p.address, p.updated_at as date,
        c.url as url_category, c.name as category,
        province.url as url_province, province.name as province,
        district.url as url_district, district.name as district,
        u.username

        FROM product as p LEFT JOIN category as c ON p.id_category=c.id
        LEFT JOIN province as district ON p.id_province=district.id
        LEFT JOIN province ON district.parent_id=province.id
        LEFT JOIN user as u ON p.id_user=u.id
        LEFT JOIN user_group as ug ON u.id_group=ug.id
        
        where u.url_store=? AND p.status=1
        ORDER BY date DESC`;
        var value = [data.url_store];
        return await this.querySuper(sql, value, "allProductStore");
    }
}

module.exports = Store;