var AT_Filter = window.AT_Filter || {};

(function($) {
	AT_Filter = {

		init: function () {
			this.filterElem = $(".grid-uniform");
			this.isLoading = false;
			this.updateURL = false;
			this.requestAgain = false;
            this.title;

			if( this.filterElem.length > 0 ) {
				this.addEvent();
				// Bind to StateChange Event
			    History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
			        var State = History.getState(); // Note: We are using History.getState() instead of event.state;
			        AT_Filter.updateURL = false;
			        if(AT_Filter.requestAgain)
			        	AT_Filter.requestPage(State.data.url);
			       	AT_Filter.requestAgain = true;
			    });
			}
		},

		addEvent: function() {
			//prevent li clicked
			AT_Filter.filterElem.on("click", ".advanced-filter", function(event){
				return false;
			});

			AT_Filter.filterElem.on("click", ".advanced-filter a", function(e){
				
				if (AT_Filter.isLoading) {
					return; 
				}
				
				var target = $(e.currentTarget), href;

				href = target.attr("href");
				//Set active or remove active for filter
				if(target.parent().hasClass("active-filter")) {
					target.parent().removeClass("active-filter");
				}
				else {
					target.parent().addClass("active-filter");
				}
				
				AT_Filter.updateURL = true;
				AT_Filter.requestPage(href);
				return false;
				
			});
          
          //Click on viewmode
          $(document).on('click', ".cata-toolbar .grid-list a", function(e){         	
          	if (AT_Filter.isLoading) {
				return; 
			}
            
            var target = $(e.currentTarget), href;
			console.log(target[0])
			href = target.attr("href");
            AT_Filter.updateURL = true;
            AT_Filter.requestPage(href);
            return false;
          });
          
          //Click on pager
          $(document).on('click', '.pagination-page li a', function(e){
          	if (AT_Filter.isLoading) {
				return; 
			}
            
            var target = $(e.currentTarget), href;
            if( target.parent().hasClass('active') )
            	return;
            
            href = target.attr("href");
            AT_Filter.updateURL = true;
            AT_Filter.requestPage(href);
            return false;
          });
          
          $(document).on('click', '.pagination .pagination-page li a', function(e){
            $("body,html").animate({
              scrollTop: 400
            }, 600);
          });
          
          $(document).on('click','.sort-by li.sort-action',function(e){
            if (AT_Filter.isLoading) {
				return; 
			}
	
            var href;
            $('.sort-by .name').html($(this).html()); 

            if(!$(this).hasClass('active')){
              var value = jQuery(this).attr('data-sort');
              Shopify.queryParams.sort_by = value;
              href = '?'+jQuery.param(Shopify.queryParams)
              //location.search = jQuery.param(Shopify.queryParams);
              AT_Filter.updateURL = true;
              AT_Filter.requestPage(href);
            }
          });
		},

		requestPage: function(href) {
			
			if (history.pushState) {
				this.getPage(href);
				
			} else {
				location.assign(href);
			}
			
		},

		filterPage: function(href){
			var splitArr = [],  param;
            if(String(href).indexOf("/") != -1) {
              splitArr = href.split("/");
              param = splitArr[splitArr.length - 1];
            }
            else
              param = href;
			console.log(param)
			return param;
		},

		getPage: function(href) {
          	$(".is-countdown").countdown("pause"); //pause countdown if page has DEAL
			$(".loading").css("display", "block");
			this.isLoading = true;
			jQuery.ajax({
			   url: href,
			   success: function (response)
			   {
			      var _obj = $(response);
                  AT_Filter.title = _obj[19];
			      if(AT_Filter.updateURL) {
			      	var params = AT_Filter.filterPage(href);
			      	AT_Filter.updateURL = false;
			      	AT_Filter.requestAgain = false;
                    
			      	History.pushState( {url: href}, AT_Filter.title.innerHTML,  href );
			      	
			      }
			      AT_Filter.isLoading = false;
			      $(".loading").css("display", "none");
			      var product_list = _obj.find(".cata-product");
			      var filter_list = _obj.find(".sb-filter");
			      
			      var delay = 0;

			      product_list.find(".cata-product-item").each(function(){
			      	$(this).addClass("wow fadeInUp animated");
			      	$(this).attr("data-wow-delay", delay + "ms");
			      	delay += 100;
			      });

			      
			      $("#col-main").empty().append(_obj.find("#col-main").children());	
			      AT_Filter.filterElem.empty().append(filter_list); 
                  AT_Main.filterCatalog();
			   },
			   error: function(e) {
			   		console.log(e);
			   },
			  
			   

			});
			
			
		},
		
	}
})(jQuery);

$(document).ready(function(){ 
	AT_Filter.init();
});