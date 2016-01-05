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

/* Focus view initially */
var initiallyFocused = true;

/* Only blur stories (or fully hide them) */
var onlyBlur = false;

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
  };

  var updateStoryStyles = function() {
     $.each($('.tasks img.TINY'), function(idx, img){
         $(this).css({
             'width': 'auto',
             'height': 'auto',
             'margin-bottom': 'auto'
         }).addClass('MEDIUM')
           .removeClass('TINY')
           .attr('src',$(this).attr('src').replace('TINY','MEDIUM'));
     });

     $('.taskboard .story .position-top').css({
        'left': '50px',
        'white-space': 'initial'
     });

     $.each($('.taskboard .story .assignments'), function(idx, img){
        if($(this).find('img').length > 1){
          $(this).css({
              'transition': 'width 0.5s ease-in',
              'width': '40px',
              'height': '40px',
              'display': 'inline-block'
          }).on('mouseenter', function(){
              $(this).css({
                'width': 'auto',
                'display': 'inline'
              });
          }).on('mouseleave', function(){
              $(this).css({
                'width': '40px',
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
  };

  // Add toggle button
  $(buttonTarget).append('<button id="samtay-toggle" class="white" style="float:right;"><span>Toggle Focus</span></button>');
  $('#samtay-toggle').on('click', toggle);

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
    }
  });

})(jQuery);