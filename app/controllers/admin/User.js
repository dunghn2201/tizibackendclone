var User = require("../../models/admin/User");
var user = new User();

module.exports = {
    search: (request, response)=>{
        var query = {
            search: request.query.search ? request.query.search : '',
            status: request.query.status ? request.query.status : '',
            group: request.query.group ? request.query.group : '',
            page: request.query.page ? request.query.page : 1,
            pageSize: request.query.pageSize ? request.query.pageSize : 20
        };
        user.search(query)
        .then(results=>{
            return response.json(results);
        })
        .catch(error=>{
            return response.json({
                success: 0,
                message: `Lỗi truy vấn ${error.name}!`,
                error: error
            })
        });
    },
    countAll: (request, response)=>{
        var query = {
            search: '',
            status: '',
            group: ''
        };
        user.count(query)
        .then(results=>{
            return response.json(results[0]);
        })
        .catch(error=>{
            return response.json({
                success: 0,
                message: `Lỗi truy vấn ${error.name}!`,
                error: error
            })
        });
    }
}