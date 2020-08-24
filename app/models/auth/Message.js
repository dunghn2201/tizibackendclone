var Model = require("../Model");

class Message extends Model{
    async get(data){
        var sql = `SELECT * FROM message WHERE message.id_product=? AND ( (message.id_user1=? AND message.id_user2=?) || (message.id_user1=? AND message.id_user2=?) ) ORDER BY id ASC`; 
        var value = [data.id_product, data.id_user1, data.id_user2, data.id_user2, data.id_user1];
        return await this.querySuper(sql, value, "getMessage");
    }
    async create(data){
        var sql = `INSERT INTO message(id_product, id_user1, id_user2, content) VALUES(?,?,?,?)`;
        var value = [data.id_product, data.id_user1, data.id_user2, data.content];
        return await this.querySuper(sql, value, "createMessage");
    }
    async aboutUser(data){
        var arrayIdUser = data.id_user.reduce((res,id_user)=>{
            if(res) res += `,${id_user}`;
            return res;
        });
        var sql = `SELECT id, username, avata FROM user WHERE id IN (${arrayIdUser})`;
        return await this.query(sql, "aboutUser");
    }
    async aboutProduct(data){
        var arrayIdProduct= data.id_product.reduce((res,id_product)=>{
            if(res) res += `,${id_product}`;
            return res;
        });
        var sql = `SELECT
            p.id, p.name, p.url, p.price, p.id_group_image as image,
            c.url as url_category, c.name as category,
            province.url as url_province, province.name as province,
            district.url as url_district, district.name as district

            FROM product as p LEFT JOIN category as c ON p.id_category=c.id
            LEFT JOIN province as district ON p.id_province=district.id
            LEFT JOIN province ON district.parent_id=province.id

            WHERE p.id IN (${arrayIdProduct})`;
        
        return await this.query(sql, "aboutProduct");
    }
    limit(data){
        return `LIMIT ${(data.page - 1) * data.pageSize},${data.pageSize}`;
    }
    async count(data){
        var sql = `SELECT COUNT(id) AS count_message FROM message WHERE id IN (SELECT MAX(id) AS id FROM message WHERE id_user1=? OR id_user2=? GROUP BY id_product)`;
        var value = [data.id_user, data.id_user];
        return await this.querySuper(sql, value, "countMessage");
    }
    async messageOfId_user(data){
        var sql = `SELECT * 
        FROM message 
        WHERE 
            id IN (
                SELECT MAX(id) AS id 
                FROM message 
                WHERE 
                    id_user1=? 
                    OR id_user2=? 
                GROUP BY id_product
            )
            OR id IN (
                SELECT id FROM
                (SELECT 
                    MAX(id) AS id,
                    CASE
                      WHEN id_user1=? THEN id_user2
                      WHEN id_user2=? THEN id_user1
                    END as people
                    FROM message
                    WHERE id_product = 0
                    GROUP BY people
                ) AS result WHERE people != null
            )
        ORDER BY id DESC ${this.limit(data)}`;
        var value = [data.id_user, data.id_user, data.id_user, data.id_user];

        var messages = await this.querySuper(sql, value, "messageOfId_userMessage");
        var count = await this.count(data);
        
        return {messages: messages, count: count[0].count_message};
    }
    async countNewMessage(data){
        var sql = `SELECT COUNT(id) AS count_message FROM message WHERE id IN (SELECT MAX(id) AS id FROM message WHERE id_user1=? OR id_user2=? GROUP BY id_product) AND status=0 AND id_user1 != ?`;
        var value = [data.id_user, data.id_user, data.id_user];
        return await this.querySuper(sql, value, "countNewMessage");
    }
    async viewMessage(data){
        var sql = `UPDATE message SET status=1 WHERE id_product=? AND id_user1=? AND id_user2=? AND status=0`;
        var value = [data.id_product, data.id_user1, data.id_user2];
        return await this.querySuper(sql, value, "viewMessage");
    }
    async delete(data){
        var arrId_product = data.reduce((res, val)=>{
            return res + `,${val}`;
        });
        var sql = `DELETE FROM message WHERE id_product IN (${arrId_product})`;
        return await this.query(sql, "deleteMessage");
    }
}

module.exports = Message;