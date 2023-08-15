import { t, r } from './theme-3c6516f2.js';

const filtering = container => {
  const forms = t('[data-filter-form]', container);
  let formData, searchParams;
  setParams();

  function setParams(form) {
    form = form || forms[0];
    formData = new FormData(form);
    searchParams = new URLSearchParams(formData).toString();
  }
  /**
   * Takes the updated form element and updates all other forms with the updated values
   * @param {*} target
   */


  function syncForms(target) {
    if (!target) return;
    const targetInputs = t('[data-filter-item]', target);
    targetInputs.forEach(targetInput => {
      if (targetInput.type === 'checkbox' || targetInput.type === 'radio') {
        const items = t(`input[name='${targetInput.name}'][value='${targetInput.value}']`);
        items.forEach(input => {
          input.checked = targetInput.checked;
        });
      } else {
        const items = t(`input[name='${targetInput.name}']`);
        items.forEach(input => {
          input.value = targetInput.value;
        });
      }
    });
  }
  /**
   * When filters are removed, set the checked attribute to false
   * for all filter inputs for that filter.
   * Can accept multiple filters
   * @param {Array} targets Array of inputs
   */


  function uncheckFilters(targets) {
    if (!targets) return;
    let selector;
    targets.forEach(target => {
      selector = !selector ? '' : `, ${selector}`;
      const {
        name,
        value
      } = target.dataset;
      selector = `input[name='${name}'][value='${value}']${selector}`;
    });
    const inputs = t(selector, container);
    inputs.forEach(input => {
      input.checked = false;
    });
  }

  function clearRangeInputs() {
    const rangeInputs = t('[data-range-input]', container);
    rangeInputs.forEach(input => {
      input.value = '';
    });
  }

  function resetForms() {
    forms.forEach(form => {
      form.reset();
    });
  }

  return {
    getState() {
      return {
        url: searchParams
      };
    },

    filtersUpdated(target, cb) {
      syncForms(target);
      setParams(target);
      r('filters:updated');
      return cb(this.getState());
    },

    removeFilters(target, cb) {
      uncheckFilters(target);
      setParams();
      r('filters:filter-removed');
      return cb(this.getState());
    },

    removeRange(cb) {
      clearRangeInputs();
      setParams();
      r('filters:range-removed');
      return cb(this.getState());
    },

    clearAll(cb) {
      searchParams = '';
      resetForms();
      return cb(this.getState());
    }

  };
};

export { filtering as default };
//# sourceMappingURL=filtering-ed12ce48.js.map
