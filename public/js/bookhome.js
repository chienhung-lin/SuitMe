/*
$.ajax({
    type: "POST",
    dataType: "json",
    data: {shop_id:'大帥西裝'},
    url: '/render/booktime',
    success: function(data) {
      console.log(data);
    },
    error: function(error) {
      console.log(error);
    }
  });
*/
$(document).ready(function(){

  $("input[type=submit]").on("click", function(event) {

    $("input[type=submit]")
      .prop("disabled", true)
      .val("傳送中");


    // collect input data under form dom
    var serialData = $("[form=book_form]").serializeObject();
    var _sendData = {};
    _sendData.time = new Date();
    _sendData.shop = serialData.shop;
    _sendData.reserv_time = serialData.time;
  
    $.ajax({
      type: "POST",
      dataType: "json",
      data: _sendData,
      url:  '/book',
      success: function(data) {
        $("input[type=submit]").val("送出成功");
      },
      error: function(data) {
        console.log("error");
      }
    });
    
    return false;
  });

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
        var option_data = {};

        option_data = data.map(function(e) {
          return $("<option value='"+e+"'>"+e+"</option>");
        });
        $("select[name=time] option:not([disabled])").remove("option");

        $("select[name=time]").append(option_data);
      },
      error: function(error) {
        console.log(error);
      }
    });

  });

});
