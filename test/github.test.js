var expect = require("chai").expect,
  github = require("../listings/github");

describe("Github", function(){
  var raw, parsed;
  before(function(done){
    this.timeout(0);
    github.get(data => {
      raw = data;
      parsed = github.parse(data);
      done();
    });
  });

  describe("Request to Github JSON", function(){
    it("should be a string", function(){
      expect(raw).to.be.a("string");
    });
    it("should be a valid JSON array", function(){
      expect(Array.isArray(JSON.parse(raw))).to.be.true;
    });
    it("should contain 50 entries", function(){
      expect(JSON.parse(raw)).to.have.lengthOf(50);
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
