/**
 * Clipboard Landing Page Template - Minimal JavaScript
 * Essential functionality with minimal dependencies
 */

(function() {
  'use strict';

  // ==========================================================================
  // Theme Management
  // ==========================================================================
  
  class ThemeManager {
    constructor() {
      this.init();
    }

    init() {
      // Set initial theme
      const savedTheme = localStorage.getItem('theme') || this.getSystemTheme();
      this.setTheme(savedTheme);
      
      // Setup theme toggle button
      this.setupToggle();
      
      // Listen for system theme changes
      this.listenForSystemChanges();
    }

    getSystemTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      this.currentTheme = theme;
    }

    toggleTheme() {
      const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      this.setTheme(newTheme);
      this.showToast(`Switched to ${newTheme} mode`, 'info');
    }

    setupToggle() {
      const toggleButton = document.querySelector('.theme-toggle');
      if (toggleButton) {
        toggleButton.addEventListener('click', () => this.toggleTheme());
        
        // Keyboard shortcut (Ctrl/Cmd + Shift + D)
        document.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            this.toggleTheme();
          }
        });
      }
    }

    listenForSystemChanges() {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  // ==========================================================================
  // Toast Notifications
  // ==========================================================================

  function showToast(message, type = 'info', duration = 3000) {
    // Create toast container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        ${message}
      </div>
    `;

    container.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  // ==========================================================================
  // Loading States
  // ==========================================================================

  function showLoading(message = 'Loading...') {
    let overlay = document.querySelector('.loading-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'loading-overlay';
      overlay.innerHTML = `
        <div class="loading-content">
          <div class="loading"></div>
          <p class="loading-message mt-md">${message}</p>
        </div>
      `;
      document.body.appendChild(overlay);
    }
    
    overlay.querySelector('.loading-message').textContent = message;
    overlay.classList.add('active');
    return overlay;
  }

  function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  }

  // ==========================================================================
  // Navigation
  // ==========================================================================

  function setupNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
        }
      });

      // Close menu when pressing escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
        }
      });
    }
  }

  // ==========================================================================
  // Form Handling
  // ==========================================================================

  function setupForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show loading
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<div class="loading"></div>';
        
        try {
          // Simulate form submission
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          showToast('Form submitted successfully!', 'success');
          form.reset();
        } catch (error) {
          showToast('Failed to submit form. Please try again.', 'error');
        } finally {
          // Restore button
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      });
    });
  }

  // ==========================================================================
  // Clipboard Functionality
  // ==========================================================================

  function setupClipboard() {
    const copyButtons = document.querySelectorAll('[data-copy]');
    
    copyButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const textToCopy = button.getAttribute('data-copy') || button.textContent;
        
        try {
          await navigator.clipboard.writeText(textToCopy);
          showToast('Copied to clipboard!', 'success');
          
          // Visual feedback
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          setTimeout(() => {
            button.textContent = originalText;
          }, 1000);
        } catch (error) {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          
          showToast('Copied to clipboard!', 'success');
        }
      });
    });
  }

  // ==========================================================================
  // Smooth Scrolling
  // ==========================================================================

  function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          
          const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
          const targetPosition = target.offsetTop - navHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ==========================================================================
  // Error Handling
  // ==========================================================================

  function setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
      showToast('Something went wrong. Please refresh the page.', 'error');
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      showToast('An unexpected error occurred.', 'error');
    });
  }

  // ==========================================================================
  // Intersection Observer for Animations
  // ==========================================================================

  function setupAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    animatedElements.forEach(el => observer.observe(el));
  }

  // ==========================================================================
  // Demo Functions (for template demonstration)
  // ==========================================================================

  function setupDemo() {
    // Add demo buttons if they exist
    const demoButton = document.querySelector('#demo-notifications');
    if (demoButton) {
      demoButton.addEventListener('click', () => {
        const types = ['success', 'error', 'warning', 'info'];
        const messages = [
          'This is a success message!',
          'This is an error message!',
          'This is a warning message!',
          'This is an info message!'
        ];
        
        types.forEach((type, index) => {
          setTimeout(() => {
            showToast(messages[index], type);
          }, index * 500);
        });
      });
    }

    const demoLoading = document.querySelector('#demo-loading');
    if (demoLoading) {
      demoLoading.addEventListener('click', () => {
        const loading = showLoading('Processing your request...');
        setTimeout(() => {
          hideLoading();
          showToast('Demo completed!', 'success');
        }, 3000);
      });
    }
  }

  // ==========================================================================
  // Public API
  // ==========================================================================

  // Expose functions globally for template users
  window.ClipboardTemplate = {
    showToast,
    showLoading,
    hideLoading,
    // Theme manager will be available after init
    themeManager: null
  };

  // ==========================================================================
  // Initialization
  // ==========================================================================

  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    try {
      // Initialize all components
      const themeManager = new ThemeManager();
      window.ClipboardTemplate.themeManager = themeManager;
      
      setupNavigation();
      setupForms();
      setupClipboard();
      setupSmoothScrolling();
      setupErrorHandling();
      setupAnimations();
      setupDemo();

      // Show welcome message
      setTimeout(() => {
        showToast('Template loaded successfully!', 'success');
      }, 500);

    } catch (error) {
      console.error('Initialization error:', error);
      showToast('Failed to initialize some features.', 'warning');
    }
  }

  // Start initialization
  init();

})();