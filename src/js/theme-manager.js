/**
 * Theme Management System
 * Handles dark/light mode toggle with localStorage persistence
 */

class ThemeManager {
  constructor() {
    this.theme = this.getStoredTheme() || this.getPreferredTheme();
    this.themeToggle = null;
    this.init();
  }

  /**
   * Initialize theme manager
   */
  init() {
    this.applyTheme(this.theme);
    this.createThemeToggle();
    this.bindEvents();
  }

  /**
   * Get theme from localStorage
   */
  getStoredTheme() {
    return localStorage.getItem('clipboard-theme');
  }

  /**
   * Get user's preferred theme from system
   */
  getPreferredTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  /**
   * Store theme preference
   */
  storeTheme(theme) {
    localStorage.setItem('clipboard-theme', theme);
  }

  /**
   * Apply theme to document
   */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.theme = theme;
    this.storeTheme(theme);
    
    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);
  }

  /**
   * Update meta theme-color for mobile browsers
   */
  updateMetaThemeColor(theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0a0a' : '#ffffff');
    }
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    
    // Announce theme change for screen readers
    this.announceThemeChange(newTheme);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme: newTheme } 
    }));
  }

  /**
   * Announce theme change for accessibility
   */
  announceThemeChange(theme) {
    const announcement = document.createElement('div');
    announcement.textContent = `Switched to ${theme} mode`;
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Create theme toggle button
   */
  createThemeToggle() {
    // Use existing button if available
    this.themeToggle = document.querySelector('#theme-toggle');
    
    if (!this.themeToggle) {
      // Create new button if not exists
      this.themeToggle = document.createElement('button');
      this.themeToggle.className = 'theme-toggle';
      this.themeToggle.setAttribute('aria-label', 'Toggle dark mode');
      this.themeToggle.setAttribute('title', 'Toggle theme');
      
      this.themeToggle.innerHTML = `
        <svg class="theme-toggle-icon sun-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5"/>
          <path d="m12 1-1 3h2l-1-3zM12 20l-1 3h2l-1-3zM4.22 4.22l1.42 1.42L4.22 4.22zM18.36 18.36l1.42 1.42-1.42-1.42zM1 12l3-1v2l-3-1zM20 12l3-1v2l-3-1zM4.22 19.78l1.42-1.42-1.42 1.42zM18.36 5.64l1.42-1.42-1.42 1.42z"/>
        </svg>
        <svg class="theme-toggle-icon moon-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      `;

      // Add to appropriate container
      const nav = document.querySelector('.nav-container');
      if (nav) {
        nav.appendChild(this.themeToggle);
      } else {
        document.body.appendChild(this.themeToggle);
      }
    }
    
    // Update accessibility attributes
    this.themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    this.themeToggle.setAttribute('title', 'Toggle theme');
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Theme toggle click
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.getStoredTheme()) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });

    // Keyboard shortcut (Ctrl/Cmd + Shift + D)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        this.toggleTheme();
      }
    });
  }

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return this.theme;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  window.themeManager = new ThemeManager();
}