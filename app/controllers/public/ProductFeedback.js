var ProductFeeback = require("../../models/public/ProductFeedback");
var productfeedback = new ProductFeeback();

module.exports = {
    create: (request, response)=>{
        var data = request.body;
        
        productfeedback.create(data)
        .then(results=>{
            return response.json({
                success:1,
                message: "Đã gửi thành công !"
            });
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: "Lỗi truy vấn "+ error.name +"!"
            })
        })
    }
}