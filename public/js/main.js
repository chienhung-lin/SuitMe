<<<<<<< HEAD
$(document).ready(function(){
  $('div#nav-bar')
    .on('click', 'div.myitem', function(e){
      if(!$(this).hasClass('active')) {
        $(this)
          .addClass('active')
          .siblings('div.myitem')
          .removeClass('active');
      }     
    });
});
=======
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
>>>>>>> d8cefaa177165d930d0608522f3200f95eb75f52
