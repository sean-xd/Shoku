var expect = require("chai").expect,
  stackoverflow = require("../../listings/stackoverflow");

describe("Stack Overflow", function(){
  var raw, parsed;
  before(function(done){
    this.timeout(0);
    stackoverflow.get(data => {
      raw = data;
      parsed = data.reduce(stackoverflow.parser, []);
      done();
    });
  });

  describe("Request to Stackoverflow XML", function(){
    it("should get jobs as an array", function(){
      expect(Array.isArray(raw)).to.be.true;
    });
    it("should be array of objects", function(){
      expect(raw[0]).to.be.a("object");
    });
    it("should have consistent properties", function(){
      expect(raw[0]).to.contain.all.keys("content", "pubDate", "title", "link");
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
