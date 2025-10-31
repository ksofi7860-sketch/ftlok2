// ===== HERO SLIDESHOW =====
const heroImages = [
  "https://cdn.pixabay.com/photo/2015/10/13/15/22/valve-986317_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/10/24/18/51/steam-8338896_1280.jpg",
  "https://cdn.pixabay.com/photo/2013/02/12/22/07/flute-80881_1280.jpg",
  "https://cdn.pixabay.com/photo/2020/06/14/17/53/valve-5298757_1280.jpg",
  "https://cdn.pixabay.com/photo/2020/02/28/15/38/nature-4887751_1280.jpg"
];

let heroIdx = 0;
const hero = document.getElementById('hero-section');

function setHeroBackground(idx) {
  if (hero) {
    hero.style.backgroundImage = `url('${heroImages[idx]}')`;
  }
}

if (hero) {
  setHeroBackground(heroIdx);
  setInterval(() => {
    heroIdx = (heroIdx + 1) % heroImages.length;
    setHeroBackground(heroIdx);
  }, 4000);
}

// ===== PRODUCT SLIDESHOW =====
const productSlides = document.querySelectorAll('.product-slide');
let currentProductSlide = 0;

function changeProductSlide() {
  productSlides[currentProductSlide].classList.remove('active');
  currentProductSlide = (currentProductSlide + 1) % productSlides.length;
  productSlides[currentProductSlide].classList.add('active');
}

if (productSlides.length > 0) {
  setInterval(changeProductSlide, 3000);
}

// ===== TESTIMONIALS SLIDER =====
let testimonials = document.querySelectorAll('.testimonial');
let current = 0;

if (testimonials.length > 0) {
  testimonials[current].classList.add('active');
  setInterval(() => {
    testimonials[current].classList.remove('active');
    current = (current + 1) % testimonials.length;
    testimonials[current].classList.add('active');
  }, 4000);
}

// ===== CONTACT FORM SUBMIT =====
document.querySelectorAll('.contact-details form').forEach(form => {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Thank you for your enquiry! We will contact you soon.');
    form.reset();
  });
});

// ===== PRODUCTS ENQUIRY BUTTON =====
const productEnquiryBtn = document.querySelector('.products-enquiry-btn');
if (productEnquiryBtn) {
  productEnquiryBtn.addEventListener('click', function() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// ===== MOBILE MENU TOGGLE =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', function(e) {
    e.stopPropagation();
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
  
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
  
  document.addEventListener('click', function(event) {
    const isClickInsideNav = navMenu.contains(event.target);
    const isClickOnHamburger = hamburger.contains(event.target);
    
    if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

// ===== INDUSTRY CARDS TOUCH INTERACTIONS =====
const industryCards = document.querySelectorAll('.industry-card');

industryCards.forEach(card => {
  let touchTimer;
  
  card.addEventListener('click', function() {
    if (this.classList.contains('card-active')) {
      this.classList.remove('card-active');
    } else {
      industryCards.forEach(c => c.classList.remove('card-active'));
      this.classList.add('card-active');
    }
  });
  
  card.addEventListener('touchstart', function() {
    touchTimer = setTimeout(() => {
      this.classList.add('card-touching');
    }, 100);
  });
  
  card.addEventListener('touchend', function() {
    clearTimeout(touchTimer);
    setTimeout(() => {
      this.classList.remove('card-touching');
    }, 150);
  });
});

document.addEventListener('click', function(event) {
  const isCard = event.target.closest('.industry-card');
  if (!isCard) {
    industryCards.forEach(card => card.classList.remove('card-active'));
  }
});

// ===== SCROLL TO TOP BUTTON =====
const scrollToTopBtn = document.getElementById('scrollToTop');

// ===== SCROLL EVENT LISTENER (SINGLE - NO DUPLICATES) =====
window.addEventListener('scroll', function() {
  // Close menu on scroll
  if (hamburger && navMenu) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  }
  
  // Show/hide scroll to top button
  if (window.pageYOffset > 300) {
    if (scrollToTopBtn) scrollToTopBtn.classList.add('show');
  } else {
    if (scrollToTopBtn) scrollToTopBtn.classList.remove('show');
  }
});

// Scroll to top click handler
if (scrollToTopBtn) {
  scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===== SCROLL ANIMATION - ONLY ANIMATE WHEN SCROLLING INTO VIEW =====
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Target sections for animation - START HIDDEN
const sections = document.querySelectorAll('.hero, .categories, .products, .about, .why-work-with-us, .industries, .testimonials, .contact');

sections.forEach((section, index) => {
  section.style.opacity = '0';
  
  if (index % 2 === 0) {
    section.classList.add('animate-left');
  } else {
    section.classList.add('animate-right');
  }
  
  observer.observe(section);
});

// ===== ANIMATE CARDS ON SCROLL =====
const whyCards = document.querySelectorAll('.why-card');
whyCards.forEach((card, index) => {
  card.style.opacity = '0';
  card.classList.add('animate-scale');
  card.style.animationDelay = `${index * 0.15}s`;
  observer.observe(card);
});

const animateIndustryCards = document.querySelectorAll('.industry-card');
animateIndustryCards.forEach((card, index) => {
  card.style.opacity = '0';
  card.classList.add('animate-scale');
  card.style.animationDelay = `${index * 0.1}s`;
  observer.observe(card);
});

const catCards = document.querySelectorAll('.cat-card');
catCards.forEach((card, index) => {
  card.style.opacity = '0';
  card.classList.add('animate-up');
  card.style.animationDelay = `${index * 0.1}s`;
  observer.observe(card);
});
