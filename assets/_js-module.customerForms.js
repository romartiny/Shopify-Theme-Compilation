define(['jquery', 'scrollbar', 'utils', 'shopifyCommon'], function($, scrollbar, utils) {

  // Modal window for addresses
  function initModalAddresses() {
    var $this = this;
    var $newAddressBtn = $('.js-add-address');
    var $editAddressBtns = $('.js-edit-address');
    var $deleteAddressBtns = $('.js-delete-address');

    $newAddressBtn.click(function(e) {
      e.preventDefault();
      _toggleAddressForm('#AddAddress');
      utils.disableScroll();
    });

    $editAddressBtns.click(function(e) {
      e.preventDefault();
      var addressID = $(this).attr('data-address-id');
      addressID = '#EditAddress_' + addressID;
      _toggleAddressForm(addressID);
      utils.disableScroll();
    });

    $deleteAddressBtns.click(function(e) {
      e.preventDefault();
      var addressID = $(this).attr('data-address-id');
      addressID = '.js-delete-address_' + addressID;
      _toggleAddressForm(addressID);
      utils.disableScroll();
    })
  }

  // Show/hide modal window for addresses
  function _toggleAddressForm(container) {
    var $modalContainer = $(container);

    if ($modalContainer.length === 0) {
      return 0;
    }

    var $this = this;
    var $closeBtn = $modalContainer.find('.js-modal__btn-close');
    var $modalBody = $modalContainer.find('.modal__body');
    var $deleteBtnConfirm = $modalContainer.find('.js-delete-address-confirm');

    $('body').addClass('modal-open');

    $modalContainer.removeClass('display-none');

    if (!$modalContainer.find('.modal__body').hasClass('scrollable') && $modalBody.length > 0) {
      window.modalScroll = scrollbar.createScrollbar($modalBody[0], {
        touchScrollSpeed: 1,
        preventDefaultScroll: true
      });
    }

    $closeBtn.click(function(e) {
      e.preventDefault();
      $modalContainer.addClass('display-none');
      $modalContainer.attr('style', '');
      utils.enableScroll();
      $('body').removeClass('modal-open');
    });

    // Delete address
    if ($deleteBtnConfirm.length !== 0) {
      $deleteBtnConfirm.click(function(e) {
        e.preventDefault();
        var addressID = $(this).attr('data-address-id');
        Shopify.postLink('/account/addresses/' + addressID, { 'parameters': { '_method': 'delete' } });
      });
    }
  }

  return {
    initModalAddresses: initModalAddresses
  }
});
