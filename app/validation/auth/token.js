const {verify} = require("jsonwebtoken");
var Image = require("../../models/auth/Image");
var image = new Image();
var Product = require("../../models/auth/Product");
var product = new Product();

module.exports = {
    isDeleteImage: (request, response, next)=>{
        var token = request.get("authorization");
        var query = request.query;
        if(token){
            token = token.slice(7);
            verify(token, "theanhit", (error, decoded)=>{
                if(error) return response.json({
                    success: 0,
                    message: "token lỗi!"
                });
                else if(decoded.result){
                    query.id_user = decoded.result.id;
                    image.isDelete(query)
                    .then(results=>{
                        
                        if(results[0].count_image > 0) return next();
                        else return response.json({
                            success: 0,
                            message: "Bạn không đủ quyền xoá!"
                        });
                    });
                }
            });
        }else{
            return response.json({
                success: 0,
                message: "Vui lòng đăng nhập!"
            });
        }
    },
    isEditProduct: (request, response, next)=>{
        var token = request.get("authorization");
        var body = request.body;
        var query = request.query;
        var data = body.id ? body : query;
        if(token){
            token = token.slice(7);
            verify(token, "theanhit", (error, decoded)=>{
                if(error){
                    return response.json({
                        success: 0,
                        message: "token lỗi!"
                    });
                }else if(decoded.result){
                    data.id_user = decoded.result.id;
                    product.isEdit(data)
                    .then(results=>{
                        if(results[0].count_product) return next();
                        else response.json({
                            success: 0,
                            message: "Ban không đủ quyền xoá !"
                        });
                    })
                    .catch(error=>{
                        return response.json({
                            success: 0,
                            message: `Lỗi truy vấn ${error.name}!`
                        });
                    })
                }
            });
        }else{
            return response.json({
                success: 0,
                message: "Vui lòng đăng nhập!"
            });
        }
    }
}