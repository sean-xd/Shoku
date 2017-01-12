var expect = require("chai").expect,
  dribbble = require("../../listings/dribbble");

describe("Dribbble", function(){
  var raw, parsed;
  before(function(done){
    this.timeout(0);
    dribbble.get(data => {
      raw = data;
      parsed = dribbble.parse(data);
      done();
    });
  });

  describe("Request to Dribbble RSS", function(){
    it("should return an object", function(){
      expect(raw).to.be.a("object");
    });
    it("should have deep property feed.entries", function(){
      expect(raw).to.have.property("feed");
      expect(raw.feed).to.have.property("entries");
    });
    it("should contain array of jobs in entries", function(){
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
