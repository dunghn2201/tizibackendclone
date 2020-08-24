const Product = require("../../models/admin/Product");
const product = new Product();
const ProductFeedback = require("../../models/admin/ProductFeedback");
const productfeedback = new ProductFeedback();
const Image = require("../../models/admin/Image");
const image = new Image();
const Notification = require("../../models/admin/Notification");
const notification = new Notification();
const Message = require("../../models/admin/Message");
const message = new Message();
const fs = require("fs");

module.exports = {
    search: (request, response)=>{
        var query = {
            id_province: request.query.province ? request.query.province : 'toan-quoc',
            id_district: request.query.district ? request.query.district : false,
            id_category: request.query.category ? request.query.category : 'tat-ca-danh-muc',
            status: request.query.status ? Number(request.query.status) : 'tat-ca',
            search: request.query.search ? request.query.search : false,
            feedback: request.query.feedback ? true : false,
            page: request.query.page ? Number(request.query.page) : 1,
            pageSize: request.query.pageSize ? Number(request.query.pageSize) : 20,
            orderBy: request.query.orderBy ? request.query.orderBy : 'ASC'
        };
        
        
        product.search(query)
        .then(results=>{
            return response.json(results);
        })
        .catch(error=>{
            return response.json({
                success: 0,
                message: "Lỗi truy vấn "+ error.name + "!",
                error: error
            })
        })
    },
    about: (request, response)=>{
        var data = request.params;
        product.about(data)
        .then(async results=>{
            results[0].image = await image.getGroup(results[0].image);
            return response.json(results[0]);
        })
        .catch(error=>{
            return response.json({
                success: 0,
                message: "Lỗi truy vấn " + error.name + "!"
            })
        })
    },
    updateStatus: (request, response)=>{
        var data = request.body;
        product.updateStatus(data)
        .then(async results=>{
            var aboutProduct = await product.abouts(data.id_product);
            var dataN = [];
            var dataUp = [];
            aboutProduct.forEach(e=>{
                var res = {
                    id_user: e.id_user,
                    url:"/tai-khoan/quan-ly-san-pham",
                    content: "Sản phẩm của bạn đã được duyệt!",
                    status:0
                };
                dataUp.push([res.id_user, res.url, res.content]);
                dataN.push(res);
            });

            await notification.create(dataUp);

            return response.json({
                success: 1,
                message: "Duyệt thành công !",
                data: dataN
            });
        })
        .catch(error=>{
            return response.json({
                success: 0,
                message: "Lỗi truy vấn " + error.name + "!",
                error: error
            });
        })
    },
    delete: (request, response)=>{
        var data = request.query;
        
        image.getGroup(data.image)
        .then(async results=>{
            results.forEach(element => {
                var path = `app/files/product/${element.name}`;
                if(fs.existsSync(path)) fs.unlinkSync(path);
            });
            data.image.forEach(name => {
                var path = `app/files/product/thumbnail/${name}`;
                if(fs.existsSync(path)) fs.unlinkSync(path);
            });
            await Promise.all([
                product.delete(data.id_product),
                image.delete(data.image),
                productfeedback.delete(data.id_product),
                message.delete(data.id_product)
            ]);
            
            return response.json({
                success: 1,
                message: "Xóa thành công !"
            })
        })
        .catch(error=>{
            return response.json({
                success: 0,
                message: "Lỗi truy vấn " +error.name+"!",
                error:error
            })
        });
    }
}