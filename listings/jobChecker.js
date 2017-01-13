/** @module jobChecker */
module.exports = jobChecker;

function jobChecker(job, list){
  var isGerman = /ä|ö|ü|Ü|ß|ntwick/.test(job.title + job.company + job.content);
  if(brokenProps(job) || brokenCompany(job) || brokenDate(job) || isGerman) return list;
  return list.concat([job]);
}

function brokenCompany(job){
  return !job.company || job.company.length < 2;
}

function brokenProps(job){
  return !job.content || !job.date || !job.location || !job.source || !job.title || !job.url;
}

function brokenDate(job){
  return Date.now() - job.date > 1000 * 3600 * 24 * 30 || job.date > Date.now();
}
