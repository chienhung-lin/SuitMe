$(document).ready(function(){

	$("select[name=shop]").on("change", function(event){
		console.log( this.value );

		var select_shop = this.value;

		/* using POST, sending data by json format */
		$.ajax({
			type: "POST",
			dataType: "json",
			data:{
				shopid: select_shop
			},
			url: '/updateShop',
			success:function(data){
				console.log('success');
        document.location = data.redirectUrl;
			},
			error:function(){
				console.log('fail');
			}
		});//ajax end

	});//on change event binding end

});// document ready end
