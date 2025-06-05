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
    
    // Styling for messages
    messageDiv.style.padding = '15px';
    messageDiv.style.borderRadius = '8px';
    messageDiv.style.marginBottom = '20px';
    messageDiv.style.fontWeight = '500';
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    }
    
    // Insert at top of form
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// DUMMY FORM SUBMISSION - Mock API call
function submitFormDummy(formData) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Simulate random success/failure for demo
            const success = Math.random() > 0.1; // 90% success rate
            
            if (success) {
                // Log form data to console (for demo purposes)
                console.log('🌾 DUMMY FORM SUBMISSION - Data received:');
                console.log('Name:', formData.get('name'));
                console.log('Role:', formData.get('role'));
                console.log('Phone:', formData.get('phone'));
                console.log('District:', formData.get('district'));
                console.log('State:', formData.get('state'));
                console.log('Registration Date:', formData.get('registration_date'));
                console.log('Source:', formData.get('source'));
                console.log('Selected Role:', formData.get('selected_role'));
                
                resolve({ success: true, message: 'Registration successful!' });
            } else {
                reject(new Error('Simulated network error'));
            }
        }, 1500 + Math.random() * 1000); // 1.5-2.5 seconds delay
    });
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
        
        // DUMMY SUBMISSION - Replace with real API call later
        submitFormDummy(formData)
            .then(response => {
                console.log('✅ Registration successful!');
                
                // Clear saved form data
                const formFields = ['name', 'phone', 'district', 'state'];
                formFields.forEach(fieldId => {
                    localStorage.removeItem(`agri_form_${fieldId}`);
                });
                
                // Get user data for thank you page
                const name = document.getElementById('name').value;
                const role = document.getElementById('role').value;
                
                // Redirect to thank you page with parameters
                window.location.href = `thankyou.html?name=${encodeURIComponent(name)}&role=${role}`;
            })
            .catch(error => {
                console.error('❌ Registration failed:', error);
                
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
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove non-numeric characters
            let value = e.target.value.replace(/\D/g, '');
            
            // Limit to 10 digits
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            
            e.target.value = value;
        });
    }
});

// Auto-capitalize name and location fields
document.addEventListener('DOMContentLoaded', function() {
    const textFields = ['name', 'district', 'state'];
    
    textFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        
        if (field) {
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
        }
    });
});

// Form data persistence
document.addEventListener('DOMContentLoaded', function() {
    const formFields = ['name', 'phone', 'district', 'state'];
    
    // Load saved data
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            const savedValue = localStorage.getItem(`agri_form_${fieldId}`);
            
            if (savedValue && !field.value) {
                field.value = savedValue;
            }
            
            // Save on input
            field.addEventListener('input', function() {
                localStorage.setItem(`agri_form_${fieldId}`, this.value);
            });
        }
    });
});

// Initialize page with URL parameters
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌾 Signup page loaded - DEMO MODE');
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    
    // Pre-select role if provided
    if (roleParam && (roleParam === 'farmer' || roleParam === 'buyer')) {
        selectRole(roleParam);
        
        // Focus on name field
        setTimeout(() => {
            const nameField = document.getElementById('name');
            if (nameField) {
                nameField.focus();
            }
        }, 500);
    }
    
    // Track page visit (dummy analytics)
    console.log('📊 Page visit tracked:', {
        page_title: 'Signup Page',
        page_location: window.location.href,
        role_preselected: roleParam || 'none',
        timestamp: new Date().toISOString()
    });
});

// Utility function for URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}
