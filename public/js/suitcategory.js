/*Categoryofsuit*/
$(function() {
  $.scrollify({
    section : ".category",
    sectionName : "section-name",
    interstitialSection : "",
    easing: "easeOutExpo",
    scrollSpeed: 1000,
    offset : 0,
    scrollbars: true,
    standardScrollElements: "",
    setHeights: true,
    before:function() {},
    after:function() {},
    afterResize:function() {},
    afterRender:function() {}
  });
});
					
$(document).ready(function() {
  $(".cat_show").click(function() {
    $(".cat_hide").fadeIn();
    $(".cat_show").fadeOut();
  });
});
