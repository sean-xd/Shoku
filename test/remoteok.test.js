var expect = require("chai").expect,
  remoteok = require("../listings/remoteok");

xdescribe("Remoteok", function(){
  var raw, parsed;
  before(function(done){
    this.timeout(0);
    remoteok.get(data => {
      raw = data;
      parsed = remoteok.parse(data);
      done();
    });
  });

  describe("Request to Remoteok JSON", function(){
    it("should be a string", function(){
      expect(raw).to.be.a("string");
    });
    it("should be a valid JSON array", function(){
      expect(Array.isArray(JSON.parse(raw))).to.be.true;
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
