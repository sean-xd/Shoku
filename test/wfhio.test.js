var expect = require("chai").expect,
  wfhio = require("../listings/wfhio");

describe("Wfh.io", function(){
  var raw, parsed;
  before(function(done){
    this.timeout(0);
    wfhio.get(data => {
      raw = data;
      parsed = wfhio.parse(data);
      done();
    });
  });

  describe("Request to Wfh.io RSS", function(){
    it("should be an array", function(){
      expect(Array.isArray(raw)).to.be.true;
    });
    it("should contain job objects", function(){
      expect(raw[0]).to.be.a("object");
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
