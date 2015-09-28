var monkey_mongo = require('./lib/app_db');


module.exports.init = function(db_url){
    monkey_mongo.init(db_url);
};

module.exports.get_db = function(db_name){
    return monkey_mongo.db(db_name);
};
