$(function(){
  var el = $("body"),
    mc = new Hammer(el[0]);

  mc.on('swiperight', onSwipe);

  function onSwipe (event) {
    var angle = Math.abs(event.angle),
      dx = event.deltaX;

    if (dx > 30) {
      $('div.loader-wrapper')
        .animate({
          left: "0%"
        }, {
          duration: 400,
          complete: function() {
            setTimeout(function() {
              document.location = $('head > link[rel=prev]').attr('href');
            }, 400);
          }
        });
    }
  }
});
