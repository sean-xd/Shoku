var expect = require("chai").expect,
  github = require("../listings/github");

describe("Github", function(){
  var cache;
  before(function(done){
    this.timeout(0);
    github.get(data => {cache = data; done();});
  });

  it("should get jobs as a JSON array", function(){
    var arr = JSON.parse(cache);
    expect(cache).to.be.a("string");
    expect(Array.isArray(arr)).to.be.true;
    expect(arr).to.have.lengthOf(50);
  });

  it("should format jobs into array of objects", function(){
    var result = github.parse(cache);
    expect(Array.isArray(result)).to.be.true;
    expect(result[0]).to.be.a("object");
    expect(result[0]).to.have.all.keys("company", "content", "date", /*"location",*/ "source", "title", "url");
  });
});
