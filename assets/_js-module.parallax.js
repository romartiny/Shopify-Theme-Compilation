define(['jquery', 'utils'], function($, utils) { 

  console.log('Module Paralax is loaded');

  function init(parallaxContainer) {

    var $parallaxContainer = $(parallaxContainer);
    var $header = $(".header");
    var $parallaxBase = $parallaxContainer.find('.parallax__base');
    var $parallaxBack = $parallaxContainer.find('.parallax__back');

    var scrollBarWidth = utils.getScrollBarWidth();
    var coordsBase = $parallaxBase[0].getBoundingClientRect();

    if ($parallaxContainer.length === 0 || $('.header').hasClass('header--fixed-off')) {
      $parallaxBack.removeClass('parallax__back');
      $parallaxBase.removeClass('parallax__base');

      $(window).scroll(function(e) { //переписати
        var y = $(window).scrollTop();
        // Start fade up animation
        if (y > 200) {
          $parallaxContainer.addClass('parallax-move');
        }
      });
      return null;
    }

    document.body.addEventListener('drawer-open', function() {
      $parallaxBack[0].style.paddingRight = scrollBarWidth + 'px';
    });

    document.body.addEventListener('drawer-closed', function() {
      $parallaxBack[0].style.paddingRight = '';
    });

    // for fadeup animation
    var windowBase = ($(window).height() - $(window).height() * 0.04);
    var emptyDiv = $('<div/>').addClass('empty-div').css('height', $parallaxBack.height());

    $parallaxBase.before(emptyDiv);

    if (!$header.hasClass('header--clear')) {
      $parallaxBack.css({
        'transform': 'translate3d(0, ' + coordsBase.top + 'px, 0)',
        '-webkit-transform': 'translate3d(0, ' + coordsBase.top + 'px, 0)'
      });
    }

    $(window).scroll(function(e) {
      window.requestAnimationFrame(function() {
        if ($('body').hasClass('cart-open')) {
          return 0;
        }

        var y = $(window).scrollTop();

        if (y > 80 && !$header.hasClass('header--clear')) {
          $parallaxBack.css({
            'transform': 'translate3d(0, 80px, 0)',
            '-webkit-transform': 'translate3d(0, 80px, 0)',
          });
          $parallaxBase.css({
            'transform': 'translate3d(0, -80px, 0)',
            '-webkit-transform': 'translate3d(0, -80px, 0)'
          });
        } else if (y < 80 && !$header.hasClass('header--clear')) {
          $parallaxBack.css({
            'transform': 'translate3d(0, ' + coordsBase.top + 'px, 0)',
            '-webkit-transform': 'translate3d(0, ' + coordsBase.top + 'px, 0)'
          });
          $parallaxBase.css({
            'transform': 'translate3d(0, 0, 0)',
            '-webkit-transform': 'translate3d(0, 0, 0)',
          });
        }

        // Start fade up animation
        if (y > 200) {
          $parallaxContainer.addClass('parallax-move');
        }
      });
    });
  }

  return {
    init: init
  };
});
