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
  
  $('div.tmpt div.clickable').on('click', function(event) {
    $('div.slide-vender-home-page').removeClass('my-hidden');
    swiper.update(true);
    swiper.unlockSwipeToNext();
    swiper.slideTo(1);
    swiper.lockSwipeToNext();
  });

  $('div.slide-vender-home-page div a').on('click', function(event) {
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
