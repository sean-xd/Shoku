# Shoku - Daily Tech Jobs

[![Build Status](https://travis-ci.org/sean-xd/Shoku.svg?branch=master)](https://travis-ci.org/sean-xd/Shoku)
[![Code Climate](https://codeclimate.com/github/sean-xd/Shoku/badges/gpa.svg)](https://codeclimate.com/github/sean-xd/Shoku)
[![Test Coverage](https://codeclimate.com/github/sean-xd/Shoku/badges/coverage.svg)](https://codeclimate.com/github/sean-xd/Shoku/coverage)

Shoku is a tech job aggregator. It currently gets jobs from:

* [Github](https://jobs.github.com/)
* [StackOverflow](https://stackoverflow.com/jobs)
* [wfh.io](https://www.wfh.io/)
* [We Work Remotely](https://weworkremotely.com/)
* [Remote Ok](https://remoteok.io/)
* [Coroflot](http://www.coroflot.com/)
* [Dribbble](https://dribbble.com/jobs)
* [Smashing jobs](http://jobs.smashingmagazine.com/)
* [Jobspresso](https://jobspresso.co/)
* [Indeed](http://www.indeed.com/)
* [The Muse](https://www.themuse.com/)
* [Authentic Jobs](https://authenticjobs.com/)

A few sources I wrote data formatters for but they aren't operable currently for various reasons.

* [Hacker News](https://github.com/HackerNews/API)
  * Doesn't standardize submissions.
  * Most posts are on the first day of the thread.
* [Remotive](http://jobs.remotive.io/)
  * Doesn't include dates so I'd have to keep track of what's new myself.

I only keep jobs for the past two weeks. Most sites have paid postings that last 30 days, but since the list updates every 30 minutes those jobs are constantly torpedoed. My use case is new jobs every day, so it doesn't make sense for people to pay to post jobs just to see them fall off the front page every 24 hours.

Also many job boards prohibit paid postings since they offer that themselves, which is great because you can use them and not me and I still get the posting. This means one less revenue stream for me, but I'm not creating a job board to siphon money out of the job board industry; I'm creating a job board because I need a job and no one else is making that process easier.

## Technology Used

It's a web application so HTML5, CSS3, Javascript / ES6.

### Angular

On the frontend I used Angular because it makes certain MVP features a lot simpler. I intend to replace Angular with native ES6 once MVP is complete.

### Express

On the backend I used Express for the same reason and intentions. I wrote my own Database adapter for storing information as JSON. If there are ever any bugs I can switch to a real database but I don't like including that overhead initially. It's a lot easier to map a JSON object to some DB schema when you can control the entire database from a text editor.

### request, cheerio, parse-rss, rss-parser

I'm using a few libraries for parsing Atom / RSS feeds. Most of the boards I'm using have feeds or JSON endpoints or APIs so I'm doing very little "scraping". Using the hacker news api feels like scraping because I have to make 3 nested requests but they say in their docs that they intend for people to use it inefficiently because of the way it was designed.
