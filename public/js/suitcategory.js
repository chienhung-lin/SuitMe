$(function(){
  $(".cat_opening").click(function(){
    $(".cat_opening").addClass("byebye");
    $(".category").removeClass("byebye");
    $(".cat_opening").addClass("byebye");
    $.scrollify({
      section : ".category",
      // interstitialSection : ".category",
      easing: "easeOutExpo",
      scrollSpeed: 700,
      offset : 0,
      scrollbars: false,
      setHeights: false
    });
  });   
});

$(function () {
  var count = 0;
  var start = new Date().getTime();
  $('.category').click(function () {
    count += 1;
    var end = new Date().getTime();
    var time = (end - start)/1000;
    if(count %10==1) {
      start = end;
    }
    if (count % 10==0) {    
      alert("你按了10下螢幕"+'在' + time+'秒內');
    }
  });
});
