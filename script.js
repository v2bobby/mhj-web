// ============================================
// Mayhaj Farm — Premium Agro-Tech Landing
// Production-quality interactions & micro-animations
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ========== MOBILE NAV ==========
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6h12v12" />
                    </svg>
                `;
            } else {
                mobileMenu.classList.add('hidden');
                mobileBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                `;
            }
        });
        
        // Close mobile menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                `;
            });
        });
    }

    // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const navHeight = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== SCROLL REVEAL ANIMATIONS ==========
    const revealElements = document.querySelectorAll('.card, .feature-card, .process-step');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = `${Math.random() * 120 + 40}ms`;
                    entry.target.classList.add('reveal', 'visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });
        
        revealElements.forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    } else {
        // Fallback: show all immediately
        revealElements.forEach(el => el.classList.add('visible'));
    }

    // ========== WAITLIST FORM HANDLING ==========
    const form = document.getElementById('waitlist-form');
    const successState = document.getElementById('success-state');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
    const submitText = document.getElementById('submit-text');
    const submitSpinner = document.getElementById('submit-spinner');
    
    if (form && successState) {
        // Check if already submitted (persisted)
        const alreadyJoined = localStorage.getItem('mayhaj_waitlist_joined');
        if (alreadyJoined) {
            showAlreadyJoinedState();
        }
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!submitBtn || !submitText || !submitSpinner) return;
            
            // Disable form
            submitBtn.disabled = true;
            submitText.textContent = 'PROCESSING...';
            submitSpinner.classList.remove('hidden');
            submitSpinner.classList.add('inline-flex');
            
            // Simulate realistic processing (network feel)
            await new Promise(resolve => setTimeout(resolve, 1250));
            
            // Collect form data (for future backend integration)
            const formData = {
                name: document.getElementById('full-name').value.trim(),
                email: document.getElementById('email').value.trim(),
                interest: document.getElementById('interest').value,
                message: document.getElementById('message').value.trim(),
                timestamp: new Date().toISOString(),
                source: 'mayhaj-farm-landing-2026'
            };
            
            // In production: POST to backend / email service here
            console.log('%c[Mayhaj Farm] Waitlist submission ready for backend:', 'color:#10B981', formData);
            
            // Success UI
            form.style.transition = 'all 0.3s ease';
            form.style.opacity = '0';
            form.style.transform = 'translateY(12px)';
            
            setTimeout(() => {
                form.style.display = 'none';
                successState.classList.remove('hidden');
                successState.style.display = 'block';
                
                // Persist in localStorage
                localStorage.setItem('mayhaj_waitlist_joined', 'true');
                localStorage.setItem('mayhaj_waitlist_email', formData.email);
                
                // Optional: subtle confetti burst
                triggerConfetti();
            }, 280);
        });
    }
    
    function showAlreadyJoinedState() {
        if (!form || !successState) return;
        
        form.style.display = 'none';
        successState.classList.remove('hidden');
        successState.style.display = 'block';
        
        // Update success message slightly
        const heading = successState.querySelector('h3');
        if (heading) heading.textContent = "You're already on the list.";
    }
    
    // Expose reset function globally for the "submit another" button
    window.resetForm = function() {
        if (!form || !successState) return;
        
        successState.style.display = 'none';
        form.style.display = 'block';
        form.style.opacity = '1';
        form.style.transform = 'translateY(0)';
        form.reset();
        
        if (submitBtn) {
            submitBtn.disabled = false;
            if (submitText) submitText.textContent = 'RESERVE MY PIONEER SPOT';
            if (submitSpinner) {
                submitSpinner.classList.add('hidden');
                submitSpinner.classList.remove('inline-flex');
            }
        }
        
        // Allow re-submission (remove persistence for demo purposes)
        // In real app you might keep it or allow multiple entries
        localStorage.removeItem('mayhaj_waitlist_joined');
    };

    // ========== SUBTLE CONFETTI (Premium micro-interaction) ==========
    function triggerConfetti() {
        const colors = ['#10B981', '#34D399', '#059669'];
        const particleCount = 42;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * window.innerWidth}px;
                    top: -12px;
                    width: ${Math.random() * 7 + 5}px;
                    height: ${Math.random() * 7 + 5}px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: ${Math.random() > 0.6 ? '50%' : '2px'};
                    pointer-events: none;
                    z-index: 9999;
                    opacity: ${Math.random() * 0.6 + 0.5};
                `;
                
                document.body.appendChild(particle);
                
                const duration = Math.random() * 2800 + 2400;
                const angle = Math.random() * 70 + 55;
                const velocity = Math.random() * 1.8 + 2.1;
                
                let start = null;
                
                function animate(timestamp) {
                    if (!start) start = timestamp;
                    const progress = (timestamp - start) / duration;
                    
                    if (progress < 1) {
                        const y = progress * (window.innerHeight * 1.1);
                        const x = Math.sin(progress * 4) * 28;
                        particle.style.transform = `translate(${x}px, ${y}px)`;
                        particle.style.opacity = (1 - progress * 0.9).toString();
                        requestAnimationFrame(animate);
                    } else {
                        particle.remove();
                    }
                }
                
                requestAnimationFrame(animate);
            }, i * 1.8);
        }
    }

    // ========== NAVBAR SCROLL EFFECT (subtle) ==========
    const nav = document.querySelector('.nav');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        if (!nav) return;
        
        if (window.scrollY > 40) {
            nav.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.25)';
        } else {
            nav.style.boxShadow = 'none';
        }
        
        // Hide nav on scroll down, show on scroll up (premium feel)
        if (window.scrollY > lastScrollY && window.scrollY > 180) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;
    }, { passive: true });

    // ========== KEYBOARD ACCESSIBILITY ==========
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement.tagName === 'BODY') {
            e.preventDefault();
            const waitlistSection = document.getElementById('waitlist');
            if (waitlistSection) {
                waitlistSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => {
                    const nameInput = document.getElementById('full-name');
                    if (nameInput) nameInput.focus();
                }, 650);
            }
        }
    });

    // Easter egg: Press "?" to show a small vision quote
    let konamiBuffer = '';
    document.addEventListener('keypress', (e) => {
        konamiBuffer += e.key.toLowerCase();
        if (konamiBuffer.length > 8) konamiBuffer = konamiBuffer.slice(-8);
        
        if (konamiBuffer.includes('?vision')) {
            konamiBuffer = '';
            const quote = document.createElement('div');
            quote.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);padding:14px 26px;border-radius:9999px;font-size:12px;letter-spacing:1.5px;color:#34D399;white-space:nowrap;z-index:99999;';
            quote.innerHTML = '“We are not just producers. We are resource managers.”';
            document.body.appendChild(quote);
            
            setTimeout(() => {
                quote.style.transition = 'all 420ms ease';
                quote.style.opacity = '0';
                setTimeout(() => quote.remove(), 420);
            }, 2650);
        }
    });

    // ========== CONSOLE BRANDING (for developers & curious visitors) ==========
    console.log('%c[Mayhaj Farm] Premium agro-tech landing initialized. Built with intention.', 'color:#64748B; font-size:9px');
    console.log('%cClosed-loop systems • Lagos 2026', 'color:#10B981; font-size:9px; font-family:monospace');
});

// Optional: Expose a small public API for future extensibility
window.MayhajFarm = {
    version: '1.0.0',
    triggerWaitlist: () => {
        const el = document.getElementById('waitlist');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};