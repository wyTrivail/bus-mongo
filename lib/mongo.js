var mongo_client = require('mongodb').MongoClient;

var connect_url;
var connect_opt;
var current_db;
var db_pool = {};

var get_db_by_name = function(admin_db, db_name){
    if(!db_name) return admin_db;
    else if(db_pool[db_name]) return db_pool[db_name];
    else {
        db_pool[db_name] = admin_db.db(db_name);
        return db_pool[db_name];
    }
};
var connect = function(db_name, callback){
    if(!current_db){
        mongo_client.connect(connect_url, connect_opt, (err, raw_db) => {
            if(err) callback(err);
            else {
                current_db = raw_db;
                callback(null, get_db_by_name(current_db, db_name));
            }
        });
    }else callback(null, get_db_by_name(current_db, db_name));
};

module.exports.init = function(url, opt, callback){
    connect_url = url;
    connect_opt = opt;
    mongo_client.connect(connect_url, connect_opt, (err, raw_db) => {
        if(err) callback(err);
        else {
            current_db = raw_db;
            callback();
        }
    });
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
