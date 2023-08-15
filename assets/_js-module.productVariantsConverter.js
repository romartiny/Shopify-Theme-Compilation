define(['utils'], function(utils){

  console.log('Module ProductVariantsConverter is loaded');

  function ProductVariantsConverter(options) {

    var defOpt = {
      callbackRadionBtnChange: null,
      DOM : {}
    };

    var wrapperRadioBtnDOM;
    var radioBtnContainerDOM = document.createElement('div');
    radioBtnContainerDOM.className = 'product-variants-radio-btns';

    this.options = utils.mergeOptions(defOpt, options);
    this.DOM     = utils.domFinder(this.options.DOM);

    this.DOM.selectVariants.style.display = 'none';

    for ( var i = 0, max = this.DOM.selectVariants.options.length; i < max; i++ ) {
      wrapperRadioBtnDOM = this.geteRadioVariantDOM(this.DOM.selectVariants.options[i]);
      radioBtnContainerDOM.appendChild(wrapperRadioBtnDOM);
    }

    this.DOM.selectVariants.parentElement.insertBefore(radioBtnContainerDOM, this.DOM.selectVariants.nextSibling);
  }

  ProductVariantsConverter.prototype.geteRadioVariantDOM = function(option) {

    var optionText = option.textContent.toLowerCase();

    var wrapperDOM = document.createElement('div');
    wrapperDOM.className = 'radio-btn';

    var labelDOM = document.createElement('label');
    labelDOM.innerHTML = option.innerHTML;
    labelDOM.setAttribute('for', optionText);

    var radioBtnDOM   = document.createElement('input');
    radioBtnDOM.type  = 'radio';
    radioBtnDOM.name  = 'variants';
    radioBtnDOM.id    = optionText;
    radioBtnDOM.value = option.value;
    radioBtnDOM.disabled = option.disabled;

    radioBtnDOM.setAttribute('data-variant-price', option.getAttribute('data-variant-price'));
    radioBtnDOM.setAttribute('data-variant-name',  optionText);
    if (option.getAttribute('data-variant-img-id')) {
      radioBtnDOM.setAttribute('data-variant-img-id',   option.getAttribute('data-variant-img-id'));
    }

    if ( option.selected) {
      radioBtnDOM.checked = true;
    }

    radioBtnDOM.addEventListener('change', function(e){

      var currentTarget = e.currentTarget;

      this.DOM.selectVariants.value = currentTarget.value;

      if (this.options.callbackRadionBtnChange && typeof this.options.callbackRadionBtnChange === 'function') {
        this.options.callbackRadionBtnChange(currentTarget);
      }
    }.bind(this));

    var radioPointDOM = document.createElement('span');
    radioPointDOM.className = 'radio-point';
    radioPointDOM.style.backgroundColor = optionText;

    wrapperDOM.appendChild(radioBtnDOM);
    wrapperDOM.appendChild(labelDOM);
    wrapperDOM.appendChild(radioPointDOM);

    return wrapperDOM;
  }


  return ProductVariantsConverter;
});
