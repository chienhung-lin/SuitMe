$(function(){

  register();
  callValidate();

  function register() {
    $.validator.addMethod("phoneNum", function(value, element) {
      return this.optional(element) || /^\d{4}-\d{3}-\d{3}$/.test(value);
    }, 'Please enter valid phone number');
  }

  function callValidate() {
    console.log('testes');
    $('form#book_form').validate({
      debug: true,
      submitHandler: myhander,
      rules: {
        shop: {
          required: true
        },
        time: {
          required: true
        },
        phone: {
          required: true,
          phoneNum: true
        }
      },
      messages: {
        shop: {
          required: '*請選擇店家'
        },
        time: {
          required: '*請選擇時間'
        },
        phone: {
          required: '*請輸入電話號碼，如：0999-111-111',
          phoneNum: '*請輸入電話號碼，如：0999-111-111'
        }
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

    // collect input data under form dom
    var serialData = $(form).serializeObject();
    var _sendData = {
      shop: (serialData.shop || ''),
      reserv_time: (serialData.time || '')
    };
    $.ajax({
      type: "POST",
      dataType: "json",
      data: _sendData,
      url:  '/book',
      success: function(data) {
        $('input[type=submit]').animate({
          textIndex: 100
        },{
          duration: 540,
          step: function(now, fx) {
            $(this).css({
              'background': ('linear-gradient(90deg, rgba(0, 51, 51, 1) 0%, rgba(0, 51, 51, 1) '+now+'%, rgba(0, 51, 51, 0.5) '+now+'%, rgba(0,51, 51, 0.5) 100%)')
            });
          },
          complete: function() {
            $("input[type=submit]").val("送出成功");
          }
        });
      },
      error: function(data) {
        console.log("error");
      }
    });
    return false;
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

  // render book time by ajax data--------------
  $("select[name=shop]").change(function(){

    var _send = {
      shop_id: $(this).val()
    };

    $.ajax({
      type: "POST",
      dataType: "json",
      data: _send,
      url: '/render/booktime',
      success: function(data) {

        var option_data = data.map(function(e) {
          return $("<option value='"+e+"'>"+e+"</option>");
        });

        $("select[name=time] option:not([value=''])").remove("option");
        $("select[name=time]").append(option_data);
      },
      error: function(error) {
        console.log(error);
      }
    });
  });
  //-------------------------------------------

});
