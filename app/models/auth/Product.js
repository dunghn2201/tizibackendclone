var Model = require("../Model");

class Product extends Model{
    async getAbout(data){
        var sql = 
        `SELECT
            p.id, p.name, p.url, p.price, p.phone, p.id_group_image, p.address, p.updated_at as date, p.content,
            c.url as url_category, c.name as category, c.id as id_category,
            province.url as url_province, province.name as province, province.id as id_province,
            district.url as url_district, district.name as district, district.id as id_district,
            u.username

        FROM product as p LEFT JOIN category as c ON p.id_category=c.id
        LEFT JOIN province as district ON p.id_province=district.id
        LEFT JOIN province ON district.parent_id=province.id
        LEFT JOIN user as u ON p.id_user=u.id
        LEFT JOIN user_group as ug ON u.id_group=ug.id

        WHERE p.id=? AND u.username=?`;
        var value = [data.id, data.username];
        return await this.querySuper(sql, value, "aboutProduct");
    }
    async isEdit(data){
        var sql = `SELECT COUNT(id) AS count_product FROM product WHERE id=? AND id_user=?`;
        var value = [data.id, data.id_user];
        return await this.querySuper(sql, value, "isEditProduct");
    }
    async update(data){
        var sql = `UPDATE product SET id_province=?, id_category=?, name=?, url=?, address=?, price=?, phone=?, content=? WHERE id=?`;
        var value = [data.id_district, data.id_category, data.name, data.url, data.address, data.price, data.phone, data.content, data.id];
        return await this.querySuper(sql, value, "updateProduct");
    }
    async updateUserProduct(data){
        var id_product = data.id_product.reduce((res,val)=>{
            if(res && val) res += `,${val}`;
            return res;
        });
        var sql = `UPDATE product SET id_user=? WHERE id IN (${id_product}) AND id_user=0`;
        var value = [data.id_user];
        return await this.querySuper(sql, value, "updateUserProduct");
    }
    where(data){
        var user = `p.id_user=${data.id_user}`;

        var category = ``;
        if(data.id_category != 'tat-ca-danh-muc') category = `p.id_category IN (${data.id_category.reduce((res,val)=>{
            if(res){
                if(val) return `${res},${val}`;
                else return res;
            }else if(val) return val;
        },``)})`;

        var search = ``;
        if(data.search) search = `(p.name LIKE BINARY '%${data.search}%' OR p.name LIKE '%${data.search}%')`;

        var status = ``;
        if(data.status != 'tat-ca-trang-thai') status = `p.status=${data.status}`;

        return [user, category, search, status].reduce((result, val)=>{
            if(val) result += ` AND ${val}`;
            return result;
        });
    }
    limit(data){
        return `LIMIT ${(data.page - 1) * data.pageSize},${data.pageSize}`;
    }
    async count(where){
        var sql = `SELECT COUNT(p.id) AS count_product
        FROM product as p LEFT JOIN category as c ON p.id_category=c.id
        LEFT JOIN province as district ON p.id_province=district.id
        LEFT JOIN province ON district.parent_id=province.id
        LEFT JOIN user as u ON p.id_user=u.id
        LEFT JOIN user_group as ug ON u.id_group=ug.id
        
        where ${ where }`;
        return await this.query(sql, "countProduct");
    }
    async search(data){
        var where = this.where(data);
        var sql = `SELECT
        p.id, p.name, p.url, p.price, p.id_group_image as image, p.address, p.updated_at as date,
        c.url as url_category, c.name as category,
        province.url as url_province, province.name as province,
        district.url as url_district, district.name as district,
        u.email as username,
        p.status

        FROM product as p LEFT JOIN category as c ON p.id_category=c.id
        LEFT JOIN province as district ON p.id_province=district.id
        LEFT JOIN province ON district.parent_id=province.id
        LEFT JOIN user as u ON p.id_user=u.id
        LEFT JOIN user_group as ug ON u.id_group=ug.id
        
        where ${ where }
        ORDER BY date DESC ${ this.limit(data) }`;
        var product = await this.query(sql, "searchProduct");
        var count = await this.count(where);
        return {product: product, count: count[0].count_product};
    }
    async sold(data){
        var sql = `UPDATE product SET status=2 WHERE id=?`;
        var value = [data.id];
        return await this.querySuper(sql, value, "soldProduct");
    }
    async active(data){
        var sql = `UPDATE product SET status=1 WHERE id=?`;
        var value = [data.id];
        return await this.querySuper(sql, value, "activeProduct");
    }
    async delete(id){
        var sql = `DELETE FROM product WHERE id=?`;
        var value = [id];
        return await this.querySuper(sql, value, "deleteProduct");
    }
    async push(data){
        var sql = `UPDATE product SET updated_at=? WHERE id=?`;
        var value = [data.date, data.id];
        return await this.querySuper(sql, value, "pushProduct");
    }
}

module.exports = Product;