# BUS-MONGO
BUS-MONGO is a mongodb client, it is more easy-to-use than the mongodb-native, and more flexable than mongboose.

## Documentation
[BUS-MONGO documents](https://github.com/wyTrivail/bus-mongo/tree/master/docs)

## Installation
```sh
$ npm install bus-mongo
```

## Stability
current stable branch is [master](https://github.com/wyTrivail/bus-mongo/tree/master).

## Overview
### init
firstly ,we need to connect mongodb with the url.

```js
var bus_mongo = require('bus-mongo');
bus_mongo.init('mongodb://username:password@localhost:port/my_db');
```

if you have replicated set, just add in url

```js
var bus_mongo = require('bus-mongo');
bus_mongo.init('mongodb://username:password@master-server:port, mongodb://username:password@slave-server:port/my-db-name');
```

### get db
we can access the db object after init bus-mongo

```js
var my_db = bus_mongo.db('my-db-name');
```

### get collection
we can access the collection of db object

```js
var my_collection = my_db.collection('collection-name');
```

### crud
we can do all the crud operations of collection, for example:

```js
my_collection.insert_one({test:1}, function(err){
    if(err) console.log(err);
    else console.log('success insert!');
});
```

more operations's docs in [here](https://github.com/wyTrivail/bus-mongo/tree/master/docs)
