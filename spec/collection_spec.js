describe('Collection', function(){
    var db_url = "mongodb://localhost:27017/test";
    var bus_mongo = require('../index.js');
    bus_mongo.init(db_url);
    var collection = bus_mongo.collection('test');

    beforeEach(function(done){
        collection.insert([{test:1},{test:2},{test:1},{test:1},{test:2}], function(err){
            expect(err).toBe(null);
            done();
        });
    });

    afterEach(function(done){
        collection.drop(function(err){
            expect(err).toBe(null);
            done();
        });
    });

    it("should be able to insert one document", function(done){
        collection.insert({test:1}, function(err){
            expect(err).toBe(null);
            done();
        });
    });

    it("should be able to find one document", function(done){
        collection.find_one({test:1}, function(err, result){
            expect(result.test).toBe(1);
            done();
        });
    });

    it("should be able to update one document", function(done){
        collection.update_one({test:1},{$set:{test:2}},function(err, r){
            expect(err).toBe(null);
            done();
        });
    });

    it("should be able to delete one document", function(done){
        collection.delete_one({test:2}, function(err, r){
            expect(r.result.n).toBe(1);
            done();
        });
    });
        
    it("should be able to insert docs", function(done){
        collection.insert([{test:4},{test:4}], function(err){
            expect(err).toBe(null);
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

});
