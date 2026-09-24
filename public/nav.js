// Controle de Navegação e Seção Ativa (Páginas 1 a 8)
(function initSectionNavigation() {
  const navButtons = document.querySelectorAll('.nav-section-btn');
  const sectionIds = [
    'comparacao-salarial',
    'por-que-equiparar',
    'informacoes-enganosas',
    'impacto-fiscal',
    'entregas-appggs',
    'dados-evasao',
    'quem-apoia',
    'fundamento-juridico'
  ];

  function setActiveButton(activeId) {
    navButtons.forEach(btn => {
      const target = btn.getAttribute('href')?.replace('#', '');
      if (target === activeId) {
        btn.classList.add('active');
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Intercept smooth clicks on navigation buttons
  navButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      const href = btn.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          const yOffset = -110; // offset for sticky header + nav bar
          const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          setActiveButton(href.replace('#', ''));
        }
      }
    });
  });

  // IntersectionObserver to dynamically highlight section when scrolling
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -55% 0px',
      threshold: [0, 0.1, 0.2]
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveButton(entry.target.id);
        }
      });
    }, observerOptions);

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        sectionObserver.observe(el);
      }
    });
  } else {
    // Fallback on scroll
    window.addEventListener('scroll', () => {
      let currentSection = sectionIds[0];
      const scrollPos = window.scrollY + 130;
      sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          currentSection = id;
        }
      });
      setActiveButton(currentSection);
    }, { passive: true });
  }
})();
