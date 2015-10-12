# BUS-MONGO CRUD

## insert(documents, [options], [callback])
Insert documents into MongoDB.

### Params
* documents `<Object | Array>`
* [options] `<Object>` [same as mongodb-native](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#insertMany)
* [callback] `<Function(err, result)>` [same as mongdb-native](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#insertMany)

### Example
```js
var assert = require('assert');
my_collection.insert({test:1}, function(err, result){
    assert.equal(null, err);
    assert.equal(1, result[0].test);
});
//also can insert multi docs!
my_collection.insert([{test:1}, {test:2}], {w:1}], function(err, result){
    assert.equal(null, err);
    assert.equal(2, result.length);
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
Fetch the docs match the query.

### Params
* query `<Object>` [mongodb query object](http://docs.mongodb.org/v2.4/tutorial/query-documents/)
* [options] `<Object>` [same as mongodb-native](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#find) 
* [callback] `<Function(err, docs)>`

### Example
```js
var assert = require('assert');
my_collection.insert([{test:1}, {test:1, t:2}], function(err){
    assert(null, err);
    my_collection.query({test:1}, function(err, docs){
        assert(null, err);
        assert(2, docs.length);
    });
});
```

## count(query, [options], [callback])
Get the num of docs that match the query.

### Params
* query `<Object>` [mongodb query object](http://docs.mongodb.org/v2.4/tutorial/query-documents/)
* [options] `<Object>` [same as mongodb-native](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#find)
* [callback] `<Function(err, count)>`

### Example
```js
var assert = require('assert');
my_collection.insert([{test:1}, {test:1, t:2}], function(err){
    assert(null, err);
    my_collection.count({test:1}, function(err, count){
        assert(null, err);
        assert(2, count);
    });
});
```

## update_one(query, payment, [options], [callback])
Update a single document on MongoDB.

### Params
* query `<Object>` [mongodb query object](http://docs.mongodb.org/v2.4/tutorial/query-documents/)
* payment `<Object>` [mongodb update object](http://docs.mongodb.org/v2.4/reference/operator/update/)
* [options] `<Object>` [same as mongodb-native](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#updateOne)
* [callback] `<Function(err, result)>` [same as mongodb-native](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#updateOne)

### Example
```js
var assert = require('assert');
my_collection.insert([{test:1}, {test:2}], function(err){
    assert.equal(null, err);
    my_collection.update_one({test:1}, {$set:{test:3}}, {returnOriginal: false},function(err, r){
        assert(0, err);
        assert(3, r.test);
    });
});
```

## update(query, payment, [options], [callback])
Update multiple documents on MongoDB

### Params
* query `<Object>` [mongodb query object](http://docs.mongodb.org/v2.4/tutorial/query-documents/)
* payment `<Object>` [mongodb update object](http://docs.mongodb.org/v2.4/reference/operator/update/)
* [options] `<Object>` [same as mongodb-native](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#updateMany)
* [callback] `<Function(err, result)>` [same as mongodb-native](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#updateMany)

### Example
```js
var assert = require('assert');
my_collection.insert([{test:1}, {test:2}, {test:1, ok:2}], function(err){
    assert.equal(null, err);
    my_collection.update({test:1}, {$set:{test:3}}, function(err, r){
        assert(0, err);
        assert(2, r.result.n);
    });
});
```

## delete_one(query, [options], [callback])
Delete a document on MongoDB.

### Params
* query `<Object>` [mongodb query object](http://docs.mongodb.org/v2.4/tutorial/query-documents/)
* [options] `<Object>` [same as mongodb-native](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#deleteOne)
* [callback] `<Function(err, result)>` [same as mongodb-native](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#deleteOne)

### Example
```js
var assert = require('assert');
my_collection.insert([{test:1}, {test:2},{test:1,ok:2}], function(err){
    assert.equal(null, err);
    my_collection.delete_one({test:1}, function(err, r){
        assert(null, err);
        assert(1, r.result.n);
    });
});
```

## delete(query, [options], [callback])
Delete multiple documents on MongoDB

### Params
* query `<Object>` [mongodb query object](http://docs.mongodb.org/v2.4/tutorial/query-documents/)
* [options] `<Object>` [same as mongodb-native](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#deleteMany)
* [callback] `<Function(err, result)>` [same as mongodb-native](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#deleteMany)

### Example
```js
var assert = require('assert');
my_collection.insert([{test:1}, {test:2},{test:1,ok:2}], function(err){
    assert.equal(null, err);
    my_collection.delete({test:1}, function(err, r){
        assert(null, err);
        assert(2, r.result.n);
    });
});
```


