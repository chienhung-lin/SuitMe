$(function(){
  function callValidate() {
    console.log('testes');
    $('.main-row').validate({
      debug: true,
      submitHandler: myhander,
      rules: {
        shop: {
          required: true
        },
        question: {
          required: true
        },
        evaluation: {
          required: true,
        }
      },
      messages: {
        shop: {
          required: '*請選擇店家'
        },
      },
      showErrors: function(errorMap, errorList) {
        $(errorList).each(function() {
          $(this.element)
            .next('div.error-box')
            .find('label')
            .text(this.message);
        });

        this.defaultShowErrors();
      },
      errorPlacement: function(error, element) {
        return true;
      },
      highlight: function(element, errorClass) {
        $(element).addClass('error-input')
          .next('div.error-box')
          .find('label')
          .css({color:'rgba(0,51,51,1)'});
      },
      unhighlight: function(element, errorClass) {
        $(element).removeClass('error-input')
          .next('div.error-box')
          .find('label')
          .css({color:''});
      }
    });
  }
  function myhander(form) {
    $("input[type=submit]")
      .prop("disabled", true)
      .val("傳送中").animate({
        textIndex: 60
      },{
        duration: 810,
        step: function(now, fx) {
          $(this).css({
            'background': ('linear-gradient(90deg, rgba(0, 51, 51, 1) 0%, rgba(0, 51, 51, 1) '+now+'%, rgba(0, 51, 51, 0.5) '+now+'%, rgba(0,51, 51, 0.5) 100%)')
          });
        }
      }
    );
  }
});

$(document).ready(function(){
  // logout-box click event----------------
  $("div.logout-container div.logout-box").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();

    $.ajax({
      type: "POST",
      dataType: "json",
      data: {},
      url: '/logout',
      success: function(data) {
        document.location = data.redirectUrl;
      },
      error: function(err) {
        console.log(err);
      }
    });
  });
  
  //evaluation star
  var star = 0;
  $('.star_form>img').on("click",function(event){
    var position = $(this).index();
    for(i = 0; i<= 4; i++){
      if(i <= position) $('.star_form>img').eq(i).attr("src","/img/feedback/white_star.png");
      else $('.star_form>img').eq(i).attr("src","/img/feedback/gray_star.png");
    }
    star = position + 1;
  });

  //submit question
  $('input[name=question_button]').on("click",function(event){
    var question = $('textarea[name=question]').val();
    var shop = $('select[name=shop]').val();
    $("input[name=question_button]")
      .prop("disabled", true)
      .val("傳送中");

    $.ajax({
      type:'POST',
      dataType:"json",
      data:{
        ShopName:shop,
        Question:question
      },
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

  //submit evaluation
  $('input[name=evaluation_button]').on("click",function(event){
    var message = $('textarea[name=evaluation]').val();
    var shop = $('select[name=shop]').val();
    $("input[name=evaluation_button]")
      .prop("disabled", true)
      .val("傳送中");

    $.ajax({
      type:'POST',
      dataType:'json',
      data:{
        ShopName:shop,
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
function textdown(e) {
  textevent = e;
  if (textevent.keyCode == 8) {
    return;
  }
  if ($('.textarea').val().length >= 100) {
    textevent.returnValue = false;
  }
}
function textup() {
  //判斷ID為text的文本區域字數是否超過100個 
  if ($('.textarea').val().length > 100) {
    $('.textarea').val() = $('.textarea').val().substring(0, 100);
  }
}



