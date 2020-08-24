var Category = require("../../models/public/Category");
var category = new Category();

module.exports = {
    getAll: (request, response)=>{
        category.getAll()
        .then(results=>{
            return response.json(results);
        })
        .catch(error=>{
            return response.json({
                success: 0,
                message: "Lỗi truy vấn "+ error.name + " !"
            })
        })
    },
    getAbout: (request, response)=>{
        var data = request.params;
        category.getAbout(data)
        .then(results=>{
            return response.json(results[0]);
        })
        .catch(error=>{
            return response.json({
                success: 0,
                message: "Lỗi truy vấn "+ error.name + " !"
            });
        })
    },
    getAllCountParent: (request, response)=>{
        category.getAllCountParent()
        .then(results=>{
            return response.json(results);
        })
        .catch(error=>{
            return response.json({
                success: 0,
                message: "Lỗi truy vấn "+ error.name + " !"
            })
        })
    }
}
