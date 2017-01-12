var expect = require("chai").expect,
  indeed = require("../listings/indeed");

xdescribe("Indeed", function(){
  var raw, parsed;
  before(function(done){
    this.timeout(0);
    indeed.get(data => {
      raw = data;
      parsed = indeed.parse(data);
      done();
    });
  });

  describe("Request to Indeed API", function(){
    it("should be an object", function(){
      expect(raw).to.be.a("object");
    });
    it("should have a deep result property", function(){
      expect(raw).to.have.deep.property("response.results[0].result");
    });
    it("should contain array in result", function(){
      expect(Array.isArray(raw.response.results[0].result)).to.be.true;
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
