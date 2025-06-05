// Real-time status tracking for Beckn transactions
class BecknStatusTracker {
    constructor() {
        this.activeTransactions = new Map();
        this.statusUpdateInterval = null;
        this.networkStatus = 'disconnected';
        this.initializeStatusIndicator();
    }

    // Initialize network status indicator
    initializeStatusIndicator() {
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'network-status disconnected';
        statusIndicator.id = 'beckn-network-status';
        statusIndicator.textContent = '🔴 Beckn Network';
        document.body.appendChild(statusIndicator);
        
        this.updateNetworkStatus();
    }

    // Update network connectivity status
    async updateNetworkStatus() {
        try {
            const response = await fetch('http://localhost:3001/health');
            if (response.ok) {
                this.setNetworkStatus('connected');
            } else {
                this.setNetworkStatus('disconnected');
            }
        } catch (error) {
            this.setNetworkStatus('disconnected');
        }
        
        // Check every 30 seconds
        setTimeout(() => this.updateNetworkStatus(), 30000);
    }

    // Set network status
    setNetworkStatus(status) {
        this.networkStatus = status;
        const indicator = document.getElementById('beckn-network-status');
        if (indicator) {
            indicator.className = `network-status ${status}`;
            switch (status) {
                case 'connected':
                    indicator.textContent = '🟢 Beckn Connected';
                    break;
                case 'connecting':
                    indicator.textContent = '🟡 Connecting...';
                    break;
                case 'disconnected':
                    indicator.textContent = '🔴 Beckn Offline';
                    break;
            }
        }
    }

    // Track a new transaction
    trackTransaction(transactionId, type = 'search') {
        const transaction = {
            id: transactionId,
            type: type,
            status: 'initiated',
            timestamp: new Date().toISOString(),
            updates: []
        };
        
        this.activeTransactions.set(transactionId, transaction);
        this.addStatusUpdate(transactionId, `${type} initiated`, 'info');
        
        // Start polling for this transaction
        this.startPolling(transactionId);
        
        return transaction;
    }

    // Add status update
    addStatusUpdate(transactionId, message, type = 'info') {
        const transaction = this.activeTransactions.get(transactionId);
        if (transaction) {
            const update = {
                message: message,
                type: type,
                timestamp: new Date().toISOString()
            };
            
            transaction.updates.push(update);
            this.displayStatusUpdate(update);
            
            console.log(`📊 Transaction ${transactionId}: ${message}`);
        }
    }

    // Display status update in UI
    displayStatusUpdate(update) {
        const statusContainer = document.getElementById('status-updates') || this.createStatusContainer();
        
        const updateElement = document.createElement('div');
        updateElement.className = `status-update ${update.type}`;
        updateElement.innerHTML = `
            <div class="update-content">
                <span class="update-message">${update.message}</span>
                <span class="update-time">${new Date(update.timestamp).toLocaleTimeString()}</span>
            </div>
        `;
        
        statusContainer.insertBefore(updateElement, statusContainer.firstChild);
        
        // Remove old updates (keep only last 5)
        const updates = statusContainer.querySelectorAll('.status-update');
        if (updates.length > 5) {
            updates[updates.length - 1].remove();
        }
    }

    // Create status container
    createStatusContainer() {
        const container = document.createElement('div');
        container.id = 'status-updates';
        container.className = 'status-updates-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 300px;
            max-height: 400px;
            overflow-y: auto;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(container);
        return container;
    }

    // Start polling for transaction updates
    startPolling(transactionId) {
        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/beckn/status/${transactionId}`);
                if (response.ok) {
                    const data = await response.json();
                    this.handleStatusResponse(transactionId, data);
                }
            } catch (error) {
                console.error('Polling error:', error);
                this.addStatusUpdate(transactionId, 'Connection error', 'error');
            }
        }, 3000);

        // Stop polling after 5 minutes
        setTimeout(() => {
            clearInterval(pollInterval);
            this.addStatusUpdate(transactionId, 'Polling stopped', 'info');
        }, 300000);
    }

    // Handle status response
    handleStatusResponse(transactionId, data) {
        const transaction = this.activeTransactions.get(transactionId);
        if (!transaction) return;

        if (data.status !== transaction.status) {
            transaction.status = data.status;
            this.addStatusUpdate(transactionId,
            this.addStatusUpdate(transactionId, 
                `Status updated: ${data.status}`, 
                data.status === 'completed' ? 'success' : 'info'
            ));
        }

        // Handle specific status updates
        switch (data.status) {
            case 'providers_found':
                this.addStatusUpdate(transactionId, 
                    `Found ${data.provider_count || 0} service providers`, 
                    'success'
                );
                break;
            case 'selection_confirmed':
                this.addStatusUpdate(transactionId, 
                    'Service provider selected successfully', 
                    'success'
                );
                break;
            case 'order_confirmed':
                this.addStatusUpdate(transactionId, 
                    `Order confirmed - ID: ${data.order_id}`, 
                    'success'
                );
                break;
            case 'fulfillment_started':
                this.addStatusUpdate(transactionId, 
                    'Sample collection initiated', 
                    'info'
                );
                break;
            case 'completed':
                this.addStatusUpdate(transactionId, 
                    'Service completed successfully', 
                    'success'
                );
                break;
            case 'error':
                this.addStatusUpdate(transactionId, 
                    `Error: ${data.error_message}`, 
                    'error'
                );
                break;
        }
    }

    // Get transaction status
    getTransactionStatus(transactionId) {
        return this.activeTransactions.get(transactionId);
    }

    // Clear completed transactions
    clearCompletedTransactions() {
        for (const [id, transaction] of this.activeTransactions) {
            if (transaction.status === 'completed' || transaction.status === 'error') {
                this.activeTransactions.delete(id);
            }
        }
    }
}

// Initialize global status tracker
const becknStatusTracker = new BecknStatusTracker();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BecknStatusTracker;
}
