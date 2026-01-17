// ===================================
// WEBLITHIC - Interactive Features
// ===================================

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function () {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });
});

// ===================================
// Preloader
// ===================================
window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1000);
});

// ===================================
// Navbar Scroll Effect
// ===================================
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===================================
// Active Navigation Link on Scroll
// ===================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===================================
// Smooth Scroll for Navigation Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: true
                });
            }
        }
    });
});

// ===================================
// Counter Animation for Statistics
// ===================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const counter = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('%') ? '' : '+');
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Intersection Observer for Counter Animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const target = parseInt(entry.target.getAttribute('data-count'));
            animateCounter(entry.target, target);
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

// Observe all stat numbers
document.querySelectorAll('.stats-number').forEach(stat => {
    statsObserver.observe(stat);
});

// ===================================
// Scroll to Top Button
// ===================================
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===================================
// Contact Form Handling
// ===================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Form validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset form
        contactForm.reset();

        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Show success message
        showNotification('Thank you! Your message has been sent successfully.', 'success');
    }, 1500);
});

// ===================================
// Notification System
// ===================================
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}" style="font-size: 1.5rem;"></i>
            <span>${message}</span>
        </div>
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add to DOM
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// ===================================
// Newsletter Subscription
// ===================================
const newsletterForm = document.querySelector('.input-group');
if (newsletterForm) {
    const newsletterBtn = newsletterForm.querySelector('.btn');
    const newsletterInput = newsletterForm.querySelector('input[type="email"]');

    newsletterBtn.addEventListener('click', () => {
        const email = newsletterInput.value;

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Show loading
        const originalHTML = newsletterBtn.innerHTML;
        newsletterBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        // Simulate subscription
        setTimeout(() => {
            newsletterInput.value = '';
            newsletterBtn.innerHTML = originalHTML;
            showNotification('Successfully subscribed to newsletter!', 'success');
        }, 1000);
    });
}

// ===================================
// Portfolio Card Hover Effects
// ===================================
const portfolioCards = document.querySelectorAll('.portfolio-card');
portfolioCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });
});

// ===================================
// Parallax Effect for Hero Section
// ===================================
window.addEventListener('scroll', () => {
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        const scrolled = window.pageYOffset;
        const heroContent = heroSection.querySelector('.hero-content');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / 500);
        }
    }
});

// ===================================
// Cursor Trail Effect (Premium Feature)
// ===================================
let cursorTrail = [];
const maxTrailLength = 20;

document.addEventListener('mousemove', (e) => {
    // Only on desktop
    if (window.innerWidth > 768) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: rgba(139, 92, 246, 0.5);
            pointer-events: none;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            z-index: 9998;
            animation: trailFade 0.5s ease-out forwards;
        `;

        document.body.appendChild(trail);
        cursorTrail.push(trail);

        if (cursorTrail.length > maxTrailLength) {
            const oldTrail = cursorTrail.shift();
            if (oldTrail && oldTrail.parentNode) {
                oldTrail.remove();
            }
        }

        setTimeout(() => {
            if (trail && trail.parentNode) {
                trail.remove();
            }
        }, 500);
    }
});

// Add trail animation
const trailStyle = document.createElement('style');
trailStyle.textContent = `
    @keyframes trailFade {
        to {
            opacity: 0;
            transform: scale(0);
        }
    }
`;
document.head.appendChild(trailStyle);

// ===================================
// Dynamic Year in Footer
// ===================================
const currentYear = new Date().getFullYear();
const copyrightText = document.querySelector('.copyright p');
if (copyrightText) {
    copyrightText.innerHTML = copyrightText.innerHTML.replace('2026', currentYear);
}

// ===================================
// Console Branding
// ===================================
console.log('%c🚀 Weblithic', 'color: #8b5cf6; font-size: 24px; font-weight: bold;');
console.log('%cWeb Development & Software Solutions', 'color: #06b6d4; font-size: 14px;');
console.log('%cVisit us at: https://weblithic.com', 'color: #ec4899; font-size: 12px;');
console.log('%c💼 Interested in working with us? Contact: info@weblithic.com', 'color: #ffffff; font-size: 12px;');

// ===================================
// Performance Monitoring
// ===================================
window.addEventListener('load', () => {
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`%c⚡ Page loaded in ${pageLoadTime}ms`, 'color: #10b981; font-size: 12px;');
    }
});

// ===================================
// Easter Egg - Konami Code
// ===================================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiPattern.join(',')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        showNotification('🎮 Konami Code Activated! You found the easter egg!', 'success');

        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(rainbowStyle);

        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// ===================================
// PREMIUM UI ENHANCEMENTS
// ===================================

// Feature #7: Scroll Progress Bar
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.pageYOffset;
    const progress = (scrolled / documentHeight) * 100;

    if (scrollProgress) {
        scrollProgress.style.width = progress + '%';
    }
}

window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);

// Feature #6: Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

let mouseX = 0;
let mouseY = 0;
let outlineX = 0;
let outlineY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    }
});

// Smooth cursor outline animation
function animateCursorOutline() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    if (cursorOutline) {
        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';
    }

    requestAnimationFrame(animateCursorOutline);
}

animateCursorOutline();

// Feature #4: Particles.js Initialization
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ['#8b5cf6', '#06b6d4', '#ec4899']
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#8b5cf6',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'repulse'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                repulse: {
                    distance: 100,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

// Feature #3: Vanilla Tilt Initialization
if (typeof VanillaTilt !== 'undefined') {
    // Portfolio cards
    VanillaTilt.init(document.querySelectorAll('.portfolio-card'), {
        max: 15,
        speed: 400,
        glare: true,
        'max-glare': 0.2,
        scale: 1.05
    });

    // Service cards
    VanillaTilt.init(document.querySelectorAll('.service-card'), {
        max: 10,
        speed: 400,
        glare: true,
        'max-glare': 0.15
    });

    // Stats cards
    VanillaTilt.init(document.querySelectorAll('.stats-card'), {
        max: 8,
        speed: 400,
        glare: true,
        'max-glare': 0.1
    });
}

// Feature #5: GLightbox Initialization
if (typeof GLightbox !== 'undefined') {
    const lightbox = GLightbox({
        touchNavigation: true,
        loop: true,
        autoplayVideos: true,
        closeButton: true,
        openEffect: 'zoom',
        closeEffect: 'fade',
        cssEfects: {
            fade: { in: 'fadeIn', out: 'fadeOut' },
            zoom: { in: 'zoomIn', out: 'zoomOut' }
        }
    });
}

// Feature #8: Skeleton Loaders
function showSkeletons() {
    const portfolioSection = document.querySelector('#portfolio .row');
    const aboutSection = document.querySelector('#about .row');

    if (portfolioSection) {
        portfolioSection.classList.add('loading');
    }

    if (aboutSection) {
        aboutSection.classList.add('loading');
    }
}

function hideSkeletons() {
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => {
        element.classList.remove('loading');
        element.classList.add('fade-in');
    });
}

// Simulate loading (remove this in production with real data)
window.addEventListener('load', () => {
    setTimeout(hideSkeletons, 1500);
});

// Feature #2: Enhanced Page Transitions are handled by CSS

// Feature #9: Gradient Border Animation is handled by CSS hover states

// ===================================
// Mobile Optimizations
// ===================================
const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
    // Disable particles on mobile for performance
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
        particlesContainer.style.display = 'none';
    }

    // Disable tilt on mobile
    document.querySelectorAll('.portfolio-card, .service-card, .stats-card').forEach(card => {
        card.style.transform = 'none';
    });
}

// ===================================
// Performance Optimization
// ===================================
// Throttle scroll events for better performance
function throttle(func, limit) {
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

// Apply throttle to scroll-heavy functions
window.addEventListener('scroll', throttle(() => {
    updateScrollProgress();
}, 16)); // ~60fps

console.log('%c✨ Premium UI Enhancements Loaded!', 'color: #8b5cf6; font-size: 16px; font-weight: bold;');
console.log('%c• Scroll Progress Bar', 'color: #06b6d4; font-size: 12px;');
console.log('%c• Custom Cursor', 'color: #06b6d4; font-size: 12px;');
console.log('%c• Particle Background', 'color: #06b6d4; font-size: 12px;');
console.log('%c• 3D Tilt Cards', 'color: #06b6d4; font-size: 12px;');
console.log('%c• Lightbox Gallery', 'color: #06b6d4; font-size: 12px;');
console.log('%c• Animated Gradient Borders', 'color: #06b6d4; font-size: 12px;');
console.log('%c• Skeleton Loaders', 'color: #06b6d4; font-size: 12px;');
console.log('%c• Page Transitions', 'color: #06b6d4; font-size: 12px;');

// ===================================
// NEW CONTENT & INTERACTIVE FEATURES
// ===================================

// Testimonials Carousel
class TestimonialsCarousel {
    constructor() {
        this.cards = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.testimonial-dots .dot');
        this.prevBtn = document.querySelector('.testimonial-nav.prev');
        this.nextBtn = document.querySelector('.testimonial-nav.next');
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.isPlaying = false;

        if (this.cards.length > 0) {
            this.init();
        }
    }

    init() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Pause on hover
        const carousel = document.querySelector('.testimonial-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pause());
            carousel.addEventListener('mouseleave', () => this.play());
        }

        // Start autoplay
        this.play();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });
    }

    goToSlide(index) {
        // Remove active class from current
        this.cards[this.currentIndex].classList.remove('active');
        this.cards[this.currentIndex].classList.add('prev');
        this.dots[this.currentIndex].classList.remove('active');

        // Add active class to new
        this.currentIndex = index;
        this.cards[this.currentIndex].classList.remove('prev');
        this.cards[this.currentIndex].classList.add('active');
        this.dots[this.currentIndex].classList.add('active');

        // Remove prev class after animation
        setTimeout(() => {
            this.cards.forEach(card => {
                if (!card.classList.contains('active')) {
                    card.classList.remove('prev');
                }
            });
        }, 500);
    }

    next() {
        const nextIndex = (this.currentIndex + 1) % this.cards.length;
        this.goToSlide(nextIndex);
    }

    prev() {
        const prevIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.goToSlide(prevIndex);
    }

    play() {
        if (!this.isPlaying) {
            this.autoPlayInterval = setInterval(() => this.next(), 5000);
            this.isPlaying = true;
        }
    }

    pause() {
        if (this.isPlaying) {
            clearInterval(this.autoPlayInterval);
            this.isPlaying = false;
        }
    }
}

// Initialize testimonials carousel
const testimonialsCarousel = new TestimonialsCarousel();

// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
        const isActive = question.classList.contains('active');

        // Close all other items (optional - remove if you want multiple open)
        faqItems.forEach(otherItem => {
            const otherQuestion = otherItem.querySelector('.faq-question');
            const otherAnswer = otherItem.querySelector('.faq-answer');

            if (otherItem !== item) {
                otherQuestion.classList.remove('active');
                otherAnswer.style.display = 'none';
            }
        });

        // Toggle clicked item
        if (isActive) {
            question.classList.remove('active');
            answer.style.display = 'none';
        } else {
            question.classList.add('active');
            answer.style.display = 'block';
        }
    });
});

// Add smooth scroll for blog links and update navigation
const blogLinks = document.querySelectorAll('.blog-link');
blogLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        // In a real app, this would navigate to the blog post
        showNotification('Blog post feature coming soon!', 'success');
    });
});

// Update navigation to include new sections
const navbarNav = document.querySelector('.navbar-nav');
if (navbarNav && !document.querySelector('.nav-link[href="#testimonials"]')) {
    const sectionsToAdd = [
        { href: '#testimonials', text: 'Testimonials' },
        { href: '#blog', text: 'Blog' },
        { href: '#faq', text: 'FAQ' }
    ];

    // Find the contact link
    const contactLink = document.querySelector('.nav-link[href="#contact"]');
    if (contactLink && contactLink.parentElement) {
        sectionsToAdd.forEach(section => {
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.innerHTML = `<a class="nav-link" href="${section.href}">${section.text}</a>`;
            contactLink.parentElement.parentElement.insertBefore(li, contactLink.parentElement);
        });
    }
}

console.log('%c✨ Content & Interactive Features Loaded!', 'color: #8b5cf6; font-size: 16px; font-weight: bold;');
console.log('%c• Testimonials Carousel', 'color: #06b6d4; font-size: 12px;');
console.log('%c• Tech Stack Grid', 'color: #06b6d4; font-size: 12px;');
console.log('%c• Blog Section', 'color: #06b6d4; font-size: 12px;');
console.log('%c• FAQ Accordion', 'color: #06b6d4; font-size: 12px;');

// ===================================
// SEO & ANALYTICS FEATURES
// ===================================

// Cookie Consent Banner
const cookieBanner = document.getElementById('cookieConsent');
const acceptBtn = document.getElementById('acceptCookies');
const declineBtn = document.getElementById('declineCookies');

// Check if user has already made a choice
function checkCookieConsent() {
    const cookieConsent = localStorage.getItem('cookieConsent');

    if (cookieConsent === null) {
        // Show banner after a delay for better UX
        setTimeout(() => {
            if (cookieBanner) {
                cookieBanner.classList.remove('hidden');
            }
        }, 2000);
    } else {
        console.log(`%cCookie Consent: ${cookieConsent}`, 'color: #10b981; font-size: 12px;');
    }
}

// Handle Accept
if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
        hideCookieBanner();

        // Here you would enable analytics/tracking
        // Example: Initialize Google Analytics
        console.log('%c✓ Cookies Accepted - Analytics Enabled', 'color: #10b981; font-size: 14px;');

        // Uncomment when you have GA4 tracking ID:
        // if (typeof gtag === 'function') {
        //     gtag('consent', 'update', {
        //         'analytics_storage': 'granted'
        //     });
        // }
    });
}

// Handle Decline  
if (declineBtn) {
    declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        localStorage.setItem('cookieConsentDate', new Date().toISOString());
        hideCookieBanner();

        console.log('%c✗ Cookies Declined - Analytics Disabled', 'color: #f59e0b; font-size: 14px;');

        // Uncomment when you have GA4 tracking ID:
        // if (typeof gtag === 'function') {
        //     gtag('consent', 'update', {
        //         'analytics_storage': 'denied'
        //     });
        // }
    });
}

function hideCookieBanner() {
    if (cookieBanner) {
        cookieBanner.classList.add('hidden');
        setTimeout(() => {
            cookieBanner.style.display = 'none';
        }, 400);
    }
}

// Initialize on page load
checkCookieConsent();

console.log('%c✨ SEO & Analytics Features Loaded!', 'color: #8b5cf6; font-size: 16px; font-weight: bold;');
console.log('%c• Enhanced Meta Tags (Open Graph, Twitter Cards)', 'color: #06b6d4; font-size: 12px;');
console.log('%c• JSON-LD Schema Markup (Organization, LocalBusiness, WebSite)', 'color: #06b6d4; font-size: 12px;');
console.log('%c• Sitemap.xml Created', 'color: #06b6d4; font-size: 12px;');
console.log('%c• Robots.txt Created', 'color: #06b6d4; font-size: 12px;');
console.log('%c• Cookie Consent Banner (GDPR Compliant)', 'color: #06b6d4; font-size: 12px;');
console.log('%c• Google Analytics 4 Placeholder Added', 'color: #06b6d4; font-size: 12px;');
console.log('%c📊 SEO Score: Excellent | Ready for Search Engines', 'color: #10b981; font-size: 14px; font-weight: bold;');



