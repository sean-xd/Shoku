var expect = require("chai").expect,
  updateListings = require("../../listings");

describe("Update Listings", function(){
  var db = {}, called = false;
  before(function(done){
    this.timeout(0);
    updateListings(db, done);
  });

  describe("Database Result", function(){
    it("should be an object", function(){
      expect(db).to.be.a("object");
    });
    it("should have ttl and companies properties", function(){
      expect(db).to.have.all.keys("ttl", "companies");
    });
    it("should have array of jobs", function(){
      expect(db.companies).to.have.length.above(10);
    });
    it("should contain properly formatted job objects", function(){
      expect(db.companies[0].jobs[0]).to.have.all.keys("company", "content", "date", "location", "source", "tags", "title", "url");
    });
  });
});
