"use strict";

Shopify.theme.jsInstagram = {
  init: function init($section) {
    // Add settings from schema to current object
    Shopify.theme.jsInstagram = $.extend(this, Shopify.theme.getSectionData($section));
    var $target = $section.find('[data-instafeed]');
    this.loadContent({
      el: $target,
      clientID: this.instagram_client_id,
      limit: this.instagram_count,
      column: this.column_width
    });
  },
  loadContent: function loadContent(settings) {
    if (settings.clientID) {
      var url = 'https://api.instagram.com/v1/users/self/media/recent/?access_token=' + settings.clientID;
      $.ajax({
        type: 'GET',
        url: url,
        dataType: 'jsonp',
        success: function success(data) {
          if (data.meta.code === 200 && data.data.length) {
            var data = data.data;
            var count = 0;
            settings.el.empty();

            for (var i = 0; i < data.length; i++) {
              var thisMedia = data[i],
                  item;
              var url = thisMedia.images.standard_resolution.url;

              if (!thisMedia.images.standard_resolution.url.indexOf("null") > -1) {
                item = '<div class="il-photo__img instagram__bg" style="background-image:url(' + url + ')" data-filter="' + thisMedia.filter + '" /></div>';
                item = '<a href="' + thisMedia.link + '" target="_blank" class="instagram__link">' + item + '</a>';
              }

              if (thisMedia.videos) {
                item = '<div class="instagram__video instagram__bg" style="background-image:url(' + url + ')" data-filter="' + thisMedia.filter + '" /></div>';
              }

              if (item) {
                // Get Unix timestamp and convert to date
                var date = new Date(parseInt(data[i].created_time) * 1000);
                var lang = document.getElementsByTagName('html')[0].getAttribute('lang');

                if (Shopify.theme.jsInstagram.show_date) {
                  var itemOverlay = void 0;

                  if (lang == 'en') {
                    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    itemOverlay = '<a class="instagram-overlay" href="' + thisMedia.link + '" target="_blank" class="instagram__link">' + '<span>' + monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + '</span></a>';
                  } else {
                    itemOverlay = '<a class="instagram-overlay" href="' + thisMedia.link + '" target="_blank" class="instagram__link">' + '<span>' + date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear() + '</span></a>';
                  }

                  item = '<div class="' + settings.column + ' columns instagram__item small-down--one-half">' + itemOverlay + item + '</div>';
                } else {
                  item = '<div class="' + settings.column + ' columns instagram__item small-down--one-half">' + item + '</div>';
                }
              }

              if (item !== '') {
                settings.el.append(item);
                count++;
              }

              if (count == settings.limit) {
                break;
              }
            }
          }
        },
        error: function error() {}
      });
    }
  },
  unload: function unload() {}
};