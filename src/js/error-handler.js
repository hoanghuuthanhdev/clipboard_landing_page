/**
 * Error Handling and Loading States Manager
 * Provides centralized error handling and loading state management
 */

class ErrorHandler {
  constructor() {
    this.errors = [];
    this.loadingStates = new Map();
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    this.init();
  }

  /**
   * Initialize error handler
   */
  init() {
    this.setupGlobalErrorHandlers();
    this.createLoadingOverlay();
  }

  /**
   * Setup global error handlers
   */
  setupGlobalErrorHandlers() {
    // Handle uncaught JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        type: 'javascript'
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        message: event.reason?.message || 'Unhandled promise rejection',
        error: event.reason,
        type: 'promise'
      });
    });

    // Handle network errors
    window.addEventListener('offline', () => {
      this.showNetworkError();
    });

    window.addEventListener('online', () => {
      this.hideNetworkError();
    });
  }

  /**
   * Handle different types of errors
   */
  handleError(errorInfo) {
    const error = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      ...errorInfo,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.errors.push(error);
    this.logError(error);
    this.showUserFriendlyError(error);

    // Report to analytics/monitoring service if available
    this.reportError(error);
  }

  /**
   * Generate unique ID for errors
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Log error to console with details
   */
  logError(error) {
    console.group(`🚨 Error ${error.id}`);
    console.error('Message:', error.message);
    console.error('Type:', error.type);
    console.error('Timestamp:', error.timestamp);
    if (error.filename) console.error('File:', error.filename);
    if (error.lineno) console.error('Line:', error.lineno);
    if (error.error?.stack) console.error('Stack:', error.error.stack);
    console.groupEnd();
  }

  /**
   * Show user-friendly error message
   */
  showUserFriendlyError(error) {
    const userMessage = this.getUserFriendlyMessage(error);
    
    if (window.toastManager) {
      window.toastManager.show({
        message: userMessage,
        type: 'error',
        duration: 5000,
        actions: [{
          label: 'Retry',
          action: () => this.retryLastAction(error)
        }, {
          label: 'Report',
          action: () => this.reportErrorToUser(error)
        }]
      });
    } else {
      // Fallback if toast system not available
      alert(userMessage);
    }
  }

  /**
   * Get user-friendly error message
   */
  getUserFriendlyMessage(error) {
    const messages = {
      network: 'Network connection failed. Please check your internet connection.',
      timeout: 'Request timed out. Please try again.',
      javascript: 'Something went wrong. Please refresh the page.',
      promise: 'An unexpected error occurred. Please try again.',
      validation: 'Please check your input and try again.',
      server: 'Server error. Please try again later.',
      notfound: 'The requested resource was not found.',
      forbidden: 'You don\'t have permission to access this resource.',
      default: 'Something went wrong. Please try again.'
    };

    return messages[error.type] || messages.default;
  }

  /**
   * Retry last action
   */
  async retryLastAction(error) {
    const attemptCount = this.retryAttempts.get(error.id) || 0;
    
    if (attemptCount >= this.maxRetries) {
      this.showMaxRetriesError();
      return;
    }

    this.retryAttempts.set(error.id, attemptCount + 1);
    
    // Show retry loading state
    this.showLoading('retry', 'Retrying...');
    
    try {
      // Simulate retry delay
      await this.delay(1000);
      
      // Trigger retry event
      window.dispatchEvent(new CustomEvent('retryAction', {
        detail: { error, attempt: attemptCount + 1 }
      }));
      
      this.hideLoading('retry');
      
      if (window.toastManager) {
        window.toastManager.show({
          message: 'Action retried successfully',
          type: 'success'
        });
      }
    } catch (retryError) {
      this.hideLoading('retry');
      this.handleError({
        message: retryError.message,
        type: 'retry',
        originalError: error
      });
    }
  }

  /**
   * Show max retries error
   */
  showMaxRetriesError() {
    if (window.toastManager) {
      window.toastManager.show({
        message: 'Maximum retry attempts reached. Please refresh the page.',
        type: 'error',
        duration: 0, // Persistent
        actions: [{
          label: 'Refresh',
          action: () => window.location.reload()
        }]
      });
    }
  }

  /**
   * Report error to user (show detailed error info)
   */
  reportErrorToUser(error) {
    const errorDetails = {
      id: error.id,
      message: error.message,
      time: new Date(error.timestamp).toLocaleString(),
      page: error.url
    };

    const reportModal = this.createErrorReportModal(errorDetails);
    document.body.appendChild(reportModal);
    reportModal.classList.add('active');
  }

  /**
   * Create error report modal
   */
  createErrorReportModal(errorDetails) {
    const modal = document.createElement('div');
    modal.className = 'modal error-report-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Error Report</h3>
          <button class="modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="modal-body">
          <p>An error occurred. You can copy the details below to report the issue:</p>
          <div class="error-details">
            <strong>Error ID:</strong> ${errorDetails.id}<br>
            <strong>Message:</strong> ${errorDetails.message}<br>
            <strong>Time:</strong> ${errorDetails.time}<br>
            <strong>Page:</strong> ${errorDetails.page}
          </div>
          <button class="btn btn-primary copy-error-btn" data-error='${JSON.stringify(errorDetails)}'>
            Copy Error Details
          </button>
        </div>
      </div>
    `;

    // Bind modal events
    modal.querySelector('.modal-close').addEventListener('click', () => {
      modal.remove();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });

    modal.querySelector('.copy-error-btn').addEventListener('click', (e) => {
      const errorData = JSON.parse(e.target.dataset.error);
      navigator.clipboard.writeText(JSON.stringify(errorData, null, 2));
      
      if (window.toastManager) {
        window.toastManager.show({
          message: 'Error details copied to clipboard',
          type: 'success'
        });
      }
    });

    return modal;
  }

  /**
   * Show loading state
   */
  showLoading(key = 'default', message = 'Loading...') {
    this.loadingStates.set(key, {
      startTime: Date.now(),
      message
    });

    // Create or update loading indicator
    let loadingElement = document.querySelector(`[data-loading-key="${key}"]`);
    
    if (!loadingElement) {
      loadingElement = this.createLoadingElement(key, message);
      document.body.appendChild(loadingElement);
    }

    loadingElement.classList.add('active');
    
    // Dispatch loading event
    window.dispatchEvent(new CustomEvent('loadingStart', {
      detail: { key, message }
    }));
  }

  /**
   * Hide loading state
   */
  hideLoading(key = 'default') {
    const loadingState = this.loadingStates.get(key);
    if (loadingState) {
      const duration = Date.now() - loadingState.startTime;
      this.loadingStates.delete(key);
      
      // Dispatch loading end event
      window.dispatchEvent(new CustomEvent('loadingEnd', {
        detail: { key, duration }
      }));
    }

    const loadingElement = document.querySelector(`[data-loading-key="${key}"]`);
    if (loadingElement) {
      loadingElement.classList.remove('active');
      setTimeout(() => {
        if (loadingElement.parentNode) {
          loadingElement.parentNode.removeChild(loadingElement);
        }
      }, 300);
    }
  }

  /**
   * Create loading element
   */
  createLoadingElement(key, message) {
    const loading = document.createElement('div');
    loading.className = 'loading-overlay';
    loading.setAttribute('data-loading-key', key);
    loading.innerHTML = `
      <div class="loading-content">
        <div class="spinner"></div>
        <p class="loading-message">${message}</p>
      </div>
    `;
    return loading;
  }

  /**
   * Create global loading overlay
   */
  createLoadingOverlay() {
    const style = document.createElement('style');
    style.textContent = `
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .loading-overlay.active {
        opacity: 1;
        visibility: visible;
      }

      .loading-content {
        background-color: var(--color-bg-primary, white);
        padding: 2rem;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      }

      .loading-message {
        margin-top: 1rem;
        color: var(--color-text-primary, #333);
        font-weight: 500;
      }

      .spinner {
        display: inline-block;
        width: 32px;
        height: 32px;
        border: 3px solid var(--color-border, #e0e0e0);
        border-radius: 50%;
        border-top-color: var(--color-primary, #26a69a);
        animation: spin 1s ease-in-out infinite;
      }

      .error-details {
        background-color: var(--color-bg-tertiary, #f5f5f5);
        padding: 1rem;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.875rem;
        margin: 1rem 0;
        word-break: break-all;
      }

      .error-report-modal .modal-content {
        max-width: 500px;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Show network error
   */
  showNetworkError() {
    if (window.toastManager) {
      window.toastManager.show({
        message: 'You are offline. Some features may not work.',
        type: 'warning',
        duration: 0,
        id: 'network-error'
      });
    }
  }

  /**
   * Hide network error
   */
  hideNetworkError() {
    if (window.toastManager) {
      window.toastManager.hide('network-error');
      window.toastManager.show({
        message: 'You are back online!',
        type: 'success'
      });
    }
  }

  /**
   * Report error to monitoring service
   */
  reportError(error) {
    // Here you would send to your error monitoring service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    console.info('Error reported:', error.id);
  }

  /**
   * Utility delay function
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get all errors
   */
  getErrors() {
    return [...this.errors];
  }

  /**
   * Clear all errors
   */
  clearErrors() {
    this.errors = [];
  }

  /**
   * Check if currently loading
   */
  isLoading(key = 'default') {
    return this.loadingStates.has(key);
  }
}

// Utility functions for easy error handling
const withErrorHandling = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      window.errorHandler?.handleError({
        message: error.message,
        error,
        type: 'function'
      });
      throw error;
    }
  };
};

const withLoading = (key, fn) => {
  return async (...args) => {
    window.errorHandler?.showLoading(key);
    try {
      const result = await fn(...args);
      window.errorHandler?.hideLoading(key);
      return result;
    } catch (error) {
      window.errorHandler?.hideLoading(key);
      throw error;
    }
  };
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ErrorHandler, withErrorHandling, withLoading };
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  window.errorHandler = new ErrorHandler();
  window.withErrorHandling = withErrorHandling;
  window.withLoading = withLoading;
}