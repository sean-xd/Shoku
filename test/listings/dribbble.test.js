var expect = require("chai").expect,
  dribbble = require("../../listings/dribbble");

describe("Dribbble", function(){
  var raw, parsed;
  before(function(done){
    this.timeout(0);
    dribbble.get(data => {
      raw = data;
      parsed = data.reduce(dribbble.parser, []);
      done();
    });
  });

  describe("Request to Dribbble RSS", function(){
    it("should get jobs as an array", function(){
      expect(Array.isArray(raw)).to.be.true;
    });
    it("should be array of objects", function(){
      expect(raw[0]).to.be.a("object");
    });
    it("should have consistent properties", function(){
      expect(raw[0]).to.contain.all.keys("title", "pubDate", "link");
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
