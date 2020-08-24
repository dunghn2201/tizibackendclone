const sharp = require("sharp");

module.exports = {
    uploadImg: (data,width,name) => {
        return new Promise((resolve, reject)=>{
            sharp(data)
            .resize(width)
            .composite([{ input: 'app/files/logo-tizi.png', gravity: 'center' }])
            .jpeg( { quality: 80 } )
            .toFile(`app/files/product/${name}`, (error, info)=>{
                if(error) return reject({name: 'uploadImg', error: error});
                return resolve(info);
            });
        });
    },
    uploadImgThumbnail:(data,width,name)=>{
        sharp(data)
        .resize(width)
        .jpeg( { quality: 80 } )
        .toFile(`app/files/product/thumbnail/${name}`);
    },
    uploadAvata: (data, name)=>{
        sharp(data)
        .resize(160,160,{
            fit: "cover"
        })
        .jpeg( { quality: 80 } )
        .toFile(`app/files/avata/${name}`);
    },
    uploadBanner: (data, name)=>{
        sharp(data)
        .jpeg({ quality: 80 })
        .toFile(`app/files/banner/${name}`);
    }
}