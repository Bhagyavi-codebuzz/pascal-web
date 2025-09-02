// Navigation and Page Management
class PageManager {
    constructor() {
        this.currentPage = 'home';
        this.pages = document.querySelectorAll('.page');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');

        this.init();
    }

    init() {
        // Initialize navigation
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupFormValidation();
        this.setupSmoothScrolling();

        // Show initial page
        this.showPage('home');

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const page = e.state?.page || 'home';
            this.showPage(page, false);
        });
    }

    // setupNavigation() {
    //     this.navLinks.forEach(link => {
    //         link.addEventListener('click', (e) => {
    //             e.preventDefault();
    //             const targetPage = link.getAttribute('href').substring(1);
    //             this.showPage(targetPage);
    //             this.closeMobileMenu();
    //         });
    //     });
    // }
    setupNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (!targetElement) return;

                // If it's a full page (has class 'page'), use showPage
                if (targetElement.classList.contains('page')) {
                    this.showPage(targetId);
                }
                // Otherwise, it's a section—just scroll smoothly
                else {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    this.closeMobileMenu();
                }
            });
        });
    }


    setupMobileMenu() {
        this.navToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
    }

    showPage(pageId, updateHistory = true) {
        // Hide all pages
        this.pages.forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;

            // Update navigation active state
            this.updateActiveNavLink(pageId);

            // Update browser history
            if (updateHistory) {
                const title = this.getPageTitle(pageId);
                history.pushState({ page: pageId }, title, `#${pageId}`);
                document.title = title;
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    updateActiveNavLink(pageId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${pageId}`) {
                link.classList.add('active');
            }
        });
    }

    getPageTitle(pageId) {
        const titles = {
            'home': 'Pascal Enterprise - Empowering Telecommunications Through Innovation',
            'services': 'Our Services - Pascal Enterprise',
            'about': 'About Us - Pascal Enterprise',
            'contact': 'Contact Us - Pascal Enterprise'
        };
        return titles[pageId] || titles['home'];
    }

    setupSmoothScrolling() {
        const headerOffset = 68; // adjust to your header height
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href.length > 1) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const elementPosition = target.getBoundingClientRect().top + window.scrollY;
                        const offsetPosition = elementPosition - headerOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                    }
                }
            });
        });
    }


    setupFormValidation() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(contactForm);
            });

            // Real-time validation
            const formControls = contactForm.querySelectorAll('.form-control');
            formControls.forEach(control => {
                control.addEventListener('blur', () => {
                    this.validateField(control);
                });

                control.addEventListener('input', () => {
                    this.clearFieldError(control);
                });
            });
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.getAttribute('name');
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required.`;
        }

        // Email validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }

        // Name validation
        if (fieldName === 'name' && value && value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters long.';
        }

        // Message validation
        if (fieldName === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long.';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    validateForm(form) {
        const formControls = form.querySelectorAll('.form-control[required]');
        let isValid = true;

        formControls.forEach(control => {
            if (!this.validateField(control)) {
                isValid = false;
            }
        });

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        field.style.borderColor = '#ef4444';

        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        field.style.borderColor = '';

        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    getFieldLabel(fieldName) {
        const labels = {
            'name': 'Full Name',
            'email': 'Email Address',
            'company': 'Company',
            'service': 'Service of Interest',
            'message': 'Message'
        };
        return labels[fieldName] || fieldName;
    }

    async handleFormSubmission(form) {
        if (!this.validateForm(form)) {
            this.showNotification('Please correct the errors in the form.', 'error');
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        // Show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            // Simulate form submission
            await this.simulateFormSubmission(form);

            // Show success message
            this.showNotification('Thank you for your message! We will get back to you soon.', 'success');

            // Reset form
            form.reset();

        } catch (error) {
            this.showNotification('There was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }

    simulateFormSubmission(form) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // Simulate success (90% success rate)
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Submission failed'));
                }
            }, 2000);
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1001;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;

        notification.textContent = message;

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            float: right;
            margin-left: 12px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        `;
        closeButton.addEventListener('click', () => notification.remove());
        notification.appendChild(closeButton);

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// Utility functions for navigation
// function navigateToSection(sectionId) {
//     if (window.pageManager) {
//         window.pageManager.showPage(sectionId);
//     }
// }
function navigateToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
// function toggleServiceDetails(button) {
//     const details = button.nextElementSibling; // assumes service-details is right after button
//     if (details.style.display === 'none') {
//         details.style.display = 'block';
//         button.textContent = '➖'; // change icon to indicate collapse
//         details.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     } else {
//         details.style.display = 'none';
//         button.textContent = '➕'; // back to expand icon
//     }
//      // Prevent page from jumping up
//   btn.blur();
// }
function toggleServiceDetails(btn) {
    const details = btn.previousElementSibling;

    // Toggle display
    if (details.style.display === 'none' || details.style.display === '') {
        details.style.display = 'block';
        btn.innerHTML = 'See Less';
    } else {
        details.style.display = 'none';
        btn.innerHTML = 'See More';
    }

    // Prevent page from jumping up
    btn.blur();
}
function toggleAboutDetails(button) {
    const details = document.getElementById('aboutDetails');
    if (details.style.display === 'none' || details.style.display === '') {
        details.style.display = 'block';
        button.innerText = 'Show Less';
    } else {
        details.style.display = 'none';
        button.innerText = 'Learn More About Us';
    }
    button.blur(); // prevent scroll jump
}



// Animation utilities
class AnimationUtils {
    static observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe service cards and other animated elements
        document.querySelectorAll('.service-card, .value-item, .stat, .service-detail').forEach(el => {
            observer.observe(el);
        });
    }

    static addScrollEffects() {
        let ticking = false;

        function updateScrollEffects() {
            const scrolled = window.pageYOffset;
            const navbar = document.querySelector('.navbar');

            if (navbar) {
                if (scrolled > 100) {
                    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
                    navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    navbar.style.backdropFilter = 'blur(10px)';
                } else {
                    navbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    navbar.style.backgroundColor = '#ffffff';
                    navbar.style.backdropFilter = 'none';
                }
            }

            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick);
    }
}

// Performance optimization utilities
class PerformanceUtils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize page manager
    window.pageManager = new PageManager();

    // Initialize animations
    AnimationUtils.observeElements();
    AnimationUtils.addScrollEffects();

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .animate-in {
            animation: fadeInUp 0.6s ease-out;
        }
        
        .service-card,
        .value-item,
        .stat,
        .service-detail {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease-out;
        }
        
        .service-card.animate-in,
        .value-item.animate-in,
        .stat.animate-in,
        .service-detail.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Handle initial page load based on URL hash
    const hash = window.location.hash.substring(1);
    if (hash) {
        if (['home', 'services', 'about', 'contact'].includes(hash)) {
            window.pageManager.showPage(hash);
        } else {
            const el = document.getElementById(hash);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    }
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        // Page is hidden - pause any animations or timers if needed
    } else {
        // Page is visible - resume animations if needed
    }
});

// Error handling
window.addEventListener('error', function (e) {
    console.error('Application error:', e.error);
    // In production, you might want to send this to an error reporting service
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function (e) {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, you might want to send this to an error reporting service
});

// Export utilities for potential external use
window.PascalEnterprise = {
    navigateToSection,
    AnimationUtils,
    PerformanceUtils
};