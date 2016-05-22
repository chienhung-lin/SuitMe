var Spreadsheet = require('edit-google-spreadsheet');

var CurrentRow;           //record the currentRow in sheet
var input_obj = {};       //used to add data into sheet

module.exports.AddSheetData = AddSheetData;
module.exports.GetAccountCheck = GetAccountCheck;
module.exports.GetRegisterCheck = GetRegisterCheck;
module.exports.GetDataBase = GetDataBase;

//transfer data in sheet into data object array
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
//used to search object of input matching
function getDataSearch(sheet_data,input){ 
  var count=0;
  var des_index=-1;
  var input_keys = Object.keys(input);
  var result = [];
  for(i = 0; i < Object.keys(sheet_data).length; i++)
  {
    count=0;
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

//increase data into sheet
function AddSheetData(WorksheetName,input){
  var input_keys = Object.keys(input);  
  //get the key of input to gain the value
  
  var term = {};
  Spreadsheet.load({
    debug: true,
    spreadsheetId: '1gIjR-904U28cabkxRobneDv8JWk6eIHn4EaN1Y7gJbY',
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
          term[i] = input[input_keys[i-1]];
        input_obj[CurrentRows] = term ;  //form object

        //add data into sheet
        spreadsheet.add(input_obj);
        spreadsheet.send(function(err){
          if(err) throw err;
          console.log('Undate success');
        });
      });
    }
  );
}

function GetAccountCheck(WorksheetName,input, callback) {
  var error;
  var AccountInfo;
  var CheckResult = undefined;

  if (typeof input !== 'object' || typeof input.account !== 'string' || typeof input.password !== 'string' ) {
    error = "opt wrong";
    console.log(typeof input !== 'object' || typeof input.account !== 'string' || typeof input.password !== 'string' );
    return callback( error, CheckResult);
  }

  Spreadsheet.load({
    debug: true,
    spreadsheetId: '1gIjR-904U28cabkxRobneDv8JWk6eIHn4EaN1Y7gJbY',
    worksheetName: WorksheetName,
    oauth2: {
      client_id:'1092863384945-s28bg9j0s03dgj98jnuhr68e7ga1sev3.apps.googleusercontent.com',
      client_secret:'Nt33gi-WmArrVO4RXw6ddgm3',
      refresh_token:'1/ZntQpuUg_oBkuqb0MYnYH5-7gURn1w3Vx1-A7CcRypA'
    }}, function run(err ,spreadsheet) {
        /* if readyfunction is error.....*/
        if ( err )  return callback(err, CheckResult);
        spreadsheet.receive( function(err, rows, info) {
          /* if recive is error.....*/
          if ( err )  return callback(err, CheckResult);

          AccountInfo = getSheetInfo(rows, info.totalRows);
          /* check account exist or not .....*/
          CheckResult = getDataSearch(AccountInfo,input );
          callback(err, CheckResult);
        });
    }
  );
}

function GetRegisterCheck(WorksheetName,input,callback){
  var input_keys = Object.keys(input);
  var AccountInfo = [];
  Spreadsheet.load({
    debug: true,
    spreadsheetId: '1gIjR-904U28cabkxRobneDv8JWk6eIHn4EaN1Y7gJbY',
    worksheetName: WorksheetName,
    oauth2: {
      client_id:'1092863384945-s28bg9j0s03dgj98jnuhr68e7ga1sev3.apps.googleusercontent.com',
      client_secret:'Nt33gi-WmArrVO4RXw6ddgm3',
      refresh_token:'1/ZntQpuUg_oBkuqb0MYnYH5-7gURn1w3Vx1-A7CcRypA'
    }}, function run(err ,spreadsheet) {
        /* if readyfunction is error.....*/
        if ( err )  return callback(err, CheckResult);
        spreadsheet.receive( function(err, rows, info) {
          /* if recive is error.....*/
          if ( err )  return callback(err, CheckResult);
          AccountInfo = getSheetInfo(rows, info.totalRows);
    
          for(i = 0; i <= Object.keys(input).length; i++)
          {
            for(j = 0;j < Object.keys(AccountInfo).length; j++)
            {
              if(AccountInfo[j][input_keys[i]] == input[input_keys[i]])
                return  callback(err , input_keys[i]);
            }
          }
          return  callback(err, undefined);
        });
    } 
  );
}

//get database you need.Return array
function GetDataBase(WorksheetName,target,key,callback){
  
  var database = [];        //return
  var sheet_data = []; 
  Spreadsheet.load({
    debug: true,
    spreadsheetId: '1gIjR-904U28cabkxRobneDv8JWk6eIHn4EaN1Y7gJbY',
    worksheetName: WorksheetName,
    oauth2: {
      client_id:'1092863384945-s28bg9j0s03dgj98jnuhr68e7ga1sev3.apps.googleusercontent.com',
      client_secret:'Nt33gi-WmArrVO4RXw6ddgm3',
      refresh_token:'1/ZntQpuUg_oBkuqb0MYnYH5-7gURn1w3Vx1-A7CcRypA'
    }}, function run(err ,spreadsheet) {
      /* if readyfunction is error.....*/
      if ( err )  return  callback(err, 'undefined');
      spreadsheet.receive( function(err, rows, info) {
        /* if recive is error.....*/
        if ( err )  return  callback(err, 'undefined');
        sheet_data = getSheetInfo(rows, info.totalRows);

        //according to target,find the corresponding object
        var content = getDataSearch(sheet_data,target);
        //record the value of object.key
        var temp ;
  
        var j = 0;
        
        //sperate data from object.key value by ","
        if(content !== 'undefined')
        {
          temp = content[key];
          for(i = 0;i <= temp.length; i++)
          { 
            if((temp[i] == ',')||( i == temp.length))
            {
              database.push( temp.substring(j,i));
              j = i + 1;
            }
          }
          return  callback(err,database);  //return array
        }
        else
          return  callback(err, 'undefined');
      });
    }
  );
}
