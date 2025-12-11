
document.addEventListener('DOMContentLoaded', function() {
  const toggler = document.querySelector('.navbar-toggler');
  const navCollapse = document.querySelector('.navbar-collapse');
  
  if (toggler && navCollapse) {
    toggler.addEventListener('click', function() {
      setTimeout(function() {
        if (navCollapse.classList.contains('show')) {
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

// Animated Counter
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16); // 60 FPS
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target + (element.dataset.suffix || '');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start) + (element.dataset.suffix || '');
    }
  }, 16);
}

// Intersection Observer to trigger animation when visible
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
      const counters = entry.target.querySelectorAll('.counter');
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        animateCounter(counter, target, 2000);
      });
      entry.target.classList.add('animated');
    }
  });
}, { threshold: 0.5 });

// Observe the stats section
document.addEventListener('DOMContentLoaded', () => {
  const statsSection = document.querySelector('.about-stats');
  if (statsSection) {
    observer.observe(statsSection);
  }
});






document.addEventListener('DOMContentLoaded', function() {
    const carouselSmall = document.querySelector('#carouselSmall');
    const carouselLarge = document.querySelector('#carouselLarge');
    
    // Initialize with auto-cycle
    const bsCarouselSmall = new bootstrap.Carousel(carouselSmall, {
        interval: 3000,
        wrap: true
    });
    
    const bsCarouselLarge = new bootstrap.Carousel(carouselLarge, {
        interval: 3000,
        wrap: true
    });
    
    // Sync both ways
    carouselSmall.addEventListener('slide.bs.carousel', function(e) {
        bsCarouselLarge.to(e.to);
    });
    
    carouselLarge.addEventListener('slide.bs.carousel', function(e) {
        bsCarouselSmall.to(e.to);
    });
    
    // Sync indicators
    const indicators = document.querySelectorAll('.carousel-indicators button');
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            bsCarouselSmall.to(index);
            bsCarouselLarge.to(index);
        });
    });
});







// Hide preloader when page is fully loaded
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    
    // Add a small delay for smooth transition
    setTimeout(function() {
        preloader.classList.add('fade-out');
        
        // Remove from DOM after fade out
        setTimeout(function() {
            preloader.style.display = 'none';
        }, 500);
    }, 500); // Adjust delay as needed (500ms = 0.5 seconds)
});


// Back to Top Button
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
