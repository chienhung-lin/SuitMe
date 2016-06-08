var fs = require('fs');
var nodemailer = require('nodemailer');
var sender = JSON.parse(fs.readFileSync(__dirname+'/sender.json')); 

module.exports.SendMail = SendMail;

function SendMail(account,address,passwd){
  var text = 'Your password is '+passwd;
  var transport = nodemailer.createTransport({
    service:'Gmail',
    auth:sender
  });
  console.log('address:'+address);
  console.log('password: '+passwd);
  var mail_options = {
    from:sender.user,
    to:address,
    subject:'忘記密碼',
    text:text
  }

  transport.sendMail(mail_options,function(error,info){
    if(error) return console.log(error);
    console.log('Email is sent:'+ info.response);
  });
}
