var fs = require('fs');

var USERJSONFILE = __dirname + '/user.json';

var USERJSONSTRING = fs.readFileSync(USERJSONFILE, 'utf8');

var USERINFO = JSON.parse(USERJSONSTRING);

module.exports.getUserInfo = getUserInfo;

function getUserInfo(opt){
  var __userinfo = USERINFO.filter(function(e){
    return e.account == opt.account &&
            e.password == opt.password ;
  });

  if (__userinfo.length==0) {
    return undefined;
  } else if (__userinfo.length>1) {
    return undefined;
  } else {
    return __userinfo[0];
  }
}
