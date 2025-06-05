// Enhanced signup handler with Beckn integration
let selectedRole = '';

// Role selection functionality (existing)
function selectRole(role) {
    selectedRole = role;
    
    const roleOptions = document.querySelectorAll('.role-option');
    roleOptions.forEach(option => {
        option.classList.remove('selected');
        if (option.dataset.role === role) {
            option.classList.add('selected');
        }
    });
    
    const roleSelect = document.getElementById('role');
    roleSelect.value = role;
    
    const title = document.getElementById('signupTitle');
    if (role === 'farmer') {
        title.textContent = '👨‍🌾 Join as Farmer';
        title.style.color = '#4CAF50';
    } else {
        title.textContent = '🏢 Join as Buyer';
        title.style.color = '#2196F3';
    }
}

// Enhanced form submission with Beckn integration
async function handleFormSubmission(formData) {
    try {
        // Show loading state
        showLoadingState('Connecting to Beckn network...');
        
        if (formData.role === 'farmer') {
            // For farmers, search for soil testing services via Beckn
            console.log('🌾 Farmer registration - searching Beckn network...');
            
            const becknResult = await becknService.searchSoilTestingServices(formData);
            
            if (becknResult.success) {
                showLoadingState('Found Beckn network! Searching for soil testing services...');
                // Results will be displayed by the polling mechanism
                return;
            } else if (becknResult.fallback) {
                // Beckn network unavailable, use fallback
                console.log('📱 Beckn network unavailable, using fallback registration');
                await simulateTraditionalRegistration(formData);
            } else {
                throw new Error(becknResult.error);
            }
            
        } else {
            // For buyers/labs, register as potential BPP
            console.log('🏢 Buyer registration - registering as potential BPP...');
            await handleBuyerRegistration(formData);
        }
        
    } catch (error) {
        console.error('❌ Registration error:', error);
        showErrorState('Registration failed. Please try again.');
    }
}

// Handle buyer registration (potential BPP)
async function handleBuyerRegistration(formData) {
    try {
        showLoadingState('Registering your lab with Beckn network...');
        
        // Simulate BPP registration process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const successHTML = `
            <div class="bpp-registration-success">
                <div class="success-icon">🏢</div>
                <h3>Lab Registration Initiated!</h3>
                <p>Welcome to the Beckn-powered Open Agri Network, ${formData.name}!</p>
                
                <div class="bpp-next-steps">
                    <h4>Next Steps for Your Lab:</h4>
                    <ul>
                        <li>📋 Complete BPP (Beckn Provider Platform) setup</li>
                        <li>🔐 Receive Beckn network credentials</li>
                        <li>🧪 List your soil testing services</li>
                        <li>📍 Set your service coverage areas</li>
                        <li>💰 Configure pricing and availability</li>
                    </ul>
                </div>
                                <div class="bpp-benefits">
                    <h4>Benefits of Joining Beckn Network:</h4>
                    <ul>
                        <li>🌐 Access to farmers across multiple platforms</li>
                        <li>📈 Increased service visibility and bookings</li>
                        <li>🔄 Standardized API integration</li>
                        <li>💳 Unified payment and fulfillment processes</li>
                    </ul>
                </div>
                
                <div class="contact-info">
                    <p><strong>Our team will contact you at:</strong></p>
                    <p>📞 ${formData.phone}</p>
                    <p>📍 ${formData.district}, ${formData.state}</p>
                </div>
                
                <button class="btn btn-primary" onclick="window.location.href='../index.html'">
                    Back to Homepage
                </button>
            </div>
        `;
        
        const container = document.querySelector('.signup-card');
        if (container) {
            container.innerHTML = successHTML;
        }
        
    } catch (error) {
        console.error('❌ BPP registration error:', error);
        showErrorState('Lab registration failed. Please try again.');
    }
}

// Traditional registration fallback
async function simulateTraditionalRegistration(formData) {
    showLoadingState('Processing your registration...');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const fallbackHTML = `
        <div class="traditional-registration-success">
            <div class="success-icon">✅</div>
            <h3>Registration Successful!</h3>
            <p>Thank you ${formData.name}! We've registered your interest in soil testing services.</p>
            
            <div class="registration-details">
                <h4>Your Registration Details:</h4>
                <ul>
                    <li><strong>Name:</strong> ${formData.name}</li>
                    <li><strong>Role:</strong> ${formData.role}</li>
                    <li><strong>Phone:</strong> ${formData.phone}</li>
                    <li><strong>Location:</strong> ${formData.district}, ${formData.state}</li>
                </ul>
            </div>
            
            <div class="next-steps">
                <h4>What happens next?</h4>
                <ul>
                    <li>📞 We'll contact you within 24-48 hours</li>
                    <li>🌐 We'll notify you when Beckn services are available in your area</li>
                    <li>🧪 Connect you with certified soil testing labs</li>
                    <li>📊 Help you get detailed soil analysis reports</li>
                </ul>
            </div>
            
            <button class="btn btn-primary" onclick="window.location.href='../index.html'">
                Back to Homepage
            </button>
        </div>
    `;
    
    const container = document.querySelector('.signup-card');
    if (container) {
        container.innerHTML = fallbackHTML;
    }
}

// UI Helper Functions
function showLoadingState(message) {
    const loadingHTML = `
        <div class="loading-state">
            <div class="loading-spinner">🔄</div>
            <h3>Processing...</h3>
            <p>${message}</p>
            <div class="loading-progress">
                <div class="progress-bar"></div>
            </div>
        </div>
    `;
    
    const container = document.querySelector('.signup-card');
    if (container) {
        const existingForm = container.querySelector('form');
        if (existingForm) {
            existingForm.style.display = 'none';
        }
        
        let loadingDiv = container.querySelector('.loading-state');
        if (!loadingDiv) {
            loadingDiv = document.createElement('div');
            container.appendChild(loadingDiv);
        }
        loadingDiv.innerHTML = loadingHTML;
    }
}

function showErrorState(message) {
    const errorHTML = `
        <div class="error-state">
            <div class="error-icon">❌</div>
            <h3>Registration Failed</h3>
            <p>${message}</p>
            <button class="btn btn-retry" onclick="location.reload()">
                Try Again
            </button>
            <button class="btn btn-secondary" onclick="window.location.href='../index.html'">
                Back to Homepage
            </button>
        </div>
    `;
    
    const container = document.querySelector('.signup-card');
    if (container) {
        container.innerHTML = errorHTML;
    }
}

// Enhanced form validation (existing functions remain the same)
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
    
    clearErrorMessages();
    
    let isValid = true;
    
    if (name.length < 2) {
        showFieldError('name', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    if (!role) {
        showFieldError('role', 'Please select your role');
        isValid = false;
    }
    
    if (!validatePhone(phone)) {
        showFieldError('phone', 'Please enter a valid 10-digit phone number');
        isValid = false;
    }
    
    if (district.length < 2) {
        showFieldError('district', 'District must be at least 2 characters long');
        isValid = false;
    }
    
    if (state.length < 2) {
        showFieldError('state', 'State must be at least 2 characters long');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.classList.add('error');
    field.parentNode.appendChild(errorDiv);
}

function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.field-error');
    errorMessages.forEach(error => error.remove());
    
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => field.classList.remove('error'));
}

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                return;
            }
            
            const formData = {
                name: document.getElementById('name').value.trim(),
                role: document.getElementById('role').value,
                phone: document.getElementById('phone').value.trim(),
                district: document.getElementById('district').value.trim(),
                state: document.getElementById('state').value.trim()
            };
            
            console.log('🚀 Starting Beckn-enabled registration:', formData);
            
            await handleFormSubmission(formData);
        });
    }
    
    // Auto-select role from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    if (roleParam) {
        selectRole(roleParam);
    }
});
