define(['googleMapsApi', 'utils'], function(google, utils){

  console.log('Module GoogleMap is loaded');
  
  function GoogleMap(options) {

    if (typeof google == 'undefined' || !google.maps)  {
      throw new Error('Please check Google Maps Api file');
    }

    var defOpt = {
      latitude: 49.531,
      longitude: -96.689,
      zoom: 16,
      openBtnSelector:  '.js-open-map',
      closeBtnSelector: '.js-close-map',
      mapsWrapperSelector: '.contact-full',
      DOM : {}
    };

    this.options = utils.mergeOptions(defOpt, options);
    
    this.DOM = utils.domFinder(this.options.DOM);

    var myLatLng = {lat: this.options.latitude, lng: this.options.longitude};

    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(this.DOM.mapSelector, {
      center: myLatLng,
      scrollwheel: false,
      zoom: this.options.zoom
    });

    // Create a marker and set its position.
    var marker = new google.maps.Marker({
      map: map,
      position: myLatLng
    });

    this._showHideMaps();
  }

  // // Show hide Google maps on Contact page
  GoogleMap.prototype._showHideMaps = function() {

    var mapWrapper  = this.DOM.mapSelector.closest(this.options.mapsWrapperSelector);
    var btnsOpenMap = mapWrapper.querySelector(this.options.openBtnSelector);
    var btnCloseMap = mapWrapper.querySelector(this.options.closeBtnSelector);

    if (!mapWrapper || !btnsOpenMap || !btnCloseMap) {
      return null;
    }

    btnsOpenMap.addEventListener('click', function(e) {
      this.nextElementSibling.classList.remove('elem-hide');
    });

    btnCloseMap.addEventListener('click', function() {
      this.parentElement.classList.add('elem-hide');
    });
  }

  return GoogleMap;
});