// js/include.js
function includeHTML() {
    const elements = document.querySelectorAll('[data-include]');
    
    elements.forEach(element => {
        const file = element.getAttribute('data-include');
        if (file) {
            fetch(file)
                .then(response => {
                    if (response.ok) return response.text();
                    throw new Error('Page not found');
                })
                .then(data => {
                    element.innerHTML = data;
                    element.removeAttribute('data-include');
                    includeHTML(); // Re-run for nested includes
                })
                .catch(err => console.error('Error loading:', file, err));
        }
    });
}

document.addEventListener('DOMContentLoaded', includeHTML);
