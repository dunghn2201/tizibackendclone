var Province = require("../../models/public/Province");
var province = new Province();

module.exports = {
    getAll: (request, response)=>{
        province.getAll()
        .then(results=>{
            return response.json(results);
        })
        .catch(error=>{
            return response.json({
                success:0,
                message: "Lỗi truy vấn "+ error.name + " !"
            })
        });
    }
}