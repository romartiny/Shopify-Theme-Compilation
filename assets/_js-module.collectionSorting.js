define(['shopInfo'], function(shopInfo) {

  if ( location.href.indexOf('list') !=-1 ) {
    document.querySelector('.list-view').classList.add('active');
  }

  var objectURL = {};
  var searchPath = location.search;
  var pathURL = location.pathname.slice(location.pathname.indexOf('/collections/') + 13);
  var orderQuery = searchPath.slice(searchPath.indexOf('sort_by') + 8);
  var changeViewButton = document.querySelectorAll('.collection__toolbar-views > a');
  var collFilters = document.querySelectorAll('.collection__filters .sort-filter');

  objectURL.collections = pathURL.split('/')[0] + '/' || '';
  objectURL.tags = pathURL.split('/')[1] || '';
  objectURL.search = '';

  if (searchPath.indexOf('view') > -1) {
    var currentView = searchPath.slice(searchPath.indexOf('view') + 4, 4);
  }

  if (currentView && searchPath.indexOf('sort_by') > -1) {
    objectURL.search = '?view=' + currentView + '&sort_by=' + orderQuery;
    changeViewButton[0].href = '/collections/' + objectURL.collections + objectURL.tags + '?sort_by=' + orderQuery;
  } else if (searchPath.indexOf('list') > -1 && currentView) {
    objectURL.search = '?view=' + currentView;
    changeViewButton[0].href = '/collections/' + objectURL.collections + objectURL.tags;
  } else if (searchPath.indexOf('sort_by') > -1 && currentView) {
    objectURL.search = '?sort_by=' + orderQuery;
    changeViewButton[1].href = '/collections/' + objectURL.collections + objectURL.tags + '?view=' + currentView + '&sort_by=' + orderQuery;
  } else if (currentView) {
    changeViewButton[1].href = '/collections/' + objectURL.collections + objectURL.tags + '?view=' + currentView;
  }

  // Set new filter from dropdowns
  for (var i = 0, max = collFilters.length; i < max; i++) {
    collFilters[i].addEventListener('change', function(e) { 
      e.preventDefault();
      var selectedValue = this.value;

      if (this.classList.contains('sort-filter--collection')) {
        location.href = shopInfo.secureUrl + '/collections/' + selectedValue + '/' + objectURL.tags + objectURL.search;
      } else if (this.classList.contains('sort-filter--tags')) {
        location.href = shopInfo.secureUrl + '/collections/' + objectURL.collections + selectedValue + objectURL.search;
      } else {
        if (selectedValue === '' && searchPath.indexOf('list') > -1) {
          objectURL.search = '?view=list';
        } else if (selectedValue === '') {
          objectURL.search = '';
        } else if (searchPath.indexOf('list') > -1) {
          objectURL.search = '?view=list&sort_by=' + selectedValue;
        } else {
          objectURL.search = '?sort_by=' + selectedValue;
        }

        location.href = shopInfo.secureUrl + '/collections/' + objectURL.collections + objectURL.tags + objectURL.search;
      }
    });
  }
});
