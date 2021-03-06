describe('Collection', function(){
    var db_url = "mongodb://admin:123456@localhost:27017/admin";
    var bus_mongo = require('../index.js');
    var collection;
    var db;
    beforeEach(function(done){
        bus_mongo.init(db_url, (err, new_db) => {
            expect(err).toBe(null);
            db = new_db;
            collection = db.collection('test');
            collection.insert([{test:1},{test:2},{test:1},{test:1},{test:2}], function(err){
                expect(err).toBe(null);
                done();
            });
        });
    });

    afterEach(function(done){
        collection.drop(function(err){
            expect(err).toBe(null);
            done();
        });
    });

    it("should be able to insert one document", function(done){
        collection.insert({test:1}, function(err, result){
            expect(err).toBe(null);
            expect(result[0].test).toBe(1);
            console.log(result);
            done();
        });
    });

    it("should be able to find one document", function(done){
        collection.find_one({test:1}, function(err, result){
            expect(err).toBe(null);
            //expect(result.test).toBe(1);
            done();
        });
    });

    it("should be able to update one document", function(done){
        collection.update_one({test:1},{$set:{test:2}}, {returnOriginal: false}, function(err, r){
            expect(err).toBe(null);
            expect(r.test).toBe(2);
            console.log(r);
            done();
        });
    });

    it("should be able to delete one document", function(done){
        collection.delete_one({test:2}, function(err, r){
            expect(err).toBe(null);
            expect(r.result.n).toBe(1);
            done();
        });
    });
        
    it("should be able to insert docs", function(done){
        collection.insert([{test:4},{test:4}], function(err, result){
            expect(err).toBe(null);
            expect(result.length).toBe(2);
            done();
        });
    });

    it("should be able to find docs", function(done){
        collection.find({test:1}, function(err, docs){
            expect(docs.length).toBe(3);
            done();
        });
    });

    it("should be able to update docs", function(done){
        collection.update({test:1},{$set:{test:5}}, function(err, r){
            expect(err).toBe(null);
            expect(r.result.n).toBe(3);
            done();
        });
    });

    it("should be able to delete docs", function(done){
        collection.delete({test:2}, function(err,r){
            expect(r.result.n).toBe(2);
            done();
        });
    });
    
    it("should be able to count docs", function(done){
        collection.count({test:1}, function(err, count){
            expect(count).toBe(3);
            done();
        });
    });

    it("should be able to create index", function(done){
        collection.create_index({test:1}, function(err, index_name){
            expect(err).toBe(null);
            collection.drop_index(index_name, function(err){
                expect(err).toBe(null);
                done();
            });
        });
    });

    it("should be able to list collections' info", function(done){
        db.list_collections(function(err, collections){
            expect(err).toBe(null);
            expect(collections.length).toBe(4);
            done();
        });
    });
});
