/** @module Wait */
module.exports = function Wait(num, cb, args){
  return data => (args.length === num - 1) ? cb(args.concat([data])) : args.push(data);
}
