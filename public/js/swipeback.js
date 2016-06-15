$(function(){
  $("body").swipe({
    swipeRight: function(event) {
      document.location = $("head > link[rel=prev]").attr('href');
    },
    threshold: 75
  });
});
