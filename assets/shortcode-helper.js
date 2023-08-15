	var tabsFn = (function() {
  
  function init() {
    //setHeight();
  }
  
  function setHeight() {
    var $tabPane = $('.tab-pane'),
        tabsHeight = $('.nav-tabs').height(); 
    
    $tabPane.css({
      height: tabsHeight
    });
  }
    
  $(init);
})();
jQuery(document).ready(function($) {
   $("div.bhoechie-tab-menu>div.list-group>a").click(function(e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(".hidden-alert").hide();
        $(this).addClass("active");
        var index = $(this).index();
        $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
        $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
    });
  function convertToSlug(Text)
{
    return Text
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'')
        ;
}
var slug = function(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  var to   = "aaaaaeeeeeiiiiooooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
};
$("#product-preview").change(function(event) {
  /* Act on the event */
  var $src  = $(this).find(":selected").data('src');
  $(".preview-product").attr('src',$src);
});
  $("#generate-product").click(function(event) {
    /* Act on the event */
    var check = true;
    $('#form-product').find('input,select').each(function(){
    if($(this).prop('required')){
       if($(this).val() == ""){
        $(this).focus();
        $(this).css('border','1px solid red');
        check = false ;
         event.stopPropagation();
        return
       // break;
       }else{
        $(this).css('border','1px solid green');
       }
    }  
});
    if (!check) {
      return 
    };
    var $data = $("#form-product").serializeArray();
    var $shortcode ="[product ";
    $.each($data,function(index, el) {
      if (el.value != "") { 
           $shortcode +=el.name+'="'+el.value+'" ';
        };
    });
    $shortcode += "]";
    $shortcode = "<!-- Shortcode product --> \n" + $shortcode + " \n <!-- / Shortcode product -->";
    $("#result-product").text($shortcode);
    $("#result-product").select();
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
      $(".hidden-alert").show();
    } catch (err) {
      console.log('Oops, unable to copy');
    }

  });

  $("#collection-preview").change(function(event) {
    /* Act on the event */
      var $src  = $(this).find(":selected").data('src');
      $(".preview-collection").attr('src',$src);
    });
    $("#generate-collections").click(function(event) {
        var check = true;
        // $('#form-collections').find('input,select').each(function(){
        //   if($(this).prop('required')){
        //      if($(this).val() == ""){
        //       $(this).focus();
        //       $(this).css('border','1px solid red');
        //       check = false ;
        //        event.stopPropagation();
        //       return
        //      // break;
        //      }else{
        //       $(this).css('border','1px solid green');
        //      }
        //   }  
        // });
          // if(!check) {
          //   return;
          // }
             var $data = $("#form-collections").serializeArray();
             var $shortcode = "[collections  ";
             $.each($data ,function(index, el) {
              if(el.value != "" ){
                $shortcode += el.name + '="'+el.value+'" '; 
              }
             });
             $shortcode += "]";
            $shortcode = "<!-- Shortcode collections portfolio  --> \n" + $shortcode + " \n <!-- / Shortcode collections portfolio -->";
            $("#result-collections").text($shortcode);
            $("#result-collections").select();
            try {
              var successful = document.execCommand('copy');
              var msg = successful ? 'successful' : 'unsuccessful';
              console.log('Copying text command was ' + msg);
              $(".hidden-alert").show();
            } catch (err) {
              console.log('Oops, unable to copy');
            }
        });
  $(".pick-font").iconpicker();
});