// Lightbox Functions
function openLightbox(imageSrc, caption) {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    lightboxImage.src = imageSrc;
    lightboxCaption.textContent = caption;
    lightbox.style.display = 'flex';
    
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('imageLightbox');
    lightbox.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Close lightbox when clicking outside the image
document.getElementById('imageLightbox')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeLightbox();
    }
});

// Close lightbox with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});
