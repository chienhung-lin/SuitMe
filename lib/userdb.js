var Spreadsheet = require('edit-google-spreadsheet');

var Account = [];

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
