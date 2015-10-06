// ==UserScript==
// @name         Local Login - M2
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       Sam Tay
// @match        *.dev/*admin*
// ==/UserScript==

window.onload = function() {
  if(typeof jQuery !== "undefined") {
    (function($) {
      if ($('body.adminhtml-auth-login').length) {
        try {
          showPopup($);
        } catch(err) {
          console.log(err);
        }
        $('#username').val('samtay');
        $('#login').val('matrix7');
        $('#login-form').submit();
      }
    })(jQuery);
  }
};

function showPopup($){
  var docHeight = $(window).width();

  $("body").append("<div id='overlay'></div><div id='login-message'>Logging in with Tampermonkey...</div>");

  $("#overlay")
      .css({
        'height' : docHeight + 'px',
        'opacity' : 0.4,
        'position': 'absolute',
        'top': 0,
        'left': 0,
        'backgroundColor': 'black',
        'width': '100%',
        'zIndex': 5000
      });

  $("#login-message")
      .css({
        'height' : '80px',
        'position': 'absolute',
        'backgroundColor': 'white',
        'width': '200px',
        'zIndex': 5001,
        'padding': '20px',
        'border': '5px solid black'
      });

  var vpWidth = $(window).width();
  var width = $("#login-message").width();

  var avLeft = (vpWidth / 2) - (width / 2) + 'px';

  var vpHeight = $(window).height();
  var height = $("#login-message").height();
  var scrollTop = $(window).scrollTop();
  var avTop = (vpHeight / 2) - (height / 2) + scrollTop + 'px';

  $("#login-message")
      .css({
        'top': avTop,
        'left': avLeft
      });
}
