window['ThemeSection_header'] = (count) => {
  const dropdownCount = parseInt(count);
  const menuOpen = {};
  for (let i = 0; i < dropdownCount; i++) {
    menuOpen['menu' + i] = false;
  }

  return {
    menuOpen: menuOpen,
    searchOpen: false,
    headerIsSticky: false,
    scrollY: 0,
    navWrapped: false,
    get isStuck() {
      return this.headerIsSticky && this.scrollY > 100;
    },
    get menuIsActive() {
      return !Object.keys(menuOpen).every((k) => !menuOpen[k]);
    },
    mounted() {
      initTeleport(this.$root);
      Alpine.store('modals').register('nav', 'leftDrawer');

      document.addEventListener('keyup', (event) => {
        if (event.key === 'Escape') {
          for (let i = 0; i < dropdownCount; i++) {
            if (this.menuOpen['menu' + i] === true) {
              this.menuOpen['menu' + i] = false;
              document.querySelector(`[aria-controls="menu${i}"]`).focus();
            }
          }
        }
      });

      document.body.addEventListener('label:search:closebutton', () => {
        this.searchOpen = false;
      });

      if (this.$root.hasAttribute('data-sticky-header')) {
        this.setUpSticky();
      }

      //set header height

      this.headerResizeFunctions();
      this._debouncedHeaderFunctions = debounce(
        this.headerResizeFunctions.bind(this),
        300
      );

      window.addEventListener('resize', this._debouncedHeaderFunctions);
      document.addEventListener('shopify:section:load', (e) => {
        if (!e.target.querySelector('.site-header')) return;
        this.headerResizeFunctions();
      });
    },
    logoLoaded() {
      setTimeout(() => {
        this.calculateHeaderHeight();
      }, 100);
    },
    headerResizeFunctions() {
      this.calculateHeaderHeight();
      this.calculateNavWrap();
    },
    calculateNavWrap() {
      const wrappedItems = [];
      let prevItem = {};
      let currItem = {};
      if (this.$refs.navigation !== undefined) {
        const items = this.$refs.navigation.children;
        for (var i = 0; i < items.length; i++) {
          currItem = items[i].getBoundingClientRect();
          if (prevItem && prevItem.top < currItem.top) {
            wrappedItems.push(items[i]);
          }
          prevItem = currItem;
        }
        if (wrappedItems.length > 0) {
          this.navWrapped = true;
        } else {
          this.navWrapped = false;
        }
      }
    },
    calculateHeaderHeight() {
      document.documentElement.style.setProperty(
        '--header-height',
        `${document.getElementById('headerBorderWrap').clientHeight}px`
      );
    },
    setUpSticky() {
      const headerContainer = document.getElementById('shopify-section-header');
      const observer = new IntersectionObserver(
        (e) => {
          e.forEach((entry) => {
            this.headerIsSticky = entry.intersectionRatio < 1 ? true : false;
          });
        },
        {
          rootMargin: '-1px 0px 0px 0px',
          threshold: [1],
        }
      );
      observer.observe(headerContainer);
      let timer = null;
      const checkScrollPosition = (e) => {
        this.scrollY = window.scrollY;
        if (timer !== null) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          this.scrollY = window.scrollY;
        }, 150);
      };
      const _debounceScrollHandler = throttle(checkScrollPosition, 150);
      document.addEventListener('scroll', _debounceScrollHandler);
      this.scrollY = window.scrollY;
    },
    openMenu(index) {
      this.menuOpen['menu' + index] = true;
    },
    focusOut(event, menu) {
      if (event.relatedTarget) {
        const dropdownParent = event.relatedTarget.closest(
          '[data-header-dropdown]'
        );
        if (!dropdownParent) {
          this.menuOpen[menu] = false;
        }
      }
    },
    closeSearch() {
      this.searchOpen = false;
      this.$refs.search.focus();
    },
    openSearch() {
      this.searchOpen = true;
      let input = document.querySelector('.header-search-input');
      setTimeout(() => {
        input.focus();
      }, 100);
    },
  };
};
