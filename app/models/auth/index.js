const Model = require("../Model");

class Auth extends Model{
    async check(data){
        var sql = `SELECT COUNT(id) AS count_user FROM user WHERE username=? OR email=? OR phone=?`;
        var value = [data.username, data.email, data.phone];
        return await this.querySuper(sql, value, "checkAuth");
    }
    async checkUrlStore(data){
        var sql = `SELECT COUNT(id) AS count_user FROM user WHERE username != ? AND url_store=?`;
        var value = [data.username, data.url_store];
        return await this.querySuper(sql, value, "checkUrlStoreAuth");
    }
    async create(data){
        var sql = `INSERT INTO user(username, name_store, url_store, email, phone, password, code)
        VALUES (?,?,?,?,?,?,?); SELECT LAST_INSERT_ID() as id_user`;
        var value = [data.username, data.username, data.username, data.email, data.phone, data.password, data.code];
        
        return await this.querySuper(sql, value, "createAuth");
    }
    async about(data){
        var sql = `SELECT user.*, user_group.name as name_group FROM user LEFT JOIN user_group ON user.id_group=user_group.id WHERE user.username=? OR user.email=? OR user.phone=?`;
        var value = [data.username, data.username, data.username];
        return await this.querySuper(sql, value, "aboutAuth");
    }
    async active(data){
        if(data.email_new){
            var sql = `UPDATE user SET email=?, status=1 WHERE username=? AND code=?`;
            var value = [data.email_new, data.username, data.code]; 
        }else{
            var sql = `UPDATE user SET status=1 WHERE username=? AND code=?`;
            var value = [data.username, data.code]; 
        }
        return await this.querySuper(sql, value, "activeAuth");
    }
    async updateCode(data){
        var sql = `UPDATE user SET code=? WHERE username=? OR email=?`;
        var value = [data.code, data.username, data.email];
        return await this.querySuper(sql, value, "updateCodeAuth");
    }
    async update(data){
        var sql = `UPDATE user SET avata=?, fullname=?, address=?, facebook=?, zalo=? WHERE username=?`;
        var value = [data.avata != 'null' ? data.avata : null, data.fullname, data.address, data.facebook, data.zalo, data.username];
        return await this.querySuper(sql, value, "updateAuth");
    }
    async updateStore(data){
        var sql = `UPDATE user SET name_store=?, url_store=? WHERE username=?`;
        var value = [data.name_store, data.url_store, data.username];
        return await this.querySuper(sql, value, "updateStoreAuth");
    }
    async changePassword(data){
        var sql = `UPDATE user SET password=? WHERE username=?`;
        var value = [data.password, data.username];
        return await this.querySuper(sql, value, "changePasswordAuth");
    }
    async forgotPassword(data){
        var sql = `UPDATE user SET password=? WHERE email=? OR code=?`;
        var value = [data.password, data.email, data.code];
        return await this.querySuper(sql, value, "forgotPasswordAuth");
    }
}

module.exports = Auth;