function element(ele, option) {
  this.width = option.width || undefined;
  this.height = option.height || undefined;
  this._top = option._top || undefined;
  this.poly = option.poly || undefined;

  this.pPos = option.pPos || undefined;

  this.ele = ele || undefined;
}

element.prototype = {
  init: function (option) {
    this.width = option.width || undefined;
    this.height = option.height || undefined;
    this._top = option._top || undefined;
    this.poly = option.poly || undefined;
    this.pPos = option.pPos || undefined;
  },
  clip_path: function(poly) {
    return 'polygon('+
      poly[0][0]+'px'+' '+poly[0][1]+'px'+','+
      poly[1][0]+'px'+' '+poly[1][1]+'px'+','+
      poly[2][0]+'px'+' '+poly[2][1]+'px'+','+
      poly[3][0]+'px'+' '+poly[3][1]+'px'+')';
  },
  update: function (option) {
    if(typeof option !== 'undefined') {
      this.init(option);
    }

    var width = this.width+'px',
      height = this.height+'px',
      clip_path = this.clip_path(this.poly),
      _top = this._top,
      p_left = ((this.pPos && this.pPos.pLeft)||10) +'px',
      p_top = ((this.pPos && this.pPos.pTop)||200) +'px',
      target = $(this.ele);

    target.css({
      'width': width,
      'height': height,
      '-webkit-clip-path': clip_path,
      'clip-path': clip_path,
      'top': _top
    });

    target.find('img').css({
      'width': width
    });

    target.find('p').css({
      'top':p_top,
      'left':p_left
    });
  }
}

$(document).ready(function(){
  var baseWidth = $(document).width(),
    slop = 0.4;

  _height_1 = 60+slop*baseWidth;
  _top_1 = 0;
  poly_1 = [
    [0,0],
    [baseWidth,0],
    [baseWidth, (_height_1 - slop*baseWidth)],
    [0, _height_1]
  ];

  _height_2 = baseWidth;
  _top_2 = _top_1 + slop*baseWidth;
  poly_2 = [
    [0,slop*baseWidth],
    [baseWidth,0],
    [baseWidth, (_height_2 - slop*baseWidth)],
    [0, _height_2]
  ];

  _height_3 = baseWidth;
  _top_3 = _top_2 + slop*baseWidth - 20;
  poly_3 = [
    [0,slop*baseWidth],
    [baseWidth,0],
    [baseWidth, _height_3],
    [0, (_height_3-slop*baseWidth)]
  ];

  _height_4 = baseWidth;
  _top_4 = _top_3 + slop*baseWidth - 20;
  poly_4 = [
    [0,0],
    [baseWidth,slop*baseWidth],
    [baseWidth, _height_4],
    [0, (_height_4-slop*baseWidth)]
  ];

  _height_5 = baseWidth;
  _top_5 = _top_4 + slop*baseWidth - 20;
  poly_5 = [
    [0,0],
    [baseWidth,slop*baseWidth],
    [baseWidth, (_height_5-slop*baseWidth)],
    [0, _height_5]
  ];

  _height_6 = baseWidth;
  _top_6 = _top_5 + slop*baseWidth - 20;
  poly_6 = poly_2;

  _height_7 = slop*baseWidth+20;
  _top_7 = _top_6 + slop*baseWidth - 20;
  poly_7 = [
    [0, slop*baseWidth],
    [baseWidth, 0],
    [baseWidth, _height_7],
    [0, _height_7]
  ];

  $('div.tmpt').css({
    'width': ''+baseWidth,
    'height': (''+(80+baseWidth*5-slop*baseWidth*4+100)+'px'),
    'background': ('linear-gradient(180deg,'+
      'rgba(88, 105, 125, 1)'+0+'px,'+
      'rgba(88, 105, 125, 1)'+(_height_1+_height_2-slop*baseWidth+20)+'px,'+
      'rgba(117, 157, 167, 1)'+(_height_1+_height_2-slop*baseWidth+20)+'px,'+
      'rgba(117, 157, 167, 1)'+(_height_1+_height_2+_height_3-2*slop*baseWidth+40)+'px,'+
      'rgba(204, 218, 227, 1)'+(_height_1+_height_2+_height_3-2*slop*baseWidth+40)+'px,'+
      'rgba(204, 218, 227, 1)'+(_height_1+_height_2+_height_3+_height_4-3*slop*baseWidth+60)+'px,'+
      'rgba(88, 105, 125, 1)'+(_height_1+_height_2+_height_3+_height_4-3*slop*baseWidth+60)+'px,'+
      'rgba(88, 105, 125, 1)'+(_height_1+_height_2+_height_3+_height_4+_height_5-4*slop*baseWidth+80)+'px,'+
      'rgba(117, 157, 167, 1)'+(_height_1+_height_2+_height_3+_height_4+_height_5-4*slop*baseWidth+80)+'px,'+
      'rgba(117, 157, 167, 1)'+(80+baseWidth*5-slop*baseWidth*4+100)+'px)')
  });

  var select_start = new element(
    'div.select_start', {
      width: baseWidth,
      height: 60+slop*baseWidth,
      _top: _top_1,
      poly: poly_1
    }
  ),
  store_1 = new element(
    'div.store_1',{
      width: baseWidth,
      height: baseWidth,
      _top: -_top_2,
      poly: poly_2,
      pPos: {
        pLeft: (0.07*baseWidth),
        pTop: (0.75*baseWidth),
      }
    }
  ),
  store_2 = new element(
    'div.store_2', {
      width: baseWidth,
      height: baseWidth,
      _top: -_top_3,
      poly: poly_3,
      pPos: {
        pLeft: baseWidth-$('div.store_2 p').width()-(0.07*baseWidth),
        pTop: (0.75*baseWidth)
      }
    }
  ),
  store_3 = new element(
    'div.store_3', {
      width: baseWidth,
      height: baseWidth,
      _top: -_top_4,
      poly: poly_4,
      pPos: {
        pLeft: baseWidth-$('div.store_2 p').width()-(0.07*baseWidth),
        pTop: (0.75*baseWidth)
      }
    }
  ),
  store_4 = new element(
    'div.store_4', {
      width: baseWidth,
      height: baseWidth,
      _top: -_top_5,
      poly: poly_5,
      pPos: {
        pLeft: (0.07*baseWidth),
        pTop: (0.75*baseWidth)
      }
    }
  ),
  store_5 = new element(
    'div.store_5', {
      width: baseWidth,
      height: baseWidth,
      _top: -_top_6,
      poly: poly_6,
      pPos: {
        pLeft: (0.07*baseWidth),
        pTop: (0.75*baseWidth)
      }
    }
  ),
  select_end = new element(
    'div.eleft', {
      width: baseWidth,
      height: baseWidth,
      _top: -_top_7,
      poly: poly_7
    }
  );

  select_start.update();
  store_1.update();
  store_2.update();
  store_3.update();
  store_4.update();
  store_5.update();
  select_end.update();

});

$(function(){
  $('div.clickable').on("click", function(event) {
    var shop_name = $(this).find('p').text(),
        shop_id = $(this).data('shopid');
        ShopObj = { ShopName: shop_name }

    $('div[data-coverid='+shop_id+']')
      .removeClass('store-hidden')
      .animate({
        opacity: 1
      }, 1000, function() {
        redirectPage();
      });
  });

  function redirectPage() {
    // ajax redirecit page
    $.ajax({
      type: 'POST',
      dataType: 'json',
      data: ShopObj,
      url: '/selectStore',
      success: function(data) {
        setTimeout(function() {
          document.location = data.redirectUrl;
        }, 500);
      },
      error: function(error) {
        console.log('error');
        console.log(error);
      }
    });
    return false;
  };

});
