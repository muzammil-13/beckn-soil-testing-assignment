// Global variables
let selectedRole = '';

// Role selection functionality
function selectRole(role) {
    selectedRole = role;
    
    // Update visual selection
    const roleOptions = document.querySelectorAll('.role-option');
    roleOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.role === role) {
            option.classList.add('selected');
        }
    });
    
    // Update form select
    const roleSelect = document.getElementById('role');
    roleSelect.value = role;
    
    // Update title based on selection
    const title = document.getElementById('signupTitle');
    if (role === 'farmer') {
        title.textContent = '👨‍🌾 Join as Farmer';
        title.style.color = '#4CAF50';
    } else {
        title.textContent = '🏢 Join as Buyer';
        title.style.color = '#2196F3';
    }
}

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
        formData.append('source', 'Open Agri Network Signup Page');
        formData.append('selected_role', selectedRole);
        
        // Submit to FormSubmit.co
        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // Success - redirect to thank you page with parameters
                const name = document.getElementById('name').value;
                const role = document.getElementById('role').value;
                window.location.href = `thankyou.html?name=${encodeURIComponent(name)}&role=${role}`;
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

// Form data persistence
document.addEventListener('DOMContentLoaded', function() {
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
    document.getElementById('signupForm').addEventListener('submit', function() {
        formFields.forEach(fieldId => {
            localStorage.removeItem(`agri_form_${fieldId}`);
        });
    });
});


// Initialize page with URL parameters
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌾 Signup page loaded');
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    
    // Pre-select role if provided
    if (roleParam && (roleParam === 'farmer' || roleParam === 'buyer')) {
        selectRole(roleParam);
        
        // Focus on name field
        setTimeout(() => {
            document.getElementById('name').focus();
        }, 500);
    }
    
    // Track page visit
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: 'Signup Page',
            page_location: window.location.href,
            role_preselected: roleParam || 'none'
        });
    }
});

// Utility function for URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
