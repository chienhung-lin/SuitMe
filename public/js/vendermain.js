var App = {
  current_shop_id: '大帥西裝'
};

$(document).ready(function() {
  var swiper = new Swiper('.swiper-container',{
    observer: false,
    onSlideChangeStart: function(_swiper) {
    },
    onSlidePrevEnd: function(_swiper) {
    }
  });

  console.log(swiper.slides.length);
  $(swiper.slides.slice(2,6)).addClass('my-hidden');
  swiper.lockSwipeToNext();
  swiper.update(true);
 

  // select click
  $('div.tmpt div.clickable').on('click', function(event) {

      /*
        $('div.vender-left-top a img,'+
          'div.vender-right-top a img,'+
          'div.vender-right-mid a img,'+
          'div.vender-bottom a img')
        .on('load', function(event) {
          swiper.unlockSwipeToNext();
          swiper.slideTo(1);
          swiper.lockSwipeToNext();
        });
      */

    var shop_name = App.current_shop_id = $(this).find('p').text() || App.current_shop_id;
		$.ajax({
		  url: '/api/getvenderinfo',
		  method: 'POST',
		  dataType: 'json',
		  data: { shop_id: shop_name},
		  success: function(data) {
		    console.log(data);

        $('div.vender-left-top a img').attr({src: data.HomeImg[0]});
        $('div.vender-right-top a img').attr({src: data.HomeImg[1]});
        $('div.vender-right-mid a img').attr({src: data.HomeImg[2]});
        $('div.vender-bottom a img').attr({src: data.HomeImg[3]});
        
        
        // filled other page
        $('div.slide-vender-history-page div p.story_title').text(shop_name);
        $('div.slide-vender-history-page div p.story_content')
          .empty()
          .append(data.History.map(function(d) {
            return d + '<br><br>'; 
          }));

        //
        $('div.slide-contact-page div div.shop_info b')
          .text(shop_name);
        $('div.slide-contact-page div div.shop_info p#shop-opentime')
          .text('營業時間：'+data.OpenTime);
        $('div.slide-contact-page div div.shop_info p#shop-telephone')
          .text('營業時間：'+data.Telephone);
        $('div.slide-contact-page div div.shop_info p#shop-address')
          .text('營業時間：'+data.Address);
        $('div.slide-contact-page div div.shop_map iframe')
          .attr("src", "http://maps.google.com.tw/maps?f=q&hl=zh-TW&geocode=&q="
            + data.Address
            +"&z=15&output=embed&t=>");
        
        //cloth
        var _append = data.Cloth.map(function(d){
          return "<div class='gallery' "+
            "style='background-image: url("+d+");'></div>";
        }).join('');
        $('div.slide-clothes-page div.cloth-box div.cloth-inner-box')
          .empty()
          .append( _append );
		  },
		  error: function(error) {
		    console.log(error);
		  }
		});

	  //feedback
	  $.ajax({
			  url: '/api/getdata',
			  method: 'POST',
			  dataType: 'json',
			  data: { shop_id: shop_name},
			  success: function(data) {
          console.log(feedBackHtml);
          var feedBackHtml = data.FeedBack.map(function(d) {
            return "<div class='comment'>"+
              "<div class='star'>"+d.Evaluation+"<img scr='/img/feedback/level_star.png'>"+"</div>"+
              "<div class='avatar'><img src='/img/feedback/custom_feedback.jpg'></div>"+
              "<div class='content'><a class='author'>"+d.UserName+"</a>"+
                "<div class='metadata'>"+d.Time+"</div>"+
                "<div class='text'>"+d.Message+"</div>"+
              "</div>"+
            "</div>"+
            "<img src='/img/feedback/line.jpg' class='line'>";
          }).join('');
          console.log(feedBackHtml);
          $('div#customer-comments').empty().append( feedBackHtml );
	      },
	      error: function(error, data) {
	        console.log(error);
	      },
        complete: function() {
	        swiper.unlockSwipeToNext();
	        swiper.slideTo(1);
	        swiper.lockSwipeToNext();
        }
	  });

  });

  $('div.slide-vender-home-page div a').on('click', function(event) {
    console.log(App);
    var _target_page = $(this).attr("value");
      _target_page_nu = _target_page == 'slide-vender-history-page'?2:
        _target_page == 'slide-contact-page'?3:
        _target_page == 'slide-clothes-page'?4:
        _target_page == 'slide-feedback-page'?5: 1;
                        

    $(swiper.slides.slice(2,6)).addClass('my-hidden');
    $('div.' + _target_page).removeClass('my-hidden');
    swiper.update(true);
    swiper.unlockSwipeToNext();
    swiper.slideTo( _target_page_nu );
    swiper.lockSwipeToNext();
  });

});
