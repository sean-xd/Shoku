var fs = require("fs"),
  request = require("request"),
  parseURL = require("rss-parser").parseURL,
  parseString = require("xml2js").parseString,
  parseRss = require("parse-rss"),
  cheerio = require("cheerio"),
  Magic = (num, cb, arr) => data => (arr.length === num - 1) ? cb(arr.concat([data])) : arr.push(data),
  sources = [
    "wfhio", "weworkremotely", "remoteok", "coroflot",
    "stackoverflow", "github", "smashingjobs", "dribbble",
    "jobspresso", "themuse", "indeed", "authentic"
  ],
  format = {};

format.authentic = magic => {
  var apikey = process.env.AUTHENTIC || require("./apikeys").authentic;
	request(`https://authenticjobs.com/api/?api_key=${apikey}&method=aj.jobs.search&format=json&perpage=10`, (err, res, body) => {
		var result = JSON.parse(body).listings.listing.map(e => {
      if(!e.company) return false;
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

format.coroflot = magic => {
  parseURL("http://feeds.feedburner.com/coroflot/AllJobs?format=xml", (err, data) => {
    if(!data || !data.feed || !data.feed.entries) return magic([]);
    var results = data.feed.entries;
      inception = Magic(data.feed.entries.length, magic, []);
    data.feed.entries.map(e => {
      var date = new Date(e.pubDate).getTime(),
        companyAndTitle = e.title.match(/(.+) is seeking an? (.+)/),
        title = companyAndTitle[2],
        company = companyAndTitle[1],
        location = e.contentSnippet,
        url = e.guid,
        source = "coroflot";
      request(url, (err2, response, body) => {
        var $ = cheerio.load(body),
          content = $("#job_description_public p").html();
        if(!content) return inception(false);
        var tags = getTags({title, content});
        inception({date, title, company, location, content, url, source, tags});
      });
    });
  });
};

format.dribbble = magic => {
  parseURL("https://dribbble.com/jobs.rss", (err, data) => {
    if(!data || !data.feed || !data.feed.entries) return magic([]);
    var result = data.feed.entries.map(e => {
      var date = new Date(e.pubDate).getTime(),
        titleReg = e.title.match(/(.+) is hiring an? (.+)/),
        delimiter = titleReg[2].indexOf(" in ") > -1 ? " in " : " anywhere",
        titleSplit = titleReg[2].split(delimiter),
        title = titleSplit[0],
        company = titleReg[1],
        location = titleSplit.length > 2 ? titleSplit.slice(1).join(" in ") : titleSplit[1],
        content = e.title,
        url = e.link,
        source = "dribbble",
        tags = getTags({title, content});
      return {date, title, company, content, url, source, location, tags};
    });
    magic(result);
  });
};

format.github = magic => {
  request("https://jobs.github.com/positions.json", (e, r, body) => {
    var result = JSON.parse(body).map(e => {
      var date = new Date(e.created_at).getTime(),
        title = e.title,
        company = e.company,
        content = e.description.replace(/https:\/+w+\.applytracking\.com\/track\.aspx\/[A-z0-9]+/g, ""),
        url = e.url,
        source = "github",
        tags = getTags({title, content});
      return {date, title, company, content, url, source, tags};
    });
    result = result.filter(e => e.date < Date.now());
    magic(result);
  });
};

format.indeed = magic => {
  var apikey = process.env.INDEED || require("./apikeys").indeed;
  request(`http://api.indeed.com/ads/apisearch?publisher=${apikey}&v=2&q=developer&sort=date`, (err1, res, body) => {
    parseString(body, (err2, data) => {
      var result = data.response.results[0].result.map(e => {
        var date = new Date(e.date[0]).getTime(),
          title = e.jobtitle[0],
          company = e.company[0],
          content = e.snippet[0],
          location = e.formattedLocationFull[0],
          url = e.url[0],
          source = "indeed",
          tags = getTags({title, content});
        return {date, title, company, content, location, url, source, tags};
      });
      magic(result);
    });
  });
};

format.jobspresso = magic => {
  parseRss("https://jobspresso.co/?feed=job_feed&job_types=designer%2Cdeveloper%2Cmarketing%2Cproject-mgmt%2Csupport%2Csys-admin%2Cvarious%2Cwriting&search_location&job_categories&search_keywords", (err, data) => {
    if(!data) return magic([]);
    data = data.map(e => {
      var date = new Date(e.pubDate).getTime(),
        title = e.title,
        company = e["job_listing:company"]["#"],
        location = "Remote",
        content = e.description,
        url = e.link,
        source = "jobspresso",
        tags = getTags({title, content});
      return {date, title, company, location, content, url, source, tags};
    });
    magic(data);
  });
};

format.remoteok = magic => {
  request("https://remoteok.io/index.json", (e, r, body) => {
    var result = JSON.parse(body).map(obj => {
      var date = new Date(obj.date).getTime(),
        title = obj.position,
        company = obj.company[0] ? obj.company[0].toUpperCase() + obj.company.slice(1) : "?",
        content = obj.description,
        urlSplit = obj.url.split("/");
      urlSplit[urlSplit.length - 2] = "l";
      var url = urlSplit.join("/"),
        source = "remoteok",
        tags = getTags({title, content});
      if(company.length > 50) company = company.slice(0,50) + "...";
      if(!title || !company || !content) return false;
      return {date, title, company, content, url, source, tags};
    });
    result = result.filter(e => e);
    result = result.filter(e => e.date < Date.now());
    magic(result);
  });
};

format.smashingjobs = magic => {
  parseURL("http://jobs.smashingmagazine.com/rss/all/all", (err, data) => {
    if(!data || !data.feed || !data.feed.entries) return magic([]);
    var result = data.feed.entries.map(e => {
      var date = new Date(e.pubDate).getTime(),
        titleSplit = e.title.split(" - "),
        title = titleSplit[0].trim(),
        company = titleSplit[1],
        location = titleSplit[2],
        content = e.content,
        url = e.link,
        source = "smashingjobs",
        tags = getTags({title, content});
      return {date, title, company, content, url, source, tags};
    });
    result = result.filter(e => !/ä|ö|ü|Ü|ß|ntwick/.test(e.title + e.company + e.content));
    magic(result);
  });
};

format.stackoverflow = magic => {
  parseURL("https://stackoverflow.com/jobs/feed", (err, data) => {
    if(!data || !data.feed || !data.feed.entries) return magic([]);
    var result = data.feed.entries.map(e => {
      var loc = !!e.title.split(" at ")[1].split(" (")[1],
        date = new Date(e.pubDate).getTime(),
        titleSplit = e.title.split(" at "),
        title = titleSplit[0].split(" (")[0],
        titleSplit2 = titleSplit[1].split(" ("),
        company = titleSplit2[0] || "?",
        location = loc ? titleSplit2[1].slice(0,-1) : e.location || "N/A",
        content = e.content,
        url = e.link,
        source = "stackoverflow",
        tags = getTags({title, content});
      return {date, title, company, content, url, source, location, tags};
    });
    result = result.filter(e => !/ä|ö|ü|Ü|ß|ntwick/.test(e.title + e.company + e.content));
    magic(result);
  });
};

format.themuse = magic => {
  var inception = Magic(5, data => magic(data.reduce((arr, e) => arr.concat(e))), []),
    apikey = process.env.THEMUSE || require("./apikeys").themuse;
  ["1","2","3","4","5"].forEach(i => {
    request(`https://api-v2.themuse.com/jobs?apikey=${apikey}&page=${i}`, (err, res, body) => {
      if(!body || !JSON.parse(body).results) return inception([]);
      var data = JSON.parse(body).results.map(e => {
        var date = new Date(e.publication_date).getTime(),
          title = e.name,
          company = e.company.name,
          content = e.contents,
          location = e.locations.reduce((locs, loc) => locs += `${loc.name} `, "").slice(0,-1),
          url = e.refs.landing_page,
          source = "the muse",
          tags = getTags({title, content});
        return {date, title, company, content, location, url, source, tags};
      });
      inception(data);
    });
  });
};

format.weworkremotely = magic => {
  var urls = ["1-design", "2-programming"],
    inception = Magic(urls.length, data => magic(data.reduce((arr, e) => arr.concat(e), [])), []);
  urls.forEach(path => {
    parseURL(`https://weworkremotely.com/categories/${path}/jobs.rss`, (err, data) => {
      if(!data || !data.feed || !data.feed.entries) return inception([]);
      var result = data.feed.entries.map(e => {
        var date = new Date(e.pubDate).getTime(),
          title = e.title.split(": ")[1],
          company = e.title.split(": ")[0],
          content = e.content,
          url = e.link,
          source = "weworkremotely",
          tags = getTags({title, content});
        if(company.length > 50) company = company.slice(0,50) + "...";
        return {date, title, company, content, url, source, tags};
      });
      inception(result);
    });
  });
};

format.wfhio = magic => {
  var urls = ["1-remote-software-development", "4-remote-design", "6-remote-devops"],
    inception = Magic(urls.length, data => magic(data.reduce((arr, e) => arr.concat(e), [])), []);
  urls.forEach(path => {
    request(`https://www.wfh.io/categories/${path}/jobs.atom`, (err1, response, body) => {
      parseString(body, (err2, result) => {
        if(!result.feed) inception(false);
        result = result.feed.entry.map(e => {
          var date = new Date(e.updated[0]).getTime(),
            url = e.link[0]["$"].href,
            title = e.title[0],
            titleSplit = title.toLowerCase().split(" "),
            company = url.match(/\w+\/\d+-(.+)/)[1].replace("(", "").replace(")", "").split("-")
              .reduce((arr, str) => {
                var index = titleSplit.indexOf(str), isTitle = index > -1;
                if(isTitle) titleSplit.splice(index, 1);
                return isTitle ? arr : arr.concat([str]);
              }, [])
              .map(str => str[0].toUpperCase() + str.slice(1))
              .join(" "),
            content = e.content[0]["_"],
            source = "wfhio",
            tags = getTags({title, content});
          return {date, title, company, content, url, source, tags};
        });
        inception(result);
      });
    });
  });
};

function getTags(obj){
  var content = obj.content.toLowerCase(),
    title = obj.title.toLowerCase(),
    tags = ["javascript", "developer", "designer", "engineer", "aws", "full stack", "ios",
      "rails", "python", "android", "node", "react", "angular", ".net", "manager", "java"];
  return tags.filter(tag => {
    if(tag === "java"){
      content = content.replace(/javascript/g, "");
      title = title.replace(/javascript/g, "");
    }
    return content.indexOf(tag) > -1 || title.indexOf(tag) > -1;
  });
}

function getJobs(db){
  db.ttl = Date.now() + (1000 * 60 * 15);
  var pushJobs = Magic(sources.length, data => {
    var hash = {};
    db.jobs = data.reduce((arr, jobs) => {
      jobs.forEach(job => {
        var noJob = !job || job.company.length < 2,
          olderThan30 = Date.now() - job.date > 1000 * 60 * 60 * 24 * 30,
          jobHash = (job.title || "").replace(/[\- ]/g, "") + job.company;
        if(noJob || olderThan30 || hash[jobHash]) return;
        hash[jobHash] = true;
        var company = arr.find(e => e.name === job.company) || {name: job.company, jobs: [], latest: 0};
        if(!company.latest) arr.push(company);
        if(job.date > company.latest) company.latest = job.date;
        company.jobs.push(job);
        if(company.jobs.length > 1) company.jobs.sort((a, b) => b.date - a.date);
      });
      return arr.sort((a, b) => b.latest - a.latest);
    }, []);
    fs.writeFile(__dirname + "/db.json", JSON.stringify(db));
  }, []);
  sources.forEach(name => format[name](pushJobs));
}

module.exports = getJobs;
