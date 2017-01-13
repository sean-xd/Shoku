/** @module jobChecker */
module.exports = function jobChecker(job, list){
  var brokenProps = !job.company || !job.content || !job.date || !job.location || !job.source || !job.title || !job.url,
    brokenCompany = job.company.length < 2,
    brokenDate = Date.now() - job.date > 1000 * 3600 * 24 * 30 || job.date > Date.now(),
    isGerman = /ä|ö|ü|Ü|ß|ntwick/.test(job.title + job.company + job.content);
  if(brokenProps || brokenCompany || brokenDate || isGerman) return list;
  return list.concat([job]);
}
