// ============================================
// Mobile Enhancements
// Native App-Like Features for Mobile Devices
// ============================================

class MobileEnhancements {
    constructor() {
        this.isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        console.log('%c📱 Mobile Enhancements Loading...', 'color: #10b981; font-size: 14px;');

        // Initialize all features
        this.initTouchGestures();
        this.initPWABanner();
        this.initBottomNav();
        this.initPullToRefresh();
        this.initHapticFeedback();
        this.initClickToCall();
        this.initQRCode();

        console.log('%c✓ Mobile Enhancements Ready', 'color: #10b981; font-size: 14px;');
    }

    // ============================================
    // Feature #81: Touch Gestures
    // ============================================
    initTouchGestures() {
        if (!this.isMobile || typeof Hammer === 'undefined') return;

        // Testimonials swipe
        const testimonialContainer = document.querySelector('.testimonial-container');
        if (testimonialContainer && window.testimonialsCarousel) {
            const mc = new Hammer(testimonialContainer);

            mc.on('swipeleft', () => {
                window.testimonialsCarousel.next();
                this.haptic([10]);
            });

            mc.on('swiperight', () => {
                window.testimonialsCarousel.prev();
                this.haptic([10]);
            });
        }

        console.log('%c  ✓ Touch gestures enabled', 'color: #06b6d4; font-size: 12px;');
    }

    // ============================================
    // Feature #82: Mobile App Banner (PWA)
    // ============================================
    initPWABanner() {
        // Listen for install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;

            // Show banner after 30 seconds if not already installed
            if (!this.isInstalled()) {
                setTimeout(() => this.showInstallBanner(), 30000);
            }
        });

        // Check if app was installed
        window.addEventListener('appinstalled', () => {
            console.log('PWA installed successfully');
            this.hideInstallBanner();
        });
    }

    isInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;
    }

    showInstallBanner() {
        const banner = document.getElementById('install-banner');
        if (banner && !this.isInstalled()) {
            banner.style.display = 'flex';
            banner.style.animation = 'slideUp 0.3s ease-out';
        }
    }

    hideInstallBanner() {
        const banner = document.getElementById('install-banner');
        if (banner) {
            banner.style.animation = 'slideDown 0.3s ease-out';
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
        }
    }

    async installPWA() {
        if (!this.deferredPrompt) return;

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }

        this.deferredPrompt = null;
        this.hideInstallBanner();
    }

    // ============================================
    // Feature #83: Bottom Navigation
    // ============================================
    initBottomNav() {
        if (!this.isMobile) return;

        const bottomNav = document.getElementById('mobile-bottom-nav');
        if (!bottomNav) return;

        // Set active based on current section
        const updateActiveNav = () => {
            const sections = ['home', 'services', 'portfolio', 'blog', 'contact'];
            const navItems = bottomNav.querySelectorAll('.nav-item');

            let activeSection = 'home';
            const scrollPosition = window.scrollY + window.innerHeight / 2;

            sections.forEach(section => {
                const element = document.getElementById(section);
                if (element) {
                    const top = element.offsetTop;
                    const bottom = top + element.offsetHeight;

                    if (scrollPosition >= top && scrollPosition < bottom) {
                        activeSection = section;
                    }
                }
            });

            navItems.forEach(item => {
                const href = item.getAttribute('href').substring(1);
                if (href === activeSection) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        };

        // Smooth scroll on click
        bottomNav.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);

                if (target) {
                    this.haptic([5]);
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Update on scroll (throttled)
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateActiveNav();
                    ticking = false;
                });
                ticking = true;
            }
        });

        updateActiveNav();
        console.log('%c  ✓ Bottom navigation active', 'color: #06b6d4; font-size: 12px;');
    }

    // ============================================
    // Feature #84: Pull to Refresh
    // ============================================
    initPullToRefresh() {
        if (!this.isMobile) return;

        let startY = 0;
        let isPulling = false;
        const threshold = 80;
        const indicator = document.getElementById('refresh-indicator');

        if (!indicator) return;

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].pageY;
                isPulling = true;
            }
        });

        document.addEventListener('touchmove', (e) => {
            if (!isPulling) return;

            const currentY = e.touches[0].pageY;
            const pullDistance = currentY - startY;

            if (pullDistance > 0 && pullDistance < 150) {
                indicator.style.transform = `translateY(${pullDistance}px)`;
                indicator.style.opacity = Math.min(pullDistance / threshold, 1);

                if (pullDistance > threshold) {
                    indicator.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i>';
                } else {
                    indicator.innerHTML = '<i class="fas fa-arrow-down"></i>';
                }
            }
        });

        document.addEventListener('touchend', async (e) => {
            if (!isPulling) return;

            const pullDistance = e.changedTouches[0].pageY - startY;
            isPulling = false;

            if (pullDistance > threshold) {
                await this.refreshContent();
            }

            // Reset
            indicator.style.transform = 'translateY(0)';
            indicator.style.opacity = '0';
        });

        console.log('%c  ✓ Pull-to-refresh enabled', 'color: #06b6d4; font-size: 12px;');
    }

    async refreshContent() {
        this.haptic([10, 50, 10]);

        // Simulate refresh - reload dynamic content
        console.log('Refreshing content...');

        // If blog posts are loaded dynamically
        if (window.blogManager) {
            // Refresh blog posts
            const result = await window.blogManager.getAllPosts({ status: 'published' });
            if (result.success) {
                console.log('Content refreshed');
            }
        }

        return new Promise(resolve => setTimeout(resolve, 500));
    }

    // ============================================
    // Feature #85: Haptic Feedback
    // ============================================
    initHapticFeedback() {
        if (!this.isMobile) return;

        // Add haptic to all buttons
        document.querySelectorAll('button, .btn, a.nav-link').forEach(el => {
            el.addEventListener('click', () => this.haptic([5]));
        });

        // Form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', () => this.haptic([10, 50, 10]));
        });

        console.log('%c  ✓ Haptic feedback enabled', 'color: #06b6d4; font-size: 12px;');
    }

    haptic(pattern = [10]) {
        if ('vibrate' in navigator && this.isMobile) {
            navigator.vibrate(pattern);
        }
    }

    // ============================================
    // Feature #89: Click-to-Call
    // ============================================
    initClickToCall() {
        // Already handled in HTML with tel: links
        // Just add analytics tracking
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', () => {
                console.log('Click-to-call initiated');
                this.haptic([10]);
            });
        });

        document.querySelectorAll('a[href^="https://wa.me"]').forEach(link => {
            link.addEventListener('click', () => {
                console.log('WhatsApp initiated');
                this.haptic([10]);
            });
        });
    }

    // ============================================
    // Feature #87: QR Code  
    // ============================================
    initQRCode() {
        // QR Code generation will be triggered on demand
        window.generateQRCode = () => {
            if (typeof QRCode === 'undefined') {
                console.error('QRCode library not loaded');
                return;
            }

            const container = document.getElementById('qr-code-container');
            if (!container) return;

            container.innerHTML = ''; // Clear previous

            const vCard = `BEGIN:VCARD
VERSION:3.0
FN:Weblithic
TEL:+91-XXX-XXX-XXXX
EMAIL:info@weblithic.com
URL:https://weblithic.com
END:VCARD`;

            new QRCode(container, {
                text: vCard,
                width: 256,
                height: 256,
                colorDark: "#8b5cf6",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            this.haptic([10]);
        };

        window.showQRModal = () => {
            window.generateQRCode();
            const modal = document.getElementById('qr-modal');
            if (modal) {
                modal.style.display = 'flex';
            }
        };

        window.hideQRModal = () => {
            const modal = document.getElementById('qr-modal');
            if (modal) {
                modal.style.display = 'none';
            }
        };
    }

    // ============================================
    // Feature #90: Get Directions
    // ============================================
    static getDirections() {
        const lat = 22.719569;
        const lng = 75.857690;
        const destination = `${lat},${lng}`;

        if (/Mobi|Android/i.test(navigator.userAgent)) {
            // Try Google Maps app first
            window.location.href = `google.navigation:q=${destination}`;

            // Fallback to browser version
            setTimeout(() => {
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
            }, 500);
        } else {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mobileEnhancements = new MobileEnhancements();
    });
} else {
    window.mobileEnhancements = new MobileEnhancements();
}

// Export for global use
window.getDirections = MobileEnhancements.getDirections;
