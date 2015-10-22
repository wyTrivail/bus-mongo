var mongo_client = require('mongodb').MongoClient;

var connect_url;
var connect_opt;
var current_db;

var connect = function(db_name, callback){
    if(!current_db){
        mongo_client.connect(connect_url, connect_opt, (err, raw_db) => {
            if(err) callback(err);
            else {
                current_db = raw_db;
                if(db_name) callback(null, current_db.db(db_name));
                else callback(null, current_db);
            }
        });
    }else if(db_name) callback(null, current_db.db(db_name));
    else callback(null, current_db);
};

module.exports.init = function(url, opt){
    connect_url = url;
    connect_opt = opt || {};
    connect_opt.maxPoolSize |= 10;
};


module.exports.get_raw_collection = function(db_name, collection_name, collection_opt, callback){
    connect(db_name, (err, raw_db) => {
        if(err) callback(err);
        else raw_db.collection(collection_name, collection_opt, callback);
    });
};

module.exports.list_collections = function(db_name, filter, callback){
    connect(db_name, (err, raw_db) => {
        if(err) callback(err);
        else raw_db.listCollections(filter).toArray(callback);
    });
};
