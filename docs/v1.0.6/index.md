# Index

## create_index(fields, [options], callback)
Create index on a collection's fields

### Params
* fields `<Object>`
* [options] `<Object>` default background is true
* [callback] `<Function(err, index_name)>`

### Example
```js
var assert = require('assert');
my_collection.create_index({test:1}, function(err, index_name){
    assert.equal(null, err);
    assert.equal('_test_', index_name);
});
```

## drop_index(index_name, callback)
Drop index of collection

### Params
* index_name `<Object>`
* [callback] `<Function(err)>`

### Example
```js
var assert = require('assert');
my_collection.drop_index('_test_', function(err){
    assert.equal(null, err);
});
```

