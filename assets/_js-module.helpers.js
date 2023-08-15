define(['jquery', 'utils'], function($, utils) {

  console.log('Module Helpers is loaded');

  // For elements that is folded (for example on product page, mobile view)
  function foldElements(element) {
    var $foldContainers = $(element);

    if ($foldContainers.length === 0) {
      return 0;
    }

    var $foldToggle = $foldContainers.find('.fold__toggle');
    $foldToggle.click(function(e) {
      var $foldElement = $(e.target).closest('.fold')
      $foldElement.toggleClass('open');

      if ($foldElement.find('.swiper-container').length > 0) {
        utils.triggerEvent(window, 'resize');
      }
    });
  }

  // Make image as background for covering all container
  function coverImg(holdersClass) {
    var $imgHolders = $(holdersClass);

    if ($imgHolders.length === 0) {
      return 0;
    }

    $imgHolders.each(function() {

      var $img = $(this).find('img');
      $img.css('display', 'none');

      $(this).css({
        'background-image': 'url(' + $img.attr('src') + ')',
        'background-repeat': 'no-repeat',
        'background-position': '50% 50%',
        'background-size': 'cover'
      });
    });
  }

  // Show/hide recovery password form
  function initRecoverPasswordForm(container) {
    var $container = $(container);

    if ($container.length === 0) {
      return 0;
    }

    var $this = this;

    var recoverPasswordLink = $container.find('.js-forget-password');
    var hideRecoverPasswordLink = $container.find('.js-forget-password-cancel');

    var customerLoginForm = $container.find('.form-wrapper--login');
    var recoverPasswordForm = $container.find('.form-wrapper--recover-password');

    recoverPasswordLink.click(function(e) {
      e.preventDefault();
      _showRecoverPasswordForm(customerLoginForm, recoverPasswordForm);
    });

    hideRecoverPasswordLink.click(function(e) {
      e.preventDefault();
      _hideRecoverPasswordForm(customerLoginForm, recoverPasswordForm);
    });

    if (window.location.hash == '#recover') {
      _showRecoverPasswordForm(customerLoginForm, recoverPasswordForm);
    }
  }

  function _showRecoverPasswordForm(loginForm, recoverForm) {
    loginForm.removeClass('fade-in').addClass('fade-out');

    loginForm.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function showForm() {
      loginForm.addClass('display-none');
      recoverForm.removeClass('fade-out display-none').addClass('fade-in');
      loginForm.off('webkitAnimationEnd oanimationend msAnimationEnd animationend', showForm);
    });
  }

  function _hideRecoverPasswordForm(loginForm, recoverForm) {
    recoverForm.removeClass('fade-in ').addClass('fade-out');

    recoverForm.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function hideForm() {
      recoverForm.addClass('display-none');
      loginForm.removeClass('fade-out display-none').addClass('fade-in');
      recoverForm.off('webkitAnimationEnd oanimationend msAnimationEnd animationend', hideForm);
    });
  }


  return {
    initRecoverPasswordForm: initRecoverPasswordForm,
    foldElements: foldElements,
    coverImg: coverImg
  }
});
