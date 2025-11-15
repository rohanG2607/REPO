/* Krystall Stars Website Script
    - V3: Added Hamburger Menu & Process Tab logic
    - Header Shrink, Smooth Scroll, Form Validation, Scroll Animations
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. NEW: Hamburger Menu Logic ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Open menu
    hamburgerBtn.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        hamburgerBtn.setAttribute('aria-expanded', 'true');
    });

    // Close menu
    function closeMenu() {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = ''; // Re-enable scrolling
        hamburgerBtn.setAttribute('aria-expanded', 'false');
    }

    closeMenuBtn.addEventListener('click', closeMenu);
    
    // Close menu after clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    
    // --- 2. NEW: Interactive Process Tabs Logic ---
    const tabButtons = document.querySelectorAll('.process-tab-btn');
    const tabContents = document.querySelectorAll('.process-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');

            // Update buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Update content
            tabContents.forEach(content => {
                if (content.id === `tab-${tabId}-content`) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });


    // --- 3. REFINED: Scroll-Reveal Animation Logic ---
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.1 
    };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    animatedElements.forEach(el => observer.observe(el));

    
    // --- 4. Header Shrink on Scroll ---
    const header = document.querySelector('.main-header');
    const shrinkThreshold = 50; 
    window.addEventListener('scroll', () => {
        if (window.scrollY > shrinkThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // --- 5. F-03: Smooth Scroll for CTAs ---
    // Select ALL links that scroll, including new mobile ones
    const scrollLinks = document.querySelectorAll('a[href^="#"], .cta-scroll');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if it's NOT a mobile menu link (which is handled by closeMenu)
            if (!link.classList.contains('mobile-nav-link')) {
                e.preventDefault();
            }
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Get header height to offset scroll
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- 6. F-10/F-11: Form Submission & Feedback ---
    const form = document.getElementById('inquiry-form');
    const feedbackEl = document.getElementById('form-feedback');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        feedbackEl.textContent = ''; 
        feedbackEl.className = 'form-feedback';

        const formData = {
            inquiryType: sanitizeInput(form.elements['inquiry-type'].value),
            name: sanitizeInput(form.elements['name'].value),
            email: sanitizeInput(form.elements['email'].value),
            company: sanitizeInput(form.elements['company'].value),
            phone: sanitizeInput(form.elements['phone'].value),
            message: sanitizeInput(form.elements['message'].value)
        };

        if (!formData.inquiryType || !formData.name || !formData.email || !formData.message) {
            showFeedback('Please fill out all required fields.', 'error');
            return;
        }

        console.log('Submitting sanitized data:', formData);
        
        setTimeout(() => {
            showFeedback('Success! Your inquiry has been sent. We will contact you shortly.', 'success');
            form.reset(); 
        }, 1000);
    });

    function showFeedback(message, type) {
        feedbackEl.textContent = message;
        feedbackEl.classList.add(type); 
    }

    function sanitizeInput(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }
});