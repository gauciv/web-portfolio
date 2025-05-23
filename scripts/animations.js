// Scroll reveal animations
document.addEventListener('DOMContentLoaded', () => {
    // Scroll Progress Indicator with Color Transition
    const scrollProgress = document.querySelector('.scroll-progress');
    
    function getGradientColors(progress) {
        // Define color stops for the gradient
        const colorStops = [
            { color: '#58a6ff', pos: 0 },    // var(--accent)
            { color: '#1f6feb', pos: 33 },   // var(--accent-secondary)
            { color: '#238636', pos: 66 },   // success green
            { color: '#6f42c1', pos: 100 }   // purple
        ];
        
        // Find the current color segment based on progress
        let startColor, endColor;
        for (let i = 0; i < colorStops.length - 1; i++) {
            if (progress >= colorStops[i].pos && progress <= colorStops[i + 1].pos) {
                startColor = colorStops[i];
                endColor = colorStops[i + 1];
                break;
            }
        }
        
        // If progress is beyond the last stop, use the last two colors
        if (!startColor) {
            startColor = colorStops[colorStops.length - 2];
            endColor = colorStops[colorStops.length - 1];
        }
        
        return [startColor.color, endColor.color];
    }
    
    function updateScrollProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        // Update progress bar width
        scrollProgress.style.width = `${progress}%`;
        
        // Update gradient colors
        const [startColor, endColor] = getGradientColors(progress);
        scrollProgress.style.background = `linear-gradient(90deg, ${startColor}, ${endColor})`;
        
        // Update glow effect color
        const glowColor = progress < 50 ? startColor : endColor;
        scrollProgress.style.boxShadow = `0 0 10px ${glowColor}80`; // 80 is for 50% opacity
    }

    window.addEventListener('scroll', updateScrollProgress);
    window.addEventListener('resize', updateScrollProgress);
    
    // Scroll reveal animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px'
    };

    const fadeInElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    fadeInElements.forEach(element => {
        observer.observe(element);
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    function highlightNavigation() {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY <= sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Initial check

    // Tech stack animation
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
    });

    // Tech stack interaction enhancements
    function addTechStackEffects() {
        // Check if device supports hover (usually indicates a non-mobile device)
        const supportsHover = window.matchMedia('(hover: hover)').matches;

        techItems.forEach((item, index) => {
            // Set initial animation delay
            item.style.animationDelay = `${index * 0.1}s`;
            
            // Only add mouse movement effect on devices that support hover
            if (supportsHover) {
                let requestId;
                
                item.addEventListener('mousemove', (e) => {
                    // Cancel any existing animation frame
                    if (requestId) {
                        cancelAnimationFrame(requestId);
                    }
                    
                    // Use requestAnimationFrame for smooth animation
                    requestId = requestAnimationFrame(() => {
                        const rect = item.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        
                        const angleX = (y - centerY) / 10;
                        const angleY = (centerX - x) / 10;
                        
                        item.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-5px)`;
                    });
                });
                
                item.addEventListener('mouseleave', () => {
                    if (requestId) {
                        cancelAnimationFrame(requestId);
                    }
                    item.style.transform = 'translateY(0)';
                });
            } else {
                // Simplified animation for mobile devices
                item.addEventListener('touchstart', () => {
                    item.style.transform = 'translateY(-5px)';
                });
                
                item.addEventListener('touchend', () => {
                    item.style.transform = 'translateY(0)';
                });
            }
        });
    }
    
    addTechStackEffects();
});
