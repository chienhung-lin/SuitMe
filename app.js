var express = require('express');
/* tempalte engine*/
var exphbs = require('express-handlebars');
/* third parts middleware */
var bodyParser = require('body-parser');
var session = require('express-session');
var redis = require('redis');
var redisStore = require('connect-redis')(session);

var dbs = require('./db.js');
var userdb = require('./lib/userdb.js');

/* port.js
 *
 * module.exports.port = [port number]
 */
var port = require('./port.js').port;

var app = express();
var redisClient = redis.createClient();

var db = new dbs('shop-1');

/* default presented data */
var INIT_STORE = db.getCurrInfo();

/******************************************
 * store init value in locals             *
 *                                        *
 * app.locals.store for record shop info  *
 * and presenting in web site             *
 ******************************************/
app.locals.store = INIT_STORE;

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

app.use(session({
  secret: 'helloworld something terroble and oh no',
  store: new redisStore({
    client: redisClient,
    ttl: 30*24*60*60
  }),
  saveUninitialized: false,
  resave: false
}));

function sessExist(req, res, next) {
  if(typeof req.session.user === 'undefined') {
    res.redirect(303, '/login_page');
  } else {
    next();
  }
};

app.use( express.static( __dirname + '/public' ) );
app.use( bodyParser.urlencoded({ extended: false }));

/* login restful api */
app.post('/login',function(req, res) {
  var login = req.body;
  /* if havn't loged in */

  userdb.myGetAccountCheck({
    account: login.account,
    password: login.password
  }, function(error, data) {
    console.log('login post api testing for myGetAccountCheck');
    console.log(data);
    /* if login success, redirect to /user  */
    if ( typeof data !== 'undefined' ) {
      req.session.user = data;
      res.redirect(303,'/user');
    /* else, login faill, redirect to /login_page  */
    } else {
      res.redirect(303,'back');
    }  
  });

});

app.post('/logout', function(req, res) {
  if (req.session.user) {
    req.session.destroy(function(){
      res.redirect(303, '/login_page');
    });
  } else {
    res.redirect(303, '/login_page');
  }
});

app.post('/register', function(req, res) {

  console.log('register post api req.body');
  console.log(req.body);

  userdb.AddSheetData('SuitApp', 'account', req.body);
  res.status(200).send({
    accountDup: false,
    redirectUrl: '/login_page'
  });
});

/* register post api */
/* support client use ajax */
/*
app.post('/register', function(req, res) {
  var regData = req.body;
  
  if (typeof req.session.user !== 'undefined') {
    res.redirect(303, '/user');
  } else {
    userdb.AddSheetData('SuitApp','account', regData);
    res.redirect(303, '/login');
  }
});
*/

/*
// update "res.locals.store"
app.post('/updateShop', function(req, res) {
	app.locals.store = db.getCurrInfo(req.body.shopid);
	res.send({redirectUrl:'/vender_info'});
});
*/

app.get('/', function(req, res) {
	res.render('home');
});

/*
// render for form-select option
app.get('/vender_choose', function(req, res) {

	res.render('vender_choose', {

		shop_lists: function() {
			var shops = db.getFilterCol(['name']);

			return shops.map(function(each){
				return {name: each.name, is_curr: (each.name == app.locals.store.name)};
			});
		}//function()

	});//res.render

});
*/

app.get('/vender_info', function(req, res) {
	res.render('vender_info', {
		store: app.locals.store
	});
});

app.get('/suithome', function(req, res) {
  res.render('suithome', {
    venderSel: false,
    suitSel: true,
    bookSel: false
  });
});

app.get('/venderhome', function(req, res) {
  res.render('venderhome', {
    venderSel: true,
    suitSel: false,
    bookSel: false
  });
});

app.get('/venderhistory', function(req, res) {
  res.render('venderhistory', {
    venderSel: true,
    sutiSel: false,
    bookSel: false
  });
});

app.get('/cloth', function(req, res) {
  res.render('cloth', {
    venderSel: true,
    suitSel: false,
    bookSel: false
  });
});

app.get('/feedback', function(req, res) {
  res.render('custom_feedback', {
    venderSel: true,
    suitSel: false,
    bookSel: false
  });
});

app.get('/login_page', function(req, res) {
  if (typeof req.session.user !== 'undefined') {
    res.redirect(303,'/user');
  } else{
    res.render('login_page', {
      venderSel: false,
      suitSel: false,
      bookSel: true
    });
  }
});

app.get('/register', function(req, res) {
  if (typeof req.session.user !== 'undefined') {
    res.redirect(303,'/user');
  } else {
    res.render('register');
  }
});

app.get('/user', sessExist,function(req, res) {
  res.render('user', {
    venderSel: false,
    suitSel: false,
    bookSel: true,
    user: req.session.user
  });
});

app.get('/bookhome', sessExist, function(req, res) {
  res.render('bookhome');
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
