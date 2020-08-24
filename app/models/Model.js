class Model {
    query(sql, name=null){
        return new Promise(function(resolve, reject){
            mysql.query(sql, function(error, results){
                if(error) return reject({name: name, error:error});
                return resolve(results);
            });
        });
    }
    querySuper(sql, data, name=null){
        return new Promise(function(resolve, reject){
            mysql.query(sql, data, function(error, results){
                if(error) return reject({name: name, error:error});
                return resolve(results);
            });
        });
    }
}
module.exports = Model;