var Spreadsheet = require('edit-google-spreadsheet');
var fs = require('fs');

var db_oauth = JSON.parse(fs.readFileSync(__dirname+'/credit.json'));

//var CurrentRow;           //record the currentRow in sheet
var input_obj = {};       //used to add data into sheet
var key_list = [];

//var SheetSort = ['account','feedback','reservation','shop_info'];
var Account = [];         //register for account
var Feedback = [];        //register for feedback
var Shop_Info = [];       //register for Shop_Info
var Reservation = [];     //register for time reservation
var Question = [];        //register for question asked by customers

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
  if(Object.keys(sheetObj).length >= length)
  {
    if(length >= 2)
    {
      for (j = 2; j <= length ; j++) {
        var temp = {};
        if((typeof headers !== 'undefined')&&( Object.keys(headers).length >= 1))
        {
          for(k = 1; k <= Object.keys(headers).length; k++)
            temp[headers[k]] = sheetObj[j][k];
          //insert data into array
          sheet_data.push(temp);
        }
      }
    }
  }
  return sheet_data;
}

function refresh(WorksheetName){
  Spreadsheet.load({
    debug: true,
    spreadsheetId: '1gIjR-904U28cabkxRobneDv8JWk6eIHn4EaN1Y7gJbY',
    worksheetName: WorksheetName,
    oauth2: db_oauth
   },function run(err,spreadsheet){
      if(err) throw err;
      spreadsheet.receive(function(err,rows,info){
        if(err) throw err;
        var term = {};
        if( WorksheetName == 'account' ) {
          if( Account.length == 0 )
            Account = getSheetInfo( rows , info.totalRows );
          else if( Account.length < info.totalRows-1 )
            Account = getSheetInfo( rows , info.totalRows );
          else if( Account.length > info.totalRows-1 ) {
            for( i = info.totalRows-1; i < Account.length; i++) {
              input_obj = {};
              key_list = Object.keys(Account[i]);
              for(j = 1; j <= key_list.length; j++)
                term[j] = Account[i][key_list[j-1]];
              input_obj[i+2] = term;
              spreadsheet.add(input_obj);
            }
          }
          console.log(Account);
        }
        if( WorksheetName == 'feedback' ) {
          if( Feedback.length == 0 )
            Feedback = getSheetInfo( rows , info.totalRows );
          else if( Feedback.length < info.totalRows-1 )
            Feedback = getSheetInfo( rows , info.totalRows );
          else if( Feedback.length > info.totalRows-1 ) {
            for( i = info.totalRows-1; i < Feedback.length; i++) {
              input_obj = {};
              key_list = Object.keys(Feedback[i]);
              for(j = 1; j <= key_list.length; j++)
                term[j] = Feedback[i][key_list[j-1]];
              input_obj[i+2] = term;
              spreadsheet.add(input_obj);
            }
          }
          console.log(Feedback);
        }
        if( WorksheetName == 'reservation' ) {
          if( Reservation.length == 0 )
            Reservation = getSheetInfo( rows , info.totalRows );
          else if( Reservation.length < info.totalRows-1 )
            Reservation = getSheetInfo( rows , info.totalRows );
          else if( Reservation.length > info.totalRows-1 ) {
            for( i = info.totalRows-1; i < Reservation.length; i++) {
              input_obj = {};
              key_list = Object.keys(Reservation[i]);
              for(j = 1; j <= key_list.length; j++)
                term[j] = Reservation[i][key_list[j-1]];
              input_obj[i+2] = term;
              spreadsheet.add(input_obj);
            }
          }
          console.log(Reservation);
        }
        if( WorksheetName == 'shop_info' ) {
          if( Shop_Info.length == 0 )
             Shop_Info = getSheetInfo( rows , info.totalRows );
          else if( Shop_Info.length < info.totalRows-1 )
            Shop_Info = getSheetInfo( rows , info.totalRows );
          else if( Shop_Info.length > info.totalRows-1 ) {
            for( i = info.totalRows-1; i < Shop_Info.length; i++) {
              input_obj = {};
              key_list = Object.keys(Shop_Info[i]);
              for(j = 1; j <= key_list.length; j++)
                term[j] = Shop_Info[i][key_list[j-1]];
              input_obj[i+2] = term;

              spreadsheet.add(input_obj);
            }
          }
          console.log(Shop_Info);
        }
        if( WorksheetName == 'question' ) {
          if( Question.length == 0 )
            Question = getSheetInfo( rows , info.totalRows );
          else if( Question.length < info.totalRows-1 )
            Question = getSheetInfo( rows , info.totalRows );
          else if( Question.length > info.totalRows-1 ) {
            for( i = info.totalRows-1; i < Question.length; i++) {
              input_obj = {};
              key_list = Object.keys(Question[i]);
              for(j = 1; j <= key_list.length; j++)
                term[j] = Question[i][key_list[j-1]];
              input_obj[i+2] = term;

              spreadsheet.add(input_obj);
            }
          }
          console.log(Question);
        }
        spreadsheet.send(function(err){
          if(err) throw err;
          console.log('Undate success');
        });
     });
  });
}

//used to search object of input matching
function getDataSearch(sheet_data,input) {
  if (typeof input === 'object') {
    var count=0;
    var input_keys = Object.keys(input);
    var result = [];
    if( sheet_data.length > 0)
    {
      for(i = 0; i < sheet_data.length; i++)
      {
        count=0;
        for(j = 0; j < input_keys.length; j++)
        {
          if(sheet_data[i][input_keys[j]] == input[input_keys[j]])
            count++;
        }
        if(count == input_keys.length)
          result.push(sheet_data[i]);
      }
    }
    if( result.length != 0 )
      return result;
    else
      return undefined;
  } 
  else if(typeof input === 'string' && input == 'ALL') {
    return sheet_data;
  }
}

//increase data into sheet
function AddSheetData(WorksheetName,input){
  if( WorksheetName == 'account' )
    Account.push(input);
  if( WorksheetName == 'feedback' )
    Feedback.push(input);
  if( WorksheetName == 'reservation' )
    Reservation.push(input);
  if( WorksheetName == 'shop_info' )
    Shop_Info.push(input);
  if( WorksheetName == 'question' )
      Question.push(input);

}

function GetAccountCheck(input) {
  
  var CheckResult = undefined;
  //format check
  if (typeof input !== 'object' || typeof input.account !== 'string' || typeof input.password !== 'string' ) {
    error = "opt wrong";
    console.log(typeof input !== 'object' || typeof input.account !== 'string' || typeof input.password !== 'string' );
    return CheckResult;
  }
  CheckResult = getDataSearch(Account,input);
  if( typeof CheckResult !== 'undefined')  
    return CheckResult[0];
  else
    return CheckResult;
}

//check account repeated when registering
function GetRegisterCheck(input){
  var input_keys = Object.keys(input);
  
  for(i = 0; i <= input_keys.length; i++)
  {
    if( Account.length > 0 )
    {
      for(j = 0;j < Account.length; j++)
      {
        if(Account[j][input_keys[i]] == input[input_keys[i]])
          return  input_keys[i];
      }
    }
    else
      break;
  }
  return undefined;
}

//get database you need.Return array
function GetDataBase(WorksheetName,target,key,callback){
  var err;
  var database = [];        //return
  var sheet_data = []; 
  if( WorksheetName == 'account' )
    sheet_data = Account;
  if( WorksheetName == 'feedback' )
    sheet_data = Feedback;
  if( WorksheetName == 'reservation' )
    sheet_data = Reservation;
  if( WorksheetName == 'shop_info' )
    sheet_data = Shop_Info;
  if( WorksheetName == 'question' )
    sheet_data = Question;
  //according to target,find the corresponding object
  var content = getDataSearch(sheet_data,target);
  //record the value of object.key
  var temp = [] ;
  
  var j = 0;
  var each_term = []; 

  //sperate data from object.key value by ","
  if(typeof content !== 'undefined') {
    for(k = 0; k < key.length; k++) {
      //initialize
      j = 0;
      each_term = [];
      temp = [];

      for(t = 0; t < content.length; t++)
        temp.push(content[t][key[k]]);
      for(i = 0;i < temp.length; i++)  {
        j = 0;
        for(s = 0;s <= temp[i].length; s++) {
          if((temp[i][s] == '|')||( s == temp[i].length)) {
            each_term.push( temp[i].substring(j,s));
            j = s + 1;
          }
        }
      }
      database.push(each_term);
    }
    return  callback(err,database);  //return array
  }
  else
    return  callback(err, 'undefined');
}
refresh('account');
refresh('feedback');
refresh('reservation');
refresh('shop_info');
refresh('question');
setInterval(function(){ refresh('account');},600000);    //10 minutes
setInterval(function(){ refresh('feedback');},300000);   //5 minutes
setInterval(function(){ refresh('reservation');},600000); //10 minutes
setInterval(function(){ refresh('shop_info');},18000000);
setInterval(function(){ refresh('question');},180000);//3 minutes
