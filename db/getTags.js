module.exports = function getTags(obj){
  var content = obj.content.toLowerCase(),
    title = obj.title.toLowerCase(),
    tags = ["javascript", "developer", "designer", "engineer", "aws", "full stack", "ios",
      "rails", "python", "android", "nodejs", "react", "angular", ".net", "manager", "java"];
  return tags.filter(tag => {
    if(tag === "java"){
      content = content.replace(/javascript/g, "");
      title = title.replace(/javascript/g, "");
    }
    return content.indexOf(tag) > -1 || title.indexOf(tag) > -1;
  });
};
