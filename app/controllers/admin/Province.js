var Province = require("../../models/admin/Province");
var province = new Province();

module.exports = {
    getAll: (request, response)=>{
        province.getAll()
        .then(results=>{
            return response.json(results);
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `lỗi truy vấn ${error.name}!`
            });
        });
    },
    getAbout: (request, response)=>{
        var data = request.params;
        province.getAbout(data)
        .then(results=>{
            return response.json(results[0]);
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `lỗi truy vấn ${error.name}!`
            });
        });
    },
    update: (request, response)=>{
        var data = request.body;
       
        province.update(data)
        .then(results=>{
            return response.json({
                success: 1,
                message: `Sửa thành công !`
            });
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `lỗi truy vấn ${error.name}!`
            });
        });
    }
}