var Spreadsheet = require('edit-google-spreadsheet');

//database
var Account = [];



var CurrentRow;           //record the currentRow in sheet
var input_obj = {};       //used to add data into sheet


module.exports.getAccountCheck = getAccountCheck;
module.exports.AddSheetData = AddSheetData;
module.exports.getDataBase = getDataBase;
module.exports.Refresh = Refresh;

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
function getDataBase(worksheet){
  if(worksheet == 'data')
    return Account;
  else
    return undefined;
}
function getAccountCheck(WorksheetName,input){ 
  var sheet_data ;
  if(WorksheetName == 'data')
    sheet_data = Account ;
  else
    sheet_data = [];
  var count=0;
  var des_index=-1;
  var input_keys = Object.keys(input);
  var result = [];
  for(i = 0; i < Object.keys(sheet_data).length; i++)
  {
    count=0;
    console.log(sheet_data[i]);
    for(j = 0; j < Object.keys(input).length; j++)
    {
      if(sheet_data[i][input_keys[j]] == input[input_keys[j]])
        count++;
    }
    if(count == Object.keys(input).length)
    {
      des_index = i;
      break;
    }                                   
  }                                       
  result.push(sheet_data[des_index]);

  if( result.length == 1)
    return result[0];
  else
    return undefined;
}
function AddSheetData(SpreadsheetName,WorksheetName,input){
  var input_keys = Object.keys(input);  
  //get the key of input to gain the value
  
  var term = {};
  Spreadsheet.load({
    debug: true,
    spreadsheetName: SpreadsheetName,
    worksheetName: WorksheetName,
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
function Refresh(WorksheetName){
  Spreadsheet.load({
    debug: true,
    spreadsheetName: 'account',
    worksheetName: Worksheet_Name,
    oauth2: {
      client_id:'1092863384945-s28bg9j0s03dgj98jnuhr68e7ga1sev3.apps.googleusercontent.com',
      client_secret:'Nt33gi-WmArrVO4RXw6ddgm3',
      refresh_token:'1/ZntQpuUg_oBkuqb0MYnYH5-7gURn1w3Vx1-A7CcRypA'
    }},function run(err,spreadsheet){
      if(err) throw err;
      spreadsheet.receive(function(err,rows,info){
        if(err) throw err;
        Account = getSheetInfo(rows,info.totalRows);
      });
    }
  );
}


//Build Database
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

