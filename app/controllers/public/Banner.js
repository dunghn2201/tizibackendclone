var Banner = require("../../models/public/Banner");
var banner = new Banner();

module.exports = {
    getAll: (request, response)=>{
        banner.getAll()
        .then(results=>{
            return response.json(results);
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: `lỗi truy vấn ${error.name}!`
            });
        });
    }
}