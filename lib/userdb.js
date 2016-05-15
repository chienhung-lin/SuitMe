//var fs = require('fs');
var Spreadsheet = require('edit-google-spreadsheet');

//var USERJSONFILE = __dirname + '/user.json';
//var USERJSONSTRING = fs.readFileSync(USERJSONFILE, 'utf8');
//var USERINFO = JSON.parse(USERJSONSTRING);
//console.log(USERINFO);
var Account = [];

//module.exports.getUserInfo = getUserInfo;
module.exports.getAccountCheck = getAccountCheck;

function getSheetInfo(sheetObj,length) {
//--------------create the format of Json-------------------------
  var headers = sheetObj[1];                //form the key of obj
  var sheet_data = [];

  //var length = Object.keys(sheetObj).length;//get the property of the sheetObj (for length)

  //match key:value
  for (j = 2; j <= length ; j++) {
    var temp = {};
    temp[headers[1]] = sheetObj[j][1];
    temp[headers[2]] = sheetObj[j][2];
    temp[headers[3]] = sheetObj[j][3];
    temp[headers[4]] = sheetObj[j][4];
    //insert data into array
    sheet_data.push(temp);
  }
  console.log(sheet_data);
  return sheet_data;
}
function getAccountCheck(input){
  var result = Account.filter(function(Account){
    return Account.account == input.account &&
           Account.password == input.password;
  });
  console.log('result'+result);
  if( result.length == 1)
    return result[0];
  else
    return undefined;
}
Spreadsheet.load({
  debug: true,
  spreadsheetName: 'account',
  worksheetName: 'data',
  oauth2: {
    client_id:'1092863384945-s28bg9j0s03dgj98jnuhr68e7ga1sev3.apps.googleusercontent.com',
    client_secret:'Nt33gi-WmArrVO4RXw6ddgm3',
    refresh_token:'1/ZntQpuUg_oBkuqb0MYnYH5-7gURn1w3Vx1-A7CcRypA'
  }},function run(err,spreadsheet){
       if(err) throw err;
       spreadsheet.receive(function(err,rows,info){
         if(err) throw err;
         console.log(rows);
         Account = getSheetInfo(rows,info.totalRows);
       });
    }
);

/*
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
}*/
