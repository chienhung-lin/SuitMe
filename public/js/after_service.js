$(document).ready(function(){
  var star = 0;
  $('.star_form>img').on("click",function(event){
    var position = $(this).index();
    for(i = 0; i<= 4; i++){
      if(i <= position) $('.star_form>img').eq(i).attr("src","/img/feedback/white_star.png");
      else $('.star_form>img').eq(i).attr("src","/img/feedback/gray_star.png");
    }
    star = position + 1;
  });
  $('input[name=question_button]').on("click",function(event){
    var question = $('input[name=question]').val();
    $("input[name=question_button]")
      .prop("disabled", true)
      .val("傳送中");

    $.ajax({
      type:'POST',
      dataType:"json",
      data:{Question:question},
      url:'/afterService',
      success:function(data){
        console.log('send success!');
        $('input[name=question_button]').val('已送出');
        $('input[name=question_button]').css("background","#333333");
      },  
      error:function(data){
        console.log('send error!');
      }
    });
  });
  $('input[name=evaluation_button]').on("click",function(event){
    var message = $('input[name=evaluation]').val();
    $("input[name=evaluation_button]")
      .prop("disabled", true)
      .val("傳送中");

    $.ajax({
      type:'POST',
      dataType:'json',
      data:{
        Evaluation:star.toString(),
        Message:message,
      },
      url:'/afterService',
      success:function(data){
        console.log('send success!');
        $('input[name=evaluation_button]').val('已送出');
        $('input[name=evaluation_button]').css("background","#333333");
      },
      error:function(data){
        console.log('send error!');
      }
    });
  });
  return false;
});



