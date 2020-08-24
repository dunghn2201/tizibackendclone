const {verify} = require("jsonwebtoken");

function check_token(token){
    return new Promise((resolve, reject)=>{
        verify(token, "theanhit", (error, decoded)=>{
            if(error) return resolve(error);
            return resolve(decoded);
        });
    });
}

module.exports = async (token)=>{
    if(!token) return null;
    token = token.slice(7);
    return await check_token(token);
}