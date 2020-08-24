var fs = require("fs");
var Category = require("../../models/admin/Category");
var category = new Category();
function uploadFile(path, file){
    return new Promise((resolve, reject)=>{
        file.mv(path, (error, results)=>{
            if(error) return reject({name:"uploadFile", error: error});
            return resolve({success:1});
        });
    });
}
function deleteFile(path){
    return new Promise((resolve, reject)=>{
        fs.unlink(path, (error) => {
            if(error) return reject({name:"deleteFile", error: error});
            return resolve({success:1});
        });
    });
}
function findParent(data, parent_id){
    var parent=[];
    for(var item of data){
        if(item.parent_id == parent_id){
            parent.push(item);
            var result = findParent(data.filter(e=>e.parent_id != parent_id), item.id);
            parent = parent.concat(result);
        }
    }
    return parent;
}
module.exports = {
    create: (request, response)=>{
        var data = request.body;
        var file = request.files.file;
        data.icon = Date.now() + '.png';

        category.checkName(data)
        .then(async results=>{
            if(results[0].count==0){
                var path="app/files/" + data.icon;
                return  await Promise.all([
                    uploadFile(path, file),
                    category.create(data)
                ]);
            }
        })
        .then(results=>{
            if(!results){
                return response.json({
                    success: 0,
                    message: "Tên danh mục bị trùng !"
                });
            }
            return response.json({
                success:1,
                message: "Thêm danh mục thành công !"
            });
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}!`
            });
        })
    },
    update: (request, response)=>{
        var data = request.body;
        var files = request.files;
       
        if(files){
            var path = "app/files/" + data.icon;
            files.file.mv(path);
        }
        
        category.update(data)
        .then(results=>{
            return response.json({
                success:1,
                message: "Sửa danh mục thành công !"
            });
        })
        .catch(error=>{
            console.log(error);
            return response.json({
                success:0,
                message: "lỗi truy vấn !"
            });
        });
    },
    delete: (request, response)=>{
        var id = Number(request.params.id);
        category.getListIdDel()
        .then(results=>{
            var listIdIcon = findParent(results, id);
            listIdIcon = listIdIcon.concat(results.find(e=>e.id == id));
            var data = [];
            for(var item of listIdIcon){
                deleteFile(`app/files/${item.icon}`);
                data.push(item.id);
            }
            return category.delete(data);
        })
        .then(results=>{
            return response.json({
                success: 1,
                message: "Xóa thành công !"
            });
        })
        .catch(error=>{
            if(error.name=="getListId")
                return response.json({
                    success:0,
                    message: "Lỗi truy vấn "+error.name+" !"
                });
            else if(error.name=="uploadFile")
                return response.json({
                    success:0,
                    message: "Lỗi truy vấn "+error.name+" !"
                });
            throw error;
        });
    },
    getSingle: (request, response)=>{
        var data = request.params;
        category.getSingle(data)
        .then(results=>{
            return response.json(results[0]);
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: "Lỗi truy vấn !"
            });
        });
    },
    getAll: (request, response)=>{
        category.getAll()
        .then(results=>{
            return response.json(results);
        })
        .catch(error=>{

        });
    },
    show: (request, response)=>{
        var data = request.body;
        category.show(data)
        .then(results=>{
            return response.json({
                success:1
            })
        })
        .catch(error=>{
            return response.json({
                success:0
            })
        })
    }
}