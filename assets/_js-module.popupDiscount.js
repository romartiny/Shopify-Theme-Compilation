define([], function(){

  console.log('Module PopupDiscount is loaded');

  var PopupDiscount = function(days) {
    this.DOM = {};
    this.DOM.popupContainer = document.querySelector('.popup');

    if (!this.DOM.popupContainer) {
      return null;
    }

    this.daysToShow = this.DOM.popupContainer.getAttribute('data-days-for-showing') || 10;

    this.DOM.discountCode = this.DOM.popupContainer.querySelector('.popup-discount-code');
    this.DOM.closeBtns    = this.DOM.popupContainer.querySelectorAll('.close-btn');
    this.DOM.link         = this.DOM.popupContainer.querySelector('.popup-link');

    window.addEventListener('load', function(){
      
      if (!this.isShow()) {
        return null;
      }

      require(['webFont'], function(WebFont){
        WebFont.load({
          google: {
            families: ['Raleway:500,900']
          }
        });
      });

      this.init();
    }.bind(this));
  };

  PopupDiscount.prototype.init = function() {

    if (!this.isShow()) {
      return null;
    }

    this.open();

    if (this.DOM.discountCode) {
      this.DOM.discountCode.addEventListener('click', function(){
        this.selectCode();
      }.bind(this));
    }

    if (this.DOM.link) {
      this.DOM.link.addEventListener('click', function(){
        this.saveDate();
      }.bind(this));
    }

    for (var i = 0, max = this.DOM.closeBtns.length; i < max; i++) {
      this.DOM.closeBtns[i].addEventListener('click', function(e){
        e.preventDefault();
        this.close();
      }.bind(this));
    }
  };

  PopupDiscount.prototype.selectCode = function() {

    if (document.selection) {

      var range = document.body.createTextRange();
      range.moveToElementText(this.DOM.discountCode);
      range.select();
    } else if (window.getSelection()) {

      var range = document.createRange();
      range.selectNode(this.DOM.discountCode);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
  };

  PopupDiscount.prototype.open = function() {

    this.DOM.popupContainer.classList.add('is-open');
  };

  PopupDiscount.prototype.close = function() {

    this.DOM.popupContainer.classList.remove('is-open');
    this.saveDate();
  };

  PopupDiscount.prototype.isShow = function() {

    if (!Storage) {
      return null;
    }

    var savedTime, date, timeToSave;

    savedTime = localStorage.popupTime;
    popupDisabled = localStorage.popupDisabled;
    date = new Date();
    timeToSave = date.getTime() + this.daysToShow*24*60*60*1000;

    // show, if days aren't specified
    if (!this.daysToShow || popupDisabled != 'disabled') {
      return true;
    }

    // show, first load of popup
    if (!savedTime) {
      localStorage.popupTime = timeToSave;
      return true;
    }

    // show, if specified days are less than saved
    if (savedTime > timeToSave) {
      localStorage.popupTime = timeToSave;
      return true;
    }

    // if saved time is running out
    if (date > savedTime) {
      localStorage.popupTime = timeToSave;
      return true;
    }

    return false;
  } ;

  PopupDiscount.prototype.saveDate = function() {

    var date, timeToSave;

    if (Storage) {
      localStorage.popupDisabled = 'disabled';
      date = new Date();
      timeToSave = date.getTime() + this.daysToShow*24*60*60*1000;
      localStorage.popupTime = timeToSave;
    }
  };

  return PopupDiscount;
});