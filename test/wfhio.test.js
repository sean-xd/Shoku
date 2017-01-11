var expect = require("chai").expect,
  wfhio = require("../listings/wfhio");

describe("Wfh.io", function(){
  var cache;
  before(function(done){
    this.timeout(0);
    wfhio.get(data => {cache = data; done();});
  });

  it("should get jobs as an RSS parsed array", function(){
    expect(Array.isArray(cache)).to.be.true;
  });

  it("should format jobs into array of objects", function(){
    var result = wfhio.parse(cache);
    expect(Array.isArray(result)).to.be.true;
    expect(result[0]).to.be.a("object");
    expect(result[0]).to.have.all.keys("company", "content", "date", "location", "source", "title", "url");
  });
});
