var mongo = require('./lib/mongo');
var Collection = require('./lib/collection');


module.exports.init = function(db_url, opt){
    mongo.init(db_url, opt);
    return module.exports.db(null);
};

module.exports.db = function(db_name){
    return {
        collection: (collection_name, options) => new Collection(db_name, collection_name, options),
        list_collections: () => {
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

