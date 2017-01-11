var expect = require("chai").expect,
  dribbble = require("../listings/dribbble");

describe("Dribbble", function(){
  var cache;
  before(function(done){
    this.timeout(0);
    dribbble.get(data => {cache = data; done();});
  });

  it("should get jobs as an XML parsed object", function(){
    expect(cache).to.be.a("object");
    expect(cache).to.have.property("feed");
    expect(cache.feed).to.have.property("entries");
    expect(Array.isArray(cache.feed.entries)).to.be.true;
  });

  it("should format jobs into array of objects", function(){
    var result = dribbble.parse(cache);
    expect(Array.isArray(result)).to.be.true;
    expect(result[0]).to.be.a("object");
    expect(result[0]).to.have.all.keys("company", "content", "date", "location", "source", "title", "url");
  });
});
