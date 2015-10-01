// ==UserScript==
// @name         Local Login
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       Sam Tay
// @match        *.dev/*admin*
// ==/UserScript==

// Set your username and password here
var username = 'samtay',
    password = 'matrix7';

if(typeof Prototype !== "undefined"){
    if ($('page-login') && $('loginForm')) {
        try {
            showPopup();
        } catch(err) {
            console.dir(err);
        }

        $('username').setValue(username);
        $('login').setValue(password);
        $('loginForm').submit();
    }
}

function showPopup(){
    var docHeight = document.viewport.getHeight();

    $$("body").first().insert("<div id='overlay'></div><div id='login-message'>Logging in with Tampermonkey...</div>");

    $("overlay")
        .setStyle({
            'height' : docHeight + 'px',
            'opacity' : 0.4,
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'backgroundColor': 'black',
            'width': '100%',
            'zIndex': 5000
        });

    $("login-message")
        .setStyle({
            'height' : '20px',
            'position': 'absolute',
            'backgroundColor': 'white',
            'width': '200px',
            'zIndex': 5001,
            'padding': '20px',
            'border': '5px solid black'
        });

    var vpWidth = $(document).viewport.getWidth();
    var width = $("login-message").getWidth();

    var avLeft = (vpWidth / 2) - (width / 2) + 'px';

    var vpHeight = $(document).viewport.getHeight();
    var height = $("login-message").getLayout().get('margin-box-height');
    var scrollTop = $(document).viewport.getScrollOffsets().top;
    var avTop = (vpHeight / 2) - (height / 2) + scrollTop + 'px';

    $("login-message")
        .setStyle({
            'top': avTop,
            'left': avLeft
        });
}