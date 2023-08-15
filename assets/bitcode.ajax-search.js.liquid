var AT_Search = {
  ajaxProductItems : function(){
    var result = new Array();
    var searchURL = '/collections/all?view=ajax';

    $.ajax({
      type: 'GET',
      url: searchURL,
      success: function (data) {

        data = '<div>' + data + '</div>';
        data = data.trim();

        var elements = $(data).find('.s-ajax');

        if( 0 < elements.length ){
          elements.each(function() {

            var title = $.trim(this.getAttribute('data-t'));
            var handle = $.trim(this.getAttribute('data-h'));
            var image = $.trim(this.getAttribute('data-src'));

            var item = new Object();
            item.title = title;
            item.handle = handle;
            item.featured_image = image;

            result.push(item);
          });
        }else{
          //todo : return not found here
        }  

      },
      dataType: 'html'
    });

    return result;
  }

  ,ajaxSearch : function(){
    var products = AT_Search.ajaxProductItems();

    $( "#input-ajax-search" ).keyup(function() {
      var $this = $(this)
      ,keyword = $this.val().toLowerCase();
      
      console.log(keyword);

      if(keyword.length >= 2){

        jQuery(this).removeClass('error warning valid').addClass('valid');

        var result = $('#result-ajax-search .search-results').empty();

        for (var i = 0; i < products.length; i++) {
          var item = products[i];

          var title = item.title;
          var handle = item.handle;
          var image = item.featured_image;

          if(title.toLowerCase().indexOf(keyword) > -1){

            var markedString = title.replace(new RegExp('(' + keyword + ')', 'gi'), '<span class="marked">$1</span>');

            var template = '<li class="search-item-wrapper"><a class="search-item-img" href="/products/'+ handle +'">'+ '<img style="max-width: 40px; float: left;" src="' + image + '" />' +'</a><a class="search-item-title" href="/products/'+ handle +'">'+ markedString +'</a></li>';
            result.append(template);
          }
        }

        if($('#result-ajax-search .search-results li').length < 1){
          result.append('<li><p>No result found for your search.</p></li>')
        } 

      }else{
        jQuery(this).removeClass('error warning valid').addClass('error');
        //todo : change the place holder to notice customer

        var t = '<li><p>You must enter at least 2 characters.</p></li>';
        var result = $('#result-ajax-search .search-results').empty();
        result.append(t);
      }
    });
  }

  ,init : function(){
    this.ajaxSearch();
  }
}

jQuery(document).ready(function($) {
  AT_Search.init();
})