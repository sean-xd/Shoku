var expect = require("chai").expect,
  coroflot = require("../listings/coroflot");

describe("Coroflot", function(){
  var cache;
  before(function(done){
    this.timeout(0);
    coroflot.get(data => {cache = data; done();});
  });

  it("should get jobs as array of objects from parsing XML", function(){
    expect(Array.isArray(cache)).to.be.true;
    expect(cache[0]).to.be.a("object");
    expect(cache[0]).to.have.property("content");
  });

  it("should format jobs into array of objects", function(){
    var result = coroflot.parse(cache);
    expect(Array.isArray(result)).to.be.true;
    expect(result[0]).to.be.a("object");
    expect(result[0]).to.have.all.keys("company", "content", "date", "location", "source", "title", "url");
  });
});
