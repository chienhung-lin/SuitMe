$(document).ready( function() {

  /* customized valiated method */
  $.validator.addMethod("phoneNum", function(value, element) {
    return this.optional(element) || /^\d{4}-\d{3}-\d{3}$/.test(value);
  }, 'Please enter valid phone number');

  $.validator.addMethod('cjkenUsername', function(value, element) {
    return this.optional(element) || /^(?=.{2,16})(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9\u4e00-\u9fff._-]+(?:[^_.-])$/.test(value);
  }, '2 to 16 chinese, japen, korean, and en character');

  $.validator.addMethod('password', function(value, element) {
    return this.optional(element) || /^(?=(?:.*[a-zA-Z]){2})(?=.*\d)[a-zA-Z0-9]{6,16}$/.test(value);
  }, 'at least 2 char, and total 8 to 16 char and num');
  
  $.validator.addMethod('trimail', function(value, element) {
    return this.optional(element) || /^((?:^\w+(?:[-+.']\w+)*@(?:gmail\.com|yahoo\.com|hotmail\.com)))$/.test(value);
  }, 'gmail.com or yahoo.com or hotmail.com');
  /*------------------------------*/

  $("form#register-form").validate({
    debug: true,
    submitHandler: function(form) {

      var sendData = $("form#register-form").serializeObject();
      delete sendData.password2;
      //for (var key in sendData) sendData[key] = "a" + sendData[key];

      console.log("start submit");

      // disable orgin event behavior
      $.ajax({
        type: "POST" ,
        dataType: "json",
        data: sendData,
        url: '/regModify',
        success: function(data) {
          if (data.successUpdate) {
            console.log(data);
            // if register successful , show popup info
            //  redirect url after close popup
            $('div#register_succ_pop_up').bPopup({
              modalColor: '#333333',
              opacity: 0.6,
              onClose: function(){
                document.location = data.redirectUrl;
              }
            });
          } else {
            $("input[name=account]")
              .addClass("error-input")
                .next("label.myerror")
                .text("*帳號以被註冊過")
                .removeClass("label-hide");
          }
        },
        error: function(error) {
          console.log("fail");
        }
      });

      return false;
      
    },
    rules: {
      nickname: {
        required: true,
        cjkenUsername: true
      },
      password: {
        required: true,
        password: true
      },
      password2: {
        required: true,
        equalTo: "#password",
        password: false
      },
      cellphone: {
        required:true,
        phoneNum: true
      },
      email: {
        required: true,
        trimail: true
      }
    },
    messages: {
      nickname: {
        required: "*請輸入稱呼",
        cjkenUsername: "請輸入6到16個中日韓英.-_之中等字元"
      },
      password: {
        required: "*請輸入密碼",
        password: "*6到16個英文與數字，英文至少2字元"
      },
      password2: {
        required: "*請輸入確認密碼",
        equalTo: "*輸入確認密碼錯誤"
      },
      cellphone: {
        required: "*請輸入手機",
        phoneNum: "*請輸入手機格式 ****-***-***"
      },
      email: {
        required: "*請輸入信箱",
        trimail: "*請輸入gmail, yahoomail, hotmail 其一"
      }
    },
    showErrors: function(errorMap, errorList) {
      console.log(errorMap);
      console.log($(errorList).each(function(){ console.log(this);}));
      $(errorList).each(function(){
        $(this.element).next(".myerror").text(this.message);
      });
      
      this.defaultShowErrors();
    },
    errorPlacement: function(error, element) {
      return true;
    },
    highlight: function(element, errorClass) {
      $(element).addClass("error-input");
      $(element).next(".myerror").removeClass("label-hide");
    },
    unhighlight: function(element, errorClass) {
      $(element).removeClass("error-input");
      $(element).next(".myerror").addClass("label-hide");
    }
  });

});
