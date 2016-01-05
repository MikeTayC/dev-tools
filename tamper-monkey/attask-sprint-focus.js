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
    }
  });
})(jQuery);
