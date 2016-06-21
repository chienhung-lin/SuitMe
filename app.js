var express = require('express');
/* tempalte engine*/
var exphbs = require('express-handlebars');
/* third parts middleware */
var bodyParser = require('body-parser');
var session = require('express-session');
var redis = require('redis');
var redisStore = require('connect-redis')(session);

var userdb = require('./lib/userdb.js');
var funct = require('./lib/funct.js');

/* port.js
 *
 * module.exports.port = [port number]
 */
var port = require('./port.js').port;

var app = express();
var redisClient = redis.createClient();

/******************************************
 * store init value in locals             *
 *                                        *
 * app.locals.store for record shop info  *
 * and presenting in web site             *
 ******************************************/

/* setting hbs */
/* layoutsDir and partialsDir is default setting*/
app.engine('.hbs', exphbs({
													defaultLayout:	'main',
													extname: 				'.hbs',
													layoutsDir:			'views/layouts/',
													partialsDir:		'views/partials/',
													}));

app.set('view engine', '.hbs');

/* true: if cache exists, it won't recompile           
 * false: compiles everytime, and won't store in cache 
 *
 * for development, disenable is good, but for efficiency
 * , you shold enable cache
 */
//app.set('view cache', true);

app.set('port', process.env.PORT || port);

//-----third-part-middlewares-------
// session, static, bodyParser
app.use(session({
  secret: 'helloworld something terroble and oh no',
  store: new redisStore({
    client: redisClient,
    ttl: 30*24*60*60
  }),
  saveUninitialized: false,
  resave: false
}));
app.use( express.static( __dirname + '/public' ) );
app.use( bodyParser.urlencoded({ extended: false }));
//-----third-part-middlewares-end-----


//--customized middlewares function----

// in some login_status necessary,
// if session.user isn't exist,
// page will auto redirect to 'login_page'
function sessExist(req, res, next) {
  if(typeof req.session.user === 'undefined') {
    res.redirect(303, '/login_page');
  } else {
    next();
  }
};
//----customized-middlewares-end------

//------------post--api---------------
//The choice of before_reservation and after_reservation
app.post('/before_after',function(req, res) {
  req.session.hour = req.body.Moment; //record the choose of that
  console.log(req.session.hour);
  if((typeof req.session.hour === 'string')&&(req.session.hour == 'beforelog'))  {
    res.status(200).send({
      redirectUrl: '/test/selectStore'
    });
  }
  else if((typeof req.session.hour === 'string')&&(req.session.hour == 'afterlog')) {
    res.status(200).send({
      redirectUrl: '/suitProcess'
    });
  }
  else{ 
    res.status(200).send({
      redirectUrl: '/test/selectStore'
    });
  }
});

//  such as restful api
app.post('/selectStore', function(req, res) {
  req.session.shop = req.body;
  console.log(req.session.shop);
  res.status(200).send({
    redirectUrl: '/venderhome'
  });
});

// login native post api
app.post('/login',function(req, res) {
  var login = req.body;

  data = userdb.GetAccountCheck({
    account: login.account,
    password: login.password
  });
  console.log('login post api testing for myGetAccountCheck');
  console.log(data);
  if ( typeof data !== 'undefined' ) {
    req.session.user = data;
    res.redirect(303,'/bookhome');
    // else, login faill, redirect to /login_page
  } else {
    res.redirect(303,'back');
  }
});

// login ajax post api
//
// if account exist, then record info by session
// and send redirect url: '/bookhome'
app.post('/test/login', function(req, res) {
  var login = req.body;
  /* if haven't loged in */
  if((typeof Object.keys(login)[0] === 'string')&&(Object.keys(login)[0] == 'Choice')) {
    req.session.afterMenu = req.body.Choice;
    res.status(200).send({succLogin: false, redirectUrl: '/login_page'});
  }
  else {
    data = userdb.GetAccountCheck({
      account: login.account,
      password: login.password
    });
    console.log('login post api testing for myGetAccountCheck');
    console.log(data);
    if ( typeof data !== 'undefined' ) {
      req.session.user = data;
      if((typeof req.session.hour === 'string')&&(req.session.hour == 'beforelog')) {
        res.status(200).send({succLogin: true, redirectUrl: '/bookhome'});
      }
      else if((typeof req.session.hour === 'string')&&(req.session.hour == 'afterlog'))  {
        if((typeof req.session.afterMenu === 'string')&&( req.session.afterMenu == 'process')) {
          res.status(200).send({succLogin: true, redirectUrl: '/suitProcess'});
        }
        else
          res.status(200).send({succLogin: true, redirectUrl: '/afterService'});
      }
      else {
        res.status(200).send({succLogin: true, redirectUrl: '/bookhome'});
      }
      // else, login faill, redirect to /login_page
    } else {
      res.status(200).send({succLogin: false, redirectUrl: '/login_page'});
    }
  }
});

app.post('/forget', function(req, res) {
  console.log(req.body);
  var account = req.body.account;
  userdb.GetDataBase('account',req.body,['email','password'],
    function(err,reply){
      if(typeof reply !== 'undefined'){
        //send-email
        funct.SendMail(account,reply[0][0],reply[1][0]);
        res.status(200).send({
          redirectUrl:'/login_page'
        });
      }
      else{
        console.log('The account does not exist!.');
        res.status(200).send({
          redirectUrl:'/forget'
        });
      }
    }
  );
});

// logout ajax api
// `
// if session exists , destory specific session 
// and redirect to '/login_page'
// if session is not exists, only redirect
// to '/login_page'
app.post('/logout', function(req, res) {
  
  // if session.user exist, destory 'session'
  if (req.session.user) {
    req.session.destroy(function(){
      res.status(200).send({
        redirectUrl: '/login_page'
      });
    });
  } else {
    res.status(200).send({
      redirectUrl: '/login_page'
    });
  }
});

app.post('/regModify', function(req, res) {
  console.log(req.body);
  if (req.session.user) {
    delete req.session.user;
  }
  res.status(200).send({
    successUpdate: true,
    redirectUrl: '/login_page'
  });
});

// register ajax post api
// 
// recive register data
// if 'new account' isn't conflict with database
// add new register data
app.post('/register', function(req, res) {

  console.log('register post api req.body');
  console.log(req.body);
  var account_info = {account: req.body.account}

  reply = userdb.GetRegisterCheck(account_info);
  if(typeof reply === 'undefined') {
    userdb.AddSheetData('account', req.body);
    res.status(200).send({
      accountDup: false,
      redirectUrl: '/login_page'
    });
  }
  else {
    console.log(reply+' is used,please register again ');
    res.status(200).send({
      accountDup: true,
      redirectUrl: '/register'
    });
  }
});

// book ajax post api
//
// recive book shop and time
app.post('/book', function(req, res) {
  var _input = {
    Time: (new Date()).toString(),
    UserName: req.session.user.account || 'error',
    Shop: req.body.shop,
    ReserveTime: req.body.reserv_time
  };

  console.log(_input);
  userdb.AddSheetData('reservation', _input);
  res.status(200).send({
    success: true,
    redirectUrl: '/bookhome'
  });
});

// render book time, ajax post api
//
// time with specific shop_id
app.post('/render/booktime', function(req, res) {
  console.log('render booktime');
  var shop_id = req.body.shop_id;

  userdb.GetDataBase('shop_info',{
    ShopName: shop_id
    },['bookTime'],function(error,data){
      res.status(200).send(data[0]);
    }
  );
});
app.post('/afterService',function(req,res) {
  console.log('input feedback'); 
  
  var input = Object.keys(req.body);
  console.log(input);

  //comfirm the identity of the user
  var person ; 
  if(req.session.user) {
    person = req.session.user.nickname;
  }
  else {
    person = "unknown_people";
  }
  //comfirm the shop
  var store ;
  if(req.session.shop) {
    store = req.session.shop;
  }
  else {
    store = "大帥西服";
  }

  //add data into userdb.js
  if((typeof input[0] === 'string')&&(input[0] == 'Question')){
    var _input = {
      ShopName:store,
      Time:'2015/03/02',
      UserName:person,
      Question:req.body.Question
    };
    console.log(_input);
    userdb.AddSheetData('question', _input);
  } 
  if((typeof input[0] === 'string')&&(input[0] == 'Evaluation')){
    var str = "-";
    var star = str.concat(req.body.Evaluation,"-");
    var _input = {
      ShopName:store,
      Time:'2015/03/02',
      UserName:person,
      Evaluation:star,
      Message:req.body.Message
    };
    console.log(_input);
    userdb.AddSheetData('feedback', _input);
  }
  res.status(200).send({
    redirectUrl: '/afterService'
  });
});

//----------post-api-end-------------

app.get('/', function(req, res) {
	res.render('home', {layout: 'main_non_nav'});
});

app.get('/beforeAfter', function(req, res) {
  res.render('before_after', {layout: 'main_non_nav'});
});

app.get('/selectStore',function(req,res){
  res.render('select_store');
});

app.get('/test/selectStore', function(req, res) {
  res.render('select_store2',{
    venderSel: true,
    suitSel: false,
    bookSel: false,
    prev: {
      href: '/beforeAfter',
      title: 'beforeAfter'
    }
  });
});

app.get('/venderhome', function(req, res) {

  console.log('venderhome');
  var shop = req.session.shop || {ShopName:'大帥西服'};

  userdb.GetDataBase(
    'shop_info',
    shop,
    ['themeImg'],
    function(error, data) {
      if (typeof data !== 'undefined' && data[0] instanceof Array) {
        console.log(data[0]);

        res.render('venderhome', {
          venderSel: true,
          suitSel: false,
          bookSel: false,
          themeImg: {
            left_up: data[0][0],
            right_up: data[0][1],
            right_mid: data[0][2],
            bottom: data[0][3]
          },
          prev: {
            href: '/test/selectStore',
            title: 'selectStore'
          }
        });
      }
    }
  );

});

app.get('/venderhistory', function(req, res) {
  var result = [];
  var shop = {ShopName:'大帥西服'};
  if(typeof req.session.shop !== 'undefined') {
    shop = req.session.shop;
  }
  userdb.GetDataBase('shop_info', shop,
    ['History'],function(error,data){
        if(typeof data !== 'undefined'){
          for(i = 0; i < data[0].length; i++)
            result.push({paragraph:data[0][i]});
          res.render('venderhistory', {
            venderSel: true,
            suitSel: false,
            bookSel: false,
            shop_name: shop.ShopName,
            story: result,
            prev: {
              href: '/venderhome',
              title: 'venderhome'
            }
          });
        }
        else
          console.log('error!!!');
      }
  );
});
app.get('/shop_contact', function(req, res) {
  var shop = {ShopName:'大帥西服'};
  if(typeof req.session.shop !== 'undefined') {
    shop = req.session.shop
  }
  userdb.GetDataBase('shop_info', shop,
    ['ShopName','OpenTime','Telphone','Address'],function(error,data) {
        if(typeof data != 'undefined') {
          res.render('shop_contact', {
            venderSel: true,
            suitSel: false,
            bookSel: false,
            name:data[0][0],
            opentime:data[1][0],
            telphone:data[2][0],
            address:data[3][0],
            prev: {
              href: '/venderhome',
              title: 'venderhome'
            }
          });
        }
        else
          console.log('error!!!');
      }
  );
});

app.get('/cloth', function(req, res) {
  var result = [];
  var shop = {ShopName:'大帥西服'};
  if(typeof req.session.shop !== 'undefined') {
    shop = req.session.shop;
  }
  console.log(shop);
  userdb.GetDataBase('shop_info', shop,['cloth'],function(error,data){
        if(typeof data !== 'undefined') {
          for(i = 0; i < data[0].length; i++) {
            result.push({imagine:data[0][i],index:(i+1).toString()});
          }
          res.render('cloth', {
              venderSel: true,
              suitSel: false,
              bookSel: false,
              clothList: result,
              prev: {
                href: '/venderhome',
                title: 'venderhome'
              }
          });
        }
        else
          console.log('error!!!');
    }
  );
});

app.get('/feedback', function(req, res) {
  var result = [];
  var shop = {ShopName:'大帥西服'};
  if(typeof req.session.shop !== 'undefined') {
    shop = req.session.shop
  }
  userdb.GetDataBase('feedback', shop,
  ['UserName','Time','Message','Evaluation'],function(error,data){
      if(typeof data !== 'undefined')  {
        for(i = 0; i < data[0].length; i++){
          var star = data[3][i].slice(1,2);
          result.push({
            author:data[0][i],
            time:data[1][i],
            message:data[2][i],
            star:star
          });
        }
        res.render('custom_feedback', {
          venderSel: true,
          suitSel: false,
          bookSel: false,
          comment: result,
          prev: {
            href: '/venderhome',
            title: 'venderhome'
          }
        });
      }
      else
        console.log('error!!!');
    }
  );
});

app.get('/suithome', function(req, res) {
  res.render('suithome', {
    venderSel: false,
    suitSel: true,
    bookSel: false,
    prev: {
      href: '/beforeAfter',
      title: 'beforeAfter'
    }
  });
});

app.get('/suitcategory', function(req, res) {
  res.render('categorysuit', {
    venderSel: false,
    suitSel: true,
    bookSel: false,
    prev: {
      href: '/suithome',
      title: 'suithome'
    }
  });
});

app.get('/suitinfo', function(req, res) {
  res.render('suitinfo', {
    venderSel: false,
    suitSel: true,
    bookSel: false,
    prev: {
      href: '/suithome',
      title: 'suithome'
    }
  });
});

app.get('/suithistory', function(req, res) {
  res.render('suithistory', {
    venderSel: false,
    suitSel: true,
    bookSel: false,
    prev: {
      href: '/suithome',
      title: 'suithome'
    }
  });
});

app.get('/login_page', function(req, res) {
  if (typeof req.session.user !== 'undefined') {
    if((typeof req.session.hour === 'string')&&(req.session.hour == 'beforelog')) { 
      res.redirect(303,'/bookhome');
    }
    else  if((typeof req.session.hour === 'string')&&(req.session.hour == 'afterlog')) {
      if ((typeof req.session.afterMenu === 'string')&&(req.session.afterMenu == 'process')) {
        res.redirect(303,'/suitProcess');
      }
      else if ((typeof req.session.afterMenu === 'string')&&(req.session.afterMenu == 'service')) {
        res.redirect(303,'/afterService');
      }
    }
    else {
      res.redirect(303,'/bookhome');
    }
  } else{
    if((typeof req.session.hour === 'string')&&(req.session.hour == 'beforelog')) {
      res.render('login_page', {
        venderSel: false,
        suitSel: false,
        bookSel: true,
        prev: {
          href: '/beforeAfter',
          title: 'beforeAfter'
        }
      });
    }
    else if((typeof req.session.hour === 'string')&&(req.session.hour == 'afterlog')) {
      console.log(req.session.afterMenu);
      if((typeof req.session.afterMenu === 'string')&&(req.session.afterMenu == 'service')){
        res.render('login_page', {
          layout: 'mainafter',    //for the better feeling of users
          processSel: false,
          afterServiceSel: true,
          prev: {
            href: '/beforeAfter',
            title: 'beforeAfter'
          }
        });
      }
      else {
        res.render('login_page', {
          layout: 'mainafter',    //for the better feeling of users
          processSel: true,
          afterServiceSel: false,
          prev: {
            href: '/beforeAfter',
            title: 'beforeAfter'
          }
        });
      }
    }
    else{
      res.render('login_page', {
        venderSel: false,
        suitSel: false,
        bookSel: true,
        prev: {
          href: '/beforeAfter',
          title: 'beforeAfter'
        }
      });
    }
  }
});

app.get('/register', function(req, res) {
  if (typeof req.session.user !== 'undefined') {
    res.redirect(303,'/bookhome');
  } else {
    res.render('register',{
      venderSel: false,
      suitSel: false,
      bookSel: true,
      prev: {
        href: '/login_page',
        title: 'login_page'
      }
    });
  }
});

app.get('/forget', function(req, res) {
  res.render('forget', {
    venderSel: false,
    suitSel: false,
    bookSel: true,
    prev: {
      href: '/login_page',
      title: 'login_page'
    }
  });
});

app.get('/regModify', sessExist,function(req, res) {
  userdb.GetDataBase(
    'account',
    {account: req.session.user.account},
    ['nickname', 'password', 'cellphone', 'email'],
    function(error, data) {
      console.log(data[0]);
      res.render('regModify', {
        venderSel: false,
        suitSel: false,
        bookSel: true,
        userInfo: {
          account: req.session.user.account,
          nickname: data[0][0],
          password: data[1][0],
          cellphone: data[2][0],
          email: data[3][0]
        },
        prev: {
          href: '/bookhome',
          title: 'bookhome'
        }
      });
    }
  );
});

app.get('/bookhome', sessExist, function(req, res) {

  userdb.GetDataBase(
    'shop_info',
    "ALL",
    ['ShopName'],
    function(error, data){
      res.render('bookhome', {
        venderSel: false,
        suitSel: false,
        bookSel: true,
        shopList: data[0],
        user: {
          name: req.session.user.nickname,
          phone: req.session.user.cellphone
        },
        prev: {
          href: '/beforeAfter',
          title: 'beforeAfter'
        }
      });
    }
  );
});

app.get('/suitProcess', function(req, res) {
  //if people have yet logined in, ask to login. 
  if (typeof req.session.user !== 'undefined') {
    /*
    userdb.GetDataBase(
      'custom',
      {account: req.session.user.account},
      ['ShopName','SuitName', 'Process'],
      function(error, data) {
        var optionList = [],
          processList = [];
        for (i in data[0]) {
          optionList.push({
            index:i,
            item:data[0][i]+' '+data[1][i]
          });
        }
        for (i in data[0]) {
          var tmpt = new Array(7)
            .fill(0)
            .fill(1,0,parseInt(data[2][i]));

          processList.push(tmpt);
        }
        processList = JSON.stringify(processList);
        console.log(processList);
        console.log(optionList);
        res.render('process', {
          layout: 'mainafter',
          processSel: true,
          afterServiceSel: false,
          prev:{
            href: '/beforeAfter',
            title: 'beforeAfter'
          },
          optionList: optionList,
          processList: processList
        });
      }
    );
    */
        res.render('process', {
          layout: 'mainafter',
          processSel: true,
          afterServiceSel: false,
          prev:{
            href: '/beforeAfter',
            title: 'beforeAfter'
          }
        });
  }
  else  {
    res.redirect(303,'/login_page');
  }
});

app.get('/afterService', function(req, res) {
  //if people have yet logined in, ask to login.
  if (typeof req.session.user !== 'undefined')  {
    res.render('after_service', {
      layout: 'mainafter',
      processSel: false,
      afterServiceSel: true,
      prev: {
        href: '/beforeAfter',
        title: 'beforeAfter'
      }
    });
  }
  else {
    res.redirect(303,'/login_page');
  }
});

/* middleware */
/* 404 - Not Found  */
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});


/* middleware */
/* 500 server error  */
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});


app.listen(app.get('port'), function(){
	console.log( 'Express started on http://localhost:' +
		app.get('port') + '; press Ctrl-C to terminate.' );
});
