const {verify} = require("jsonwebtoken");

module.exports = {
    checkToken: (request, response, next)=>{
        var token = request.get("authorization");
        if(token){
            token = token.slice(7);
            verify(token, "theanhit", (error, decoded)=>{
                if(error) return response.json({
                    success: 0,
                    message: "token lỗi!"
                });
                else if(decoded.result.id_group==2) return next();
                else return response.json({
                    success: 0,
                    message: "Vui lòng đăng nhập tài khoản admin!"
                });
            });
        }else{
            return response.json({
                success: 0,
                message: "Vui lòng đăng nhập!"
            });
        }
    }
}