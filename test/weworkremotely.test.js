var expect = require("chai").expect,
  weworkremotely = require("../listings/weworkremotely");

describe("We Work Remotely", function(){
  var cache;
  before(function(done){
    this.timeout(0);
    weworkremotely.get(data => {cache = data; done();});
  });

  it("should get jobs as an RSS parsed array", function(){
    expect(Array.isArray(cache)).to.be.true;
    expect(cache[0]).to.have.property("pubDate");
  });

  it("should format jobs into array of objects", function(){
    var result = weworkremotely.parse(cache);
    expect(Array.isArray(result)).to.be.true;
    expect(result[0]).to.be.a("object");
    expect(result[0]).to.have.all.keys("company", "content", "date", "location", "source", "title", "url");
  });
});
