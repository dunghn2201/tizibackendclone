var Model = require("../Model");

class User extends Model{
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
    where(data){
        var status = ``;
        if(data.status) status = `u.status = ${data.status}`;
        
        var group = ``;
        if(data.group) group = `u.id_group = ${data.group}`;

        var search = ``;
        if(data.search) search = `(u.username LIKE '%${data.search}%')
        OR (u.email LIKE '%${data.search}%')
        OR (u.phone LIKE '%${data.search}%')
        OR (u.address LIKE '%${data.search}%')
        OR (u.zalo LIKE '%${data.search}%')
        OR (u.name_store LIKE '%${data.search}%')
        OR (u.name_store LIKE BINARY '%${data.search}%')
        OR (u.fullname LIKE '%${data.search}%')
        OR (u.fullname LIKE BINARY '%${data.search}%')
        OR (u.facebook LIKE '%${data.search}%')`;
        return [status, group ,search].reduce((res, text)=>{
            if(res){
                if(text) res += `AND ${text}`;
                else return res;
            }else{
                if(text) res = text;
                else return res;
            }
            return res;
        },``);
    }
    async count(data){
        var where = this.where(data);
        var sql = `SELECT COUNT(u.id) as count_user
        FROM user as u
        LEFT JOIN user_role as ur ON ur.id_user=u.id
        LEFT JOIN user_group as ug ON ur.id_group=ug.id
        
        ${ where ? 'WHERE ' + where : ''}`;
        return await this.query(sql, "countUser");
    }
    async search(data){
        var where = this.where(data);
        var sql = `SELECT u.id, u.username, u.account_balance, u.name_store, u.url_store, u.avata, u.fullname, u.email, u.facebook, u.zalo, u.phone, u.address, u.created_at, u.status,
        ug.name as group_name, 
        ur.time_out

        FROM user as u
        LEFT JOIN user_role as ur ON ur.id_user=u.id
        LEFT JOIN user_group as ug ON ur.id_group=ug.id
        
        ${ where ? 'WHERE ' + where : ''}
        ${this.limit(data)}`;
        
        var user = await this.query(sql, "searchUser");
        var count = await this.count(data);
        return {
            user: user,
            count: count[0].count_user
        }
    }
}

module.exports = User;