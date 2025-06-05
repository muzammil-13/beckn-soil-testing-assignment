// Main homepage functionality

// Smooth scrolling for internal links
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

// Analytics tracking for CTA clicks
document.addEventListener('DOMContentLoaded', function() {
    const farmerBtn = document.querySelector('.btn-farmer');
    const buyerBtn = document.querySelector('.btn-buyer');
    
    if (farmerBtn) {
        farmerBtn.addEventListener('click', () => {
            trackEvent('cta_click', { role: 'farmer', page: 'homepage' });
        });
    }
    
    if (buyerBtn) {
        buyerBtn.addEventListener('click', () => {
            trackEvent('cta_click', { role: 'buyer', page: 'homepage' });
        });
    }
});

// Analytics tracking function
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
    
    // Google Analytics integration (if available)
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Facebook Pixel integration (if available)
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, properties);
    }
}

// Animate stats on scroll
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                
                // Extract number from text (e.g., "500+" -> 500)
                const numMatch = finalValue.match(/\d+/);
                if (numMatch) {
                    const finalNum = parseInt(numMatch[0]);
                    animateNumber(target, 0, finalNum, finalValue);
                }
                
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Animate number counting
function animateNumber(element, start, end, originalText) {
    const duration = 2000; // 2 seconds
    const increment = end / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = originalText;
            clearInterval(timer);
        } else {
            const suffix = originalText.replace(/\d+/, '');
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add entrance animations
    const heroSection = document.querySelector('.hero-section');
    const ctaSection = document.querySelector('.cta-section');
    const features = document.querySelector('.features');
    
    // Stagger animations
    setTimeout(() => {
        if (heroSection) heroSection.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        if (ctaSection) ctaSection.style.opacity = '1';
    }, 300);
    
    setTimeout(() => {
        if (features) features.style.opacity = '1';
    }, 500);
    
    // Initialize stats animation
    animateStats();
});

// Page load performance tracking
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`🌾 Open Agri Network loaded in ${Math.round(loadTime)}ms`);
    
    // Track page load time
    trackEvent('page_load', {
        load_time: Math.round(loadTime),
        page: 'homepage'
    });
});

// Handle URL parameters for role pre-selection
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Check for role parameter and highlight appropriate button
document.addEventListener('DOMContentLoaded', function() {
    const roleParam = getUrlParameter('role');
    if (roleParam) {
        const targetBtn = document.querySelector(`.btn-${roleParam}`);
        if (targetBtn) {
            targetBtn.style.transform = 'scale(1.05)';
            targetBtn.style.boxShadow = '0 10px 30px rgba(76, 175, 80, 0.3)';
            
            // Scroll to CTA section
            setTimeout(() => {
                document.querySelector('.cta-section').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 500);
        }
    }
});
