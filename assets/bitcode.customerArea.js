
/* customer address helper */
Shopify.CustomerAddress = {
  toggleForm: function(id) {
    var editEl = document.getElementById('edit_address_'+id);
    var toolEl = document.getElementById('tool_address_'+id);
    var parentEL = jQuery('#parent_address_'+id);
    if(parentEL.hasClass('show'))
      parentEL.removeClass('show');
    else
      parentEL.addClass('show');
    editEl.style.display = editEl.style.display == 'none' ? '' : 'none';
    toolEl.style.display = toolEl.style.display == 'none' ? '' : 'none';
    return false;    
  },
  
  toggleNewForm: function() {
    var el = document.getElementById('add_address');
    el.style.display = el.style.display == 'none' ? '' : 'none';
    return false;
  },
  
  destroy: function(id, confirm_msg) {
    if (confirm(confirm_msg || "Are you sure you wish to delete this address?")) {
      Shopify.postLink('/account/addresses/'+id, {'parameters': {'_method': 'delete'}});
    }      
  }
}
