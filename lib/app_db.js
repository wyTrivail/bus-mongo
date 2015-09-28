var mongo_client = require('mongodb').MongoClient;

var db_url = '';
var admin_db = null;


module.exports.db = function(db_name){
    return {
        collection: create_or_get_collection,
        list_collections: function(filter, callback){
            get_raw_db(db_name, function(err, db){
                db.listCollections(filter).toArray((err, collection_infos) => {
                    if(err) callback(err);
                    else callback(null, collection_infos.map(item => create_or_get_collection(db_name, item.name)));
                });
            });
        }
    };
};

module.exports.init = function(url){
    db_url = url;
};

var get_raw_db = function(db_name, callback){
    if(!admin_db) mongo_client.connect(db_url, function(err, db){
        if(err) callback(err);
        else{
            admin_db = db;
            callback(null, admin_db.db(db_name));
        }
    });
    else callback(null, admin_db.db(db_name));
};

var create_or_get_collection = function(db_name, collection_name){
    var exec_func = function(func_name, args){
        get_raw_db(db_name, function(err, db){
            db.collection(collection_name, {w:1}, function(err, collection){
                return collection[func_name].apply(collection, args);
            });
        });
    };
    return {
        name: collection_name
        find: () => exec_func('find', arguments),
        insert: () => exec_func('insert', arguments),
        update: () => exec_func('update', arguments),
        delete: () => exec_func('delete', arguments),
        find_one: () => exec_func('findOne', arguments),
        insert_one: () => exec_func('insertOne', arguments),
        update_one: () => exec_func('updateOne', arguments),
        delete_one: () => exec_func('deleteOne', arguments),
        find_one_and_replace: () => exec_func('findOneAndReplace', arguments),
        find_one_and_update: () => exec_func('findOneAndUpdate', arguments),
        find_and_modify: () => exec_func('findAndModify', arguments),
        drop: () => exec_func('drop', arguments)
    };
};

