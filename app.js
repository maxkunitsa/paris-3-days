// DOM Content Loaded Event Listener
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeAccordions();
});

// Tab Functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            this.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // Handle keyboard navigation for tabs
    tabButtons.forEach((button, index) => {
        button.addEventListener('keydown', function(e) {
            let newIndex;
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    newIndex = index > 0 ? index - 1 : tabButtons.length - 1;
                    tabButtons[newIndex].focus();
                    tabButtons[newIndex].click();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    newIndex = index < tabButtons.length - 1 ? index + 1 : 0;
                    tabButtons[newIndex].focus();
                    tabButtons[newIndex].click();
                    break;
                case 'Home':
                    e.preventDefault();
                    tabButtons[0].focus();
                    tabButtons[0].click();
                    break;
                case 'End':
                    e.preventDefault();
                    tabButtons[tabButtons.length - 1].focus();
                    tabButtons[tabButtons.length - 1].click();
                    break;
            }
        });
    });
}

// Accordion Functionality
function initializeAccordions() {
    const accordionButtons = document.querySelectorAll('.accordion-btn');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = this.classList.contains('active');
            
            if (isActive) {
                // Close accordion
                this.classList.remove('active');
                content.classList.remove('active');
                this.textContent = 'Show Details';
                content.style.maxHeight = null;
            } else {
                // Open accordion
                this.classList.add('active');
                content.classList.add('active');
                this.textContent = 'Hide Details';
                
                // Set max-height for smooth transition
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });

        // Handle keyboard interaction
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Utility function to handle smooth scrolling to elements
function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Handle external link clicks with confirmation (for maps links)
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('maps-link')) {
        // Add a small delay to show the click feedback
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 150);
    }
});

// Add intersection observer for timeline items animation
function initializeTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// Initialize timeline animation after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure CSS is loaded
    setTimeout(initializeTimelineAnimation, 100);
});

// Handle window resize for responsive accordion content
window.addEventListener('resize', function() {
    const activeAccordions = document.querySelectorAll('.accordion-content.active');
    activeAccordions.forEach(content => {
        content.style.maxHeight = content.scrollHeight + 'px';
    });
});

// Expand all accordions function (useful for printing)
function expandAllAccordions() {
    const accordionButtons = document.querySelectorAll('.accordion-btn');
    accordionButtons.forEach(button => {
        if (!button.classList.contains('active')) {
            button.click();
        }
    });
}

// Collapse all accordions function
function collapseAllAccordions() {
    const accordionButtons = document.querySelectorAll('.accordion-btn.active');
    accordionButtons.forEach(button => {
        button.click();
    });
}

// Print preparation
window.addEventListener('beforeprint', function() {
    expandAllAccordions();
});

// Add keyboard shortcut for quick navigation
document.addEventListener('keydown', function(e) {
    // Alt + 1, 2, 3 for quick tab switching
    if (e.altKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                document.querySelector('[data-tab="day1"]').click();
                break;
            case '2':
                e.preventDefault();
                document.querySelector('[data-tab="day2"]').click();
                break;
            case '3':
                e.preventDefault();
                document.querySelector('[data-tab="day3"]').click();
                break;
        }
    }
});

// Add focus management for better accessibility
function manageFocus() {
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabPanels.forEach(panel => {
        // Add tabindex for keyboard navigation
        panel.setAttribute('tabindex', '-1');
        
        // Focus management when tab becomes active
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (panel.classList.contains('active')) {
                        panel.focus();
                    }
                }
            });
        });
        
        observer.observe(panel, { attributes: true });
    });
}

// Initialize focus management
document.addEventListener('DOMContentLoaded', manageFocus);

// Add touch support for mobile devices
function addTouchSupport() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const currentActiveTab = document.querySelector('.tab-btn.active');
        const allTabs = Array.from(document.querySelectorAll('.tab-btn'));
        const currentIndex = allTabs.indexOf(currentActiveTab);
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next tab
            const nextIndex = currentIndex < allTabs.length - 1 ? currentIndex + 1 : 0;
            allTabs[nextIndex].click();
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous tab
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : allTabs.length - 1;
            allTabs[prevIndex].click();
        }
    }
}

// Initialize touch support
document.addEventListener('DOMContentLoaded', addTouchSupport);