var Model = require("../Model");

class Notification extends Model{
    async create(data){
        var sql = `INSERT INTO notification(id_user, url, content) VALUES ?`;
        var value = [data];
        return await this.querySuper(sql, value, "createNotification");
    }
    limit(data){
        return `LIMIT ${(data.page - 1) * data.pageSize},${data.pageSize}`;
    }
    async count(data){
        var sql = `SELECT COUNT(id) AS count_notification FROM notification WHERE id_user=?`;
        var value = [data.id_user];
        return await this.querySuper(sql, value, "countNotification");
    }
    async notificationOfId_user(data){
        var sql = `SELECT * FROM notification WHERE id_user=? ORDER BY id DESC ${this.limit(data)}`;
        var value = [data.id_user];

        var notification = await this.querySuper(sql, value, "notificationOfId_userNotification");
        var count = await this.count(data);
        
        return {notification: notification, count: count[0].count_notification};
    }
    async countNewNotification(data){
        var sql = `SELECT COUNT(id) AS count_notification FROM notification WHERE id_user=? AND status=0`;
        var value = [data.id_user];
        return await this.querySuper(sql, value, "countNewNotification");
    }
    async viewMessage(data){
        var sql = `UPDATE notification SET status=1 WHERE id=? AND id_user=? AND status=0`;
        var value = [data.id_product, data.id_user];
        return await this.querySuper(sql, value, "viewNotification");
    }
}

module.exports = Notification;