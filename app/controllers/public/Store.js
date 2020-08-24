var Store = require("../../models/public/Store");
var store = new Store();

module.exports = {
    aboutUser: (request, response)=>{
        var data = request.params;
        store.aboutUser(data)
        .then(async results=>{
            var count = await store.countProduct(results[0]);
            
            return response.json({
                store: results[0],
                count: count
            });
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}!`
            })
        })
    },
    product: (request, response)=>{
        var data = {
            url_store: request.query.url_store,
            page: request.query.page ? request.query.page : 1,
            pageSize: request.query.pageSize ? request.query.pageSize : 20
        }
        store.product(data)
        .then(results=>{
            return response.json(results);
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}!`
            })
        })
    },
    allProduct: (request, response)=>{
        var data = {
            url_store: request.query.url_store
        }
        store.allProduct(data)
        .then(results=>{
            return response.json(results);
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}!`
            })
        })
    }
}