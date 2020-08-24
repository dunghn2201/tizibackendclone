var { v4: uuidv4 } = require('uuid');
var {uploadBanner} = require("../../util/upload");
var Banner = require("../../models/admin/Banner");
var banner = new Banner();
var fs = require("fs");

module.exports = {
    create: (request, response)=>{
        var data = request.body;
        var image = request.files.image;
        data.image = uuidv4() + ".jpeg";
        uploadBanner(image.data, data.image);

        banner.create(data)
        .then(results=>{
            return response.json({
                success:1,
                message: "Thêm banner thành công !"
            })
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `lỗi truy vấn ${error.name}`
            })
        });
    },
    getAbout: (request, response)=>{
        var data = request.params;
        banner.getAbout(data)
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
    getAll: (request, response)=>{
        banner.getAll()
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
    update: (request, response)=>{
        var data = request.body;
        if(request.files){
            var path = "app/files/banner/" + data.image;
            if (fs.existsSync(path)) fs.unlinkSync(path);
            data.image = uuidv4() + ".jpeg";
            uploadBanner(request.files.image_new.data, data.image);
        }
        
        banner.update(data)
        .then(results=>{
            return response.json({
                success: 1,
                message: `Cập nhật thành công !`
            });
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `lỗi truy vấn ${error.name}!`,
                error: error
            });
        });
    },
    updateStatus: (request, response)=>{
        var data = request.body;
        banner.updateStatus(data)
        .then(results=>{
            return response.json({
                success: 1,
                message: `Cập nhật thành công !`
            });
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `lỗi truy vấn ${error.name}!`
            });
        });
    },
    delete: (request, response)=>{
        var data = request.query;
        banner.getAbout(data)
        .then(results=>{
            var path = "app/files/banner/" + results[0].image;
            if (fs.existsSync(path)) fs.unlinkSync(path);
            return banner.delete(data);
        })
        .then(results=>{
            return response.json({
                success: 1,
                message: `Xoá thành công!`
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