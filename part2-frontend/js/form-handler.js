// Global variables
let currentRole = '';

// Show signup form modal
function showSignupForm(role) {
    currentRole = role;
    const modal = document.getElementById('signupModal');
    const roleSelect = document.getElementById('role');
    
    // Pre-select the role based on button clicked
    roleSelect.value = role;
    
    // Update modal title based on role
    const modalTitle = document.querySelector('.modal-content h2');
    if (role === 'farmer') {
        modalTitle.textContent = '👨‍🌾 Join as Farmer';
        modalTitle.style.color = '#4CAF50';
    } else {
        modalTitle.textContent = '🏢 Join as Buyer';
        modalTitle.style.color = '#2196F3';
    }
    
    // Show modal
    modal.style.display = 'block';
    
    // Focus on first input
    setTimeout(() => {
        document.getElementById('name').focus();
    }, 300);
}

// Close signup form modal
function closeSignupForm() {
    const modal = document.getElementById('signupModal');
    modal.style.display = 'none';
    
    // Reset form
    document.getElementById('signupForm').reset();
    currentRole = '';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('signupModal');
    if (event.target === modal) {
        closeSignupForm();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeSignupForm();
    }
});

// Form validation functions
function validatePhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
}

function validateForm() {
    const name = document.getElementById('name').value.trim();
    const role = document.getElementById('role').value;
    const phone = document.getElementById('phone').value.trim();
    const district = document.getElementById('district').value.trim();
    const state = document.getElementById('state').value.trim();
    
    // Clear previous error messages
    clearErrorMessages();
    
    let isValid = true;
    
    // Validate name
    if (name.length < 2) {
        showFieldError('name', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate role
    if (!role) {
        showFieldError('role', 'Please select your role');
        isValid = false;
    }
    
    // Validate phone
    if (!validatePhone(phone)) {
        showFieldError('phone', 'Please enter a valid 10-digit phone number');
        isValid = false;
    }
    
    // Validate district
    if (district.length < 2) {
        showFieldError('district', 'Please enter a valid district name');
        isValid = false;
    }
    
    // Validate state
    if (state.length < 2) {
        showFieldError('state', 'Please enter a valid state name');
        isValid = false;
    }
    
    return isValid;
}

// Show field-specific error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.parentElement;
    
    // Add error class to field
    field.classList.add('error');
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#f44336';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '5px';
    
    // Append error message
    formGroup.appendChild(errorDiv);
}

// Clear all error messages
function clearErrorMessages() {
    // Remove error classes
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
    
    // Remove error messages
    const errorMessages = document.querySelectorAll('.field-error');
    errorMessages.forEach(msg => msg.remove());
    
    // Remove general error/success messages
    const generalMessages = document.querySelectorAll('.form-error, .form-success');
    generalMessages.forEach(msg => msg.remove());
}

// Show general message (success or error)
function showMessage(message, type = 'success') {
    const form = document.getElementById('signupForm');
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'form-success' : 'form-error';
    messageDiv.textContent = message;
    
    // Insert at top of form
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Registering...';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        // Prepare form data
        const formData = new FormData(form);
        
        // Add timestamp and additional data
        formData.append('registration_date', new Date().toISOString());
        formData.append('source', 'Open Agri Network Website');
        formData.append('selected_role', currentRole);
        
        // Submit to FormSubmit.co (or your preferred service)
        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // Success - redirect to thank you page
                window.location.href = 'thankyou.html';
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            
            // Show error message
            showMessage('Registration failed. Please try again.', 'error');
        });
    });
});

// Auto-format phone number input
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    
    phoneInput.addEventListener('input', function(e) {
        // Remove non-numeric characters
        let value = e.target.value.replace(/\D/g, '');
        
        // Limit to 10 digits
        if (value.length > 10) {
            value = value.slice(0, 10);
        }
        
        e.target.value = value;
    });
});

// Auto-capitalize name and location fields
document.addEventListener('DOMContentLoaded', function() {
    const textFields = ['name', 'district', 'state'];
    
    textFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        
        field.addEventListener('input', function(e) {
            // Capitalize first letter of each word
            const words = e.target.value.split(' ');
            const capitalizedWords = words.map(word => {
                if (word.length > 0) {
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                }
                return word;
            });
            e.target.value = capitalizedWords.join(' ');
        });
    });
});

// Analytics tracking (optional)
function trackEvent(eventName, properties = {}) {
    // Add your analytics tracking here (Google Analytics, etc.)
    console.log('Event tracked:', eventName, properties);
    
    // Example for Google Analytics (if implemented)
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
}

// Track button clicks
document.addEventListener('DOMContentLoaded', function() {
    const farmerBtn = document.querySelector('.btn-farmer');
    const buyerBtn = document.querySelector('.btn-buyer');
    
    if (farmerBtn) {
        farmerBtn.addEventListener('click', () => {
            trackEvent('cta_click', { role: 'farmer' });
        });
    }
    
    if (buyerBtn) {
        buyerBtn.addEventListener('click', () => {
            trackEvent('cta_click', { role: 'buyer' });
        });
    }
});

// Smooth scrolling for any internal links (future use)
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Form data persistence (save to localStorage on input)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const formFields = ['name', 'phone', 'district', 'state'];
    
    // Load saved data
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const savedValue = localStorage.getItem(`agri_form_${fieldId}`);
        
        if (savedValue && !field.value) {
            field.value = savedValue;
        }
        
        // Save on input
        field.addEventListener('input', function() {
            localStorage.setItem(`agri_form_${fieldId}`, this.value);
        });
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        formFields.forEach(fieldId => {
            localStorage.removeItem(`agri_form_${fieldId}`);
        });
    });
});

// Utility function to get URL parameters (for future use)
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌾 Open Agri Network - Page Loaded');
    
    // Check if there's a role parameter in URL
    const roleParam = getUrlParameter('role');
    if (roleParam && (roleParam === 'farmer' || roleParam === 'buyer')) {
        setTimeout(() => {
            showSignupForm(roleParam);
        }, 1000);
    }
});
