/*
$(document).ready( function() {

  $.validator.addMethod("phoneNum", function(value, element) {
    return this.optional(element) || /^\d{4}-\d{3}-\d{3}$/.test(value);
  }, 'Please enter valid phone number');

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
        url: '/test/regModify',
        success: function(data) {

          if (!data.accountDup) {

            console.log(data.accountDup);
            document.location = data.redirectUrl;
  
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
        required: true
      },
      password: {
        required: true
      },
      password2: {
        required: true,
        equalTo: "#password"
      },
      cellphone: {
        required:true,
        phoneNum: true
      },
      email: {
        required: true,
        email: true
      }
    },
    messages: {
      nickname: {
        required: "*請輸入稱呼"
      },
      password: {
        required: "*請輸入密碼"
      },
      password2: {
        required: "*請輸入確認密碼",
        equalTo: "*輸入確認密碼錯誤"
      },
      cellphone: {
        required: "*請輸入手機",
        phoneNum: "請輸入手機格式 ****-***-***"
      },
      email: {
        required: "*請輸入信箱",
        email: "*信箱格式錯誤"
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
*/
