window.shapesParallax = window.shapesParallax || {};

window.shapesParallax.init = function () {
  if (window.shapesParallax.executed) {
    return;
  }

  const elements = document.querySelectorAll('[data-parallax-element]');
  const parallaxItems = [];
  elements.forEach(function (item) {
    let speed = parseInt(item.getAttribute('data-parallax-speed'));
    parallaxItems.push({
      speed: speed
    });
  });

  function smoothAnimation() {
    for (var i = 0; i < elements.length; i++) {
      let translateY = Math.round(window.scrollY / parallaxItems[i].speed);
      elements[i].style.transform = `translate3d(0px, ${translateY}px, 0px)`;
    }

    requestAnimationFrame(smoothAnimation);
  }

  document.addEventListener('scroll', () => {
    requestAnimationFrame(smoothAnimation);
  }, {
    passive: true
  });

  function scrollRotate() {
    const items = document.querySelectorAll('.sticker-rotate-when-scrolling');

    for (let item of items) {
      item.style.transform = 'rotate(' + window.pageYOffset / 3 + 'deg)';
    }
  }

  window.onscroll = function () {
    requestAnimationFrame(scrollRotate);
  };

  window.shapesParallax.executed = true;
};

if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  document.addEventListener('DOMContentLoaded', function () {
    shapesParallax.init();
  });
  document.addEventListener('shopify:section:load', () => {
    window.shapesParallax.executed = false;
    shapesParallax.init();
  });
}
