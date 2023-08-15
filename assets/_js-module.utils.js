define([], function(){

  console.log('Module Utils is loaded');

  /*
    ---------------------------------------------------------
    Get supported event for animation ending    
    ---------------------------------------------------------
  */
  var getAnimationEndEvent = function() {
    var el = document.createElement('div');
    var animEndEventNames = {
      animation       : 'animationend',
      WebkitAnimation : 'webkitAnimationEnd',
    };

    for (var name in animEndEventNames) {
      if (el.style[name] !== undefined) {
        return animEndEventNames[name];
      }
    }

    return false;
  };


  /*
    ---------------------------------------------------------
    Search DOM Elements    
    ---------------------------------------------------------
  */
  function domFinder (DOM) {
    var temp;
    
    for (var prop in DOM){
      
      temp = domFinder._findHtmlEl (prop, DOM[prop]);
      if (temp) {
        DOM[prop] = temp;
      } else {
        throw new Error(DOM[prop] +' is not exist');
      }
    }

    return DOM;
  }

  domFinder._findHtmlEl = function (queryName, queryStr) {
    
    var htmlElement,
        idQueryRegExp   = /(id$)/i,
        allQueryRegExp  = /(all$)/i,
        hashIdRegExp = /^#.+/i;
    
    if (idQueryRegExp.test(queryName)) {//if name parametr has ID(id) ending
      
      htmlElement = document.getElementById(queryStr);
    
    } else if (allQueryRegExp.test(queryName)) {//if name parametr has ALL(all) ending
      
      htmlElement = document.querySelectorAll(queryStr);
      
    } else if (hashIdRegExp.test(queryStr)){//if query string has # begining
      
      htmlElement = document.getElementById(queryStr.replace('#', ''));
    
    } else {
      
      htmlElement = document.querySelector(queryStr);    
    }
    
    return htmlElement;
  }

  /*
    ---------------------------------------------------------
    Scroll window to position
    ---------------------------------------------------------
  */
  function scrollToY(scrollTargetY, speed, easing) {
    // scrollTargetY: the target scrollY property of the window
    // speed: time in pixels per second
    // easing: easing equation to use

    var scrollY = window.scrollY,
      scrollTargetY = scrollTargetY || 0,
      speed = speed || 2000,
      easing = easing || 'easeOutSine',
      currentTime = 0;

    // min time .1, max time .8 seconds
    var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

    // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
    var PI_D2 = Math.PI / 2,
      easingEquations = {
        easeOutSine: function(pos) {
          return Math.sin(pos * (Math.PI / 2));
        },
        easeInOutSine: function(pos) {
          return (-0.5 * (Math.cos(Math.PI * pos) - 1));
        },
        easeInOutQuint: function(pos) {
          if ((pos /= 0.5) < 1) {
            return 0.5 * Math.pow(pos, 5);
          }
          return 0.5 * (Math.pow((pos - 2), 5) + 2);
        }
      };

    // add animation loop
    function tick() {
      currentTime += 1 / 60;

      var p = currentTime / time;
      var t = easingEquations[easing](p);

      if (p < 1) {
        requestAnimationFrame(tick);

        window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
      } else {
        window.scrollTo(0, scrollTargetY);
      }
    }

    // call it once to get started
    tick();
  }



  /*
    ---------------------------------------------------------
    Get a scrollbar width in the particular browser
    ---------------------------------------------------------
  */
  function getScrollBarWidth() {
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild (inner);

    document.body.appendChild (outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild (outer);

    return (w1 - w2);
  }



  /*
    ---------------------------------------------------------
    Trigger event on the element
    ---------------------------------------------------------
  */
  function triggerEvent(element, eventName, eventInit) {

    if (!eventName) {
      return null;
    }

    var event;

    event = new CustomEvent(eventName, eventInit);
    element.dispatchEvent(event);
  }


  /*
    ---------------------------------------------------------
    Asynchronous loading of CSS
    ---------------------------------------------------------
  */
  function loadCSS(link) {

    if (!link && typeof link !== 'string') {
      return null;
    }

    var cssFile   = document.createElement('link'); 
    cssFile.rel   = 'stylesheet';
    cssFile.href  = link;
    cssFile.media = 'only x';

    cssFile.addEventListener('load', function onloadCSS() {
      cssFile.media = 'all';
      cssFile.removeEventListener('load', onloadCSS);
    });

    document.head.appendChild(cssFile);      
  };



  /*
    ---------------------------------------------------------
    Polyfill for matches   
    ---------------------------------------------------------
  */  
  window.Element && function(ElementPrototype) {
      ElementPrototype.matches = ElementPrototype.matches ||
      ElementPrototype.matchesSelector ||
      ElementPrototype.webkitMatchesSelector ||
      ElementPrototype.msMatchesSelector ||
      function(selector) {
          var node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;
          while (nodes[++i] && nodes[i] != node);
          return !!nodes[i];
      }
  }(Element.prototype);
  


  /*
    ---------------------------------------------------------
    Polyfill for closest   
    ---------------------------------------------------------
  */
  window.Element && function(ElementPrototype) {
      ElementPrototype.closest = ElementPrototype.closest ||
      function(selector) {
          var el = this;
          while (el.matches && !el.matches(selector)) el = el.parentNode;
          return el.matches ? el : null;
      }
  }(Element.prototype);


  
  /*
    ---------------------------------------------------------
    Polyfill for requestAnimFrame
    https://gist.github.com/paulirish/1579671
    ---------------------------------------------------------
  */
  (function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };

    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
  }());


  /*
    ---------------------------------------------------------
    Polyfill for customEvent
    https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
    ---------------------------------------------------------
  */
  (function() {
    if ( typeof window.CustomEvent === "function" ) return false;

    function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
     }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
  }());



  /*
    ---------------------------------------------------------
    Disable or enable browser scroll
    http://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily
    ---------------------------------------------------------
  */ 
  function disableScroll () {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', _preventDefault, false);
    window.onwheel = this.preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = this.preventDefault; // older browsers, IE
    window.ontouchmove = this.preventDefault; // mobile
  };

 function enableScroll () {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', _preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
  };

  function _preventDefault (e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
  };



  /*
    ---------------------------------------------------------
    Merge to objects. First will be overwritten by second one
    ---------------------------------------------------------
  */ 
  function mergeOptions(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
  }

  

  return {
    getAnimationEndEvent: getAnimationEndEvent,
    domFinder:            domFinder,
    scrollToY:            scrollToY,
    disableScroll:        disableScroll,
    enableScroll:         enableScroll,
    triggerEvent:         triggerEvent,
    getScrollBarWidth:    getScrollBarWidth,
    mergeOptions:         mergeOptions,
    loadCSS:              loadCSS
  };

});