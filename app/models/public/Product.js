var Model = require("../Model");

class Product extends Model{
    async create(data){
        var sql = `INSERT INTO product(id_category, id_province, id_user, name, url, price, phone, content, address, id_group_image, created_at, updated_at, status)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?); SELECT LAST_INSERT_ID() as id_product`;
        var value = value = [
            data.id_category,
            data.id_province,
            data.id_user,
            data.name,
            data.url,
            data.price,
            data.phone,
            data.content,
            data.address,
            data.id_group_image,
            data.created_at,
            data.updated_at,
            data.status
        ];
        return await this.querySuper(sql, value, "createProduct");
    }
    async getAbout(data){
        var sql = 
        `SELECT
            p.id, p.name, p.url, p.price, p.phone, p.id_group_image, p.address, p.updated_at as date, p.content,
            c.url as url_category, c.name as category, c.id as id_category,
            province.url as url_province, province.name as province, province.id as id_province,
            district.url as url_district, district.name as district, district.id as id_district,
            p.id_user, p.id_user, u.username, u.avata, u.url_store, u.name_store, u.created_at,
            CASE 
                WHEN (ur.time_out >= NOW() || u.id=1) THEN 1
                ELSE 0
            END AS is_vip
        
        FROM product as p LEFT JOIN category as c ON p.id_category=c.id
        LEFT JOIN province as district ON p.id_province=district.id
        LEFT JOIN province ON district.parent_id=province.id
        LEFT JOIN user as u ON p.id_user=u.id
        LEFT JOIN user_role as ur ON ur.id_user = u.id
        LEFT JOIN user_group as ug ON ug.id=ur.id_group

        WHERE p.id=?`;
        var value = [data.id];
        return await this.querySuper(sql, value, "aboutProduct");
    }
    async suggest(data){
        var sql = `SELECT
        p.id, p.name, p.url, p.price, p.id_group_image as image, p.updated_at as date,
        c.url as url_category, c.name as category,
        province.url as url_province, province.name as province,
        district.url as url_district, district.name as district

        FROM product as p 
        LEFT JOIN category as c ON p.id_category=c.id
        LEFT JOIN province as district ON p.id_province=district.id
        LEFT JOIN province ON district.parent_id=province.id
        
        WHERE p.status=1 AND c.url=? AND province.url=? AND p.id != ${data.id}
        ORDER BY RAND()
        LIMIT 15`;
        var value = [data.url_category, data.url_province];
        return await this.querySuper(sql, value, "suggestProduct");
    }
    where(data){
        var status = `p.status=1`;
        var group_user = data.group != 0 ? (data.group==1 ? `ug.id=${data.group}` : `(ug.id=2 OR ug.id=3)`): ``;
        if(data.group==3) group_user = `(ur.time_out >= NOW() || u.id=1)`;
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
            price = `((
                p.price >= ${data.priceFrom}
                AND p.price <= ${data.priceTo}
            ) OR (p.price=0))`;
        } 
        var category = ``;
        if(data.id_category != 'tat-ca-danh-muc'){
            category = data.id_category.reduce((result, val)=>{
                if(result && val){
                    return `${result},${val}`;
                }
                return result;
            });
            category = `p.id_category IN (${category})`;
        }
        var province = ``;
        if(data.id_district == 'tat-ca-quan-huyen'){
            province = `province.url='${data.id_province}'`;
        }else if(data.id_province != 'toan-quoc'){
            province = `district.url='${data.id_district}'`;
        }
        return [status, group_user, search, price, category, province].reduce((result, val)=>{
            if(result){
                if(val) return `${result} AND ${val}`;
                else return result;
            }else return val;
        });
    }
    orderBy(orderBy){
        if(orderBy=="time-new"){
            return "ORDER BY p.updated_at DESC";
        }else if(orderBy=="price-hight"){
            return "ORDER BY p.price DESC, p.updated_at DESC";
        }else{
            return "ORDER BY p.price ASC, p.updated_at DESC";
        }
    }
    limit(data){
        return `LIMIT ${(data.page - 1)*data.pageSize},${data.pageSize}`;
    }
    async count(where){
        var sql = `SELECT COUNT(p.id) as count_product

        FROM product as p LEFT JOIN category as c ON p.id_category=c.id
        LEFT JOIN province as district ON p.id_province=district.id
        LEFT JOIN province ON district.parent_id=province.id
        LEFT JOIN user as u ON p.id_user=u.id
        LEFT JOIN user_role as ur ON ur.id_user = u.id
        LEFT JOIN user_group as ug ON u.id_group=ug.id
        
        ${where}`;
        return await this.query(sql, "countProduct");
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

        FROM product as p 
        LEFT JOIN category as c ON p.id_category=c.id
        LEFT JOIN province as district ON p.id_province=district.id
        LEFT JOIN province ON district.parent_id=province.id
        LEFT JOIN user as u ON p.id_user=u.id
        LEFT JOIN user_role as ur ON ur.id_user = u.id
        LEFT JOIN user_group as ug ON u.id_group=ug.id
        
        ${where}
        ${orderBy}
        ${limit}`;

        var product = await this.query(sql,"searchProduct");
        var count = await this.count(where);
        return {
            product: product,
            count: count[0].count_product
        }
    }
}

module.exports = Product;
