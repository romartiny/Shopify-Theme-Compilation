/*********************
rendomly number avialable user on current page
***********************/ 
jQuery(function($) {
  var min_max =  $("#min_max_number").val();
  min_max1 = min_max.split("-");
 
   var min1 =  parseInt(min_max1[0]);
   var max1 =  parseInt(min_max1[1]);

   min = Math.ceil(min1);
   max = Math.floor(max1);


    setInterval(function(){  
      
      var  r =  Math.floor(Math.random()*(max-min+1)+min);
      
      if(r >= min1  && r <= max1)
        
      {
      var digits = (""+r).split("");
      
      var d = '';
      for(var j=0;j<digits.length;j++){
        
           d += '<span>'+ digits[j] +'</span>';
        
      } 
       
                 
      jQuery("#dynamic_counter1").html(d); 
      } 
      
  
  }, 2000);
  });


/******************
for read more 
******************/


// $(function(){

//   $('.product-description').readmore({
//     collapsedHeight: 153,
//     heightMargin: 16,
//     moreLink: '<a href="javascript:void(0)" class="more_load btn--">Read more</a>',
//     lessLink: '<a href="javascript:void(0)" class="more_load btn--">Less</a>'
//   });
// });


/*
$(document).ready(function() {
    
    // Configure/customize these variables.
  var showChar = 400;  // How many characters are shown by default
    var ellipsestext = "";
    var moretext = "Read More";
    var lesstext = "Less";
    var half_disc=$(".half_disc_readmore").html();

//  $('.product-description').each(function() {   });
        var content = $('.product-description').html();
 
 if(content.length > showChar) {  
  
          //  var c =content.substr(0, showChar);
           // var h =content.substr(showChar, content.length - showChar);
 
            var htmlfl ='<span class="halfText">'+half_disc + '</span><span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span class="fullText">' + content + '</span>&nbsp;&nbsp;<a href="javascript:" class="more_load">' + moretext + '</a></span>';
 
            $('.product-description').html(htmlfl);
      
 }
 
    $(".more_load").click(function(){
        if($(this).hasClass("less")) {
            $(this).removeClass("less");
            $(this).html(moretext);
        } else {
            $(this).addClass("less");
            $(this).html(lesstext);
        }
      //  $(this).parent().prev().toggle();
       // $(this).prev().toggle();
	    $('.moreellipses').toggle();
        $('.fullText').toggle();
		$('.halfText').toggle();
        return false;
    });
});	
*/


/************************

product thumb script

*************************/
 
    $(window).load(function(){
      $('.flexsliderproduct').flexslider({
        animation: "slide",
       slideshow: false, 
		controlNav: false,
        animationLoop: false,
		pauseOnHover:true, 
        itemWidth: 93,
        itemMargin: 10,
        pausePlay: false,
        start: function(slider){
          $('.slider').removeClass('loading');
        }
      });
    });
 


