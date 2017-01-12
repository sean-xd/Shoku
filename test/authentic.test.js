var expect = require("chai").expect,
  authentic = require("../listings/authentic");

describe("Authentic Jobs", function(){
  var raw, parsed;
  before(function(done){
    this.timeout(0);
    authentic.get(data => {
      raw = data;
      parsed = authentic.parse(data);
      done();
    });
  });

  describe("Request to Authentic API", function(){
    it("should get jobs as a string", function(){
      expect(raw).to.be.a("string");
    });
    it("should be string of JSON", function(){
      expect(JSON.parse(raw)).to.be.a("object");
    });
    it("should have listings", function(){
      expect(JSON.parse(raw)).to.have.property("listings");
    });
  });

  describe("Parsing Authentic Jobs JSON", function(){
    it("should be an array", function(){
      expect(Array.isArray(parsed)).to.be.true;
    });
    it("should contain job objects", function(){
      expect(parsed[0]).to.be.a("object");
    });
    it("should have jobs with consistent properties", function(){
      expect(parsed[0]).to.have.all.keys("company", "content", "date", "location", "source", "title", "url");
    });
  });
});
