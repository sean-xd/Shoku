var expect = require("chai").expect,
  authentic = require("../listings/authentic");

describe("Authentic Jobs", function(){
  var cache;
  before(function(done){
    this.timeout(0);
    authentic.get(data => {cache = data; done();});
  });

  it("should get jobs as a JSON string", function(){
    var obj = JSON.parse(cache);
    expect(cache).to.be.a("string");
    expect(obj).to.be.a("object");
    expect(obj).to.have.property("listings");
  });

  it("should format jobs into array of objects", function(){
    var result = authentic.parse(cache);
    expect(Array.isArray(result)).to.be.true;
    expect(result[0]).to.be.a("object");
    expect(result[0]).to.have.all.keys("company", "content", "date", "location", "source", "title", "url");
  });
});
