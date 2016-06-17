$(function(){
  var el = $("body"),
    mc = new Hammer(el[0]);

  mc.on('swipe', onSwipe);

  function onSwipe (event) {
    var angle = Math.abs(event.angle),
      dx = event.deltaX;

    if (angle < 10 && dx > 30) {
      document.location = $('head > link[rel=prev]').attr('href');
    }
  }
/*
  var el = $("body");
  var mc = new Hammer(el[0]);
  mc.on("swipe", onSwipe);
  mc.on("panstart panmove", onPanMove);
  mc.on("panend", onPanEnd);

  function onSwipe(ev) {
    console.log();
    var angle = Math.abs(ev.angle),
      dx = ev.deltaX;
    if (angle < 10 && dx > 20) {
      // go animate
      // direct to prev page
        document.location = $('head > link[rel=prev]').attr('href');
    };
  }

  function onPanMove(ev) {
    var angle = Math.abs(ev.angle),
      direct = ev.direction,
      deltaX = ev.deltaX;

      console.log(deltaX);
    if (angle < 10 && (direct == Hammer.DIRECTION_RIGHT)) {
      el.css({
        'margin-left': deltaX
      });
    }
  }

  function onPanEnd(ev) {
    var angle = Math.abs(ev.angle),
      direct = ev.direction,
      deltaX = ev.deltaX;

      console.log(deltaX);
    if (angle < 10 && (direct == Hammer.DIRECTION_RIGHT) && deltaX > 70) {
      el.animate({
        'margin-left': el.width()
      }, (el.width()-deltaX)*2.5, function() {
        document.location = $('head > link[rel=prev]').attr('href');
      });
    } else {
      el.animate({
        'margin-left': 0
      }, deltaX*2.5);
    }
  }
*/
  //console.log(el);
});
