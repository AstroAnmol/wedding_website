/* ============================================================
   Wedding Website — Anmol & Bhavini
   Interactive Animations & Scroll Effects
   ============================================================ */

(function () {
    'use strict';

    /* ──────────────────────────────────────────────
       1. FLOATING PETAL PARTICLE SYSTEM
    ────────────────────────────────────────────── */
    const canvas = document.getElementById('petals-canvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const PETAL_COUNT = 40;
    const petals = [];

    const petalColors = [
        'rgba(201, 168, 76, 0.7)',
        'rgba(232, 201, 106, 0.6)',
        'rgba(244, 237, 224, 0.5)',
        'rgba(107, 26, 42, 0.4)',
        'rgba(201, 168, 76, 0.4)',
    ];

    function randomBetween(a, b) { return a + Math.random() * (b - a); }

    function createPetal() {
        return {
            x: randomBetween(0, canvas.width),
            y: randomBetween(-200, -10),
            size: randomBetween(5, 14),
            speedY: randomBetween(0.6, 1.8),
            speedX: randomBetween(-0.6, 0.6),
            rotation: randomBetween(0, Math.PI * 2),
            rotationSpeed: randomBetween(-0.02, 0.02),
            opacity: randomBetween(0.4, 0.9),
            color: petalColors[Math.floor(Math.random() * petalColors.length)],
            wobble: randomBetween(0, Math.PI * 2),
            wobbleSpeed: randomBetween(0.01, 0.03),
            wobbleAmplitude: randomBetween(0.3, 1.2),
        };
    }

    for (let i = 0; i < PETAL_COUNT; i++) {
        const p = createPetal();
        p.y = randomBetween(0, canvas.height); // distribute on start
        petals.push(p);
    }

    function drawPetal(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        // Draw an elliptical petal shape
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
    }

    function animatePetals() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        petals.forEach(p => {
            p.wobble += p.wobbleSpeed;
            p.x += p.speedX + Math.sin(p.wobble) * p.wobbleAmplitude;
            p.y += p.speedY;
            p.rotation += p.rotationSpeed;

            drawPetal(p);

            // Reset petal when it falls off screen
            if (p.y > canvas.height + 30 || p.x < -30 || p.x > canvas.width + 30) {
                Object.assign(p, createPetal());
                p.y = -20;
            }
        });

        requestAnimationFrame(animatePetals);
    }

    animatePetals();


    /* ──────────────────────────────────────────────
       2. PARALLAX HERO BACKGROUND
    ────────────────────────────────────────────── */
    const heroBg = document.getElementById('heroBg');

    function updateParallax() {
        if (!heroBg) return;
        const scrollY = window.pageYOffset;
        // Subtle downward shift as you scroll (parallax illusion)
        heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
    }

    window.addEventListener('scroll', updateParallax, { passive: true });


    /* ──────────────────────────────────────────────
       3. NAVBAR SCROLL STATE
    ────────────────────────────────────────────── */
    const navbar = document.getElementById('navbar');

    function updateNavbar() {
        if (window.pageYOffset > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();


    /* ──────────────────────────────────────────────
       4. HAMBURGER MOBILE MENU
    ────────────────────────────────────────────── */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.style.display === 'flex';
            navLinks.style.display = isOpen ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'rgba(14,5,8,0.97)';
            navLinks.style.padding = '20px';
            navLinks.style.gap = '20px';
        });
    }


    /* ──────────────────────────────────────────────
       5. COUNTDOWN TIMER — June 22, 2026
    ────────────────────────────────────────────── */
    const weddingDate = new Date('2026-06-22T00:00:00').getTime();

    const cdDays  = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMins  = document.getElementById('cd-mins');
    const cdSecs  = document.getElementById('cd-secs');

    function pad(n) { return n < 10 ? '0' + n : String(n); }

    function updateCountdown() {
        const now = Date.now();
        const diff = weddingDate - now;

        if (diff <= 0) {
            if (cdDays) cdDays.textContent = '00';
            if (cdHours) cdHours.textContent = '00';
            if (cdMins) cdMins.textContent = '00';
            if (cdSecs) cdSecs.textContent = '00';
            return;
        }

        const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs  = Math.floor((diff % (1000 * 60)) / 1000);

        if (cdDays)  cdDays.textContent  = pad(days);
        if (cdHours) cdHours.textContent = pad(hours);
        if (cdMins)  cdMins.textContent  = pad(mins);
        if (cdSecs)  cdSecs.textContent  = pad(secs);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);


    /* ──────────────────────────────────────────────
       6. INTERSECTION OBSERVER — SCROLL REVEAL
    ────────────────────────────────────────────── */
    const revealEls = document.querySelectorAll(
        '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger reveals within a group
                const delay = entry.target.style.getPropertyValue('--delay') || '0s';
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseFloat(delay) * 1000);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px',
    });

    revealEls.forEach(el => revealObserver.observe(el));


    /* ──────────────────────────────────────────────
       7. SMOOTH SCROLL FOR ANCHOR LINKS
    ────────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile nav if open
                if (navLinks) navLinks.style.display = 'none';
            }
        });
    });


    /* ──────────────────────────────────────────────
       8. ACTIVE NAV LINK HIGHLIGHTING
    ────────────────────────────────────────────── */
    const sections = document.querySelectorAll('section[id]');
    const navLinkEls = document.querySelectorAll('.nav-link');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinkEls.forEach(link => {
                    link.classList.remove('nav-link--active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('nav-link--active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(s => sectionObserver.observe(s));


    /* ──────────────────────────────────────────────
       9. HOVER TILT EFFECT ON CARDS
    ────────────────────────────────────────────── */
    document.querySelectorAll('.event-card, .venue-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-8px) perspective(600px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });


    /* ──────────────────────────────────────────────
       10. DECORATIVE RING MOUSE PARALLAX
    ────────────────────────────────────────────── */
    const rings = document.querySelectorAll('.deco-ring');

    document.querySelector('.hero')?.addEventListener('mousemove', (e) => {
        const { innerWidth, innerHeight } = window;
        const mx = (e.clientX / innerWidth - 0.5) * 2;
        const my = (e.clientY / innerHeight - 0.5) * 2;

        rings.forEach((ring, i) => {
            const factor = (i + 1) * 6;
            ring.style.transform = `translate(calc(-50% + ${mx * factor}px), calc(-50% + ${my * factor}px))`;
        });
    });

})();
