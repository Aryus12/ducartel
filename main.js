// Navigation toggle et animations améliorées
document.addEventListener('DOMContentLoaded', function () {
  try {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');
    
    // Effet parallaxe sur le héros
    const hero = document.querySelector('.hero');
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        hero.style.backgroundPosition = `${x * 50}px ${y * 50}px`;
    });
    // Vérification des éléments requis
    if (!menuToggle || !navMenu || !navbar) {
        console.warn('[nav] Éléments de navigation manquants');
        return;
    }

    // Animation au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '-50px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.observe(entry.target);
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    document.querySelectorAll('.card, .section-title, .hero-title, .hero-subtitle').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Gestion du header au scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.style.transform = 'translateY(0)';
            navbar.style.background = 'rgba(10, 11, 14, 0.8)';
            return;
        }

        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
            navbar.style.background = 'rgba(10, 11, 14, 0.95)';
        }
        lastScroll = currentScroll;
    });

    // ensure the toggle is keyboard-focusable
    if (!menuToggle.hasAttribute('tabindex')) menuToggle.setAttribute('tabindex', '0');

    function setOpenState(isOpen) {
      if (isOpen) {
        menuToggle.classList.add('open');
        navMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
        menuToggle.setAttribute('aria-expanded', 'true');
        
        // Les animations sont maintenant gérées en CSS
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.style.opacity = ''; // Reset pour utiliser le CSS
            link.style.transform = ''; // Reset pour utiliser le CSS
        });
      } else {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    }

    function toggleMenu() {
      const isOpen = !menuToggle.classList.contains('open');
      setOpenState(isOpen);
    }

    // click toggler
    menuToggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    // keyboard accessibility: Enter / Space
    menuToggle.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        toggleMenu();
      }
    });

    // close when clicking an internal anchor inside the menu
    navMenu.addEventListener('click', function (e) {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href.startsWith('#')) {
        // give the browser a moment to scroll
        setTimeout(() => setOpenState(false), 120);
      }
    });

    // close when clicking outside the open menu
    document.addEventListener('click', function (e) {
      if (!navMenu.classList.contains('open')) return;
      // if click is inside nav container, ignore
      if (e.target.closest('.nav-container')) return;
      setOpenState(false);
    });

    // close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.code === 'Escape') {
        if (navMenu.classList.contains('open')) setOpenState(false);
      }
    });

    console.debug('[nav] toggle initialisé.');
  } catch (err) {
    console.error('[nav] Erreur lors de l\'initialisation du toggle :', err);
  }
});