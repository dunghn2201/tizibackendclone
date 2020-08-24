var AboutFooter = require("../../models/admin/AboutFooter");
var aboutFooter = new AboutFooter();

module.exports = {
    create: (request, response)=>{
        var data = request.body;
        aboutFooter.create(data)
        .then(results=>{
            return response.json({
                success: 1,
                message: `Thêm thành công!`
            });
        })
        .catch(error=>{
            console.log(error);
            return response.json({
                success:0,
                message: `Có lỗi xảy ra ${error.name}!`
            });
        });
    },
    about: (request, response)=>{
        var data = request.params;
        aboutFooter.about(data)
        .then(results=>{
            return response.json(results[0]);
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Có lỗi xảy ra ${error.name}!`
            });
        });
    },
    getAll: (request, response)=>{
        aboutFooter.getAll()
        .then(results=>{
            return response.json(results);
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Có lỗi xảy ra ${error.name}!`
            });
        });
    },
    update: (request, response)=>{
        var data = request.body;
        aboutFooter.update(data)
        .then(results=>{
            return response.json({
                success: 1,
                message: `Sửa thành công!`
            });
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Có lỗi xảy ra ${error.name}!`
            });
        });
    },
    delete: (request, response)=>{
        var data = request.query;
        aboutFooter.delete(data)
        .then(results=>{
            return response.json({
                success: 1,
                message: `Xóa thành công!`
            });
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Có lỗi xảy ra ${error.name}!`
            });
        });
    }
}
