#Shoku - Daily Tech Jobs
Shoku is a tech job aggregator. It currently gets jobs from:

* Github
* StackOverflow
* wfh.io
* We Work Remotely
* Remote Ok
* Coroflot

The latest 200 results are sent to the client and paged by 10 with pseudo-infinite scroll.

##Technology Used
It's a web application so HTML5, CSS3, ES6.

On the frontend I used Angular because it makes certain MVP features a lot simpler. I intend to replace Angular with native ES6 once MVP is complete.

On the backend I used Express for the same reason and intentions. I wrote my own Database adapter for storing information as JSON. If there are ever any bugs I can switch to a real database but I don't like including that overhead initially. It's a lot easier to map a JSON object to some DB schema when you can control the entire database from a text editor.
