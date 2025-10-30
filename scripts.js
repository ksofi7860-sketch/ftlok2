// HERO SLIDESHOW
const heroImages = [
  "https://cdn.pixabay.com/photo/2015/10/13/15/22/valve-986317_1280.jpg",
  "https://cdn.pixabay.com/photo/2023/10/24/18/51/steam-8338896_1280.jpg",
  "https://cdn.pixabay.com/photo/2013/02/12/22/07/flute-80881_1280.jpg",
  "https://cdn.pixabay.com/photo/2020/06/14/17/53/valve-5298757_1280.jpg",
  "https://cdn.pixabay.com/photo/2020/02/28/15/38/nature-4887751_1280.jpg"
];
// Product slideshow
const productSlides = document.querySelectorAll('.product-slide');
let currentProductSlide = 0;

function changeProductSlide() {
    productSlides[currentProductSlide].classList.remove('active');
    currentProductSlide = (currentProductSlide + 1) % productSlides.length;
    productSlides[currentProductSlide].classList.add('active');
}

// Change product every 3 seconds
if (productSlides.length > 0) {
    setInterval(changeProductSlide, 3000);
}

// Products enquiry button
const productEnquiryBtn = document.querySelector('.products-enquiry-btn');
if (productEnquiryBtn) {
    productEnquiryBtn.addEventListener('click', function() {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });
}

let heroIdx = 0;
const hero = document.getElementById('hero-section');
function setHeroBackground(idx) {
  hero.style.backgroundImage = `url('${heroImages[idx]}')`;
}
setHeroBackground(heroIdx);
setInterval(() => {
  heroIdx = (heroIdx + 1) % heroImages.length;
  setHeroBackground(heroIdx);
}, 4000);

// Testimonials slider (as before)
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

// Contact form submit (as before)
document.querySelectorAll('.contact-details form').forEach(form => {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Thank you for your enquiry! We will contact you soon.');
        form.reset();
    });
});
// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}
// Mobile touch interactions for industry cards
const industryCards = document.querySelectorAll('.industry-card');

industryCards.forEach(card => {
    let touchTimer;
    
    // Add click/tap handler
    card.addEventListener('click', function() {
        // Toggle active class
        if (this.classList.contains('card-active')) {
            this.classList.remove('card-active');
        } else {
            // Remove active from all cards
            industryCards.forEach(c => c.classList.remove('card-active'));
            // Add active to clicked card
            this.classList.add('card-active');
        }
    });
    
    // Touch start
    card.addEventListener('touchstart', function() {
        touchTimer = setTimeout(() => {
            this.classList.add('card-touching');
        }, 100);
    });
    
    // Touch end
    card.addEventListener('touchend', function() {
        clearTimeout(touchTimer);
        setTimeout(() => {
            this.classList.remove('card-touching');
        }, 150);
    });
});

// Close active card when clicking outside
document.addEventListener('click', function(event) {
    const isCard = event.target.closest('.industry-card');
    if (!isCard) {
        industryCards.forEach(card => card.classList.remove('card-active'));
    }
});
// WhatsApp button scroll behavior
// WhatsApp button - NO HIDE ON SCROLL
const whatsappBtn = document.querySelector('.whatsapp-float');

if (whatsappBtn) {
    // Simple click tracking for analytics (optional)
    whatsappBtn.addEventListener('click', function() {
        console.log('WhatsApp button clicked');
    });
}
