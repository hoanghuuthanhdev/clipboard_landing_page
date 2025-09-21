/**
 * Toast Notification System
 * Provides beautiful, accessible toast notifications for user feedback
 */

class ToastManager {
  constructor(options = {}) {
    this.toasts = new Map();
    this.container = null;
    this.options = {
      position: 'top-right', // top-left, top-right, bottom-left, bottom-right, top-center, bottom-center
      maxToasts: 5,
      defaultDuration: 4000,
      animationDuration: 300,
      gap: 8,
      ...options
    };
    this.init();
  }

  /**
   * Initialize toast manager
   */
  init() {
    this.createContainer();
    this.addStyles();
    this.bindEvents();
  }

  /**
   * Create toast container
   */
  createContainer() {
    this.container = document.createElement('div');
    this.container.className = `toast-container toast-${this.options.position}`;
    this.container.setAttribute('aria-live', 'polite');
    this.container.setAttribute('aria-label', 'Notifications');
    document.body.appendChild(this.container);
  }

  /**
   * Add CSS styles for toasts
   */
  addStyles() {
    if (document.getElementById('toast-styles')) return;

    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
      .toast-container {
        position: fixed;
        z-index: 10000;
        pointer-events: none;
        display: flex;
        flex-direction: column;
        gap: ${this.options.gap}px;
        max-width: 420px;
        width: calc(100vw - 2rem);
      }

      .toast-container.toast-top-right {
        top: 1rem;
        right: 1rem;
      }

      .toast-container.toast-top-left {
        top: 1rem;
        left: 1rem;
      }

      .toast-container.toast-bottom-right {
        bottom: 1rem;
        right: 1rem;
        flex-direction: column-reverse;
      }

      .toast-container.toast-bottom-left {
        bottom: 1rem;
        left: 1rem;
        flex-direction: column-reverse;
      }

      .toast-container.toast-top-center {
        top: 1rem;
        left: 50%;
        transform: translateX(-50%);
      }

      .toast-container.toast-bottom-center {
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
        flex-direction: column-reverse;
      }

      .toast {
        background-color: var(--color-bg-primary, white);
        border: 1px solid var(--color-border, #e0e0e0);
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 1rem;
        pointer-events: auto;
        position: relative;
        overflow: hidden;
        min-height: 64px;
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        opacity: 0;
        transform: translateX(100%);
        transition: all ${this.options.animationDuration}ms ease-out;
      }

      .toast-container.toast-top-left .toast,
      .toast-container.toast-bottom-left .toast {
        transform: translateX(-100%);
      }

      .toast-container.toast-top-center .toast,
      .toast-container.toast-bottom-center .toast {
        transform: translateY(-100%);
      }

      .toast.toast-show {
        opacity: 1;
        transform: translateX(0) translateY(0);
      }

      .toast.toast-success {
        border-left: 4px solid var(--color-success, #10b981);
      }

      .toast.toast-error {
        border-left: 4px solid var(--color-error, #ef4444);
      }

      .toast.toast-warning {
        border-left: 4px solid var(--color-warning, #f59e0b);
      }

      .toast.toast-info {
        border-left: 4px solid var(--color-info, #3b82f6);
      }

      .toast-icon {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        margin-top: 2px;
      }

      .toast-icon svg {
        width: 100%;
        height: 100%;
      }

      .toast-icon.toast-success svg {
        fill: var(--color-success, #10b981);
      }

      .toast-icon.toast-error svg {
        fill: var(--color-error, #ef4444);
      }

      .toast-icon.toast-warning svg {
        fill: var(--color-warning, #f59e0b);
      }

      .toast-icon.toast-info svg {
        fill: var(--color-info, #3b82f6);
      }

      .toast-content {
        flex-grow: 1;
        min-width: 0;
      }

      .toast-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-text-primary, #1f2937);
        margin-bottom: 0.25rem;
        line-height: 1.25;
      }

      .toast-message {
        font-size: 0.875rem;
        color: var(--color-text-secondary, #6b7280);
        line-height: 1.4;
        word-wrap: break-word;
      }

      .toast-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.75rem;
      }

      .toast-action {
        background: transparent;
        border: 1px solid var(--color-border, #e0e0e0);
        border-radius: 4px;
        padding: 0.25rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        color: var(--color-text-primary, #1f2937);
      }

      .toast-action:hover {
        background-color: var(--color-bg-secondary, #f9fafb);
      }

      .toast-action.primary {
        background-color: var(--color-primary, #3b82f6);
        border-color: var(--color-primary, #3b82f6);
        color: white;
      }

      .toast-action.primary:hover {
        background-color: var(--color-primary-dark, #2563eb);
      }

      .toast-close {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: transparent;
        border: none;
        width: 20px;
        height: 20px;
        cursor: pointer;
        color: var(--color-text-tertiary, #9ca3af);
        font-size: 18px;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
      }

      .toast-close:hover {
        background-color: var(--color-bg-secondary, #f3f4f6);
        color: var(--color-text-primary, #1f2937);
      }

      .toast-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        background-color: var(--color-primary, #3b82f6);
        transition: width linear;
        border-radius: 0 0 8px 8px;
      }

      .toast.toast-success .toast-progress {
        background-color: var(--color-success, #10b981);
      }

      .toast.toast-error .toast-progress {
        background-color: var(--color-error, #ef4444);
      }

      .toast.toast-warning .toast-progress {
        background-color: var(--color-warning, #f59e0b);
      }

      .toast.toast-info .toast-progress {
        background-color: var(--color-info, #3b82f6);
      }

      /* Dark theme support */
      [data-theme="dark"] .toast {
        background-color: var(--color-bg-secondary, #1f2937);
        border-color: var(--color-border, #374151);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      }

      /* Responsive design */
      @media (max-width: 480px) {
        .toast-container {
          left: 1rem !important;
          right: 1rem !important;
          width: calc(100vw - 2rem);
          max-width: none;
          transform: none !important;
        }

        .toast {
          padding: 0.875rem;
          min-height: 56px;
        }

        .toast-title,
        .toast-message {
          font-size: 0.8rem;
        }
      }

      /* Animations */
      @keyframes toastSlideIn {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes toastFadeOut {
        from {
          opacity: 1;
          transform: scale(1);
        }
        to {
          opacity: 0;
          transform: scale(0.95);
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Bind global events
   */
  bindEvents() {
    // Pause auto-dismiss on hover
    this.container.addEventListener('mouseenter', () => {
      this.toasts.forEach(toast => {
        if (toast.timer) {
          clearTimeout(toast.timer);
          toast.paused = true;
        }
      });
    });

    this.container.addEventListener('mouseleave', () => {
      this.toasts.forEach(toast => {
        if (toast.paused && toast.duration > 0) {
          const remainingTime = toast.duration - (Date.now() - toast.startTime);
          if (remainingTime > 0) {
            toast.timer = setTimeout(() => this.hide(toast.id), remainingTime);
            toast.paused = false;
          }
        }
      });
    });
  }

  /**
   * Show a toast notification
   */
  show(options) {
    const toast = {
      id: options.id || this.generateId(),
      type: options.type || 'info',
      title: options.title,
      message: options.message,
      duration: options.duration !== undefined ? options.duration : this.options.defaultDuration,
      actions: options.actions || [],
      closable: options.closable !== false,
      startTime: Date.now(),
      timer: null,
      paused: false,
      element: null
    };

    // Remove oldest toast if we're at the limit
    if (this.toasts.size >= this.options.maxToasts) {
      const oldestToast = Array.from(this.toasts.values())[0];
      this.hide(oldestToast.id);
    }

    // Create and add toast element
    toast.element = this.createToastElement(toast);
    this.container.appendChild(toast.element);
    this.toasts.set(toast.id, toast);

    // Trigger show animation
    requestAnimationFrame(() => {
      toast.element.classList.add('toast-show');
    });

    // Auto-dismiss if duration > 0
    if (toast.duration > 0) {
      toast.timer = setTimeout(() => this.hide(toast.id), toast.duration);
    }

    // Dispatch event
    this.dispatchEvent('toastShow', { toast });

    return toast.id;
  }

  /**
   * Hide a toast notification
   */
  hide(id) {
    const toast = this.toasts.get(id);
    if (!toast) return;

    // Clear timer
    if (toast.timer) {
      clearTimeout(toast.timer);
    }

    // Remove show class
    toast.element.classList.remove('toast-show');

    // Remove element after animation
    setTimeout(() => {
      if (toast.element.parentNode) {
        toast.element.parentNode.removeChild(toast.element);
      }
      this.toasts.delete(id);
      this.dispatchEvent('toastHide', { toast });
    }, this.options.animationDuration);
  }

  /**
   * Create toast DOM element
   */
  createToastElement(toast) {
    const element = document.createElement('div');
    element.className = `toast toast-${toast.type}`;
    element.setAttribute('role', 'alert');
    element.setAttribute('aria-live', 'assertive');

    const icon = this.getIcon(toast.type);
    const hasTitle = toast.title && toast.title.trim();
    const hasActions = toast.actions && toast.actions.length > 0;

    element.innerHTML = `
      <div class="toast-icon toast-${toast.type}">
        ${icon}
      </div>
      <div class="toast-content">
        ${hasTitle ? `<div class="toast-title">${this.escapeHtml(toast.title)}</div>` : ''}
        <div class="toast-message">${this.escapeHtml(toast.message)}</div>
        ${hasActions ? this.createActionsHtml(toast.actions) : ''}
      </div>
      ${toast.closable ? '<button class="toast-close" aria-label="Close notification">&times;</button>' : ''}
      ${toast.duration > 0 ? '<div class="toast-progress"></div>' : ''}
    `;

    // Bind close button
    if (toast.closable) {
      const closeBtn = element.querySelector('.toast-close');
      closeBtn.addEventListener('click', () => this.hide(toast.id));
    }

    // Bind action buttons
    if (hasActions) {
      const actionBtns = element.querySelectorAll('.toast-action');
      actionBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
          const action = toast.actions[index];
          if (action.action) {
            action.action(toast);
          }
          if (action.dismiss !== false) {
            this.hide(toast.id);
          }
        });
      });
    }

    // Progress bar animation
    if (toast.duration > 0) {
      const progressBar = element.querySelector('.toast-progress');
      if (progressBar) {
        progressBar.style.width = '100%';
        progressBar.style.transitionDuration = `${toast.duration}ms`;
        requestAnimationFrame(() => {
          progressBar.style.width = '0%';
        });
      }
    }

    return element;
  }

  /**
   * Create actions HTML
   */
  createActionsHtml(actions) {
    const actionsHtml = actions.map(action => {
      const className = `toast-action ${action.primary ? 'primary' : ''}`;
      return `<button class="${className}">${this.escapeHtml(action.label)}</button>`;
    }).join('');

    return `<div class="toast-actions">${actionsHtml}</div>`;
  }

  /**
   * Get icon SVG for toast type
   */
  getIcon(type) {
    const icons = {
      success: `
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
      `,
      error: `
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
      `,
      warning: `
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
        </svg>
      `,
      info: `
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>
      `
    };

    return icons[type] || icons.info;
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return 'toast-' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Dispatch custom event
   */
  dispatchEvent(eventName, detail) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  /**
   * Clear all toasts
   */
  clearAll() {
    this.toasts.forEach((toast) => {
      this.hide(toast.id);
    });
  }

  /**
   * Convenience methods
   */
  success(message, options = {}) {
    return this.show({ ...options, message, type: 'success' });
  }

  error(message, options = {}) {
    return this.show({ ...options, message, type: 'error' });
  }

  warning(message, options = {}) {
    return this.show({ ...options, message, type: 'warning' });
  }

  info(message, options = {}) {
    return this.show({ ...options, message, type: 'info' });
  }

  /**
   * Get all active toasts
   */
  getToasts() {
    return Array.from(this.toasts.values());
  }

  /**
   * Check if a toast is active
   */
  isActive(id) {
    return this.toasts.has(id);
  }

  /**
   * Update toast position
   */
  setPosition(position) {
    this.options.position = position;
    this.container.className = `toast-container toast-${position}`;
  }

  /**
   * Destroy toast manager
   */
  destroy() {
    this.clearAll();
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    
    const styles = document.getElementById('toast-styles');
    if (styles && styles.parentNode) {
      styles.parentNode.removeChild(styles);
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ToastManager;
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  window.toastManager = new ToastManager();
  
  // Add convenience methods to window
  window.toast = {
    show: (options) => window.toastManager.show(options),
    success: (message, options) => window.toastManager.success(message, options),
    error: (message, options) => window.toastManager.error(message, options),
    warning: (message, options) => window.toastManager.warning(message, options),
    info: (message, options) => window.toastManager.info(message, options),
    hide: (id) => window.toastManager.hide(id),
    clear: () => window.toastManager.clearAll()
  };
}