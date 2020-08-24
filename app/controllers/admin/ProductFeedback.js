var ProductFeeback = require("../../models/admin/ProductFeedback");
var productfeedback = new ProductFeeback();

module.exports = {
    about: (request, response)=>{
        var id_product = request.params.id_product;
        productfeedback.about(id_product)
        .then(results=>{
            return response.json(results);
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: "Lỗi truy vấn "+ error.name +"!"
            })
        })
    }
}