// Beckn Integration for Frontend
class BecknService {
    constructor() {
        this.baseURL = 'http://localhost:3001/api/beckn';
        this.currentTransaction = null;
    }

    // Search for soil testing services
    async searchSoilTestingServices(formData) {
        try {
            const searchRequest = {
                location: {
                    gps: await this.getLocationCoordinates(formData.district, formData.state),
                    district: formData.district,
                    state: formData.state,
                    city: formData.district,
                    pincode: "000000" // Default, can be enhanced
                },
                testType: "Basic Soil Testing",
                farmerDetails: {
                    name: formData.name,
                    phone: formData.phone,
                    role: formData.role
                }
            };

            console.log('🔍 Searching Beckn network for soil testing services...');
            console.log('Search Request:', searchRequest);

            const response = await fetch(`${this.baseURL}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(searchRequest)
            });

            const result = await response.json();
            
            if (result.success) {
                this.currentTransaction = result.transaction_id;
                console.log('✅ Beckn search initiated:', result.transaction_id);
                
                // Poll for results
                setTimeout(() => this.pollSearchResults(result.transaction_id), 2000);
                
                return {
                    success: true,
                    transaction_id: result.transaction_id,
                    message: "Searching for soil testing services in your area..."
                };
            } else {
                throw new Error(result.error || 'Search failed');
            }

        } catch (error) {
            console.error('❌ Beckn search error:', error);
            return {
                success: false,
                error: error.message,
                fallback: true
            };
        }
    }

    // Poll for search results
    async pollSearchResults(transactionId, maxAttempts = 5) {
        let attempts = 0;
        
        const poll = async () => {
            try {
                attempts++;
                console.log(`🔄 Polling for results (attempt ${attempts}/${maxAttempts})...`);
                
                const response = await fetch(`${this.baseURL}/search-results/${transactionId}`);
                const result = await response.json();
                
                if (result.success && result.providers && result.providers.length > 0) {
                    console.log('🎉 Found soil testing providers:', result.providers);
                    this.displaySearchResults(result.providers);
                    return;
                }
                
                if (attempts < maxAttempts) {
                    setTimeout(poll, 3000); // Poll every 3 seconds
                } else {
                    console.log('⏰ Polling timeout - no providers found');
                    this.showFallbackMessage();
                }
                
            } catch (error) {
                console.error('❌ Polling error:', error);
                if (attempts < maxAttempts) {
                    setTimeout(poll, 3000);
                } else {
                    this.showFallbackMessage();
                }
            }
        };
        
        poll();
    }

    // Display search results to user
    displaySearchResults(providers) {
        const resultsHTML = `
            <div class="beckn-results">
                <h3>🧪 Available Soil Testing Services</h3>
                <div class="providers-list">
                    ${providers.map(provider => `
                        <div class="provider-card" data-provider-id="${provider.id}">
                            <h4>${provider.descriptor.name}</h4>
                            <p>${provider.descriptor.short_desc}</p>
                            <div class="services">
                                ${provider.items.map(item => `
                                    <div class="service-item">
                                        <span class="service-name">${item.descriptor.name}</span>
                                        <span class="service-price">₹${item.price.value}</span>
                                    </div>
                                `).join('')}
                            </div>
                            <button class="btn btn-select" onclick="becknService.selectProvider('${provider.id}')">
                                Select This Lab
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Insert results into page
        const container = document.querySelector('.signup-card') || document.body;
        const resultsDiv = document.createElement('div');
        resultsDiv.innerHTML = resultsHTML;
        container.appendChild(resultsDiv);
    }

    // Select a provider
    async selectProvider(providerId) {
        try {
            console.log('🎯 Selecting provider:', providerId);
            
            // In a real implementation, you'd collect more details
            // For now, we'll show a success message
            this.showSelectionSuccess(providerId);
            
        } catch (error) {
            console.error('❌ Provider selection error:', error);
        }
    }

    // Show selection success
    showSelectionSuccess(providerId) {
        const successHTML = `
            <div class="beckn-success">
                <div class="success-icon">✅</div>
                <h3>Service Selected!</h3>
                <p>You've selected a soil testing provider through the Beckn network.</p>
                <p><strong>Transaction ID:</strong> ${this.currentTransaction}</p>
                <p><strong>Provider ID:</strong> ${providerId}</p>
                <div class="next-steps">
                    <h4>What happens next?</h4>
                    <ul>
                        <li>📞 The lab will contact you within 24 hours</li>
                        <li>📅 Schedule sample pickup from your farm</li>
                        <li>🧪 Receive detailed soil analysis report</li>
                        <li>🌾 Get personalized crop recommendations</li>
                    </ul>
                </div>
                <button class="btn btn-primary" onclick="window.location.href='../index.html'">
                    Back to Homepage
                </button>
            </div>
        `;
        
        // Replace current content
        const container = document.querySelector('.signup-card');
        if (container) {
            container.innerHTML = successHTML;
        }
    }

    // Fallback when Beckn network is unavailable
    showFallbackMessage() {
        const fallbackHTML = `
            <div class="beckn-fallback">
                <div class="info-icon">ℹ️</div>
                <h3>Registration Successful!</h3>
                <p>We've registered your interest in soil testing services.</p>
                <p>The Beckn network is currently expanding in your area.</p>
                <div class="fallback-info">
                    <h4>We'll contact you when:</h4>
                    <ul>
                        <li>🌐 Beckn-enabled labs are available in your district</li>
                        <li>📱 New soil testing services join the network</li>
                        <li>🎯 Special offers become available</li>
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

    // Get coordinates for location (mock implementation)
    async getLocationCoordinates(district, state) {
        // In production, use a geocoding service
        const mockCoordinates = {
            'bangalore': '12.9716,77.5946',
            'mumbai': '19.0760,72.8777',
            'delhi': '28.7041,77.1025',
            'pune': '18.5204,73.8567',
            'hyderabad': '17.3850,78.4867'
        };
        
        const key = district.toLowerCase();
        return mockCoordinates[key] || '12.9716,77.5946'; // Default to Bangalore
    }
}

// Initialize Beckn service
const becknService = new BecknService();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BecknService;
}
