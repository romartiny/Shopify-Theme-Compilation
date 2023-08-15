import { S as Splide } from './shared-import-splide.esm.bundle.js';
/*!
 * @splidejs/splide-extension-auto-scroll
 * Version  : 0.3.7
 * License  : MIT
 * Copyright: 2022 Naotoshi Fujita
 */
// node_modules/@splidejs/splide/dist/js/splide.esm.js

function isArray(subject) {
  return Array.isArray(subject);
}

function toArray(value) {
  return isArray(value) ? value : [value];
}

function forEach(values, iteratee) {
  toArray(values).forEach(iteratee);
}

function raf(func) {
  return requestAnimationFrame(func);
}

var EVENT_MOVE = "move";
var EVENT_MOVED = "moved";
var EVENT_UPDATED = "updated";
var EVENT_DRAG = "drag";
var EVENT_SCROLL = "scroll";
var EVENT_SCROLLED = "scrolled";
var EVENT_DESTROY = "destroy";

function EventInterface(Splide22) {
  const {
    event
  } = Splide22;
  const key = {};
  let listeners = [];

  function on(events, callback, priority) {
    event.on(events, callback, key, priority);
  }

  function off(events) {
    event.off(events, key);
  }

  function bind(targets, events, callback, options) {
    forEachEvent(targets, events, (target, event2) => {
      listeners.push([target, event2, callback, options]);
      target.addEventListener(event2, callback, options);
    });
  }

  function unbind(targets, events, callback) {
    forEachEvent(targets, events, (target, event2) => {
      listeners = listeners.filter(listener => {
        if (listener[0] === target && listener[1] === event2 && (!callback || listener[2] === callback)) {
          target.removeEventListener(event2, listener[2], listener[3]);
          return false;
        }

        return true;
      });
    });
  }

  function forEachEvent(targets, events, iteratee) {
    forEach(targets, target => {
      if (target) {
        events.split(" ").forEach(iteratee.bind(null, target));
      }
    });
  }

  function destroy() {
    listeners = listeners.filter(data => unbind(data[0], data[1]));
    event.offBy(key);
  }

  event.on(EVENT_DESTROY, destroy, key);
  return {
    on,
    off,
    emit: event.emit,
    bind,
    unbind,
    destroy
  };
}

function RequestInterval(interval, onInterval, onUpdate, limit) {
  const {
    now
  } = Date;
  let startTime;
  let rate = 0;
  let id;
  let paused = true;
  let count = 0;

  function update() {
    if (!paused) {
      const elapsed = now() - startTime;

      if (elapsed >= interval) {
        rate = 1;
        startTime = now();
      } else {
        rate = elapsed / interval;
      }

      if (onUpdate) {
        onUpdate(rate);
      }

      if (rate === 1) {
        onInterval();

        if (limit && ++count >= limit) {
          return pause();
        }
      }

      raf(update);
    }
  }

  function start(resume) {
    !resume && cancel();
    startTime = now() - (resume ? rate * interval : 0);
    paused = false;
    raf(update);
  }

  function pause() {
    paused = true;
  }

  function rewind() {
    startTime = now();
    rate = 0;

    if (onUpdate) {
      onUpdate(rate);
    }
  }

  function cancel() {
    cancelAnimationFrame(id);
    rate = 0;
    id = 0;
    paused = true;
  }

  function set(time) {
    interval = time;
  }

  function isPaused() {
    return paused;
  }

  return {
    start,
    rewind,
    pause,
    cancel,
    set,
    isPaused
  };
} // node_modules/@splidejs/splide/src/js/constants/types.ts


var SLIDE2 = "slide"; // node_modules/@splidejs/splide/src/js/utils/type/type.ts

function isObject2(subject) {
  return !isNull2(subject) && typeof subject === "object";
}

function isUndefined2(subject) {
  return typeof subject === "undefined";
}

function isNull2(subject) {
  return subject === null;
} // node_modules/@splidejs/splide/src/js/utils/array/index.ts


var arrayProto2 = Array.prototype; // node_modules/@splidejs/splide/src/js/utils/arrayLike/slice/slice.ts

function slice2(arrayLike, start, end) {
  return arrayProto2.slice.call(arrayLike, start, end);
} // node_modules/@splidejs/splide/src/js/utils/object/forOwn/forOwn.ts


function forOwn2(object, iteratee, right) {
  if (object) {
    let keys = Object.keys(object);
    keys = right ? keys.reverse() : keys;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (key !== "__proto__") {
        if (iteratee(object[key], key) === false) {
          break;
        }
      }
    }
  }

  return object;
} // node_modules/@splidejs/splide/src/js/utils/object/assign/assign.ts


function assign2(object) {
  slice2(arguments, 1).forEach(source => {
    forOwn2(source, (value, key) => {
      object[key] = source[key];
    });
  });
  return object;
} // node_modules/@splidejs/splide/src/js/utils/math/math/math.ts


var {
  min: min2,
  max: max2,
  floor: floor2,
  ceil: ceil2,
  abs: abs2
} = Math; // node_modules/@splidejs/splide/src/js/utils/math/clamp/clamp.ts

function clamp2(number, x, y) {
  const minimum = min2(x, y);
  const maximum = max2(x, y);
  return min2(max2(minimum, number), maximum);
} // src/js/constants/defaults.ts


var DEFAULTS2 = {
  speed: 1,
  autoStart: true,
  pauseOnHover: true,
  pauseOnFocus: true
}; // src/js/extensions/AutoScroll/AutoScroll.ts

function AutoScroll(Splide3, Components2, options) {
  const {
    on,
    off,
    bind,
    unbind
  } = EventInterface(Splide3);
  const {
    translate,
    getPosition,
    toIndex,
    getLimit
  } = Components2.Move;
  const {
    setIndex,
    getIndex
  } = Components2.Controller;
  const {
    orient
  } = Components2.Direction;
  const {
    root
  } = Splide3;
  let autoScrollOptions = {};
  let interval;
  let paused;
  let hovered;
  let focused;
  let busy;
  let currPosition;

  function setup() {
    const {
      autoScroll
    } = options;
    autoScrollOptions = assign2({}, DEFAULTS2, isObject2(autoScroll) ? autoScroll : {});
  }

  function mount() {
    if (!interval && options.autoScroll !== false) {
      interval = RequestInterval(0, move);
      listen();
      autoStart();
    }
  }

  function destroy() {
    if (interval) {
      interval.cancel();
      interval = null;
      currPosition = void 0;
      off([EVENT_MOVE, EVENT_DRAG, EVENT_SCROLL, EVENT_MOVED, EVENT_SCROLLED]);
      unbind(root, "mouseenter mouseleave focusin focusout");
    }
  }

  function listen() {
    if (autoScrollOptions.pauseOnHover) {
      bind(root, "mouseenter mouseleave", e => {
        hovered = e.type === "mouseenter";
        autoToggle();
      });
    }

    if (autoScrollOptions.pauseOnFocus) {
      bind(root, "focusin focusout", e => {
        focused = e.type === "focusin";
        autoToggle();
      });
    }

    on(EVENT_UPDATED, update);
    on([EVENT_MOVE, EVENT_DRAG, EVENT_SCROLL], () => {
      busy = true;
      pause(false);
    });
    on([EVENT_MOVED, EVENT_SCROLLED], () => {
      busy = false;
      autoToggle();
    });
  }

  function update() {
    const {
      autoScroll
    } = options;

    if (autoScroll !== false) {
      autoScrollOptions = assign2(autoScrollOptions, isObject2(autoScroll) ? autoScroll : {});
      mount();
    } else {
      destroy();
    }

    if (interval && !isUndefined2(currPosition)) {
      translate(currPosition);
    }
  }

  function autoStart() {
    if (autoScrollOptions.autoStart) {
      if (document.readyState === "complete") {
        play();
      } else {
        bind(window, "load", play);
      }
    }
  }

  function play() {
    if (interval && interval.isPaused()) {
      interval.start(true);
    }
  }

  function pause() {
    let manual = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    if (interval && !interval.isPaused()) {
      interval.pause();
    }

    paused = manual;
  }

  function autoToggle() {
    if (!paused) {
      if (!hovered && !focused && !busy) {
        play();
      } else {
        pause(false);
      }
    }
  }

  function move() {
    const position = getPosition();
    const destination = computeDestination(position);

    if (position !== destination) {
      translate(destination);
      updateIndex(destination);
      currPosition = destination;
    } else {
      pause(false);

      if (autoScrollOptions.rewind) {
        Splide3.go(0);
      }
    }
  }

  function computeDestination(position) {
    const speed = autoScrollOptions.speed || 1;
    position += orient(speed);

    if (Splide3.is(SLIDE2)) {
      position = clamp2(position, getLimit(false), getLimit(true));
    }

    return position;
  }

  function updateIndex(position) {
    const {
      length
    } = Splide3;
    const index = (toIndex(position) + length) % length;

    if (index !== getIndex()) {
      setIndex(index);
      Components2.Slides.update();
      Components2.Pagination.update();
    }
  }

  return {
    setup,
    mount,
    destroy,
    play,
    pause
  };
}

window.Splide = Splide;
window.slideshows = {};

const _createSplideInstance = (splideRoot, options, extensions) => {
  if (splideRoot.hasAttribute('data-thumbnails')) {
    const thumbsRoot = document.getElementById(splideRoot.getAttribute('data-thumbnails'));
    window.slideshows[thumbsRoot.id] = new Splide(`#${thumbsRoot.id}`, {
      direction: 'ttb',
      height: 'var(--thumbnails-height)',
      autoHeight: true,
      arrows: false,
      pagination: false,
      isNavigation: true,
      focus: 'left',
      gap: '0.625rem',
      slideFocus: false
    });
    window.slideshows[splideRoot.id] = new Splide(`#${splideRoot.id}`, options);
    const mainSplide = window.slideshows[splideRoot.id];
    const thumbsSplide = window.slideshows[thumbsRoot.id];
    mainSplide.mount(extensions);
    document.addEventListener('shapes:product:arrow-change', e => {
      if (e.detail.direction == 'prev') {
        thumbsSplide.go('<');
      } else {
        thumbsSplide.go('>');
      }

      const slides = thumbsSplide.Components.Slides;
      const targetSlideObject = slides.getAt(thumbsSplide.index).slide.querySelector('.media-thumbnail');
      targetSlideObject.click();
    });
    document.addEventListener('shapes:product:variantchange', e => {
      if (!e.target.contains(splideRoot)) return;
      const mediaId = e.detail.variant.featured_media.id;
      const targetSlides = thumbsSplide.Components.Slides.filter(slide => slide.slide.dataset.mediaId === mediaId.toString());
      if (!targetSlides.length) return;
      thumbsSplide.go(targetSlides[0].index);
    });
    thumbsSplide.mount();
  } else {
    window.slideshows[splideRoot.id] = new Splide(`#${splideRoot.id}`, options); //make IDs unique

    window.slideshows[splideRoot.id].on('mounted', e => {
      const clones = window.slideshows[splideRoot.id].root.querySelectorAll('.splide__slide--clone');

      for (let i = 0; i < clones.length; i++) {
        let clone = clones[i];
        let elements = clone.getElementsByTagName('*');

        for (let j = 0; j < elements.length; j++) {
          let el = elements[j];

          if (el.hasAttribute('id')) {
            el.id = el.getAttribute('id') + '-' + i;
          }

          if (el.hasAttribute('for')) {
            let newForAttr = el.getAttribute('for') + '-' + i;
            el.setAttribute('for', newForAttr);
          }
        }
      }
    });
    window.slideshows[splideRoot.id].mount(extensions);
  }
};

window.destroySlideshow = splideRoot => {
  window.slideshows[splideRoot.id].destroy();
  delete window.slideshows[splideRoot.id];
};

window.makeSlideshow = splideRoot => {
  if (splideRoot.matches('.splide--thumbnails')) return;

  if (!splideRoot.id) {
    console.error('Shapes Theme: makeSlideshow requires a unique ID on the slideshow root');
    return;
  }

  if (window.slideshows[splideRoot.id]) return;
  const mobileOnly = splideRoot.matches('.splide--mobile');
  let options = {
    mediaQuery: 'min',
    perPage: 1,
    perMove: 1,
    autoWidth: true,
    arrows: true,
    pagination: false,
    rewind: true,
    autoScroll: {
      autoStart: false
    },
    breakpoints: mobileOnly ? {
      990: {
        destroy: true
      }
    } : {}
  };
  const customOptions = splideRoot.querySelector('.slideshow-options');

  if (customOptions !== null) {
    options = JSON.parse(splideRoot.querySelector('.slideshow-options').textContent);
  }

  if (splideRoot.matches('.splide--product')) {
    const productOptions = {
      mediaQuery: 'min',
      type: 'slide',
      perPage: 1,
      perMove: 1,
      autoWidth: true,
      pagination: false,
      arrows: true,
      rewind: true,
      drag: splideRoot.dataset.dragDisabled !== 'true',
      autoScroll: {
        autoStart: false
      },
      breakpoints: {
        990: {
          destroy: true
        }
      }
    };
    import('./components-splide-product.bundle.js').then(_ref => {
      let {
        default: SplideProductModule,
        SplideProduct
      } = _ref;

      _createSplideInstance(splideRoot, productOptions, {
        SplideProduct
      });
    });
  } else {
    let extensions = {};

    if (options.autoScroll && options.autoScroll.autoStart === true && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      extensions = {
        AutoScroll
      };
    }

    _createSplideInstance(splideRoot, options, extensions);
  }
};

window.discoverNewSlideshows = function () {
  let container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  container.querySelectorAll('.splide').forEach(splideRoot => {
    makeSlideshow(splideRoot);
  });
};

window.destroySlideshowsIn = function () {
  let container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
  container.querySelectorAll('.splide').forEach(splideRoot => {
    destroySlideshow(splideRoot);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  discoverNewSlideshows();
});
document.addEventListener('shapes:productquickbuy:added', () => {
  discoverNewSlideshows();
});
document.addEventListener('shapes:productquickbuy:willremove', e => {
  if (!e.detail.container) return;
  destroySlideshowsIn(e.detail.container);
});

function progressBar(Splide, Components, options) {
  const bar = Splide.root.querySelector('.splide__progress-bar');

  function mount() {
    if (bar) {
      Splide.on('mounted move', onMountedMove);
    }
  }

  function onMountedMove() {
    const end = Splide.Components.Controller.getEnd() + 1;
    bar.style.width = String(100 * (Splide.index + 1) / end) + '%';
  }

  return {
    mount
  };
}

export { progressBar };
