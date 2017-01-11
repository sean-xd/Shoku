var expect = require("chai").expect,
  remoteok = require("../listings/remoteok");

describe("Remoteok", function(){
  var cache;
  before(function(done){
    this.timeout(0);
    remoteok.get(data => {cache = data; done();});
  });

  it("should get jobs as a JSON array", function(){
    var arr = JSON.parse(cache);
    expect(cache).to.be.a("string");
    expect(Array.isArray(arr)).to.be.true;
  });

  it("should format jobs into array of objects", function(){
    var result = remoteok.parse(cache);
    expect(Array.isArray(result)).to.be.true;
    expect(result[0]).to.be.a("object");
    expect(result[0]).to.have.all.keys("company", "content", "date", /*"location",*/ "source", "title", "url");
  });
});
