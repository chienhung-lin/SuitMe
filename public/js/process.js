$(function(){

  // closure
  (function(numberlist) {
    var _numberlist = numberlist || [[0,0,0,0,0,0,0]];
    var _initCurr = [0,0,0,0,0,0,0];

    // create object with null init
    processApp = new ProcessApp();
    // store element with jquery object
    processApp.initElement();
    // binding data (not exactly say)
    processApp.initData( _numberlist, _initCurr);
    // render book process with binding data
    processApp.renderBookProgress();
    //add listener,
    // to render with every change of select
    processApp.onChange();

  })(ExternalNumberList);

  // click binding
  registerClick();

});

// logout-box click event----------------
function registerClick() {
  $("div#using-bar div.logout-box").on("click", function(e) {
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
}

//select rander
function ProcessApp () {
  this.data = {};
  this.data.previous = null;
  this.data.current = null;
  this.data.all = null;
  this.selectElement = null;
  this.renderElement = null;
}

ProcessApp.prototype.initElement = function() {
  this.selectElement = $('div.process div#using-bar select');
  this.renderElement = [ {
      pre: $('div.process div.step1.preorder'), //status 0
      post: $('div.process div.step1.postorder') //status 1
    },
    {
      pre: $('div.process div.step2.preorder'), //status 0
      post: $('div.process div.step2.postorder') //status 1
    },
    {
      pre: $('div.process div.step3.preorder'), //status 0
      post: $('div.process div.step3.postorder') //status 1
    },
    {
      pre: $('div.process div.step4.preorder'), //status 0
      post: $('div.process div.step4.postorder') //status 1
    },
    {
      pre: $('div.process div.step5.preorder'), //status 0
      post: $('div.process div.step5.postorder') //status 1
    },
    {
      pre: $('div.process div.step6.preorder'), //status 0
      post: $('div.process div.step6.postorder') //status 1
    },
    {
      pre: $('div.process div.step7.preorder'), //status 0
      post: $('div.process div.step7.postorder') //status 1
    }
  ];
}


ProcessApp.prototype.initData = function(numberList, curr) {
  var current = curr || numberList[0];
  this.dataChange(numberList);
  this.currentChange({
    prev: current,
    curr: current
  });
}

ProcessApp.prototype.dataChange = function(numberList) {
  this.data.all = numberList;
}

ProcessApp.prototype.currentChange = function(status) {
  this.data.previous = status.prev || this.data.current;
  this.data.current = status.curr;
}

ProcessApp.prototype.onChange = function() {
  var processThis = this;
  this.selectElement.on('change', function(event) {
    if (this.value != '') {
      processThis.currentChange({
        curr:processThis.data.all[this.value]
      });
      processThis.renderBookProgress();
    } else {
      // do nothing
    }
  });
}

ProcessApp.prototype.renderBookProgress = function() {
  for (i in this.renderElement) {
    if (this.data.current[i] ^ this.data.previous[i]) {
      if (this.data.current[i]) {
        this.renderElement[i].pre.addClass('hidden-process');
        this.renderElement[i].post.removeClass('hidden-process');
      } else {
        this.renderElement[i].pre.removeClass('hidden-process');
        this.renderElement[i].post.addClass('hidden-process');
      }
    }
  }
}

