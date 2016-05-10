var express = require('express');

/* tempalte engine*/
var exphbs = require('express-handlebars');

/* third parts middleware */
var bodyParser = require('body-parser');

var dbs = require('./db.js');

var app = express();

var DEFAULT_SHOP = 'shop-1';

var db = new dbs(DEFAULT_SHOP);

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

app.set('port', process.env.PORT || 8088);

app.use( express.static( __dirname + '/public' ) );
app.use( bodyParser.urlencoded({ extended: false }));

/* update "res.locals.store" */
app.post('/updateShop', function(req, res) {
	app.locals.store = db.getCurrInfo(req.body.shopid);

  /* redirect is false, "bug" */
	res.redirect(303,'/');
});

app.get('/', function(req, res) {
	res.render('home');
});

app.get('/about', function(req, res) {
	res.render('about');
});


/* render for form-select option */
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

app.get('/vender_info', function(req, res) {
	res.render('vender_info', {
		store: app.locals.store
	});
});


app.get('/suit_knowledge', function(req, res) {
	res.render('suit_knowledge');
});

app.get('/reservation', function(req, res) {
	res.render('reservation');
});

app.get('/login_page', function(req, res) {
  res.render('login_page');
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
