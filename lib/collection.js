var mongo = require('./mongo');


var Collection = function(db_name, collection_name, collection_opt){
    this.collection_options = collection_opt || {};
    this.collection_options.enable_date |= true; // default enable updated_at and created_at

    this.get_collection = (callback) => {
        mongo.get_raw_collection(db_name, collection_name, collection_opt, callback);
    };

    /**
     * handle the arguments before query, options will be ignore if length of arguments is 2
     * @function
     * @param {argument} the arguments of query
     * @return {query, options, callback | query, callback}
     */
    this.pre_handle_query_args = function(args){
        if(args.length === 3){
            return {
                query: args[0],
                options: args[1],
                callback: args[2]
            };
        }else return {
            query: args[0],
            options: {},
            callback: args[1]
        }
    };

    /**
     * handle the arguments before the insert exec, options will be ignore if the length of args is 2.
     * @function
     * @param {arguments} the arguments of insert
     * @return {insert,options,callback | insert,callback}
     */
    this.pre_handle_insert_args = function(args){
        var handled_result = this.pre_handle_query_args(args);
        var insert = handled_result.query;
        delete handled_result.query;
        if(this.collection_options.enable_date){
            if(Array.isArray(insert)){
                insert = insert.map(item => {
                    if(!item.created_at) item.created_at = new Date();
                    if(!item.updated_at) item.updated_at = new Date();
                    return item;
                });
            }else {
                if(!insert.created_at) insert.created_at = new Date();
                if(!insert.updated_at) insert.updated_at = new Date();
            }
        }
        handled_result.insert = insert;
        return handled_result;
    };

    /**
     * handle the arguments before update, options will be ignore if the length of args is 3
     * @function
     * @param {arguments} the arguments of update
     * @return {query, payment, options, callback | query, payment, callback}
     */
    this.pre_handle_update_args = function(args){
        var new_args = {};
        if(args.length === 4){
            new_args = {
                query: args[0],
                payment: args[1],
                options: args[2],
                callback: args[3]
            };
        }else new_args = {
            query: args[0],
            payment: args[1],
            callback: args[2]
        };
        if(this.collection_options.enable_date){
            if(new_args.payment.$set) new_args.payment.$set.updated_at = new_args.payment.$set.updated_at || new Date();
            else new_args.payment.$set = {
                updated_at: new Date()
            };
        }
        return new_args;
    };

};

Collection.prototype.drop = function(callback){
    this.get_collection((err, collection) => {
        if(err) callback(err);
        else collection.drop(callback);
    });
};

/**
 * fetch all the docs that matchs the query
 * @method
 * @param {object} query condition
 * @param {object} [options=null] optional settings
 * @callback {err, docs}
 */
Collection.prototype.find = function(){
    var args = this.pre_handle_query_args(arguments);
    this.get_collection((err, collection) => {
        if(err) args.callback(err);
        else collection.find(args.query, args.options).toArray(args.callback);
    });
};

/**
 * get the number of docs that match the query
 * @method
 * @param {object} query condition
 * @param {object} [options=null] optional settings
 * @callback {err, count}
 */
Collection.prototype.count = function(){
    var args = this.pre_handle_query_args(arguments);
    this.get_collection((err, collection) => {
        if(err) args.callback(err);
        else collection.find(args.query, args.options).count(args.callback);
    });
};

/**
 * insert docs into mongodb
 * @method
 * @param {object array | object} inserted doc or docs
 * @param {object} [options=null] optional settings
 * @callback {err, command_exec_result}
 */
Collection.prototype.insert = function(){
    var args = this.pre_handle_insert_args(arguments);
    this.get_collection((err, collection) => {
        if(err) args.callback(err);
        else {
            if(Array.isArray(args.insert)) collection.insert(args.insert, args.options, (err, result) => {
                if(err) args.callback(err);
                else args.callback(null, result.ops);
            });
            else collection.insertOne(args.insert, args.options, (err, result) => {
                if(err) args.callback(err);
                else args.callback(null, result.ops);
            });
        }
    });
};

/**
 * update docs that match the query
 * @method
 * @param {object} query condition
 * @param {object} update payment
 * @param {object} [options=null] optional settings
 * @callback {err, command_exec_result}
 */
Collection.prototype.update = function(){
    var args = this.pre_handle_update_args(arguments);
    this.get_collection((err, collection) => {
        if(err) args.callback(err);
        else collection.updateMany(args.query, args.payment, args.options, args.callback);
    });
};

/**
 * delete docs that match the query
 * @method
 * @param {object} query condition
 * @param {object} [options=null] optional settings11
 * @callback {err, command_exec_result}
 */
Collection.prototype.delete = function(){
    var args = this.pre_handle_query_args(arguments);
    this.get_collection((err, collection) => {
        if(err) args.callback(err);
        else collection.deleteMany(args.query, args.options, args.callback);
    });
};

/**
 * fetch the first one doc that matchs the query
 * @method
 * @param {object} query condition
 * @param {object} [options=null] optional settings
 * @callback {err, doc}
 */
Collection.prototype.find_one = function(){
    var args = this.pre_handle_query_args(arguments);
    this.get_collection((err, collection) => {
        if(err) args.callback(err);
        else collection.findOne(args.query, args.options || {}, args.callback);
    });
};

/**
 * update the first one doc that matchs the query
 * @method
 * @param {object} query condition
 * @param {object} update payment
 * @param {object} [options=null] optional settings
 * @callback {err, exec_command_result}
 */
Collection.prototype.update_one = function(){
    var args = this.pre_handle_update_args(arguments);
    this.get_collection((err, collection) => {
        if(err) args.callback(err);
        else collection.findOneAndUpdate(args.query, args.payment, args.options || {}, (err, result) => {
            if(err) args.callback(err);
            else args.callback(null, result.value);
        });
    });
};

/**
 * delete the first one doc that matchs the query
 * @method
 * @param {object} query condition
 * @param {object} [options=null] optional settings
 * @callback {err, exec_command_result}
 */
Collection.prototype.delete_one = function(){
    var args = this.pre_handle_query_args(arguments);
    this.get_collection((err, collection) => {
        if(err) args.callback(err);
        else collection.deleteOne(args.query, args.options, args.callback);
    });
};

/**
 * create index if it doesn't exists
 * @method
 * @param {object} indexed field
 * @param {object} [options={backgroud: true}] optional settings
 * @callback {err}
 */
Collection.prototype.create_index = function(){
    if(arguments.length === 2){
        var fields = arguments[0];
        var options = {background: true};
        var callback = arguments[1];
    }else if(arguments.length === 3){
        var fields = arguments[0];
        var options = arguments[1];
        options.background |= true;
        var callback = arguments[2];
    }else{
        throw new Error('invalid');
    }
    this.get_collection((err, collection) => {
        if(err) callback(err);
        else collection.ensureIndex(fields, options, callback);
    });
};

/**
 * drop index
 * @method
 * @param {string} index name
 * @callback {err}
 */
Collection.prototype.drop_index = function(index_name, callback){
    this.get_collection((err, collection) => {
        if(err) callback(err);
        else collection.dropIndex(index_name, callback);
    });
};

module.exports = Collection;
