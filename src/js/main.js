/**
 * Main Application Entry Point
 * Integrates all features: theme management, error handling, and toast notifications
 */

class ClipboardApp {
  constructor() {
    this.features = {
      themeManager: null,
      errorHandler: null,
      toastManager: null
    };
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      // Initialize core features
      await this.initializeFeatures();
      
      // Setup demo functionality
      this.setupDemoFeatures();
      
      // Bind global events
      this.bindGlobalEvents();
      
      // Show welcome message
      this.showWelcomeMessage();
      
      console.log('🚀 Clipboard App initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Clipboard App:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Initialize all features
   */
  async initializeFeatures() {
    // Theme manager is already initialized globally
    this.features.themeManager = window.themeManager;
    
    // Error handler is already initialized globally
    this.features.errorHandler = window.errorHandler;
    
    // Toast manager is already initialized globally
    this.features.toastManager = window.toastManager;
    
    // Verify all features are available
    if (!this.features.themeManager) {
      throw new Error('Theme manager not available');
    }
    
    if (!this.features.errorHandler) {
      throw new Error('Error handler not available');
    }
    
    if (!this.features.toastManager) {
      throw new Error('Toast manager not available');
    }
  }

  /**
   * Setup demo functionality for the landing page
   */
  setupDemoFeatures() {
    // Add demo buttons for testing features
    this.createDemoControls();
    
    // Setup form interactions
    this.setupFormInteractions();
    
    // Setup download button interactions
    this.setupDownloadButtons();
    
    // Setup newsletter signup
    this.setupNewsletterSignup();
  }

  /**
   * Create demo controls for testing features
   */
  createDemoControls() {
    // Only add demo controls in development/demo mode
    if (window.location.hostname === 'localhost' || window.location.search.includes('demo=true')) {
      this.addDemoPanel();
    }
  }

  /**
   * Add demo panel for testing features
   */
  addDemoPanel() {
    const demoPanel = document.createElement('div');
    demoPanel.innerHTML = `
      <div style="position: fixed; bottom: 20px; left: 20px; background: var(--color-bg-primary, white); border: 1px solid var(--color-border, #ccc); border-radius: 8px; padding: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.1); z-index: 9999; max-width: 300px;">
        <h4 style="margin: 0 0 1rem 0; color: var(--color-text-primary, #333);">🧪 Demo Controls</h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <button onclick="clipboardApp.testToast('success')" style="padding: 0.5rem; border: 1px solid #10b981; background: #10b981; color: white; border-radius: 4px; cursor: pointer;">Success Toast</button>
          <button onclick="clipboardApp.testToast('error')" style="padding: 0.5rem; border: 1px solid #ef4444; background: #ef4444; color: white; border-radius: 4px; cursor: pointer;">Error Toast</button>
          <button onclick="clipboardApp.testToast('warning')" style="padding: 0.5rem; border: 1px solid #f59e0b; background: #f59e0b; color: white; border-radius: 4px; cursor: pointer;">Warning Toast</button>
          <button onclick="clipboardApp.testToast('info')" style="padding: 0.5rem; border: 1px solid #3b82f6; background: #3b82f6; color: white; border-radius: 4px; cursor: pointer;">Info Toast</button>
          <button onclick="clipboardApp.testError()" style="padding: 0.5rem; border: 1px solid #6b7280; background: #6b7280; color: white; border-radius: 4px; cursor: pointer;">Test Error</button>
          <button onclick="clipboardApp.testLoading()" style="padding: 0.5rem; border: 1px solid #8b5cf6; background: #8b5cf6; color: white; border-radius: 4px; cursor: pointer;">Test Loading</button>
        </div>
      </div>
    `;
    document.body.appendChild(demoPanel);
  }

  /**
   * Setup form interactions with error handling and feedback
   */
  setupFormInteractions() {
    // Newsletter forms
    const forms = document.querySelectorAll('form, .newsletter-form, .contact-form');
    
    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleFormSubmission(form);
      });
    });

    // Input validation
    const inputs = document.querySelectorAll('input[type="email"], input[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateInput(input));
      input.addEventListener('input', () => this.clearInputError(input));
    });
  }

  /**
   * Handle form submission with loading states and error handling
   */
  async handleFormSubmission(form) {
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    const originalText = submitBtn?.textContent || submitBtn?.value;
    
    try {
      // Show loading state
      this.features.errorHandler.showLoading('form-submit', 'Processing...');
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
      }

      // Validate form
      const isValid = this.validateForm(form);
      if (!isValid) {
        throw new Error('Please check your input and try again');
      }

      // Simulate API call
      await this.simulateApiCall();

      // Success feedback
      this.features.toastManager.success('Thank you! We\'ll be in touch soon.', {
        title: 'Success',
        duration: 5000
      });

      // Reset form
      form.reset();

    } catch (error) {
      this.features.errorHandler.handleError({
        message: error.message,
        type: 'form',
        context: { formId: form.id || 'unknown' }
      });
    } finally {
      // Hide loading and restore button
      this.features.errorHandler.hideLoading('form-submit');
      
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  }

  /**
   * Validate form inputs
   */
  validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateInput(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Validate individual input
   */
  validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (input.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Email validation
    if (input.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    // Show/hide error
    if (!isValid) {
      this.showInputError(input, errorMessage);
    } else {
      this.clearInputError(input);
    }

    return isValid;
  }

  /**
   * Show input error
   */
  showInputError(input, message) {
    this.clearInputError(input);
    
    input.style.borderColor = 'var(--color-error, #ef4444)';
    
    const errorEl = document.createElement('div');
    errorEl.className = 'input-error';
    errorEl.textContent = message;
    errorEl.style.cssText = `
      color: var(--color-error, #ef4444);
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: block;
    `;
    
    input.parentNode.appendChild(errorEl);
  }

  /**
   * Clear input error
   */
  clearInputError(input) {
    input.style.borderColor = '';
    const errorEl = input.parentNode.querySelector('.input-error');
    if (errorEl) {
      errorEl.remove();
    }
  }

  /**
   * Setup download button interactions
   */
  setupDownloadButtons() {
    const downloadBtns = document.querySelectorAll('.btn[href*="download"], .download-btn, [data-download]');
    
    downloadBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        await this.handleDownload(btn);
      });
    });
  }

  /**
   * Handle download with feedback
   */
  async handleDownload(btn) {
    const platform = btn.dataset.platform || 'unknown';
    
    try {
      this.features.errorHandler.showLoading('download', `Preparing download for ${platform}...`);
      
      // Simulate download preparation
      await this.delay(2000);
      
      this.features.toastManager.success(`Download started for ${platform}!`, {
        title: 'Download Ready',
        actions: [{
          label: 'View Downloads',
          action: () => {
            // Open downloads in new tab (browser-specific)
            window.open('chrome://downloads/', '_blank');
          }
        }]
      });

    } catch (error) {
      this.features.toastManager.error('Download failed. Please try again.', {
        title: 'Download Error'
      });
    } finally {
      this.features.errorHandler.hideLoading('download');
    }
  }

  /**
   * Setup newsletter signup
   */
  setupNewsletterSignup() {
    // This would integrate with a real newsletter service
    const newsletterForms = document.querySelectorAll('.newsletter-form, [data-newsletter]');
    
    newsletterForms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = form.querySelector('input[type="email"]').value;
        
        try {
          await this.subscribeToNewsletter(email);
          
          this.features.toastManager.success('Successfully subscribed to newsletter!', {
            title: 'Welcome aboard! 🎉',
            duration: 6000,
            actions: [{
              label: 'Preferences',
              action: () => {
                this.features.toastManager.info('Newsletter preferences coming soon!');
              }
            }]
          });
          
          form.reset();
        } catch (error) {
          this.features.toastManager.error('Failed to subscribe. Please try again.', {
            title: 'Subscription Error'
          });
        }
      });
    });
  }

  /**
   * Subscribe to newsletter (mock)
   */
  async subscribeToNewsletter(email) {
    // Simulate API call
    await this.delay(1500);
    
    // Mock validation
    if (!email.includes('@')) {
      throw new Error('Invalid email address');
    }
    
    // Mock success
    return { success: true, email };
  }

  /**
   * Bind global events
   */
  bindGlobalEvents() {
    // Listen for theme changes
    window.addEventListener('themeChanged', (e) => {
      this.features.toastManager.info(`Switched to ${e.detail.theme} mode`, {
        duration: 2000
      });
    });

    // Listen for errors
    window.addEventListener('error', () => {
      // Error handler will catch this automatically
    });

    // Listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Pause any active timers
        console.log('Page hidden - pausing timers');
      } else {
        // Resume timers
        console.log('Page visible - resuming timers');
      }
    });
  }

  /**
   * Show welcome message
   */
  showWelcomeMessage() {
    // Only show on first visit
    if (!localStorage.getItem('clipboard-visited')) {
      setTimeout(() => {
        this.features.toastManager.info('Welcome to Clipboard! Try the theme toggle in the top-right corner.', {
          title: 'Welcome! 👋',
          duration: 8000,
          actions: [{
            label: 'Got it!',
            primary: true,
            action: () => {
              localStorage.setItem('clipboard-visited', 'true');
            }
          }]
        });
      }, 1000);
    }
  }

  /**
   * Handle initialization errors
   */
  handleInitializationError(error) {
    // Fallback error display if toast system fails
    const errorMsg = `Failed to initialize application: ${error.message}`;
    console.error(errorMsg);
    
    // Try to show error toast, fallback to alert
    try {
      if (window.toastManager) {
        window.toastManager.error(errorMsg, { duration: 0 });
      } else {
        alert(errorMsg);
      }
    } catch {
      alert(errorMsg);
    }
  }

  /**
   * Test methods for demo
   */
  testToast(type) {
    const messages = {
      success: 'Operation completed successfully!',
      error: 'Something went wrong. Please try again.',
      warning: 'Please check your input before continuing.',
      info: 'Here\'s some helpful information for you.'
    };

    this.features.toastManager[type](messages[type], {
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Message`,
      actions: type === 'error' ? [{
        label: 'Retry',
        action: () => this.features.toastManager.info('Retrying action...')
      }] : undefined
    });
  }

  testError() {
    throw new Error('This is a test error for demonstration purposes');
  }

  async testLoading() {
    this.features.errorHandler.showLoading('test', 'Testing loading state...');
    await this.delay(3000);
    this.features.errorHandler.hideLoading('test');
    this.features.toastManager.success('Loading test completed!');
  }

  /**
   * Utility methods
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  simulateApiCall() {
    return this.delay(1500 + Math.random() * 1000);
  }
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.clipboardApp = new ClipboardApp();
  });
} else {
  window.clipboardApp = new ClipboardApp();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ClipboardApp;
}