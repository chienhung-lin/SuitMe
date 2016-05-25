$(document).ready(function(){
	$('div#nav-bar')
		.on('click', 'div.myitem', function(e){
			if(!$(this).hasClass('active')) {
				$(this)
					.addClass('active')
					.siblings('div.myitem')
						.removeClass('active');
			}			
		}
	);
});



/**************** 08+09   ********************/

;(function($) {        
  $(function() {           
    $('.s-shoulder ').bind('click', function(e) {
      e.preventDefault();
      $('.suit-popup.shoulder').bPopup({
        fadeSpeed: 'slow', 
        followSpeed: 1500, 
      });
    });
  });
})(jQuery);	
;(function($){$(function(){$('.s-button').bind('click',function(e){e.preventDefault();$('.suit-popup.button').bPopup({fadeSpeed:'slow',followSpeed: 1500,});});});})(jQuery);	
;(function($){$(function(){$('.s-pocket').bind('click',function(e){e.preventDefault();$('.suit-popup.pocket').bPopup({fadeSpeed:'slow',followSpeed: 1500,});});});})(jQuery);	
;(function($){$(function(){$('.s-hand').bind('click',function(e){e.preventDefault();$('.suit-popup.hand').bPopup({fadeSpeed:'slow',followSpeed: 1500,});});});})(jQuery);	
;(function($){$(function(){$('.s-pants').bind('click',function(e){e.preventDefault();$('.suit-popup.pants').bPopup({fadeSpeed:'slow',followSpeed: 1500,});});});})(jQuery);	
/*appin*/
function blinker() {
    $('.appin').fadeOut(500);
    $('.appin').fadeIn(500);
}

setInterval(blinker, 100);
