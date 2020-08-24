var Product = require("../../models/public/Product");
var product = new Product();

var Image = require("../../models/public/Image");
var image = new Image();

var Category = require("../../models/public/Category");
var category = new Category();

var { v4: uuidv4 } = require('uuid');
var { uploadImg, uploadImgThumbnail } = require("../../util/upload");

var date = require("../../util/date");
var Find = require("../../util/find");

module.exports = {
    create: async (request, response)=>{
        var data = request.body;
        var files = request.files;

        var id_group_image  = uuidv4() + ".jpeg";
        data.id_group_image = id_group_image;
        data.created_at     = date();
        data.updated_at     = data.created_at;
        data.status = 1;

        if(files){
            var images = files.images;
            var dataImage = []; //[["id_group_image", "name", "is_default"]]

            var img = [];//["id_group_image", "name", "is_default"]
            img.push(id_group_image); // img = ["id_group_image"]
            img.push(uuidv4() + ".jpeg"); // img = ["id_group_image", "name"]
            img.push(1); // img = ["id_group_image", "name", 1]

            dataImage.push(img);
            if(images.length > 1){
                await uploadImg(images[0].data, 700, img[1]);
                uploadImgThumbnail(images[0].data, 270, id_group_image);

                for(var i=1; i < files.images.length; i++){
                    var img = [];//["id_group_image", "name", "is_default"]
                    img.push(id_group_image);
                    img.push(uuidv4() + '.jpeg');
                    img.push(0);

                    uploadImg(images[i].data, 700, img[1]);
                    dataImage.push(img);
                }
            }else{
                await uploadImg(images.data, 700, img[1]);
                uploadImgThumbnail(images.data, 270, id_group_image);
            }
            // insert database
            image.create(dataImage)
            .then(results=>{
                return product.create(data);
            })
            .then(results=>{
                return response.json({
                    success:1,
                    message: "Đăng tin thành công !",
                    id_product: results[1][0].id_product
                })
            })
            .catch(error=>{
                console.log(error);
                return response.json({
                    success:0,
                    message: "Lỗi tuy vấn " + error.name +" !"
                })
            });
        }
    },
    about: (request, response)=>{
        var data = request.params;
        product.getAbout(data)
        .then(async results=>{
            var groupImg =[];
            var suggest = [];
            if(results.length){
                groupImg = await image.getGroup(results[0].id_group_image);
                suggest = await product.suggest(results[0]);
            }
            return response.json({
                about:results[0],
                image:groupImg,
                suggest: suggest
            });
        })
        .catch(error=>{
            console.log(error);
            return response.json({
                success: 0,
                message: "Lỗi truy vấn "+ error.name + " !"
            });
        })
    },
    search: (request, response)=>{
        var query = {
            id_province: request.query.id_province ? request.query.id_province : 'toan-quoc',
            id_district: request.query.id_district ? request.query.id_district : false,
            id_category: request.query.id_category ? request.query.id_category : 'tat-ca-danh-muc',
            search: request.query.search ? request.query.search : false,
            priceFrom: request.query.priceFrom ? request.query.priceFrom : false,
            priceTo: request.query.priceTo ? request.query.priceTo : false,
            sortOption: request.query.sortOption ? request.query.sortOption : 'time-new',
            group: request.query.group == 'ca-nhan' ? 1 : (request.query.group == 'chuyen' ? 3 : 0),// tat cac cac san pham. bao gom 'ca nhan = 1 ' va 'chuyen = 3'
            page: request.query.page ? request.query.page : 1,
            pageSize: request.query.pageSize ? request.query.pageSize : 20
        }

        category.getAll()
        .then(async results=>{

            if(query.id_category!='tat-ca-danh-muc'){
                var find = new Find(results);
                find.getId(query.id_category);
                query.id_category = find.getArrayId().concat([find.id]);
            }
            
            var dataProduct = await product.search(query);
            return response.json(dataProduct);
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}!`
            });
        });
    }
}
