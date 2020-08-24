var route = require("express").Router();
var auth = require("../../controllers/auth");
var {isDeleteImage, isEditProduct} = require("../../validation/auth/token");

// user
route.post("/login", auth.login);
route.post("/create", auth.create);
route.get("/", auth.about);
route.get("/check", auth.check);
route.put("/active", auth.active);
route.put("/confirmMail", auth.confirmMail);
route.patch("/update", auth.update);
route.put("/changepassword", auth.changePassword);
route.put("/forgotpassword", auth.forgotPassword);
//store
route.get("/check-url-store", auth.checkUrlStore);
route.patch("/update-store", auth.updateStore);
// product
route.get("/searchproduct", auth.searchProduct);
route.put("/soldproduct", isEditProduct, auth.soldProduct);
route.put("/activeproduct", isEditProduct, auth.activeProduct);
route.post("/aboutproduct", auth.aboutProduct);
route.patch("/editproduct", isEditProduct, auth.editProduct);
route.patch("/update-user-product", auth.updateUserProduct);
route.put("/defaultimage", auth.defaultImg);
route.put("/addimage", auth.addImg);
route.delete("/deleteimage", isDeleteImage, auth.deleteImg);
route.delete("/deleteproduct", isEditProduct, auth.deleteProduct);
route.put("/pushproduct", isEditProduct, auth.pushProduct);
// product priority
route.get("/searchproductpriority", auth.searchProductPriority);
route.put("/activeproductpriority", auth.activeProductPriority);
route.post("/addproductpriority", auth.addProductPriority);
route.delete("/delete-product-priority", auth.deleteProductPriority);
// product follow
route.get("/search-product-follow", auth.searchProductFollow);
route.delete("/product-follow", auth.deleteProductFollow);
// message
route.get("/message", auth.message); // lay da ta cua mot cuoc tro chuyen
route.post("/message", auth.sendMessage);
route.get("/message/about-user", auth.aboutUser);
route.get("/message/about-product", auth.messageProduct);
route.get("/message/all", auth.messageAll);
route.get("/message/count-new-message", auth.countNewMessage);
route.get("/message/view-message", auth.viewMessage);
// notification
route.get("/notification", auth.notification);
route.get("/notification/view", auth.viewNotification);
route.get("/notification/count-new-notification", auth.countNewNotification); 

module.exports = route;