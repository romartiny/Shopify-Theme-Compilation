define([], function(){

  console.log('Module Tab is loaded');
  
  function Tab(tabContainerSelector, tabChangeCallback) {
    if ( !tabContainerSelector ) {
      console.error('tabContainerSelector isn\'t defined');
      return null;
    }

    if (typeof tabChangeCallback == 'function' ) {
      this.tabChangeCallback = tabChangeCallback;
    }

    var self = this;

    this.DOM = {};
    this.DOM.tabContainer     = document.querySelector(tabContainerSelector);
    this.DOM.tabList          = this.DOM.tabContainer.querySelector('.tab-list');
    this.DOM.tabsContent      = this.DOM.tabContainer.querySelector('.tabs-content');
    this.DOM.activeTabContent = this.DOM.tabsContent.querySelector('.tab-content.is-active');

    this.activeTab        = this.DOM.tabList.querySelector('.tab.is-active');
    this.prevTab; // settings into changeTab()
    this.nextTab; // settings into changeTab()

    this.DOM.tabList.addEventListener('click', function(e){
      e.preventDefault();

      var target = e.target;
      var clickedTab = target.closest('.tab__link');

      if ( !clickedTab ||  clickedTab.parentElement === self.activeTab || clickedTab.parentElement.classList.contains('disable') ) {
        return null;
      }

      self.changeTab(clickedTab);
    });
  }

  Tab.prototype.changeTab = function(newTab) {
    
    this.activeTab.classList.remove('is-active')
    newTab.parentElement.classList.add('is-active');


    this.prevTab   = this.activeTab;
    this.activeTab = newTab.parentElement;
    this.nextTab   = this.activeTab.nextElementSibling;

    this.showTabContent(newTab.hash);    
    this.tabChangeCallback();
  };

  Tab.prototype.showTabContent = function(hash) {
    var choosedTabContent = this.DOM.tabsContent.querySelector(hash);

    if ( !choosedTabContent || choosedTabContent === this.DOM.activeTabContent ) {
      return null;
    }

    this.DOM.activeTabContent.classList.remove('is-active');
    choosedTabContent.classList.add('is-active')

    this.DOM.activeTabContent = choosedTabContent;
  };

  Tab.prototype.changeTabManually = function(hash) {
    var tabToChange = this.DOM.tabList.querySelector('a[href*="' + hash + '"]');
    this.changeTab(tabToChange);
  };

  Tab.prototype.enableTab = function(tab) {
    if ( tab.classList.contains('disable') ) {
      tab.classList.remove('disable');
    }
  };

  Tab.prototype.disableTab = function(tab) {
    if ( !tab.classList.contains('disable') ) {
      tab.classList.add('disable');
    }
  };

  Tab.prototype.disableAllTabs = function(tab) {
    var tabs = this.DOM.tabList.querySelectorAll('.tab');

    for ( var i = 0, max = tabs.length; i < max; i++ ) {

      if ( i !== 0 ){
        this.disableTab(tabs[i]);
      }
    }
  };

  Tab.prototype.hideTab = function(hash) {
    var tabToHide = this.DOM.tabList.querySelector('a[href*="' + hash + '"]').parentElement;
    if ( !tabToHide.classList.contains('is-hide') ) {
      tabToHide.classList.add('is-hide');
    }
  };

  Tab.prototype.showTab = function(hash) {
    var tabToShow = this.DOM.tabList.querySelector('a[href*="' + hash + '"]').parentElement;
    if ( tabToShow.classList.contains('is-hide') ) {
      tabToShow.classList.remove('is-hide');
    }
  };

  return Tab;
});