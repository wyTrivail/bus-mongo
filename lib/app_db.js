var mongo_client = require('mongodb').MongoClient;

var db_url = '';


/**
 * Return the raw db instance of mongodb
 * @function
 * @param {string} db's name, use the default db on url if this param is null
 * @callback {err, raw_db}
 */
var get_raw_db = function(db_name, callback){
    mongo_client.connect(db_url, function(err, raw_db){
        if(err) callback(err);
        else callback(null, db_name ? raw_db.db(db_name) : raw_db);
    });
};

/**
 * Return the raw collection instance of mongodb 
 * @function
 * @param {string} db's name
 * @param {string} collection's name
 * @callback {err, raw_collection}
 */
var get_raw_collection = function(db_name, collection_name, callback){
    get_raw_db(db_name, function(err, db){
        if(err) callback(err);
        else db.collection(collection_name, {w:1}, callback);
    });
};

var create_or_get_collection = function(db_name, collection_name){
    var get_collection = function(callback){
        get_raw_collection(db_name, collection_name, callback);
    };

    /**
     * handle the arguments before query, options will be ignore if length of arguments is 2
     * @function
     * @param {argument} the arguments of query
     * @return {query, options, callback | query, callback}
     */
    var pre_handle_query_args = function(args){
        if(args.length === 3){
            return {
                query: args[0],
                options: args[1],
                callback: args[2]
            };
        }else return {
            query: args[0],
            callback: args[1]
        }
    };


    /**
     * handle the arguments before the insert exec, options will be ignore if the length of args is 2.
     * @function
     * @param {arguments} the arguments of insert
     * @return {insert,options,callback | insert,callback}
     */
    var pre_handle_insert_args = function(args){
        var handled_result = pre_handle_query_args(args);
        var insert = handled_result.query;
        delete handled_result.query;
        handled_result.insert = insert;
        return handled_result;
    }

    /**
     * handle the arguments before update, options will be ignore if the length of args is 3
     * @function
     * @param {arguments} the arguments of update
     * @return {query, payment, options, callback | query, payment, callback}
     */
    var pre_handle_update_args = function(args){
        if(args.length === 4){
            return {
                query: args[0],
                payment: args[1],
                options: args[2],
                callback: args[3]
            };
        }else return {
            query: args[0],
            payment: args[1],
            callback: args[2]
        };
    };

    return {
        name: collection_name,
        drop: (callback) => {
            get_collection((err, collection) => {
                if(err) callback(err);
                else collection.drop(callback);
            });
        },
        /**
         * fetch all the docs that matchs the query
         * @method
         * @param {object} query condition
         * @param {object} [options=null] optional settings
         * @callback {err, docs}
         */
        find: () => {
            var args = pre_handle_query_args(arguments);
            get_collection((err, collection) => {
                if(err) args.callback(err);
                else collection.find(args.query, args.options).toArray(args.callback);
            });
        },

        /**
         * insert docs into mongodb
         * @method
         * @param {object array | object} inserted doc or docs
         * @param {object} [options=null] optional settings
         * @callback {err, command_exec_result}
         */
        insert: () => {
            var args = pre_handle_insert_args(arguments);
            get_collection((err, collection) => {
                if(err) args.callback(err);
                else {
                    if(Array.isArray(args.insert)) collection.insert(args.insert, args.options, args.callback);
                    else collection.insertOne(args.insert, args.options, args.callback);
                }
            });
        },

        /**
         * update docs that match the query
         * @method
         * @param {object} query condition
         * @param {object} update payment
         * @param {object} [options=null] optional settings
         * @callback {err, command_exec_result}
         */
        update: () => {
            var args = pre_handle_update_args(arguments);
            get_collection((err, collection) => {
                if(err) args.callback(err);
                else collection.updateMany(args.query, args.payment, args.options, args.callback);
            });
        },

        /**
         * delete docs that match the query
         * @method
         * @param {object} query condition
         * @param {object} [options=null] optional settings
         * @callback {err, command_exec_result}
         */
        delete: () => {
            var args = pre_handle_query_args(arguments);
            get_collection((err, collection) => {
                if(err) args.callback(err);
                else collection.deleteMany(args.query, args.options, args.callback);
            });
        },

        /**
         * fetch the first one doc that matchs the query
         * @method
         * @param {object} query condition
         * @param {object} [options=null] optional settings
         * @callback {err, doc}
         */
        find_one: () => {
            var args = pre_handle_query_args(arguments);
            get_collection((err, collection) => {
                if(err) args.callback(err);
                else collection.findOne(args.query, args.options, args.callback);
            });
        },

        /**
         * update the first one doc that matchs the query
         * @method
         * @param {object} query condition
         * @param {object} update payment
         * @param {object} [options=null] optional settings
         * @callback {err, exec_command_result}
         */
        update_one: () => {
            var args = pre_handle_update_args(arguments);
            get_collection((err, collection) => {
                if(err) args.callback(err);
                else collection.updateOne(args.query, args.payment, args.options, args.callback);
            });
        },

        /**
         * delete the first one doc that matchs the query
         * @method
         * @param {object} query condition
         * @param {object} [options=null] optional settings
         * @callback {err, exec_command_result}
         */
        delete_one: () => {
            var args = pre_handle_query_args(arguments);
            get_collection((err, collection) => {
                if(err) args.callback(err);
                else collection.deleteOne(args.query, args.options, args.callback);
            });
        }
    };
};



module.exports.init = function(url){
    db_url = url;
};

/**
 * return the db if the default db is not our target db
 * @function
 * @param {string} target db name
 * @return {class} return the db class
 */
module.exports.db = function(db_name){
    return {
        collection: collection_name => create_or_get_collection(db_name, collection_name),
        list_collections: function(filter, callback){
            get_raw_db(db_name, function(err, db){
                db.listCollections(filter).toArray(function(err, collection_infos){
                    if(err) callback(err);
                    else callback(null, collection_infos.map(item => create_or_get_collection(db_name, item.name)));
                });
            });
        }
    };
};

/**
 * return the collection of the default db in db url
 * @function
 * @param {string} collection name
 * @return {class} return the collection class
 */
module.exports.collection = function(collection_name){
    return create_or_get_collection(null, collection_name);
};



