// Enquiry Popup Functions
function showEnquiryPopup() {
    const popup = document.getElementById('enquiryPopup');
    if (!popup) return;
    popup.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

function closeEnquiryPopup() {
    const popup = document.getElementById('enquiryPopup');
    if (!popup) return;
    popup.classList.remove('active');
    document.body.style.overflow = 'auto'; // Restore scroll
}

// Auto-show popup after 3 seconds (only once per session)
window.addEventListener('load', function() {
    // Show popup after 5 seconds of page load
    setTimeout(function() {
        showEnquiryPopup();
    }, 5000); // 5 seconds

    // Show popup again after 60 seconds if user is still on page
    setTimeout(function() {
        showEnquiryPopup();
    }, 60000); // 60 seconds
});


// Close popup when clicking outside the container
document.addEventListener('click', function(e) {
    const popupOverlay = document.getElementById('enquiryPopup');
    const popupContainer = popupOverlay ? popupOverlay.querySelector('.enquiry-popup-container') : null;
    if (!popupOverlay || !popupContainer) return;

    if (e.target === popupOverlay) {
        closeEnquiryPopup();
    }
});

// Close popup with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeEnquiryPopup();
    }
});

// Handle Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('enquiryPopupForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(form);

        // TODO: Replace with your backend URL or FormSpree endpoint
        fetch('https://yourdomain.com/php/send-enquiry.php', {
    method: 'POST',
    body: new FormData(form)
})
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Thank you! Your enquiry has been submitted successfully.');
                closeEnquiryPopup();
                form.reset();
            } else {
                alert('Error: ' + (data.message || 'Unable to send enquiry.'));
            }
        })
        .catch(() => {
            alert('Network error. Please try again.');
        });
    });
});
