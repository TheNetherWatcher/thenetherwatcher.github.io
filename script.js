// Modern Portfolio JavaScript with Particle Effects and Animations
class ModernPortfolio {
    constructor() {
        this.particles = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        
        // Typing animation properties
        this.typingTexts = [
            "Software Engineer @ Metzev",
            "AI/ML Research Engineer",
            "Full Stack Developer",
            "Computer Vision Expert",
            "Published Researcher",
            "Problem Solver"
        ];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typingSpeed = 100;
        this.deletingSpeed = 50;
        this.pauseTime = 2000;
        
        this.init();
    }

    init() {
        this.showLoadingScreen();
        this.setupCanvas();
        this.setupEventListeners();
        this.initParticles();
        this.startAnimation();
        this.initTypingAnimation();
        this.initScrollAnimations();
        this.initSmoothScroll();
        this.initMobileMenu();
        
        // Hide loading screen after initialization
        setTimeout(() => {
            this.hideLoadingScreen();
        }, 3000);
    }

    // Loading Screen
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        // Start page animations
        this.animatePageLoad();
    }

    animatePageLoad() {
        // Animate elements on page load
        const animatedElements = document.querySelectorAll('.glass-card, .timeline-item, .project-card, .skill-category');
        animatedElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in');
            }, index * 100);
        });
    }

    // Particle System
    setupCanvas() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }

    resizeCanvas() {
        if (!this.canvas) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initParticles() {
        if (!this.canvas) return;
        
        const particleCount = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 20000));
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.6 + 0.2,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    updateParticles() {
        if (!this.particles.length) return;
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }

            // Mouse interaction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150 * 0.02;
                particle.vx += dx * force * 0.01;
                particle.vy += dy * force * 0.01;
            }

            // Pulse effect
            particle.pulsePhase += particle.pulseSpeed;
            particle.opacity = 0.2 + Math.sin(particle.pulsePhase) * 0.3;

            // Speed dampening
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        });
    }

    drawParticles() {
        if (!this.ctx || !this.particles.length) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.drawConnections();
        
        // Draw particles
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            
            // Create gradient for particles
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.radius * 3
            );
            gradient.addColorStop(0, `rgba(255, 10, 10, ${particle.opacity})`);
            gradient.addColorStop(1, `rgba(255, 10, 10, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });
    }

    drawConnections() {
        if (!this.particles.length) return;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const particle1 = this.particles[i];
                const particle2 = this.particles[j];
                
                const dx = particle1.x - particle2.x;
                const dy = particle1.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = (120 - distance) / 120 * 0.3;
                    
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 10, 10, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(particle1.x, particle1.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    startAnimation() {
        const animate = () => {
            this.updateParticles();
            this.drawParticles();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    // Typing Animation
    initTypingAnimation() {
        this.typeText();
    }

    typeText() {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;

        const currentText = this.typingTexts[this.currentTextIndex];
        
        if (!this.isDeleting) {
            // Typing
            typingElement.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentText.length) {
                // Finished typing, start pause
                setTimeout(() => {
                    this.isDeleting = true;
                    this.typeText();
                }, this.pauseTime);
                return;
            }
            
            setTimeout(() => this.typeText(), this.typingSpeed);
        } else {
            // Deleting
            typingElement.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.typingTexts.length;
            }
            
            setTimeout(() => this.typeText(), this.deletingSpeed);
        }
    }

    // Scroll Animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('slide-up');
                    
                    // Special animations for different elements
                    if (entry.target.classList.contains('skill-tag')) {
                        this.animateSkillTags(entry.target.parentElement);
                    } else if (entry.target.classList.contains('stat-item')) {
                        this.animateCounters(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        const elementsToObserve = document.querySelectorAll(
            '.timeline-item, .project-card, .skill-category, .achievement-item, .stat-item, .focus-item'
        );
        
        elementsToObserve.forEach(el => {
            observer.observe(el);
        });
    }

    animateSkillTags(container) {
        const tags = container.querySelectorAll('.skill-tag');
        tags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.transform = 'translateY(0) scale(1)';
                tag.style.opacity = '1';
            }, index * 50);
        });
    }

    animateCounters(statItem) {
        const numberElement = statItem.querySelector('.stat-number');
        if (!numberElement) return;
        
        const finalNumber = numberElement.textContent;
        const numericValue = parseFloat(finalNumber.replace(/[^0-9.]/g, ''));
        const suffix = finalNumber.replace(/[0-9.]/g, '');
        
        let currentNumber = 0;
        const increment = numericValue / 50;
        
        const counter = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= numericValue) {
                currentNumber = numericValue;
                clearInterval(counter);
            }
            
            numberElement.textContent = Math.floor(currentNumber) + suffix;
        }, 30);
    }

    // Smooth Scroll
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    this.updateActiveNavLink(link);
                }
            });
        });

        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavOnScroll();
            this.handleScrollEffects();
        });
    }

    updateActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        if (activeLink.classList.contains('nav-link')) {
            activeLink.classList.add('active');
        }
    }

    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    handleScrollEffects() {
        const navbar = document.querySelector('.navbar');
        const scrolled = window.scrollY > 100;
        
        if (scrolled) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.9)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
    }

    // Mobile Menu
    initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
            
            // Close menu when clicking on a link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Mouse tracking for particles
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Resize handling
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.initParticles();
        });

        // Interactive effects
        this.initInteractiveEffects();

        // Page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                }
            } else {
                this.startAnimation();
            }
        });
    }

    initInteractiveEffects() {
        // Skill tag hover effects
        document.querySelectorAll('.skill-tag').forEach(tag => {
            tag.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e);
            });
        });

        // Button hover effects
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                this.createGlowEffect(e.target);
            });
            
            btn.addEventListener('mouseleave', (e) => {
                this.removeGlowEffect(e.target);
            });
        });

        // Social link effects
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('click', (e) => {
                this.createClickEffect(e);
            });
        });

        // Project card hover effects
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    createRippleEffect(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 10, 10, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    createGlowEffect(element) {
        element.style.boxShadow = '0 0 30px rgba(255, 10, 10, 0.6)';
    }

    removeGlowEffect(element) {
        element.style.boxShadow = '';
    }

    createClickEffect(e) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: #ff0a0a;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            animation: clickExpand 0.8s ease-out forwards;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 800);
    }

    // Utility Methods
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.resizeCanvas);
        document.removeEventListener('mousemove', this.updateMouse);
    }
}

// Additional CSS animations via JavaScript
const additionalStyles = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes clickExpand {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(20);
            opacity: 0;
        }
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(10, 10, 10, 0.95);
        backdrop-filter: blur(20px);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding: 2rem;
        gap: 1rem;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .skill-tag {
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    @media (max-width: 1024px) {
        .nav-menu {
            display: none;
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new ModernPortfolio();
    
    // Add some Easter eggs
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.keyCode);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
            // Easter egg effect
            document.body.style.animation = 'rainbow 2s ease-in-out';
            
            const message = document.createElement('div');
            message.textContent = '🚀 You found the secret! Welcome to the Matrix!';
            message.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 10, 10, 0.9);
                color: white;
                padding: 2rem;
                border-radius: 12px;
                font-size: 1.2rem;
                font-weight: bold;
                z-index: 10000;
                animation: scaleIn 0.5s ease-out;
            `;
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                document.body.style.animation = '';
                message.remove();
            }, 3000);
            
            konamiCode = [];
        }
    });
});

// Add rainbow animation for easter egg
const rainbowStyle = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;

const rainbowStyleSheet = document.createElement('style');
rainbowStyleSheet.textContent = rainbowStyle;
document.head.appendChild(rainbowStyleSheet);