var Model = require("../Model");

class ProductPriority extends Model{
    where(data){
        var status = `pp.status=1 AND p.status != 3`;
        var group_user = data.group != 0 ? (data.group==1 ? `ug.id=${data.group}` : `(ug.id=2 OR ug.id=3)`): ``;
        var search = ``;
        if(data.search){
            search = `(
                p.name LIKE BINARY '%${data.search}%'
                OR p.name LIKE '%${data.search}%'
                OR p.address LIKE '%${data.search}%'
                OR p.content LIKE '%${data.search}%'
            )`;
        }
        var price = ``;
        if(data.priceFrom){
            price = `(
                p.price >= ${data.priceFrom}
                AND p.price <= ${data.priceTo}
            )`;
        } 
        var category = ``;
        if(data.id_category != 'tat-ca-danh-muc'){
            category = data.id_category.reduce((result, val)=>{
                if(result && val){
                    return `${result},${val}`;
                }
                return result;
            });
            category = `(pp.id_category IN (${category}) OR pp.id_category = 0)`;
        }else{
            category = `pp.id_category = 0`;
        }

        var province = ``;
        if(data.id_district == 'tat-ca-quan-huyen'){
            province = `(pp_p.url='${data.id_province}' OR pp.id_province=0)`;
        }else if(data.id_province != 'toan-quoc'){
            province = `(pp_p.url='${data.id_province}' OR pp_p.url='${data.id_district}' OR pp.id_province=0)`;
        }else if(data.id_province == 'toan-quoc')  province = `pp.id_province=0`;

        var time = `(pp.time_from <= NOW() AND pp.time_to >= NOW())`;

        return [status, group_user, search, price, category, province, time].reduce((result, val)=>{
            if(result){
                if(val) return `${result} AND ${val}`;
                else return result;
            }else return val;
        });
    }
    orderBy(){
        return `ORDER BY RAND()`;
    }
    limit(data){
        return `LIMIT 10`;
    }
    async search(data){
        var where = this.where(data);
        where = where ? `WHERE ${where}` : ``;
        var orderBy = this.orderBy(data.sortOption);
        var limit = this.limit(data);
        var sql = `SELECT
        p.id, p.name, p.url, p.price, p.id_group_image as image, p.address, p.updated_at as date,
        c.url as url_category, c.name as category,
        province.url as url_province, province.name as province,
        district.url as url_district, district.name as district,
        u.username,
        CASE 
            WHEN (ur.time_out >= NOW() || u.id=1) THEN 1
            ELSE 0
        END AS is_vip

        FROM product_priority as pp
        LEFT JOIN category as pp_c ON pp.id_category = pp_c.id
        LEFT JOIN province as pp_p ON pp.id_province = pp_p.id

        INNER JOIN product as p ON pp.id_product = p.id
        LEFT JOIN category as c ON p.id_category=c.id
        LEFT JOIN province as district ON p.id_province=district.id
        LEFT JOIN province ON district.parent_id=province.id
        LEFT JOIN user as u ON p.id_user=u.id
        LEFT JOIN user_role as ur ON ur.id_user = u.id
        LEFT JOIN user_group as ug ON u.id_group=ug.id
        
        ${where}
        ${orderBy}
        ${limit}`;

        return await this.query(sql, "searchProductPriority");
    }
}

module.exports = ProductPriority;