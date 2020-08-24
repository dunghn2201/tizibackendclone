const Model  = require("../Model");

class Product extends Model{
    async abouts(data){
        var array = data.reduce((res,id_product)=>{
            if(!res) return `${id_product}`;
            res += `,${id_product}`;
            return res;
        },``);
        
        var sql = `SELECT id_user FROM product WHERE id IN (${ array })`;
        return await this.query(sql, "aboutsProduct");
    }
    async about(data){
        var sql =
        `SELECT
            p.id, p.name, p.price, p.phone, p.address, p.id_group_image as image, p.content, p.updated_at as date,
            c.name as category,
            province.name as province,
            district.name as district,
            u.email as username

        FROM product as p LEFT JOIN category as c ON p.id_category=c.id
        LEFT JOIN province as district ON p.id_province=district.id
        LEFT JOIN province ON district.parent_id=province.id
        LEFT JOIN user as u ON p.id_user=u.id
        LEFT JOIN user_group as ug ON u.id_group=ug.id

        WHERE p.id = ${ data.id_product }`;
        return await this.query(sql, "aboutProduct"); 
    }
    async count(where, data){
        var sql = `SELECT COUNT(p.id) as count_product
        FROM product as p LEFT JOIN category as c ON p.id_category=c.id
        LEFT JOIN province as district ON p.id_province=district.id
        LEFT JOIN province ON district.parent_id=province.id
        LEFT JOIN user as u ON p.id_user=u.id
        LEFT JOIN user_group as ug ON u.id_group=ug.id
        ${data.feedback ? this.join_feedback() : ''}

        ${where}`;
        return await this.query(sql, "CountProduct");
    }
    where(data){
        var province = '';
        if(data.id_district == 'tat-ca-quan-huyen') province = `province.id=${data.id_province}`;
        else if(data.id_province != 'toan-quoc') province = `district.id=${data.id_district}`;

        var category = '';
        if(data.id_category != 'tat-ca-danh-muc'){
            category = `p.id_category IN (${data.id_category})`;
        }

        var search = '';
        if(data.search){
            search = `(
                p.name LIKE '%${data.search}%'
                OR p.phone LIKE '%${data.search}%'
                OR p.address LIKE '%${data.search}%'
                OR c.name LIKE '%${data.search}%'
                OR u.email LIKE '%${data.search}%'
            )`;
        }

        var status = '';
        if(data.status != 'tat-ca') status = `p.status=${data.status}`;
        var feedback = '';
        if(data.feedback && data.status==1) feedback = `pf.count_feedback > 0`;

        return [province, category, search, status, feedback].reduce((result, val)=>{
            if(result){
                return val ? `${result} AND ${val}` : result;
            }else if(val) return val;
            else return '';
        });
    }
    join_feedback(){
        return `LEFT JOIN (
            SELECT id_product, COUNT(id_product) AS count_feedback FROM product_feedback GROUP BY id_product
        ) AS pf ON p.id=pf.id_product`
    }
    async search(data){
        var where = this.where(data);
        where = where ? 'WHERE ' + where : '';
        var sql =
        `SELECT
            p.id, p.name, p.url as url_product, p.price, p.phone, p.address, p.id_group_image as image, p.updated_at as date, p.status,
            c.name as category, c.url as url_category,
            province.name as province, province.url as url_province,
            district.name as district, district.url as url_district,
            u.username
            ${data.feedback ? ', pf.count_feedback':''}

        FROM product as p LEFT JOIN category as c ON p.id_category=c.id
        LEFT JOIN province as district ON p.id_province=district.id
        LEFT JOIN province ON district.parent_id=province.id
        LEFT JOIN user as u ON p.id_user=u.id
        LEFT JOIN user_group as ug ON u.id_group=ug.id
        ${data.feedback ? this.join_feedback() : ''}

        ${where}
        ORDER BY date ${data.orderBy}
        LIMIT ${(data.page - 1)*data.pageSize},${data.pageSize}`;
        
        var result =  await this.query(sql ,"searchProduct");
        var count = await this.count(where, data);
        return {
            product: result,
            count: count[0].count_product
        }
    }
    async updateStatus(data){
        var id_product = data.id_product.reduce((result, val)=>{
           if(result && val){
               result += `,${val}`;
           }
           return result;
        });
        var where = `WHERE id IN (${id_product})`;
        var sql = `UPDATE product SET status=? ${where}`;
        var value = [data.status];
        return await this.querySuper(sql, value, "updateProduct");
    }
    async delete(data){
        var id_product = data.reduce((result, val)=>{
            if(result && val){
                result += `,${val}`;
            }
            return result;
        });
        var where = `WHERE id IN (${id_product})`;
        var sql = `DELETE FROM product ${where}`;
        return await this.query(sql, "deleProduct");
    }
}

module.exports = Product;