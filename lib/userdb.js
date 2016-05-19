var Spreadsheet = require('edit-google-spreadsheet');

var Account = [];
var CurrentRow;           //record the currentRow in sheet
var input_obj = {};       //used to add data into sheet
module.exports.getAccountCheck = getAccountCheck;
module.exports.AddSheetData = AddSheetData;
function getSheetInfo(sheetObj,length) {
//--------------create the format of Json-------------------------
  var headers = sheetObj[1];                //form the key of obj
  var sheet_data = [];

  //match key:value
  for (j = 2; j <= length ; j++) {
    var temp = {};
    for(k = 1; k <= Object.keys(headers).length; k++)
      temp[headers[k]] = sheetObj[j][k];
    //insert data into array
    sheet_data.push(temp);
  }
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

function AddSheetData(Spreadsheet_Name,Worksheet_Name,input){
  var input_keys = Object.keys(input);  
  //get the key of input to gain the value
  
  var term = {};
  Spreadsheet.load({
    debug: true,
    spreadsheetName: Spreadsheet_Name,
    worksheetName: Worksheet_Name,
    oauth2: {
      client_id:'1092863384945-s28bg9j0s03dgj98jnuhr68e7ga1sev3.apps.googleusercontent.com',
      client_secret:'Nt33gi-WmArrVO4RXw6ddgm3',
      refresh_token:'1/ZntQpuUg_oBkuqb0MYnYH5-7gURn1w3Vx1-A7CcRypA'
    }},function run(err,spreadsheet){
      if(err) throw err;
      spreadsheet.receive(function(err,rows,info){
        if(err) throw err;
        CurrentRows = info.totalRows;
        CurrentRows++;
        //transfer data for term 
        for(i = 1; i<= Object.keys(input).length; i++)
          term[i] = input[input_key[i-1]];
        input_obj[CurrentRows] = term ;  //form object
        
        //add data into sheet
        spreadsheet.add(input_obj);
        spreadsheet.send(function(err){
          if(err) throw err;
          console.log('Undate success');
        });
      });
    });
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
