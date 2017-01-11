var expect = require("chai").expect,
  indeed = require("../listings/indeed");

describe("Indeed", function(){
  var cache;
  before(function(done){
    this.timeout(0);
    indeed.get(data => {cache = data; done();});
  });

  it("should get jobs as a JSON string", function(){
    expect(cache).to.be.a("object");
    expect(cache).to.have.deep.property("response.results[0].result");
    expect(Array.isArray(cache.response.results[0].result)).to.be.true;
  });

  it("should format jobs into array of objects", function(){
    var result = indeed.parse(cache);
    expect(Array.isArray(result)).to.be.true;
    expect(result[0]).to.be.a("object");
    expect(result[0]).to.have.all.keys("company", "content", "date", "location", "source", "title", "url");
  });
});
