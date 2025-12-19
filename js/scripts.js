// ================= Navbar Mobile Scroll Lock =================
document.addEventListener('DOMContentLoaded', function () {
  const toggler = document.querySelector('.navbar-toggler');
  const navCollapse = document.querySelector('.navbar-collapse');

  if (toggler && navCollapse) {
    toggler.addEventListener('click', function () {
      setTimeout(function () {
        if (navCollapse.classList && navCollapse.classList.contains('show')) {
          // Menu is opening - lock background scroll
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
        } else {
          // Menu is closing - restore background scroll
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.width = '';
        }
      }, 100);
    });
  }
});


// ================= Animated Counter =================
function animateCounter(element, target, duration = 2000) {
  if (!element) return;

  let start = 0;
  const fps = 16;
  const increment = target / (duration / fps);

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target + (element.dataset.suffix || '');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start) + (element.dataset.suffix || '');
    }
  }, fps);
}


// ================= Stats Intersection Observer =================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (
        entry.isIntersecting &&
        entry.target &&
        !entry.target.classList.contains('animated')
      ) {
        const counters = entry.target.querySelectorAll('.counter');
        counters.forEach((counter) => {
          const target = parseInt(counter.dataset.target, 10);
          if (!isNaN(target)) {
            animateCounter(counter, target, 2000);
          }
        });
        entry.target.classList.add('animated');
      }
    });
  },
  { threshold: 0.5 }
);

document.addEventListener('DOMContentLoaded', () => {
  const statsSection = document.querySelector('.about-stats');
  if (statsSection) {
    observer.observe(statsSection);
  }
});


// ================= Dual Carousel Sync =================
document.addEventListener('DOMContentLoaded', function () {
  const carouselSmall = document.querySelector('#carouselSmall');
  const carouselLarge = document.querySelector('#carouselLarge');

  if (!carouselSmall || !carouselLarge || !window.bootstrap) return;

  const bsCarouselSmall = new bootstrap.Carousel(carouselSmall, {
    interval: 3000,
    wrap: true,
  });

  const bsCarouselLarge = new bootstrap.Carousel(carouselLarge, {
    interval: 3000,
    wrap: true,
  });

  // Prevent infinite loop with a flag
  let isSyncing = false;

  carouselSmall.addEventListener('slide.bs.carousel', function (e) {
    if (isSyncing) return;
    isSyncing = true;
    bsCarouselLarge.to(e.to);
    setTimeout(() => (isSyncing = false), 50);
  });

  carouselLarge.addEventListener('slide.bs.carousel', function (e) {
    if (isSyncing) return;
    isSyncing = true;
    bsCarouselSmall.to(e.to);
    setTimeout(() => (isSyncing = false), 50);
  });

  // Sync indicators (assumes indicators belong to large carousel)
  const indicators = document.querySelectorAll('.carousel-indicators button');
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', function () {
      bsCarouselSmall.to(index);
      bsCarouselLarge.to(index);
    });
  });
});


// ================= Preloader =================
window.addEventListener('load', function () {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  setTimeout(function () {
    preloader.classList && preloader.classList.add('fade-out');

    setTimeout(function () {
      preloader.style.display = 'none';
    }, 500);
  }, 500);
});


// ================= Back to Top Button =================
const backToTop = document.getElementById('backToTop');

if (backToTop) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  backToTop.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
