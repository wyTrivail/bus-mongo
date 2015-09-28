# BUS-MONGO CRUD
## insert_one(document, [options], [callback])
Inserts a single document into MongoDB.

### Params
* docments `<Object>`
* [options] `<Object>` [same as mongodb-native](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#insertOne)
* [callback] `<Function(err, result)>` [same as mongodb-native](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#insertOne)

### Example
```js
var assert = require('assert');
my_collection.insert_one({test:1}, function(err, result){
    assert.equal(null, err);
    assert.equal(1, result.insertedCount);
});
```

## insert(documents, [options], [callback])
Insert documents into MongoDB.

### Params
* documents `<Object>`
* [options] `<Object>` [same as mongodb-native](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#insertMany)
* [callback] `<Function(err, result)>` [same as mongdb-native](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#insertMany)

### Example
```js
var assert = require('assert');
my_collection.insert([{test:1}, {test:2}], {w:1}], function(err, result){
    assert.equal(null, err);
    assert.equal(2, result.insertedCount);
});
```

## find_one(query, [options], [callback])
Fetches the first document that matches the query.

### params
* query `<Object>` [mongodb query object](http://docs.mongodb.org/v2.4/tutorial/query-documents/)
* [options] `<Object>` [same as mongodb-native](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#findOne)
* [callback] `<Function(err, result)>` [same as mongodb-native](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#findOne)

### Example
```js
var assert = require('assert')
my_collection.insert([{test:1},{test:2}], function(err){
    assert.equal(null, err);
    my_collection.find_one({test:1}, function(err, result){
        assert.equal(null, err);
        assert.equal({test:1}, result);
    });
});
```

## find(query, [options])
Creates a cursor for a query that can be used to iterate over results from MongoDB.

### params
* query `<Object>` [mongodb query object](http://docs.mongodb.org/v2.4/tutorial/query-documents/)
* [options] `<Object>` [same as mongodb-native](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#find) 

### return
* <Object> a cursor that can iterate over results

### Example
```js
var assert = require('assert');
my_collection.insert([{test:1}, {test:1, t:2}], function(err){
    assert(null, err);
    var cursor = my_collection.query({test:1});
    cursor.toArray(function(items){
        assert(2, items.length);
    });
});
```

## update_one(query, payment, [options], [callback])

