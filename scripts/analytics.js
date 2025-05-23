/**
 * analytics.js
 * Handles visitor count display and analytics integration
 * Requires Google Analytics 4 to be set up
 */

/**
 * analytics.js
 * Handles visitor tracking using Counter API
 * Privacy-friendly and lightweight solution for static websites
 * 
 * @author John Vincent Augusto
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', () => {
    const COUNTER_ENDPOINT = 'https://api.countapi.xyz';
    const NAMESPACE = 'gauciv-portfolio';
    const KEY = 'visitors';

    // Update visitor count
    async function updateVisitorCount() {
        try {
            // Increment the counter and get the new value
            const response = await fetch(`${COUNTER_ENDPOINT}/hit/${NAMESPACE}/${KEY}`);
            const data = await response.json();
            
            // Update the counter display if it exists
            const counterElement = document.querySelector('.visitor-counter');
            if (counterElement && data.value) {
                counterElement.textContent = `${data.value.toLocaleString()} visits`;
            }
        } catch (error) {
            console.error('Failed to update visitor count:', error);
        }
    }

    // Initialize visitor counter
    updateVisitorCount();
    // Function to format numbers with commas
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // Function to update visitor count
    async function updateVisitorCount() {
        try {
            // Get the visitor count element
            const visitorCountElement = document.querySelector('.visitor-count');
            if (!visitorCountElement) return;

            // Get data from Google Analytics
            // Note: This requires setting up GA4 API access
            // For now, we'll just show real-time active users
            if (typeof gtag === 'function') {
                gtag('get', 'YOUR-GA4-ID', 'client_id', (clientId) => {
                    if (clientId) {
                        visitorCountElement.textContent = 'Online now';
                        visitorCountElement.classList.add('active');
                    }
                });
            }
        } catch (error) {
            console.error('Error updating visitor count:', error);
        }
    }

    // Update count every minute
    updateVisitorCount();
    setInterval(updateVisitorCount, 60000);
});
