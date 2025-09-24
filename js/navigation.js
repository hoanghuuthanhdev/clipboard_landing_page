/**
 * Navigation Active State Manager
 * Handles active states for navigation links based on current section
 */

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section[id]');
    
    // Function to remove active class from all links
    function removeActiveClasses() {
        navLinks.forEach(link => link.classList.remove('active'));
    }
    
    // Function to add active class to current link
    function addActiveClass(targetId) {
        const activeLink = document.querySelector(`.nav__link[href="#${targetId}"]`);
        if (activeLink) {
            removeActiveClasses();
            activeLink.classList.add('active');
        }
    }
    
    // Handle click events on navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                // Add active class immediately
                addActiveClass(targetId);
                
                // Optional: Keep focus on the clicked link for a short time
                this.focus();
                setTimeout(() => {
                    // Allow natural focus behavior after a brief moment
                    this.blur();
                }, 500);
            }
        });
    });
    
    // Intersection Observer to detect which section is in view
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px', // Trigger when section is 20% from top
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                addActiveClass(entry.target.id);
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Handle initial page load - check hash in URL
    function handleInitialHash() {
        const hash = window.location.hash;
        if (hash) {
            const targetId = hash.substring(1);
            addActiveClass(targetId);
        } else {
            // Default to first section if no hash
            if (sections.length > 0) {
                addActiveClass(sections[0].id);
            }
        }
    }
    
    // Call on page load
    handleInitialHash();
    
    // Handle hash changes (back/forward buttons)
    window.addEventListener('hashchange', handleInitialHash);
});