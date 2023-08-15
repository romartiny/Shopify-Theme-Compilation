 $(document).ready(function($) {
/*
 * Search By cattegories
 * kitisummus@gmail.com
 */
  function ajaxSearchCss(){
    if($(window).width() < 736){
      $('#search_mini_form').addClass('vbMobile');
      $('body').on('click', '.iconVbMobile', function(event) {
        event.preventDefault();
        $('#search_mini_form').toggleClass('showCatt');
      });
      $('body').on('click', '#search', function(event) {
        event.preventDefault();
        $('#search_mini_form').removeClass('showCatt');
      });
    }else{
      $('#search_mini_form').removeClass('vbMobile');
    }
  }
  if($(window).width() < 736){
    $("#search_mini_form .input-search").bind('focus',function(e) {
      $('#searchModal').addClass('focus');
      $('html, body').animate({scrollTop:0,scrollLeft:0}, 'slow');
    });
  }
  var $current_search = null;
  var $val_input = null;
  $("#search_mini_form .input-search").keyup(function(event) {
    event.preventDefault();
    $val_input = $(this).val();
    ajaxSearch($(this))
  });
  $("#search_mini_form .input-search").change(function(event) {
    event.preventDefault();
    if($(this).val() !== $val_input){
      ajaxSearch($(this))
    }
  });
  $("#search_mini_form .searchCatt").change(function(event) {
    event.preventDefault();
    ajaxSearch($(this))
  });
  function ajaxSearch(element){
    $(".livesearch").html('');
    $('.noResults_').remove();
    clearTimeout($current_search);
    var $val  = $("#search_mini_form .input-search").val(),
        $filter = ' '+$val.toUpperCase()+' ',
        $filter = $filter.replace('  ',' '),
        $catt = $('#search_mini_form .searchCatt').val(),
        querySearch = [];
    if($val.trim() == '') {
      setTimeout(function(){
        $('#search_mini_form').removeClass('loading');
        $(".livesearch").html('');
      },300);
      return false;
    }else{
      $('#search_mini_form').addClass('loading');
      $current_search = setTimeout(function(){
        if($catt !== '') {
          $('#search_mini_form').attr('action','/collections/'+$catt)
          if($('#search_mini_form #view').length <= 0 ){
            $('#search_mini_form').append('<input id="view" type="hidden" name="view" value="searchAjax">');
          }
          var url = '/collections/'+$catt+'?view=searchBeforeSend';
          $.ajax({
            type: 'get',
            url: url,
            beforeSend: function() {
            },
            success: function(data) {
              if(data.length <= 4){
                $('#searchModal').removeClass('loading_pr').addClass('focus');
                if($('.noResults_').length <= 0){
                  $('.content-item').append('<h5 class="noResults_"><span>Your search for "'+$val+'" did not yield any results.</span></h5>');
                }
                $('#search_mini_form').removeClass('loading');
                return;
              }
              if(data.length > 0) {
                var json = JSON.parse(data);  
                jQuery.each(json, function(i, v) {
                  var title = ' '+v.title,
                      tags = v.tags,
                      tags_ = tags.join(' '),
                      variants = '';
                  jQuery.each(v.variants, function(y, variant) {
                    var variant_title = variant.title.replace('/ ','').replace('/ ','');
                    variants += variant_title+' ';
                  });
                  if(title.toUpperCase().indexOf($filter) != -1 || v.vendor.toUpperCase().indexOf($filter) != -1 || v.type.toUpperCase().indexOf($filter) != -1 || tags_.toUpperCase().indexOf($filter) != -1 || variants.toUpperCase().indexOf($filter) != -1 ) {
                    querySearch.push(v.handle);
                  }else if(i == json.length - 1 && querySearch.length == 0){
                    $('#searchModal').removeClass('loading_pr').addClass('focus');
                    if($('.noResults_').length <= 0){
                      $('.content-item').append('<h5 class="noResults_"><span>Your search for "'+$val+'" did not yield any results.</span></h5>');
                    }
                    $('#search_mini_form').removeClass('loading');
                    return;
                  }
                  if(json.length <= 20 && i == json.length - 1 && querySearch.length > 0 ){
                    $('.noResults_').empty();
                    $('#searchModal').addClass('loading_pr').removeClass('focus');
                    ajaxSearchByCatt(querySearch,$catt);
                    $('#search_mini_form').removeClass('loading');
                    return false;
                  }else if(json.length > 20 && i == 20 && querySearch.length > 0 ){
                    $('.noResults_').empty();
                    $('#searchModal').addClass('loading_pr').removeClass('focus');
                    ajaxSearchByCatt(querySearch,$catt);
                    $('#search_mini_form').removeClass('loading');
                    return false;
                  }
                });
              }
            }
          });
        }else{
          $('#search_mini_form').attr('action','/search');
          $('#search_mini_form #view').remove();
          $.get('/search',{
            view:'ajax',
            type:'product',
            q : encodeURI($val.replace(/\s/g,'+'))
          }, function(data) {
            if($(data).find('.thumb').length === 0 ){
              $('#searchModal').removeClass('loading_pr').addClass('focus');
              if($('.noResults_').length <= 0){
                $('.content-item').append('<h5 class="noResults_"><span>Your search for "'+$val+'" did not yield any results.</span></h5>');
              }
            }else{
              $('#searchModal').addClass('loading_pr').removeClass('focus');
              $('.noResults_').empty();
              $(".livesearch").html(data);
              $(".item-search").each(function(i) {
                var t = $(this);
                var style = $(this).attr("style");
                style = (style == undefined) ? '' : style;
                var delay = i * 200 + 1 * 50;
                var animate = t.data('animate');
                t.attr("style", style +
                       ";-webkit-animation-delay:" + delay + "ms;" + "-moz-animation-delay:" + delay + "ms;" + "-o-animation-delay:" + delay + "ms;" + "animation-delay:" + delay + "ms;"
                      ).addClass('animated ' + animate).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                  $(this).removeClass('animated ' + animate);
                });
              })
            }
            $('#search_mini_form').removeClass('loading');
            Currency.convertAll(shopCurrency,cookieCurrency,".livesearch span.money");
          });
        }
      },300);
    }
  }
  function ajaxSearchByCatt(element,catt){
    var querySearch = element.join('+'),
        url = '/collections/'+catt+'?q='+querySearch+'&view=searchSuccess';
    $.ajax({
      type: 'get',
      url: url,
      beforeSend: function() {
      },
      success: function(data) {
        $(".livesearch").html(data);
        $(".item-search").each(function(i) {
          var t = $(this);
          var style = $(this).attr("style");
          style = (style == undefined) ? '' : style;
          var delay = i * 200 + 1 * 50;
          var animate = t.data('animate');
          t.attr("style", style +
                 ";-webkit-animation-delay:" + delay + "ms;" + "-moz-animation-delay:" + delay + "ms;" + "-o-animation-delay:" + delay + "ms;" + "animation-delay:" + delay + "ms;"
                ).addClass('animated ' + animate).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass('animated ' + animate);
          });
        })
        Currency.convertAll(shopCurrency,cookieCurrency,".livesearch span.money");
      }
    });
  }
  $("#search_mini_form_page .searchCatt").change(function(event) {
    event.preventDefault();
    var $catt = $('#search_mini_form_page .searchCatt').val();
    if($catt !== '') {
      $('#search_mini_form_page').attr('action','/collections/'+$catt);
      if($('#search_mini_form_page #view').length <= 0 ){
        $('#search_mini_form_page').append('<input id="view" type="hidden" name="view" value="searchAjax">');
      }
    }else{
      $('#search_mini_form_page').attr('action','/search');
      $('#search_mini_form_page #view').remove();
    }
  });
  if(typeof ajaxSearchPageData !== 'undefined'){ajaxSearchPage(ajaxSearchPageData);}
  var $current_search = null, $val_input = null, $all_products_count = 0, $animate_count = 0;
  function ajaxSearchPage(element){
    clearTimeout($current_search);
    if(element == undefined){
      var $val  = $("#search_mini_form_page .input-search").val();
    }else{
      var $val  = element;
    }
    var $filter = ' '+$val.toUpperCase()+' ',
        $catt = $('#search_mini_form_page .searchCatt').val(),
        page = parseInt($('#readMore_').val()),
        recPerPage = $('#readMore_').data('range'),
        startRec = Math.max(page - 1, 0) * recPerPage,
        endRec = startRec + recPerPage,
        querySearch = [];
    if($val.trim() == '') {
      setTimeout(function(){
        $('#search_mini_form_page').removeClass('loading');
        $('#shopify-section-collection-search-template').removeClass('loading_pr');
        $(".products-grid.product-listing").html('');
      },300);
      return false;
    }else{
      $('#search_mini_form_page').addClass('loading');
      $('#shopify-section-collection-search-template').addClass('loading_pr');
      $current_search = setTimeout(function(){
        if($('#search_mini_form_page #view').length <= 0 ){
          $('#search_mini_form_page').append('<input id="view" type="hidden" name="view" value="searchAjax">');
        }
        var url = '/collections/'+$catt+'?view=searchBeforeSend';
        $.ajax({
          type: 'get',
          url: url,
          beforeSend: function() {
          },
          success: function(data) {
            if(data.length > 0) {
              var json = JSON.parse(data);  
              jQuery.each(json, function(i, v) {
                var title = ' '+v.title,
                    tags = v.tags,
                    tags_ = tags.join(' ');
                var variants = '';
                jQuery.each(v.variants, function(y, variant) {
                  var variant_title = variant.title.replace('/ ','').replace('/ ','');
                  variants += variant_title+' ';
                });
                if(title.toUpperCase().indexOf($filter) != -1 || v.vendor.toUpperCase().indexOf($filter) != -1 || v.type.toUpperCase().indexOf($filter) != -1 || tags_.toUpperCase().indexOf($filter) != -1 || variants.toUpperCase().indexOf($filter) != -1 ) {
                  if(i >= startRec ){querySearch.push(v.handle);}
                  $all_products_count ++
                }else if(i == json.length - 1 && querySearch.length == 0){
                  $(".products-grid.product-listing").html('<li class="noResult">Your search for \"{{item_filter}}\" did not yield any results.</li>');
                                                           $('#search_mini_form_page').removeClass('loading');
                }
                if(json.length <= endRec && i == json.length - 1 && querySearch.length > 0 ){
                  ajaxSearchByCatt(querySearch,$catt);
                }else if(json.length > endRec && i == endRec - 1 && querySearch.length > 0 ){
                  ajaxSearchByCatt(querySearch,$catt);
                }
              });
            }
          }
        });
      },300);
    }
  }
  function ajaxSearchByCatt(element,catt){
    var querySearch = element.join('+'),
        page = parseInt($('#readMore_').val()),
        recPerPage = $('#readMore_').data('range'),
        startRec = Math.max(page - 1, 0) * recPerPage,
        endRec = startRec + recPerPage,
        url = '/collections/'+catt+'?q='+querySearch+'&view=searchSuccessByCatt';
    $.ajax({
      type: 'get',
      url: url,
      beforeSend: function() {
      },
      success: function(data) {
        if($('.products-grid.product-listing .card').length > 0){
          $(".products-grid.product-listing").html(data);
        }else{
          $(".products-grid.product-listing").append(data);
        }
        $(".grid-item").not('.animated_').each(function(i) {
          var t = $(this);
          var style = $(this).attr("style");
          style = (style == undefined) ? '' : style;
          var delay = i * 200 + 1 * 50;
          var animate = t.data('animate');
          t.attr("style", style +
                 ";-webkit-animation-delay:" + delay + "ms;" + "-moz-animation-delay:" + delay + "ms;" + "-o-animation-delay:" + delay + "ms;" + "animation-delay:" + delay + "ms;"
                ).addClass('animated ' + animate).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $(this).removeClass('animated ' + animate).addClass('animated_');
          });
        });
        if($('#resultsCall .count').html != ''){
          $('#resultsCall .count').html($all_products_count).parent().css('opacity','1');
          if($all_products_count > 1){
            $('#resultsCall .text1').hide();$('#resultsCall .text2').show();
          }else{
            $('#resultsCall .text2').hide();$('#resultsCall .text1').show();
          }
        }
        if($all_products_count > endRec ){
          $('#readMore_').val(page+1).trigger('change');
          $('.readMore span').removeClass('loading').show();
        }else{
          $('.readMore span').removeClass('loading').hide();
        }
        $('#search_mini_form_page').removeClass('loading');
        apply();
      }
    });
  }
  $(document).on('click', '.readMore span', function(e) {
    e.preventDefault();
    ajaxSearchPage(ajaxSearchPageData);
    $(this).addClass('loading');
    $(".grid-item").addClass('animated_');
  });
});