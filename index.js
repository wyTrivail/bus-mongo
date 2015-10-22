var mongo = require('./lib/mongo');
var Collection = require('./lib/collection');


module.exports.init = function(){
    if(arguments.length === 2){
        var db_url = arguments[0];
        var callback = arguments[1];
    }else{
        var db_url = arguments[0];
        var opt = arguments[1];
        var callback = arguments[2];
    }
    mongo.init(db_url, opt, (err) => {
        if(err) callback(err);
        else callback(null, module.exports.db(null));
    });
};

module.exports.db = function(db_name){
    return {
        collection: (collection_name, options) => new Collection(db_name, collection_name, options),
        list_collections: function(){
            if(arguments.length === 1){
                var callback = arguments[0];
                var filter = {};
            }else{
                var filter = arguments[0];
                var callback = arguments[1];
            }
            mongo.list_collections(db_name, filter, callback);
        }
    };
};

