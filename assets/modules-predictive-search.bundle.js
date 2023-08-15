import { r as removeTrapFocus, t as trapFocus } from './shared-import-theme-a11y.bundle.js';

window.ThemeComponent_PredictiveSearch = resources => {
  return {
    cachedResults: {},
    loading: false,
    isOpen: false,
    rawQuery: '',
    results: false,
    resultsMarkup: null,
    resources: resources,

    get trimmedQuery() {
      return this.rawQuery.trim();
    },

    mounted() {
      this.cachedResults = {};
      const toggles = document.querySelectorAll('[data-open-search]');
      toggles.forEach(toggle => {
        toggle.setAttribute('role', 'button');
      });
      document.addEventListener('keyup', event => {
        if (event.key === 'Escape') {
          this.close(false, true);
          setTimeout(() => this.$refs.input.focus(), 100);
        }
      });
    },

    close() {
      let clearSearchTerm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      let closeButton = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.isOpen = false;

      if (clearSearchTerm) {
        this.rawQuery = '';
      }

      const selected = this.$el.querySelector('[aria-selected="true"]');
      if (selected) selected.setAttribute('aria-selected', false);
      this.$refs.input.setAttribute('aria-activedescendant', '');
      this.$refs.input.setAttribute('aria-expanded', false);
      removeTrapFocus();
      document.documentElement.style.overflowY = 'auto';

      if (closeButton) {
        document.body.dispatchEvent(new CustomEvent('label:search:closebutton'));
      }

      const toggleSearch = document.querySelector('[data-open-search]');

      if (toggleSearch) {
        setTimeout(() => toggleSearch.focus(), 100);
      }
    },

    getSearchResults() {
      this.loading = true; //this.$store.predictiveSearch.loading = true;

      const queryKey = this.trimmedQuery.replace(' ', '-').toLowerCase();
      liveRegion(window.theme.strings.loading); // if (this.cachedResults[queryKey]) {
      //   this.renderSearchResults(this.cachedResults[queryKey]);
      //   return;
      // }

      fetch(`${window.theme.routes.predictive_search_url}?q=${encodeURIComponent(this.trimmedQuery)}&${encodeURIComponent('resources[type]')}=${this.resources}&${encodeURIComponent('resources[limit]')}=10&section_id=predictive-search`).then(response => {
        this.loading = false;

        if (!response.ok) {
          var error = new Error(response.status);
          this.close();
          throw error;
        }

        return response.text();
      }).then(text => {
        this.results = true;
        const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
        const liveRegionText = new DOMParser().parseFromString(text, 'text/html').querySelector('#predictive-search-count').textContent;
        this.cachedResults[queryKey] = resultsMarkup;
        this.renderSearchResults(resultsMarkup);
        liveRegion(liveRegionText);
      }).catch(error => {
        this.close();
        throw error;
      });
    },

    onChange() {
      if (!this.trimmedQuery.length) {
        this.close(true);
      } else {
        this.open();
        this.getSearchResults();
      }
    },

    onFocus() {
      if (!this.trimmedQuery.length) return;

      if (this.results === true) {
        this.open();
      } else {
        this.getSearchResults();
      }
    },

    onFocusOut() {
      setTimeout(() => {
        if (!this.$el.contains(document.activeElement)) this.close();
      });
    },

    onFormSubmit(event) {
      if (!this.trimmedQuery.length || this.$el.querySelector('[aria-selected="true"] a')) event.preventDefault();
    },

    onKeyup(event) {
      event.preventDefault();

      switch (event.code) {
        case 'ArrowUp':
          this.switchOption('up');
          break;

        case 'ArrowDown':
          this.switchOption('down');
          break;

        case 'Enter':
          this.selectOption();
          break;
      }
    },

    onKeydown(event) {
      // Prevent the cursor from moving in the input when using the up and down arrow keys
      if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
        event.preventDefault();
      }
    },

    open() {
      this.isOpen = true;
      this.$refs.input.setAttribute('aria-expanded', true);
      document.documentElement.style.overflowY = 'hidden';
    },

    renderSearchResults(resultsMarkup) {
      this.$refs.results.innerHTML = resultsMarkup;
      this.results = true;
      this.open();
      setTimeout(() => {
        trapFocus(this.$el);
        this.$refs.input.focus();
      }, 300);
    },

    selectOption() {
      const selectedProduct = this.$el.querySelector('[aria-selected="true"] a, [aria-selected="true"] button');
      if (selectedProduct) selectedProduct.click();
    },

    switchOption(direction) {
      if (!this.isOpen) return;
      const moveUp = direction === 'up';
      const selectedElement = this.$el.querySelector('[aria-selected="true"]');
      const allElements = this.$el.querySelectorAll('li');
      let activeElement = this.$el.querySelector('li');
      if (moveUp && !selectedElement) return;

      if (!moveUp && selectedElement) {
        activeElement = selectedElement.nextElementSibling || allElements[0];
      } else if (moveUp) {
        activeElement = selectedElement.previousElementSibling || allElements[allElements.length - 1];
      }

      if (activeElement === selectedElement) return;
      activeElement.setAttribute('aria-selected', true);
      if (selectedElement) selectedElement.setAttribute('aria-selected', false);
      this.$refs.input.setAttribute('aria-activedescendant', activeElement.id);
    }

  };
};
