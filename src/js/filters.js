app.filter("dateFilter", () => input => {
  var timeSince = Date.now() - input,
    one = {
      second: 1000,
      minute: 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000
    },
    type = timeSince > one.day ? "day" : timeSince > one.hour ? "hour" : timeSince > one.minute ? "minute" : false;
  if(!type) return "just now";
  var num = Math.floor(timeSince / one[type]),
    type = num === 1 ? type : type + "s";
  return `${num} ${type} ago`;
});

app.filter('trust', $sce => val => $sce.trustAs("html", val.replace(/<br ?\/?>/g, "")));

app.filter("upperFirst", () => input => input[0].toUpperCase() + input.substr(1));
