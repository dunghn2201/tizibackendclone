var ProductPriority = require("../../models/public/ProductPriority");
var productPriority = new ProductPriority();

var Category = require("../../models/public/Category");
var category = new Category();

var Find = require("../../util/find");
module.exports = {
    search: (request, response)=>{
        var query = {
            id_province: request.query.id_province ? request.query.id_province : 'toan-quoc',
            id_district: request.query.id_district ? request.query.id_district : false,
            id_category: request.query.id_category ? request.query.id_category : 'tat-ca-danh-muc',
            search: request.query.search ? request.query.search : false,
            priceFrom: request.query.priceFrom ? request.query.priceFrom : false,
            priceTo: request.query.priceTo ? request.query.priceTo : false,
            group: request.query.group == 'ca-nhan' ? 1 : (request.query.group == 'chuyen' ? 3 : 0) // tat cac cac san pham. bao gom 'ca nhan = 1 ' va 'chuyen = 3'
        }

        category.getAll()
        .then(async results=>{
            if(query.id_category!='tat-ca-danh-muc'){
                var find = new Find(results, query.id_category);
                query.id_category = find.getParent();
            }
           
            var dataProduct = await productPriority.search(query);
            return response.json(dataProduct);
        })
        .catch(error=>{
            console.log(error);
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}!`
            });
        });
    }
}