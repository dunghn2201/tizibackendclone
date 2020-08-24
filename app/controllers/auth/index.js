var sendMail = require("../../util/mail");
var randomstring = require("randomstring");

var Auth = require("../../models/auth");
var auth = new Auth();

var {genSaltSync, hashSync, compareSync} = require("bcrypt");
var {sign,verify} = require("jsonwebtoken");

var { v4: uuidv4 } = require('uuid');
var { uploadAvata } = require("../../util/upload");

var fs = require("fs");

var Product = require("../../models/auth/Product");
var product = new Product();

var ProductPriority = require("../../models/auth/ProductPriority");
var productPriority = new ProductPriority();

var ProductFollow = require("../../models/auth/ProductFollow");
var productFollow = new ProductFollow();

var ProductFeedback = require("../../models/auth/ProductFeedback");
var productFeedback = new ProductFeedback();

var Category = require("../../models/auth/Category");
var category = new Category();

var Find = require("../../util/find");

var Image = require("../../models/auth/Image");
var image = new Image();

var Message = require("../../models/auth/Message");
var message = new Message();

var Notification = require("../../models/auth/Notification");
var notification = new Notification();

var { uploadImg, uploadImgThumbnail } = require("../../util/upload");
var { v4: uuidv4 } = require('uuid');

var moment = require("moment");

module.exports = {
    check: (request, response)=>{
        var data = {
            username: request.query.username ? request.query.username : null,
            email: request.query.email ? request.query.email : null,
            phone: request.query.phone ? request.query.phone : null,
        };
        
        auth.check(data)
        .then(results=>{
            if(results[0].count_user > 0) return response.json({
                result: true,
                message: `Đã tồn tại !`
            });
            return response.json({
                result: false,
                message: `Hơp lệ !`
            })
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}!`,
                error: error
            })
        })
    },
    create: (request, response)=>{
        var data = request.body;
        var code = randomstring.generate({
            length: 4,
            charset: 'numeric'
        });
        data.code = code;
        var salt = genSaltSync(10);
        data.password = hashSync(data.password, salt);
        
        auth.create(data)
        .then(async results=>{
            var mainOptions = {
                from: 'tizi',
                to: data.email,
                subject: `Tizi.vn > Xác nhận tài khoản !`,
                text: `tizi.vn`,
                html:`<h1>Mã xác nhận: <span style="color:red;">${code}</span></h1>`
            }

            await sendMail(mainOptions);

            return response.json({
                success:1,
                message: `Đăng ký thành công !`,
                id_user: results[1][0].id_user
            })
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}!`,
                error: error
            })
        })
    },
    login: (request, response)=>{
        const data = request.body;
        auth.about(data)
        .then(results=>{
            if(results.length > 0){
                var result = compareSync(data.password, results[0].password);
                const jsontoken = sign({result:results[0]}, "theanhit",{
                    expiresIn: "365d"
                });
                if(result) return response.json({
                    success:1,
                    message: "Đăng nhập thành công !",
                    token: jsontoken,
                    user: results[0]
                });
                else return response.json({
                    success:0,
                    message: "Sai mật khẩu !",
                });
            }else return response.json({
                success:0,
                message: `Tài khoản hoặc email không tồn tại!`
            });
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}`
            });
        })
    },
    about: (request, response)=>{
        var token = request.get("authorization");
        token = token.slice(7);

        verify(token, "theanhit", (error, decoded)=>{
            if(error) return response.json({
                success: 0,
                message: "token lỗi!"
            });
            
            auth.about(decoded.result)
            .then(results=>{
                return response.json({
                    success:1,
                    result: results[0]
                });
            })
            .catch(error=>{
                return response.json({
                    success:0,
                    message: `Lỗi truy vấn ${error.name}!`
                })
            })
        });
    },
    active: (request, response)=>{
        var data = request.body;
        
        auth.active(data)
        .then(results=>{
            if(results.affectedRows) return response.json({
                success: 1,
                message: `Xác nhận thành công !`
            })
            else return response.json({
                success: 0,
                message: `Mã xác nhận không chính xác !`
            })
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}!`,
                error: error
            })
        })
    },
    confirmMail: (request, response)=>{
        var data = request.body;
        data.code = randomstring.generate({
            length: 4,
            charset: 'numeric'
        });

        auth.updateCode(data)
        .then(async results=>{
            var mainOptions = {
                from: 'tizi',
                to: data.email,
                subject: `Tizi.vn > Xác nhận tài khoản !`,
                text: `tizi.vn`,
                html:`<h1>Mã xác nhận: <span style="color:red;">${data.code}</span></h1>`
            }

            await sendMail(mainOptions);

            return response.json({
                success:1,
                message: `Gửi code thành công !`
            });
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Email không tồn tại !`,
                error: error
            })
        });
    },
    update: (request, response)=>{
        var data = request.body;
        var files = request.files;
        if(files){
            var path = "app/files/avata/" + data.avata;
            if (fs.existsSync(path)) fs.unlinkSync(path);
            data.avata = uuidv4() + '.jpeg';
            uploadAvata(files.image.data, data.avata);
        }
        
        auth.update(data)
        .then(async results=>{
            var user = await auth.about(data);
            if(results.affectedRows) return response.json({
                success: 1,
                message: `Cập nhật thành công !`,
                user: user[0]
            })
            else return response.json({
                success: 0,
                message: `Có lỗi xảy ra !`
            })
        })
        .catch(error=>{
            return response.json({
                success: 0,
                message: `lỗi truy vấn ${error.name}!`
            });
        })
        
    },
    changePassword: (request, response)=>{
        const data = request.body;
        auth.about(data)
        .then(async results=>{
            var check = compareSync(data.password, results[0].password);
            if(check){
                var salt = genSaltSync(10);
                data.password = hashSync(data.passwordnew, salt);

                await auth.changePassword(data);
                return response.json({
                    success: 1,
                    message: `Đổi mật khẩu thành công !`
                });
            }else{
                return response.json({
                    success:0,
                    message: `Mật khẩu không đúng !`
                });
            }
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}`
            });
        })
    },
    forgotPassword: (request, response)=>{
        const data = request.body;

        var salt = genSaltSync(10);
        data.password = hashSync(data.password, salt);

        auth.forgotPassword(data)
        .then(results=>{
            if(results.affectedRows){
                return response.json({
                    success: 1,
                    message: `Đổi mật khẩu thành công !`
                });
            }else{
                return response.json({
                    success:0,
                    message: `Có lỗi xảy ra !`
                });
            }
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}`
            });
        })
    },
    //store
    checkUrlStore: (request, response)=>{
        var data = request.query;
        var token = request.get("authorization");
        token = token.slice(7);
        verify(token, "theanhit", (error, decoded)=>{
            if(error) return response.json({
                success:0,
                message: "Token lỗi!",
                error: error
            });
            data.username = decoded.result.username;
            
            auth.checkUrlStore(data)
            .then(results=>{
                if(results[0].count_user > 0) return response.json({
                    success: false,
                    message: `Đã tồn tại !`
                });
                return response.json({
                    success: true,
                    message: `Hơp lệ !`
                })
            })
            .catch(error=>{
                return response.json({
                    success:0,
                    message: `Lỗi truy vấn ${error.name}!`
                })
            })
        });
    },
    updateStore: (request, response)=>{
        var data = request.body;
        var token = request.get("authorization");
        token = token.slice(7);
        verify(token, "theanhit", (error, decoded)=>{
            if(error) return response.json({
                success:0,
                message: "Token lỗi!"
            });
            data.username = decoded.result.username;
            
            auth.updateStore(data)
            .then(results=>{
                return response.json({
                    success:1,
                    message: `Sửa thành công!`
                }) 
            })
            .catch(error=>{
                return response.json({
                    success:0,
                    message: `Lỗi truy vấn ${error.name}!`
                })
            })
        });
    },
    //Product
    searchProduct: (request, response)=>{
        var data = {
            id_user: request.query.id_user ? request.query.id_user : 0,
            id_category: request.query.id_category ? request.query.id_category : 'tat-ca-danh-muc',
            search: request.query.search ? request.query.search : '',
            status: request.query.status ? request.query.status : 'tat-ca-trang-thai',
            page: request.query.page ? request.query.page : 1,
            pageSize: request.query.pageSize ? request.query.pageSize : 20
        };
        if(data.id_category != 'tat-ca-danh-muc'){
            category.getAll()
            .then(results=>{
                var find = new Find(results, data.id_category);
                data.id_category = find.get();
                return product.search(data);
            })
            .then(results=>{
                return response.json(results);
            })
            .catch(error=>{
                return response.json({
                    success:0,
                    message: `Lỗi truy vấn ${error.name}!`
                });
            })
        }else{
            product.search(data)
            .then(results=>{
                return response.json(results);
            })
            .catch(error=>{
                return response.json(error);
            });
        }
    },
    soldProduct: (request, response)=>{
        var data = request.body;
        product.sold(data)
        .then(results=>{
            return response.json({
                success:1,
                message: 'Đã bán thành công!'
            })
        })
        .catch(error=>{
            return response.json({
                success: 0,
                message: "Lỗi truy vấn "+ error.name + " !"
            });
        })
    },
    activeProduct: (request, response)=>{
        var data = request.body;
        product.active(data)
        .then(results=>{
            return response.json({
                success:1,
                message: 'Đăng thành công!'
            })
        })
        .catch(error=>{
            return response.json({
                success: 0,
                message: "Lỗi truy vấn "+ error.name + " !"
            });
        })
    },
    aboutProduct: (request, response)=>{
        var data = request.body;
        
        product.getAbout(data)
        .then(async results=>{
            var groupImg =[];
            if(results.length){
                groupImg = await image.aboutGroup(results[0].id_group_image);
            }
            return response.json({
                about:results[0],
                image:groupImg
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
    addImg: async (request, response)=>{
        var files = request.files;
        var body = request.body;

        var dataImage = []; //[["id_group_image", "name", "is_default"]
        if(files.image.length > 1){
            for(var file of files.image){
                var img = [];//["id_group_image", "name", "is_default"]

                img.push(body.id_group_image); // img = ["id_group_image"]
                img.push(uuidv4() + ".jpeg"); // img = ["id_group_image", "name"]
                img.push(0); // img = ["id_group_image", "name", 0]

                await uploadImg(file.data, 700, img[1]);

                dataImage.push(img);
            }
        }else{
            var img = [];//["id_group_image", "name", "is_default"]

            img.push(body.id_group_image); // img = ["id_group_image"]
            img.push(uuidv4() + ".jpeg"); // img = ["id_group_image", "name"]
            img.push(0); // img = ["id_group_image", "name", 0]
            
            await uploadImg(files.image.data, 700, img[1]);
            dataImage.push(img);
        }

        // insert database
        image.create(dataImage)
        .then(results=>{
            return image.aboutGroup(body.id_group_image);
        })
        .then(results=>{
            return response.json({
                success: 1,
                message: `Thêm hình thành công!`,
                images: results
            });
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}!`
            })
        })
    },
    defaultImg: (request, response)=>{
        var data = request.body;
        
        image.defaultImage(data)
        .then(results=>{
            var path = `app/files/product/${data.name}`;
            if(fs.existsSync(path)){
                var readFile = fs.readFileSync(path);
                uploadImgThumbnail(readFile, 270 ,data.id_group_image);
            }
            return response.json({
                success:1,
                message: `Đặt ảnh mặc định thành công!`,
            })
        })
        .catch(error=>{
            return response.json({
                success: 0,
                message: `Lỗi truy vấn ${error.name}!`,
                error: error
            })
        });
    },
    deleteImg: (request, response)=>{
        var data = request.query;
        
        var path = `app/files/product/${data.name}`;
        if(fs.existsSync(path)) fs.unlinkSync(path);
        image.delete(data)
        .then(results=>{
            return response.json({
                success:1,
                message: `Xoá thành công !`
            });
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}!`
            });
        });
    },
    editProduct: (request, response)=>{
        var data = request.body;
        product.update(data)
        .then(results=>{
            return response.json({
                success:1,
                message: `Sửa thành công !`
            })
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}!`
            });
        })
    },
    updateUserProduct: (request, response)=>{
        var data = request.body;
        product.updateUserProduct(data)
        .then(results=>{
            return response.json({
                success:1,
                message: `Cập nhật thành công !`
            });
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Có lỗi xảy ra ${error.name}!`
            });
        });
    },
    deleteProduct: (request, response)=>{
        var data = request.query;
        image.aboutGroup(data.id_group_image)
        .then(async results=>{
            results.forEach(e => {
                var path = `app/files/product/${e.name}`;
                if(fs.existsSync(path)) fs.unlinkSync(path);
            });
            var path = `app/files/product/thumbnail/${data.id_group_image}`;
            if(fs.existsSync(path)) fs.unlinkSync(path);

            await Promise.all([
                product.delete(data.id),
                image.deleteGroup(data.id_group_image),
                productFeedback.delete([data.id]),
                message.delete([data.id])
            ]);

            return response.json({
                success:1,
                message: `Xóa thành công !`
            });
        })
        .catch(error=>{
            console.log(error);
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}!`
            });
        })
    },
    // push product
    pushProduct: (request, response)=>{
        var data = request.body;
        data.date = moment().format('YYYY-MM-DD H:mm:ss');
    
        product.push(data)
        .then(async results=>{
            return response.json({
                success:1,
                message: `Đẩy tin thành công !`,
                date: data.date
            });
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}!`
            });
        })
    },
    //product priority
    searchProductPriority: (request, response)=>{
        var data = {
            id_user: request.query.id_user ? request.query.id_user : 0,
            search: request.query.search ? request.query.search : '',
            status: request.query.status ? request.query.status : 'tat-ca-trang-thai',
            page: request.query.page ? request.query.page : 1,
            pageSize: request.query.pageSize ? request.query.pageSize : 20
        };
        productPriority.search(data)
        .then(results=>{
            return response.json(results);
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}!`
            });
        });
    },
    activeProductPriority: (request, response)=>{
        var data = request.body;
        productPriority.active(data)
        .then(results=>{
            return response.json({
                success:1,
                message: data.status ? (data.status == 0 ? `Tin đã được hoạt động!`: `Tin đã tắt!`) : `Cập nhật trạng thái thành công!`,
                result: results
            });
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `Lỗi truy vấn ${error.name}!`
            });
        });
    },
    addProductPriority: (request, response)=>{
        var data = request.body;
        var date = new moment(data.date_from);
        data.date_to = date.add(data.day, 'd').format("YYYY-MM-DD HH:mm:ss");
        if(data.id_district != 0) data.id_province = data.id_district;

        var token = request.get("authorization");
        token = token.slice(7);
        verify(token, "theanhit", (error, decoded)=>{
            if(error) return response.json({
                success: 0,
                message: "token lỗi!"
            });
            data.id_user = decoded.result.id;
            productPriority.create(data)
            .then(results=>{
                return response.json({
                    success: 1,
                    message: "Thêm tin ưu tiên thành công !"
                })
            }) 
            .catch(error=>{
                console.log(error);
                return response.json({
                    success:0,
                    message: `Lỗi truy vấn ${error.name}!`
                })
            });
        });
    },
    deleteProductPriority: (request, response)=>{
        var data = request.query;
        var token = request.get("authorization");
        token = token.slice(7);
        verify(token, "theanhit", (error, decoded)=>{
            if(error) return response.json({
                success: 0,
                message: "token lỗi!"
            });
            data.id_user = decoded.result.id;
            productPriority.delete(data)
            .then(results=>{
                return response.json({
                    success: 1,
                    message: "Xoá thành công !"
                })
            }) 
            .catch(error=>{
                console.log(error);
                return response.json({
                    success:0,
                    message: `Lỗi truy vấn ${error.name}!`
                })
            });
        });
    },
    // product follow
    searchProductFollow: (request, response)=>{
        var data = {
            id_user: request.query.id_user ? request.query.id_user : 0,
            id_category: request.query.id_category ? request.query.id_category : 'tat-ca-danh-muc',
            search: request.query.search ? request.query.search : '',
            page: request.query.page ? request.query.page : 1,
            pageSize: request.query.pageSize ? request.query.pageSize : 20
        };
        if(data.id_category != 'tat-ca-danh-muc'){
            category.getAll()
            .then(results=>{
                var find = new Find(results, data.id_category);
                data.id_category = find.get();
                return productFollow.search(data);
            })
            .then(results=>{
                return response.json(results);
            })
            .catch(error=>{
                return response.json({
                    success:0,
                    message: `Lỗi truy vấn ${error.name}!`
                });
            })
        }else{
            productFollow.search(data)
            .then(results=>{
                return response.json(results);
            })
            .catch(error=>{
                return response.json({
                    success:0,
                    message: `Lỗi truy vấn ${error.name}!`
                });
            });
        }
    },
    deleteProductFollow: (request, response)=>{
        var data = request.query;
        var token = request.get("authorization");
        token = token.slice(7);
        verify(token, "theanhit", (error, decoded)=>{
            if(error) return response.json({
                success:0,
                message: "Token lỗi!",
                error: error
            });
            data.id_user = decoded.result.id;
            
            productFollow.delete(data)
            .then(results=>{
                return response.json({
                    success: 1,
                    message: `Xoá thành công!`
                })
            })
            .catch(error=>{
                return response.json({
                    success:0,
                    message: `Lỗi truy vấn ${error.name}!`
                })
            })
        }); 
    },
    // message
    message: (request,response)=>{
        var data = request.query;
        message.get(data)
        .then(results=>{
            return response.json(results);
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `lỗi truy vấn ${error.name}!`,
                error: error
            })
        });
    },
    sendMessage: (request,response)=>{
        var data = request.body;
        message.create(data)
        .then(results=>{
            return response.json({
                success:1,
                message: "Gửi tin thành công!"
            });
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `lỗi truy vấn ${error.name}!`,
                error: error
            })
        });
    },
    aboutUser: (request,response)=>{
        var data = request.query;
        message.aboutUser(data)
        .then(results=>{
            return response.json(results);
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `lỗi truy vấn ${error.name}!`,
                error: error
            })
        });
    },
    countNewMessage: (request,response)=>{
        var token = request.get("authorization");
        token = token.slice(7);
        
        verify(token, "theanhit", (error, decoded)=>{
            if(error) return response.json({
                success: 0,
                message: "token lỗi!"
            });
            var data = {
                id_user: decoded.result.id
            }
            message.countNewMessage(data)
            .then(results=>{
                return response.json(results[0]);
            })
            .catch(error=>{
                return response.json({
                    success:0,
                    message: `lỗi truy vấn ${error.name}!`,
                    error: error
                })
            });
        });
    },
    messageProduct: (request,response)=>{
        var data = request.query;
        message.aboutProduct(data)
        .then(results=>{
            return response.json(results);
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `lỗi truy vấn ${error.name}!`,
                error: error
            })
        });
    },
    messageAll:(request,response)=>{
        var token = request.get("authorization");
        token = token.slice(7);
        
        verify(token, "theanhit", (error, decoded)=>{
            if(error) return response.json({
                success: 0,
                message: "token lỗi!"
            });
            var data = {
                id_user: decoded.result.id,
                page: request.query.page ? request.query.page : 1,
                pageSize: request.query.pageSize ? request.query.pageSize : 15
            }
            message.messageOfId_user(data)
            .then(results=>{
                return response.json(results);
            })
            .catch(error=>{
                return response.json({
                    success:0,
                    message: `lỗi truy vấn ${error.name}!`,
                    error: error
                })
            });
        });
    },
    viewMessage: (request,response)=>{
        var token = request.get("authorization");
        token = token.slice(7);
        
        verify(token, "theanhit", (error, decoded)=>{
            if(error) return response.json({
                success: 0,
                message: "token lỗi!"
            });
            var data = {
                id_user2: decoded.result.id,
                id_user1: request.query.id_user1,
                id_product: request.query.id_product
            }
            message.viewMessage(data)
            .then(results=>{
                return response.json({
                    success:1,
                    message: "Xem tin nhắn thành công!"
                });
            })
            .catch(error=>{
                return response.json({
                    success:0,
                    message: `lỗi truy vấn ${error.name}!`,
                    error: error
                })
            });
        });
    },
    // notification
    notification: (request,response)=>{
        var token = request.get("authorization");
        token = token.slice(7);
        var data = {
            page: request.query.page ?  request.query.page : 1,
            pageSize:  request.query.pageSize ?  request.query.pageSize : 15 
        }
        verify(token, "theanhit", (error, decoded)=>{
            if(error) return response.json({
                success: 0,
                message: "token lỗi!"
            });

            data.id_user = decoded.result.id;
            
            notification.notificationOfId_user(data)
            .then(results=>{
                return response.json(results);
            })
            .catch(error=>{
                return response.json({
                    success:0,
                    message: `lỗi truy vấn ${error.name}!`,
                    error: error
                })
            });
        });
    },
    viewNotification: (request,response)=>{
        var token = request.get("authorization");
        token = token.slice(7);
        
        verify(token, "theanhit", (error, decoded)=>{
            if(error) return response.json({
                success: 0,
                message: "token lỗi!"
            });
            var data = {
                id_user: decoded.result.id,
                id_notification: request.query.id_notification
            }
            notification.viewNotification(data)
            .then(results=>{
                return response.json({
                    success:1,
                    message: "Xem thành công!"
                });
            })
            .catch(error=>{
                return response.json({
                    success:0,
                    message: `lỗi truy vấn ${error.name}!`,
                    error: error
                })
            });
        });
    },
    countNewNotification: (request,response)=>{
        var token = request.get("authorization");
        token = token.slice(7);
        
        verify(token, "theanhit", (error, decoded)=>{
            if(error) return response.json({
                success: 0,
                message: "token lỗi!"
            });
            var data = {
                id_user: decoded.result.id
            }
            notification.countNewNotification(data)
            .then(results=>{
                return response.json(results[0]);
            })
            .catch(error=>{
                return response.json({
                    success:0,
                    message: `lỗi truy vấn ${error.name}!`,
                    error: error
                })
            });
        });
    }
}