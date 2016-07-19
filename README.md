#Shoku - Daily Tech Jobs
Shoku is a tech job aggregator. It currently gets jobs from:

* Github
* StackOverflow
* wfh.io
* We Work Remotely
* Remote Ok
* Coroflot
* Dribbble
* Smashing jobs
* Jobspresso
* Hacker News (almost)

I only keep jobs for the past two weeks. Most sites have paid postings that last 30 days, but since the list updates every 30 minutes those jobs are constantly torpedoed. My use case is new jobs every day, so it doesn't make sense for people to pay to post jobs just to see them fall off the front page every 24 hours. Also many job boards prohibit paid postings since they offer that themselves, which is great because you can use them and not me and I still get the posting. This means one less revenue stream for me, but I'm not creating a job board to siphon money out of the job board industry; I'm creating a job board because I need a job and no one else is making a site that makes that process easier.

##Technology Used
It's a web application so HTML5, CSS3, Javascript / ES6.

On the frontend I used Angular because it makes certain MVP features a lot simpler. I intend to replace Angular with native ES6 once MVP is complete.

On the backend I used Express for the same reason and intentions. I wrote my own Database adapter for storing information as JSON. If there are ever any bugs I can switch to a real database but I don't like including that overhead initially. It's a lot easier to map a JSON object to some DB schema when you can control the entire database from a text editor.

I'm using a few libraries for parsing Atom / RSS feeds. Most of the boards I'm using have feeds or APIs so I'm doing very little "scraping". Using the hacker news api feels like scraping because I have to make 3 nested requests but they say in their docs that they intend people to use it inefficiently because of the way it was designed.
