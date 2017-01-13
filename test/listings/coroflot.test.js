var expect = require("chai").expect,
  coroflot = require("../../listings/coroflot");

describe("Coroflot", function(){
  var raw, parsed;
  before(function(done){
    this.timeout(0);
    coroflot.get(data => {
      raw = data;
      parsed = data.reduce(coroflot.parser, []);
      done();
    });
  });

  describe("Request to Coroflot Feedburner XML", function(){
    it("should get jobs as an array", function(){
      expect(Array.isArray(raw)).to.be.true;
    });
    it("should be array of objects", function(){
      expect(raw[0]).to.be.a("object");
    });
    it("should have consistent properties", function(){
      expect(raw[0]).to.contain.all.keys("content", "pubDate", "title", "contentSnippet", "guid");
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
