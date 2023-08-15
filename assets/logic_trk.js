(function() {
    window.FacebookPixel = undefined;
    var loadScript = function(url, callback) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        if (script.readyState) {
            script.onreadystatechange = function() {
                 callback();
            };
        } else {
            script.onload = function() {
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    };
    
    var support_info = {};
    support_info['show_total_price'] = 'yes';
    support_info['global_delay'] = 0;
    support_info['purchase_percent'] = '100';
    support_info['store_name'] = 'projector-2.myshopify.com';
    
    if (typeof fbq === 'undefined' || typeof fbq === 'function') {
        var myAppJavaScript = function($) {
            ! function(f, b, e, v, n, t, s) {
                if (f.fbq) return;
                n = f.fbq = function() {
                    n.callMethod ?
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                };
                if (!f._fbq) f._fbq = n;
                n.push = n;
                n.loaded = !0;
                n.version = '2.0';
                n.queue = [];
                t = b.createElement(e);
                t.async = !0;
                t.src = v;
                s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s)
            }(window,
            document, 'script', '//connect.facebook.net/en_US/fbevents.js');
            window.FacebookPixel = fbq;
            $(document).ready(function() {
                var str = JSON.stringify({"Main Pixel0":"2912480762369957"});
                var newArr = JSON.parse(str);
                var collect_str = JSON.stringify([]);
                var collectNewArr = JSON.parse(collect_str);
                var pageViewFbCall = function(){
                    setTimeout(function(){ FacebookPixel('track', 'PageView'); }, 0);
                }
                var getPixelIds = function (productIds, type, content) {
                    $.ajax({
                        url:'https://pixelconversionpro.com/collectionByProductId.php',
                        dataType:'JSON',
                        crossDomain: true,
                        data:{'productIds':productIds,storeName:'projector-2.myshopify.com'},
                        type:'POST',
                        success:function(data){
                            let collections = data.collectionIds;
                            let inc=0;
                            Object.values(collections).forEach(function (value) {
                                if(productIds[inc] == value.productId && value.collectionId){
                                    Object.keys(value.collectionId).forEach(function (key) {
                                        FacebookPixel('init', value.collectionId[key]);
                                    });
                                }
                                inc++;
                            });
                            FacebookPixel('track', 'PageView');
                            if(content){
                                FacebookPixel('track', type, content);
                            }
                        },
                        error:function(err){
                            console.log(err)
                        }
                    });
                };
                function getPurEventSetting(){
				    var response;
              		$.ajax({
                        url:'https://pixelconversionpro.com/collectionByProductId.php',
                        dataType:'JSON',
                        crossDomain: true,
                        async:false,
                        data:{'purchaseEvent':'yes',storeName:'projector-2.myshopify.com'},
                        type:'POST',
                        success:function(data) {
                          	response = data;
                        },
                        error:function(err) {
                            console.log(err)
                        }
                    });
                    return response;
                }
                Object.keys(newArr).forEach(function (key) {
                    if(key.includes('Main Pixel')){
                        FacebookPixel('init', newArr[key]);
                    }
                });
                pageViewFbCall();
         
                //----------Start Buy It Now Button - App Version 4.1.11 ----
                var nativeFetch = window.fetch;
                window.fetch = function(...args) {
                    args.forEach(function(item,index){
                        if(typeof item === 'string'){
                            if(item.indexOf('checkouts.json') !== -1) {
                                console.log('buy it now clicked');
                                if (location.pathname.match(/\/products\/.+/)) {
                              		FacebookPixel('track', 'InitiateCheckout', {
                                        content_type: 'product_group',
                                        content_ids: meta.product.id,
                                        value: (meta.product.variants[0].price/100),
                                        num_items: '1',
                                        content_name: meta.product.variants[0].name,
                                        currency: Shopify.currency.active,
                                        content_category: meta.product.type
                                    });
                                }else if (location.pathname.match(/^\/cart/)) {
                              		CallCheckoutPixelOnCart();
                                }else{
                                	CallCheckoutPixelOnCartDrawer();
                                }
                            }
                        }
                    });
                    return nativeFetch.apply(window, args);
                }
                //----------End Buy It Now Button Update--------------------

                var addedToCart = false;
                var addToCart = function(addedVariantId) {
                    sessionStorage.removeItem('variant_name');
                    var name;
                    var my_variants = location.search;
                    if(my_variants != '' || my_variants != undefined || my_variants != null) {
                        var my_id = my_variants.split('=');
                        my_id = my_id[1];
                        for(var i = 0; i < meta.product.variants.length; i++) {
                            if(meta.product.variants[i].id == my_id) {
                                name = meta.product.variants[i].name;
                                sessionStorage.setItem('variant_name',name);
                            } 
                        }
                    } 
                    if(sessionStorage.getItem('variant_name') != null) {
                        name = sessionStorage.getItem('variant_name');
                    } else {
                        name = meta.product.variants[0].name;
                    }
                    if (!addedToCart) {
                        var addedVariant = meta.product.variants.find(function(variant) {
                            return variant.id == addedVariantId;
                        });
                        if(addedVariant == undefined){
                            addedVariant = meta.product.variants[0];
                        }
                        FacebookPixel('track', 'AddToCart', {
                            content_ids: __st.rid,
                            content_type: 'product_group',
                            content_category: meta.product.type,
                            content_name: name,
                            currency: Shopify.currency.active, 
                            value: (addedVariant.price /100),

                        });
                        //addedToCart = true;
                    }
          
                };
        
                if (location.pathname.match(/\/products\/.+/)) {
                    $('.product_fb p').each(function() {
                        var fbPixel = $(this).attr('data-pixelid');
                        FacebookPixel('init', fbPixel);
                    });
                    pageViewFbCall();
                    var url_variant_id = getUrlParameter('variant');
                    var content_id = __st.rid;
                    var content_name_value = meta.product.variants[0].name;
                    if(url_variant_id){
                        content_id = url_variant_id;
                        meta.product.variants.forEach(function(item,index) {
                            if(item.id == url_variant_id){
                                content_name_value = item.name;        
                            }
                        });
                    }
                    setTimeout(function(){FacebookPixel('track', 'ViewContent', {
                        content_ids: __st.rid,
                        content_type: 'product_group',
                        content_category: meta.product.type,
                        //content_name: meta.product.variants[0].name,
                        content_name: content_name_value,
                        value: (meta.product.variants[0].price /100),
                        currency: window.ShopifyAnalytics.meta.currency,
                        app_ver: 'Pixel Conversion Pro v4.1.11',
     
                    });}, 0);
                    if($('#purchase').length > 0) {
                        $('#purchase').click(function() {
                            // initiate checkout custom content drawer and model
                            var new_price = meta.product.variants[0].price /100;
                            products_total_price_drmodel = products_total_price_drmodel+new_price;
                            products_item_count_drmodel = products_item_count_drmodel+1;
                            if(!content_ids_arr_drmodel.includes(__st.rid)) {
                                content_ids_arr_drmodel.push(__st.rid);
                            }
                            if(!content_name_arr_drmodel.includes(meta.product.variants[0].name)) {
                                content_name_arr_drmodel.push(meta.product.variants[0].name);
                            }
                            // initiate checkout custom content drawer and model
                            var addedVariantId = $(this).children('[name="id"]').val();
                            addToCart(addedVariantId)
                        });
                    } else {
                        $('form[action="/cart/add"]').submit(function() {
                            // initiate checkout custom content drawer and model
                            var new_price = meta.product.variants[0].price /100;
                            products_total_price_drmodel = products_total_price_drmodel+new_price;
                            products_item_count_drmodel = products_item_count_drmodel+1;
                            if(!content_ids_arr_drmodel.includes(__st.rid)) {
                                content_ids_arr_drmodel.push(__st.rid);
                            }
                            if(!content_name_arr_drmodel.includes(meta.product.variants[0].name)) {
                                content_name_arr_drmodel.push(meta.product.variants[0].name);
                            }
                            // initiate checkout custom content drawer and model
                            var addedVariantId = $(this).children('[name="id"]').val();
                            addToCart(addedVariantId)
                        });
                    }
                    function getUrlParameter(sParam) {
                        var sPageURL = window.location.search.substring(1),
                            sURLVariables = sPageURL.split('&'),
                            sParameterName,
                            i;
                    
                        for (i = 0; i < sURLVariables.length; i++) {
                            sParameterName = sURLVariables[i].split('=');
                    
                            if (sParameterName[0] === sParam) {
                                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                            }
                        }
                    };
                }
                if (location.pathname.match(/^\/collections/)) {
                    Object.keys(collectNewArr).forEach(function (key) {
                        if(key == meta.page.resourceId){
                            FacebookPixel('init', collectNewArr[key]);
                        }
                    });
                    pageViewFbCall();
                    if(location.pathname.match(/^\/collections\/.+/) && window.location.pathname.split('/').indexOf('products') == -1){
                        var current_collection = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
                        setTimeout(function(){FacebookPixel('trackCustom', 'ViewCategory', {
                            content_name: current_collection,
                            app_ver: 'Pixel Conversion Pro v4.1.11',
                        });}, 0);
                    }
                }
                if (location.pathname.match(/^\/cart/)) {
                    localStorage.setItem('product_types', '[]');
                    // for buy now button on cart page
                    function CallCheckoutPixelOnCart(){
                      	var content_ids_arr = [];
                        var content_name_arr = [];
                        var products_total_price = 0;
                        var products_item_count = 0;
                        var products_currency = 'USD';
                        var productsInCartTypes = JSON.parse(localStorage.getItem('product_types'));
                        $.getJSON('/cart.js', function(products) {
                            products_total_price = (products.total_price/100);
                          	products_item_count = products.item_count;
                            products_currency = products.currency;
                            products.items.forEach(function(item,index) {
                                content_ids_arr.push(item.product_id);
                                content_name_arr.push(item.title);
                                $('.cart_fb p').each(function() {
                                    var fbPixel = $(this).text();
                                    FacebookPixel('init', fbPixel);
                                });
                                FacebookPixel('track', 'PageView');
                                if(productsInCartTypes.indexOf(item.product_type) === -1) {
                                    productsInCartTypes.push(item.product_type);
                                }
                            });
                            localStorage.setItem('product_types', JSON.stringify(productsInCartTypes));
                        	if (productsInCartTypes.filter(function(v){return v!==''}).length > 0) {
                                var product_cont_catogry = productsInCartTypes.filter(function(v){return v!==''});                       
                            }else{
                                var product_cont_catogry = 'Not Set';
                            }
                            FacebookPixel('track', 'InitiateCheckout', {
                                content_type: 'product_group',
                                content_ids: content_ids_arr,
                                value: products_total_price,
                                num_items: products_item_count,
                                content_name: content_name_arr,
                                currency: products_currency,
                                content_category: product_cont_catogry
                            });
                        }); 
                    }
                    var content_ids_arr = [];
                    var content_name_arr = [];
                    var products_total_price = 0;
                    var products_item_count = 0;
                    var products_currency = 'USD';
                    var productsInCartTypes = JSON.parse(localStorage.getItem('product_types'));
                    $.getJSON('/cart.js', function(products){
                        products_total_price = (products.total_price/100);
                        products_item_count = products.item_count;
                        products_currency = products.currency;
                        products.items.forEach(function(item,index){
                            content_ids_arr.push(item.product_id);
                            content_name_arr.push(item.title);
                            $('.cart_fb p').each(function() {
                                var fbPixel = $(this).text();
                                FacebookPixel('init', fbPixel);
                            });
                            FacebookPixel('track', 'PageView');
                            if(productsInCartTypes.indexOf(item.product_type) === -1){
                                productsInCartTypes.push(item.product_type);
                            }
                        });
                        localStorage.setItem('product_types', JSON.stringify(productsInCartTypes));
                    });
                    $('body').on('click', '[name="checkout"]', function (e) {
                        if (productsInCartTypes.filter(function(v){return v!==''}).length > 0) {
                          	var product_cont_catogry = productsInCartTypes.filter(function(v){return v!==''});                         
                        }else{
                            var product_cont_catogry = 'Not Set';
                        }
                        FacebookPixel('track', 'InitiateCheckout', {
                            content_type: 'product_group',
                            content_ids: content_ids_arr,
                            value: products_total_price,
                            num_items: products_item_count,
                            content_name: content_name_arr,
                            currency: products_currency,
                            content_category: product_cont_catogry
                        });
                    });
                } else {
                    // initiate checkout custom content drawer and model on buy now button
                    function CallCheckoutPixelOnCartDrawer(){
                  		var content_ids_arr_drmodel = [];
                        var content_name_arr_drmodel = [];
                        var products_total_price_drmodel = 0;
                        var products_item_count_drmodel = 0;
                        var products_currency_drmodel = 'USD';
                        var product_content_category = [];
                        $.getJSON('/cart.js', function(products) {
                            products_total_price_drmodel = (products.total_price/100);
                            products_item_count_drmodel = products.item_count;
                            products_currency_drmodel = products.currency;
                            products.items.forEach(function(item,index) {
                                content_ids_arr_drmodel.push(item.product_id);
                                content_name_arr_drmodel.push(item.title);
                                if(!product_content_category.includes(item.product_type)) {
                                    product_content_category.push(item.product_type);
                                }
                                // product_content_category.push(item.product_type);
                            });
                            
                            if (product_content_category.filter(function(v){return v!==''}).length > 0) {
                              	var product_cart_catogry = product_content_category.filter(function(v){return v!==''});                         
                            }else{
                                var product_cart_catogry = 'Not Set';
                            }
                            FacebookPixel('track', 'InitiateCheckout', {
                                content_type: 'product_group',
                                content_ids: content_ids_arr_drmodel,
                                value: parseFloat(products_total_price_drmodel).toFixed(2),
                                num_items: products_item_count_drmodel,
                                content_name: content_name_arr_drmodel,
                                currency: products_currency_drmodel,
                                content_category: product_cart_catogry
                            });
                        });
                    }
                    // initiate checkout custom content drawer and model
                    var content_ids_arr_drmodel = [];
                    var content_name_arr_drmodel = [];
                    var products_total_price_drmodel = 0;
                    var products_item_count_drmodel = 0;
                    var products_currency_drmodel = 'USD';
                    var product_content_category = [];
                    $('body').on('click', '[name="checkout"]', function (e) {
                        console.log('checkout init 2');
                        var content_ids_arr_drmodel = [];
                        var content_name_arr_drmodel = [];
                        var products_total_price_drmodel = 0;
                        var products_item_count_drmodel = 0;
                        var products_currency_drmodel = 'USD';
                        var product_content_category = [];
                        $.getJSON('/cart.js', function(products) {
                            products_total_price_drmodel = (products.total_price/100);
                            products_item_count_drmodel = products.item_count;
                            products_currency_drmodel = products.currency;
                            products.items.forEach(function(item,index) {
                                content_ids_arr_drmodel.push(item.product_id);
                                content_name_arr_drmodel.push(item.title);
                                if(!product_content_category.includes(item.product_type)) {
                                    product_content_category.push(item.product_type);
                                }
                                // product_content_category.push(item.product_type);
                            });
                            localStorage.setItem('product_types', JSON.stringify(product_content_category));
                            if (product_content_category.filter(function(v){return v!==''}).length > 0) {
                              	var product_cart_catogry = product_content_category.filter(function(v){return v!==''});                         
                            }else{
                                var product_cart_catogry = 'Not Set';
                            }
                            FacebookPixel('track', 'InitiateCheckout', {
                                content_type: 'product_group',
                                content_ids: content_ids_arr_drmodel,
                                value: parseFloat(products_total_price_drmodel).toFixed(2),
                                num_items: products_item_count_drmodel,
                                content_name: content_name_arr_drmodel,
                                currency: products_currency_drmodel,
                                content_category: product_cart_catogry
                            });
                        });
                    });
                }

         
                if (Shopify.Checkout && Shopify.Checkout.page == 'thank_you') {

                    var productIds = [];
                    var productNames = [];
                    var totalItems = 0;
                    var productTypes = JSON.parse(localStorage.getItem('product_types'));
                    Shopify.checkout.line_items.forEach(function(item, index) {
                        if(item.variant_title != ''){
                            var prod_name = item.title+' - '+item.variant_title;                            
                        }else{
                            var prod_name = item.title;
                        }
                        productNames.push(prod_name);
                        //productNames.push(item.title);
                        productIds.push(item.product_id);
                        totalItems += parseInt(item.quantity);
                    });
                    var getOrderID = localStorage.getItem('order_id');
                    var orderID = Shopify.checkout.line_items[0].product_id;
                    var checkout = Shopify.checkout;
                    
                    var checkPriceVal = getPurEventSetting();
                    var set_price_value = '';
                    if(checkPriceVal.show_price && checkPriceVal.show_price == 'no'){
                  		set_price_value = checkout.subtotal_price;
                    }else{
                    	set_price_value = checkout.total_price;
                    }
                    
                    if(checkPriceVal.pur_percent != ''){
                        set_price_value = (set_price_value * checkPriceVal.pur_percent/100).toFixed(2);
                  	}
                  	
                    var purproductTypes = '';
                    if (productTypes.filter(function(v){return v!==''}).length > 0) {
                        purproductTypes = productTypes.filter(function(v){return v!==''});                         
                    }else{
                        purproductTypes = 'Not Set';
                    }
                    
                    getPixelIds(productIds,'Purchase',{
                        content_ids: productIds,
                        content_name: productNames,
                        content_type: 'product_group',
                        value: set_price_value,
                        currency: checkout.currency,
                        num_items: totalItems
                    });
                    localStorage.setItem('order_id', orderID);
                    localStorage.setItem('product_types', '[]');
                } //end of if shopify.checkout
            });
        };


        if (typeof jQuery === 'undefined') {
            loadScript('//ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js', function() {
                jQuery220 = jQuery.noConflict(true);
                myAppJavaScript(jQuery220);
            });
        } else {
            myAppJavaScript(jQuery);
        }
    }
})()