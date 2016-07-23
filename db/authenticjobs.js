var request = require("request"),
  getTags = require("./getTags.js");

module.exports = function authenticjobs(url, magic){
	request(url, (err, res, body) => {
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
