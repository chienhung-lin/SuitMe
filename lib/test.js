var googleSheet = require('./userdb.js');

var inputTest = {
  account: 'nekoneko123',
  password: 'ss12345678',
  nickname: 'nekoneko',
  cellphone: '0937222333',
  'email': 'jack@hotmail.com'
};

googleSheet.AddSheetData('SuitApp','account', inputTest);
