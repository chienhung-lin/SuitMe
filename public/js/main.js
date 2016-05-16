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