var expect = require("chai").expect,
  stackoverflow = require("../listings/stackoverflow");

describe("Stack Overflow", function(){
  var raw, parsed;
  before(function(done){
    this.timeout(0);
    stackoverflow.get(data => {
      raw = data;
      parsed = stackoverflow.parse(data);
      done();
    });
  });

  describe("Request to Stackoverflow XML", function(){
    it("should be an object", function(){
      expect(raw).to.be.a("object");
    });
    it("should have deep property feed.entries", function(){
      expect(raw).to.have.deep.property("feed.entries");
    });
    it("should contain array of entries", function(){
      expect(Array.isArray(raw.feed.entries)).to.be.true;
    });
  });

  describe("Parsing results of request", function(){
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
