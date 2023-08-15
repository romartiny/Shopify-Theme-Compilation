
/**
* Remaining Items Bar
*/
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

var total_items = 50;
var d = new Date();
var ran = randomIntFromInterval(12,14);
//console.log(ran);
var decrease_after = 1.7;	//in minutes
//var qtysold = $("#qtysold").html();
var decrease_after_first_item = 0.17; //in minutes
var min_of_remaining_items = 1;
var remaining_items = randomIntFromInterval(12,15);

(function( $ ) {
 
    $.fn.progressbar = function() {
      	var progress_bar_html = "<p>Hurry! Only <span class='count'>" + remaining_items + "</span> left in stock.</p>" + "<div class='progressbar'><div style='width:100%'></div></div>";
      	
      	this.addClass('items-count');
        this.html(progress_bar_html + this.html());
      	
        updateMeter(this);
 		   var ths = this;
      
      	setTimeout(function(){
          remaining_items--;
          if(remaining_items < min_of_remaining_items ){
          	remaining_items = randomIntFromInterval(12,15);
          }
          	$('.count').css('background-color', '#E04848');
            $('.count').css('color', '#fff');
            $('.count').css('border-radius','5px');
            
            setTimeout(function(){
            $('.count').css('background-color', '#fff');
            $('.count').css('color', '#A94442');
            },1000 * 60 * 0.03);
          
          	ths.find(".count").text(remaining_items);
          	updateMeter(ths);
        }, 1000 * 60 * decrease_after_first_item);
      
          setInterval(function(){
          remaining_items--;
          if(remaining_items < min_of_remaining_items ){
          	remaining_items = randomIntFromInterval(12,15);
          }
          	$('.count').css('background-color', '#E04848');
            $('.count').css('color', '#fff');
            $('.count').css('border-radius','5px');
            
            setTimeout(function(){
            $('.count').css('background-color', '#fff');
            $('.count').css('color', '#A94442');
            },1000 * 60 * 0.03);
            
          	ths.find(".count").text(remaining_items);
          	updateMeter(ths);
        }, 1000 * 60 * decrease_after);        
    };
   
    function updateMeter(ths){
		var progress = 100*remaining_items/total_items;
      if(remaining_items < 10) {
      	ths.find('.progressbar div:first').addClass('less-than-ten');
      }
        ths.find('.progressbar').addClass('active progress-striped');
      setTimeout(function(){
      
      	myanimate(ths.find('.progressbar div:first'), progress);
         ths.find('.progressbar').removeClass('active progress-striped');
    },1000);
    }	
}( jQuery ));


function myanimate(elem, total_width) {
	
  	var width = 0;
  	var max_width = parseInt(elem.closest('.progressbar').css('width'));
  	var elem_current_width = Math.floor(100*parseInt(elem.css('width'))/max_width);
  	if(elem_current_width > total_width) {
     	 width = elem_current_width;
    }
  	//console.log("max_width = " + max_width);
  	//console.log("elem_current_width = " + elem_current_width);
  	function frame() {
      if(elem_current_width > total_width) {
      	width--;  // update parameters 
      } else {
      	width++;  // update parameters 
      }
    
      	//console.log("width = " + width);
    	elem.css('width', width + '%'); // show frame 

    	if (width == total_width || width <= 0 || width >= 100)  // check finish condition
      	clearInterval(id);
  	}

  var id = setInterval(frame, 40); // draw every 10ms
}

