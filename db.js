var filter = require('filter-object');

var exports = module.exports = Dbs;

/* demo database */
var SHOP_INFO = {
	'shop-1': {
		name: 'shop-1',
		supplies: ['suit', 'uniform', 'sewing'],
		clothes: ['bahamas_nat-ba-01', 'fortuny_2vft-01', 'hero_uhm-he-01']
	},
	'shop-2': {
		name: 'shop-2',
		supplies: ['suit', 'uniform'],
		clothes: ['bahamas_nat-ba-01', 'marbellous_bx4587', 'fortuny_2vft-01']
	},
	'shop-3': {
		name: 'shop-3',
		supplies: ['suit'],
		clothes: ['hero_uhm-he-01', 'scatola_2vsz-03']
	},
	'shop-4': {
		name: 'shop-4',
		supplies: ['sewing', 'polish_cloth'],
		clothes: ['bahamas_nat-ba-01', 'marbellous_bx4587']
	},
	'shop-5': {
		name: 'shop-5',
		supplies: ['suit', 'uniform', 'sewing', 'polish_cloth'],
		clothes: ['scatola_2vsz-03', 'fortuny_2vft-01', 'bahamas_nat-ba-01', 'marbellous_bx4587', 'hero_uhm-he-01']
	}
};

var DEFAULT_SHOP = Object.keys(SHOP_INFO)[0];

function Dbs ( _mydefault ) {
  this.curr_store =  _mydefault || DEFAULT_SHOP;
  this.getCurrInfo = getCurrInfo;
  this.getFilterCol = getFilterCol;
}

function getCurrInfo(index) {
  this.curr_store = index || this.curr_store || DEFAULT_SHOP;
  return SHOP_INFO[this.curr_store];
}

function getFilterCol(option) {
  var keys = Object.keys(SHOP_INFO);
  var values = keys.map(function(key) {
    return SHOP_INFO[key];
  });

  return values.map(function(each_data){
    return filter(each_data, option);
  });
}
