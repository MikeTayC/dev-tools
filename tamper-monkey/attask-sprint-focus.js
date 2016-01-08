// ==UserScript==
// @name         Sprint board focused view
// @version      0.1
// @description  Filter irrelevant stories
// @author       Sam Tay
// @match        https://blueacorn.attask-ondemand.com/people
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

/* Sprint Board Focus State */
if (localStorage.getItem('BA:SprintBoard:Focused') === null) {
  localStorage.setItem('BA:SprintBoard:Focused', 'false');
}
if (localStorage.getItem('BA:SprintBoard:Blur') === null) {
  localStorage.setItem('BA:SprintBoard:Blur', 'false');
}
if (localStorage.getItem('BA:SprintBoard:Colors') === null) {
  localStorage.setItem('BA:SprintBoard:Colors', 'false');
}
if (localStorage.getItem('BA:SprintBoard:Icons') === null) {
  localStorage.setItem('BA:SprintBoard:Icons', 'false');
}

var toggleSettingValue = function(setting) {
  console.log(setting);
  if(localStorage.getItem('BA:SprintBoard:' + setting) === 'true'){
    localStorage.setItem('BA:SprintBoard:' + setting, 'false');
    location.reload();
  }else{
    localStorage.setItem('BA:SprintBoard:' + setting, 'true');
    location.reload();
  }
};

/* Focus view initially */
var initiallyFocused = JSON.parse(localStorage.getItem('BA:SprintBoard:Focused'));

/* Only blur stories (or fully hide them) */
var onlyBlur = JSON.parse(localStorage.getItem('BA:SprintBoard:Blur'));

/* Show Color Names */
var showColorNames = JSON.parse(localStorage.getItem('BA:SprintBoard:Colors'));

/* Show Large Icons */
var showLargeIcons = JSON.parse(localStorage.getItem('BA:SprintBoard:Icons'));

console.log(initiallyFocused, onlyBlur, showColorNames, showLargeIcons);

(function($) {
  // Set initial values
  var currentlyFocused = false,
      buttonTarget = 'div.team-title-bar',
      currentUser,
      stories;

  // CSS stuff
  var blurCss = {
    'transition': '175ms all ease-in-out',
    '-webkit-filter':'blur(1.5px)',
    'min-height': '10px',
    'height': '30px'
  };
  var clearCss = {
    '-webkit-filter': 'none',
    'min-height': '60px'
  };

  // Get current user
  $('#user-menu-trigger').click();
  currentUser = $('.my-profile li').attr('title');
  $('#user-menu-trigger').click();

  // Toggle focused view
  var toggle = function() {
    if (currentlyFocused) {
      if (onlyBlur) {
        stories.css(clearCss).off('mouseover').off('mouseout');
      } else {
        stories.show();
      }
    } else {
      if (onlyBlur) {
        stories.css(blurCss).on('mouseover', function() {
          $(this).css(clearCss);
        }).on('mouseout', function() {
          $(this).css(blurCss);
        });
      } else {
        stories.hide();
      }
    }
    currentlyFocused = !currentlyFocused;
    localStorage.setItem('BA:SprintBoard:Focused', currentlyFocused.toString());
  };

  var updateStoryStyles = function() {
    var iconHeight;
    if(showLargeIcons) {
      iconHeight = '40px';
      $.each($('.tasks img.TINY'), function(idx, img){
          $(this).css({
              'width': 'auto',
              'height': 'auto',
              'margin-bottom': 'auto',
              'float': 'left'
          }).addClass('MEDIUM')
            .removeClass('TINY')
            .attr('src',$(this).attr('src').replace('TINY','MEDIUM'));
      });

      $('.taskboard .story .position-top').css({
         'left': '50px',
         'white-space': 'initial'
      });
    }
    // else{
    //   iconHeight = '22px';
    //   $.each($('.tasks img.TINY'), function(idx, img){
    //       $(this).css({
    //           'width': 'auto',
    //           'height': 'auto',
    //           'margin-bottom': 'auto',
    //           'float': 'left'
    //       });
    //   });
    // }

     if(showLargeIcons) {
          $.each($('.taskboard .story .assignments'), function(idx, img){
            if($(this).find('img').length > 1){
              $(this).css({
                  'transition': 'width 0.5s ease-in',
                  'width': iconHeight,
                  'height': iconHeight,
                  'display': 'inline-block'
              }).on('mouseenter', function(){
                  $(this).css({
                    'width': '100%',
                    'display': 'inline'
                  });
              }).on('mouseleave', function(){
                  $(this).css({
                    'width': iconHeight,
                    'display': 'inline-block'
                  });
              });
              $(this).append('<i>' + $(this).find('img').length + '</i>');
              $(this).find('i').css({
                'display': 'inline-block',
                'position': 'absolute',
                  'left': '2px',
                  'bottom' : '2px',
                  'background': '#0074D9',
                  'color': '#fff',
                  'font': 'normal 10px/16px Arial, Helvetica, sans-serif',
                  'text-align': 'center',
                  'height': '16px',
                  'width': '16px',
                  'border-radius': '50%'
              });
            }
         });
    }
  };

  var colorNames = function() {

      var colors = [
              {'#001f3f': '#80BFFF'},
              {'#7FDBFF': '#004966'},
              {'#3D9970': '#163728'},
              {'#AAAAAA': '#111111'},
              {'#01FF70': '#00662C'},
              {'#FF851B': '#663000'},
              {'#85144b': '#EB7AB1'},
              {'#B10DC9': '#EFA9F9'},
              {'#2ECC40': '#0E3E14'},
              {'#DDDDDD': '#111111'},
              {'#0074D9': '#B3DBFF'},
              {'#39CCCC': '#111111'},
              {'#FFDC00': '#665800'},
              {'#FF4136': '#800600'},
              {'#F012BE': '#65064F'},
              {'#111111': '#DDDDDD'},
          ],
          users = {},
          userCount = 0;

      $.each($('.team-member-list .name'), function(idx, name){
          var userName = $(name).html().split(' ')[0], primaryColor, secondaryColor;

          users[userName] = colors[userCount];

          if(userCount <= colors.length - 1) {
              userCount++;
          }else{
              userCount = 0;
          }

          primaryColor = Object.keys(users[userName])[0],
          secondaryColor = users[userName][Object.keys(users[userName])];

          $(this).parents('li').css({'background': primaryColor});
          $(this).css({'color':secondaryColor});
      });

      $.each($('.taskboard .story .portrait'), function(idx, portrait) {
        if($(portrait).attr('title') !== '') {
          var portraitName = $(portrait).attr('title').split(' ')[0],
              primaryColor = Object.keys(users[portraitName])[0],
              secondaryColor = users[portraitName][Object.keys(users[portraitName])];

              if(colorNames && !showLargeIcons) {
                $(portrait).hide();
              }

              $(portrait).after('<span style="background:' + primaryColor + '; color:' + secondaryColor + '; display:block; float:left; clear:both; font-size:10px; line-height:14px; text-align:center;">' + portraitName + '</span>');

              if(showLargeIcons) {
                $(portrait).siblings('span').css({'width':'40px'});
              }else{
                $(portrait).siblings('span').css({'padding':'0 4px'});
              }
        }else{
          $(portrait).hide();
        }

      });

      if(showLargeIcons) {
        $('.taskboard .story .assignments').css({'height': '55px'});
      }
      $('.taskboard .story .assignments > span').css({'float': 'left', 'margin-right': '5px', 'display': 'inline-block'});

  };

  var toggleMenu = function() {
    $('.tm-menu').toggleClass('active');
  };

  var toggleColorNames = function() {
    toggleSettingValue('Colors');
  };

  var toggleBlur = function() {
      toggleSettingValue('Blur');
  };

  var toggleIcons = function() {
      toggleSettingValue('Icons');
  };

  $('#content-team-header').removeClass('overflow-hidden');

  var htmlContent = '<div class="buttons-group">' +
                      '<button id="samtay-toggle" class="white"><span>Toggle Focus</span></button>' +
                      '<button id="tm-menu-toggle" class="white"><span>BA</span><i></i></button>' +
                      '<div class="tm-menu">' +
                          '<a id="toggle-colors" class="menu-link">Toggle Color Names</a>' +
                          '<a id="toggle-large-portraits" class="menu-link">Toggle Large Portraits</a>' +
                          '<a id="toggle-blur" class="menu-link">Toggle Blur On Focus</a>' +
                      '</div>' +
                    '</div>' +
                    '<style>' +
                        '.buttons-group {' +
                          'position: relative;' +
                          'float: right;' +
                        '}' +
                        '.tm-menu {' +
                          'display: none;' +
                          'position: absolute;' +
                          'left: 5px;' +
                          'top: 100%;' +
                          'border: 1px solid #5E8FAA;' +
                          'background: #fff;' +
                          'padding: 5px;' +
                          'border-radius: 3px;' +
                          'z-index: 9999;' +
                        '}' +
                        '.tm-menu.active { display: block; }' +
                        '.tm-menu a { float: left; clear: both; }' +
                        '#samtay-toggle,' +
                        '#tm-menu-toggle {' +
                          'float: right;' +
                          'margin-left: 5px;' +
                        '} ' +
                        '#tm-menu-toggle span {' +
                          'float: left;' +
                        '}' +
                        '#tm-menu-toggle i { ' +
                          'background: url(\'/static/img/s-mdm2.png\') no-repeat -12px -892px;' +
                          'display: block;' +
                          'width: 17px;' +
                          'height: 16px; ' +
                          'float: left;' +
                          'margin-left: 5px' +
                        '}' +
                    '</style>';

  // Add toggle button
  $(buttonTarget).append(htmlContent);
  $('#samtay-toggle').on('click', toggle);
  $('#tm-menu-toggle').on('click', toggleMenu);
  $('#toggle-colors').on('click', toggleColorNames);
  $('#toggle-large-portraits').on('click', toggleIcons);
  $('#toggle-blur').on('click', toggleBlur);

  // Find stories && set initial view
  var previouslyRun = false;
  $(document).ajaxComplete(function(ev, xhr) {
    if (previouslyRun) return;
    if (xhr.responseText.indexOf('"objCode":"TASK"') !== -1) {
      stories = $('.story').filter(function() {
        return !$(this).find('img.TINY[title="' + currentUser + '"]').length;
      });
      initiallyFocused && toggle();
      previouslyRun = true;
      updateStoryStyles();
      showColorNames && colorNames();
    }
  });

})(jQuery);