/** @module jobChecker */
module.exports = function jobChecker(job, list){
  if(!job.company || !job.content || !job.date || !job.location || !job.source || !job.title || !job.url) return list;
  if(job.company.length < 2 || Date.now() - date > 1000 * 60 * 60 * 24 * 30 || date > Date.now()) return list;
  return list.concat([job]);
}
