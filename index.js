var mongo = require('./lib/mongo');
var Collection = require('./lib/collection');


module.exports.init = function(db_url, opt){
    mongo.init(db_url, opt);
};

module.exports.db = function(db_name){
    return {
        collection: (collection_name, options) => new Collection(db_name, collection_name, options)
    };
};

module.exports.collection = function(collection_name, opt){
    return new Collection(null, collection_name, opt);
};
