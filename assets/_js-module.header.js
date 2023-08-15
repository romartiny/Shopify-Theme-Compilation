define(['jquery', 'utils'], function($, utils) {

  console.log('Module Header is loaded');

  var DOM = utils.domFinder({
    mainContent: '.main-content',
    header: '.header'
  });


  // Initialization of functions for header
  function init() {

    var scrollBarWidth = utils.getScrollBarWidth();

    document.body.addEventListener('drawer-open', function() {
      document.body.classList.add('overflow-hidden');
      DOM.mainContent.style.paddingRight = scrollBarWidth + 'px';
      DOM.header.style.paddingRight = scrollBarWidth + 'px';
      DOM.header.style.marginRight = '-' + scrollBarWidth + 'px';
    });

    document.body.addEventListener('drawer-closed', function() {
      document.body.classList.remove('overflow-hidden');
      DOM.mainContent.style.paddingRight = '';
      DOM.header.style.paddingRight = '';
      DOM.header.style.marginRight = '';
    });

    // Closing dropdowns and search container by clicking on other elements
    $('body').mousedown(function(e) {
      $target = $(e.target);

      $parentTargetDropdown = $target.closest('.dropdown');
      $openDropdown = $('.dropdown.open');

      $parentTargetSearch = $target.closest('.search-container');
      $openSearch = $('.search-container.open');

      if ($parentTargetDropdown.length === 0 && $openDropdown.length > 0) {
        $openDropdown.removeClass('open');
      } else if ($parentTargetSearch.length === 0 && $openSearch.length > 0) {
        $openSearch.removeClass('open');
        $openSearch.children().removeClass('popup-active');
      }
    });
  }

  // Collapsing for mobile menu items
  _initCollapsing();
  // Collapsing menu items in mobile view
  function _initCollapsing() {
    var toggleForCollapsing = document.querySelectorAll('.has-dropdown > a');

    if (toggleForCollapsing.length <= 0) {
      return null;
    }

    for (var i = 0, max = toggleForCollapsing.length; i < max; i++) {
      toggleForCollapsing[i].addEventListener('click', function(e) {

        var windowSize = window.getComputedStyle(document.body, ':after').getPropertyValue('content');

        if (windowSize.indexOf("widescreen") >= 0) {
          return null;
        };

        e.preventDefault();

        var collapsingContainer = e.currentTarget.parentElement;

        if (collapsingContainer.classList.contains('show-dropdown')) {
          collapsingContainer.classList.remove('show-dropdown');
        } else {
          collapsingContainer.classList.add('show-dropdown');
        }
      });
    }
  }

  // Opening search field by clicking on icon
  _searchHeaderToggle();
  // Open search field after click on search icon in the header
  function _searchHeaderToggle() {
    var $searchContainer = $('.search-container');
    var $searchToggle = $searchContainer.find('.js-icon--search');
    var $searchForm = $searchContainer.find('form[action="/search"]');

    $searchToggle.click(function() {
      if ($searchContainer.hasClass('open')) {
        $searchForm.submit();
      } else {
        $searchForm.find('input[name="q"]').focus();
        $searchContainer.addClass('open');
      }
    });
  }

  // Fixed header
  if (!DOM.header.classList.contains('header--fixed-off')) {
    _initFixedHeader('.header');
  }
  // Fixed header
  function _initFixedHeader(headerSelector) {

    var DOM = utils.domFinder({
      header: headerSelector
    });

    var y;
    var headerHeight = DOM.header.clientHeight;
    var refreshY = window.scrollY;

    var drawerIsOpen = false;

    DOM.header.parentElement.style.height = headerHeight + 'px';

    if (refreshY > 0) {
      checkScrollHeader();
    }

    document.body.addEventListener('drawer-open', function() {
      drawerIsOpen = true;
    });

    document.body.addEventListener('drawer-closed', function() {
      drawerIsOpen = false;
    });

    function checkScrollHeader() {

      if (drawerIsOpen) {
        return null;
      }

      y = window.scrollY;

      if (y > 0 && !DOM.header.classList.contains('fixed')) {

        DOM.header.classList.add('fixed');
      } else if (y <= 0 && DOM.header.classList.contains('fixed')) {
        // Unfixing header
        DOM.header.classList.remove('fixed');
      }
    }

    window.addEventListener('scroll', function() {
      checkScrollHeader();
    });

    window.addEventListener('resize', function() {
      window.requestAnimationFrame(function() {
        headerHeight = DOM.header.clientHeight;
        DOM.header.parentElement.style.height = headerHeight + 'px';
      });
    });
  }

  // Showing fixed mobile top bar
  if (document.querySelector('.additional-mobile-menu')) {
    _showTopBar('.additional-mobile-menu');
  }

  // Showing fixed top bar
  function _showTopBar(topBar) {
    var $topBar = $(topBar);

    if ($topBar.length === 0) {
      return 0;
    }

    var y;

    function checkScroll() {
      y = $(this).scrollTop();

      if (y > 150) {
        $topBar[0].classList.add('show');
      } else {
        $topBar[0].classList.remove('show');
      }
    }

    $(window).scroll(function() {
      window.requestAnimationFrame(checkScroll);
    });
  }

  return {
    init: init
  }
});
