var ProductFollow = require("../../models/public/ProductFollow");
var productFollow = new ProductFollow();

module.exports = {
    create: (request, response)=>{
        var data = request.body;
        productFollow.check(data)
        .then(async results=>{
            if(results[0].count_product==0) await productFollow.create(data);
            return response.json({
                success: 1,
                message: `Lưu tin thành công!`
            })
        })
        .catch(error=>{
            return response.json({
                success: 0,
                message: `Lỗi truy vấn ${error.name}!`
            })
        })
    },
    getAll: (request, response)=>{
        var data = request.params;
        productFollow.getAll(data)
        .then(results=>{
            return response.json(results);
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}!`
            })
        });
    },
    search: (request, response)=>{
        var query = {
            id_user: request.query.id_user ? request.query.id_user:'',
            search: request.query.search ? request.query.search:'',
            page: request.query.page ? request.query.page:1,
            pageSize: request.query.pageSize ? request.query.pageSize:20
        }
        
        productFollow.search(query)
        .then(results=>{
            return response.json(results);
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}!`,
                error: error
            })
        })
    }
}