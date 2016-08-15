var request = require("request"),
  getTags = require(__dirname + "/getTags.js"),
  apikey = process.env.AUTHENTIC || require("./apikeys").authenticjobs;

module.exports = function authenticjobs(magic){
	request(`https://authenticjobs.com/api/?api_key=${apikey}&method=aj.jobs.search&format=json&perpage=10`, (err, res, body) => {
		var result = JSON.parse(body).listings.listing.map(e => {
			var date = new Date(e.post_date).getTime(),
				title = e.title.split(" @")[0] || e.title,
				company = e.company.name,
				content = e.description,
				url = e.url,
				source = "authenticjobs",
				location = e.telecommuting ? "Remote" : e.company.location.name,
				tags = getTags({title, content});
			return {date, title, company, content, url, source, location, tags};
		});
		magic(result);
	});
};
