// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
            
            // Hide previous status
            formStatus.style.display = 'none';
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Send AJAX request
            fetch('php/send-email.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Show status message
                formStatus.style.display = 'block';
                
                if (data.success) {
                    // Success
                    formStatus.className = 'alert alert-success';
                    formStatus.innerHTML = '<i class="fas fa-check-circle me-2"></i>' + data.message;
                    
                    // Reset form
                    contactForm.reset();
                } else {
                    // Error
                    formStatus.className = 'alert alert-danger';
                    formStatus.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>' + data.message;
                }
                
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
                
                // Scroll to status message
                formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            })
            .catch(error => {
                // Network error
                formStatus.style.display = 'block';
                formStatus.className = 'alert alert-danger';
                formStatus.innerHTML = '<i class="fas fa-exclamation-circle me-2"></i>Network error. Please check your connection and try again.';
                
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
                
                console.error('Error:', error);
            });
        });
    }
});
