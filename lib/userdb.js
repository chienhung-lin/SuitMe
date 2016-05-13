var fs = require('fs');

var USERJSONFILE = __dirname + '/user.json';

var USERJSONSTRING = fs.readFileSync(USERJSONFILE, 'utf8');

var USERINFO = JSON.parse(USERJSONSTRING);

console.log(USERINFO);

module.exports.getUserInfo = getUserInfo;

function getUserInfo(opt){
  var __userinfo = USERINFO.filter(function(e){
    return e.account == opt.account &&
            e.password == opt.password ;
  });

  if (__userinfo.length==0) {
    console.log('no exist');
    return undefined;
  } else if (__userinfo.length>1) {
    console.log('duplicate info');
    return undefined;
  } else {
    console.log('success get info; ');
    console.log(__userinfo[0]);
    return __userinfo[0];
  }
}
