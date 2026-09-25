// Controle de Navegação e Seção Ativa (Páginas 1 a 8) - Quiet Luxury & Fluid Mobile
(function initSectionNavigation() {
  const navButtons = document.querySelectorAll('.nav-section-btn');
  const navContainer = document.querySelector('.section-nav-strip');
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

  let isNavigating = false;
  let navTimeout = null;

  // Centraliza o botão ativo dentro da barra horizontal sem interferir na rolagem vertical da página
  function centerNavButton(btn) {
    if (!navContainer || !btn) return;
    const btnRect = btn.getBoundingClientRect();
    const navRect = navContainer.getBoundingClientRect();
    const currentScroll = navContainer.scrollLeft;
    const targetScrollLeft = currentScroll + (btnRect.left - navRect.left) - (navContainer.clientWidth / 2) + (btn.offsetWidth / 2);

    const preferReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    navContainer.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: preferReduced ? 'auto' : 'smooth'
    });
  }

  function setActiveButton(activeId) {
    let activeBtn = null;
    navButtons.forEach(btn => {
      const target = btn.getAttribute('href')?.replace('#', '');
      if (target === activeId) {
        btn.classList.add('active');
        btn.setAttribute('aria-current', 'true');
        activeBtn = btn;
      } else {
        btn.classList.remove('active');
        btn.removeAttribute('aria-current');
      }
    });

    if (activeBtn) {
      centerNavButton(activeBtn);
    }
  }

  function scrollToSection(targetId) {
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    isNavigating = true;
    if (navTimeout) clearTimeout(navTimeout);

    // Marca imediatamente o botão correspondente como ativo
    setActiveButton(targetId);

    const preferReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Rolagem nativa suave respeitando scroll-margin-top configurado no CSS
    targetEl.scrollIntoView({
      behavior: preferReduced ? 'auto' : 'smooth',
      block: 'start'
    });

    // Mantém isNavigating ativo durante a transição suave para evitar oscilações no IntersectionObserver
    navTimeout = setTimeout(() => {
      isNavigating = false;
    }, 950);
  }

  // Intercepta cliques nos botões de navegação no topo fixo
  navButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      const href = btn.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        e.stopPropagation();
        const targetId = href.replace('#', '');
        scrollToSection(targetId);
        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', '#' + targetId);
        }
      }
    });
  });

  // Intercepta botões internos de transição entre seções (.btn-deep-dive)
  document.querySelectorAll('a.btn-deep-dive').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.replace('#', '');
        if (sectionIds.includes(targetId)) {
          e.preventDefault();
          e.stopPropagation();
          scrollToSection(targetId);
          if (window.history && window.history.pushState) {
            window.history.pushState(null, '', '#' + targetId);
          }
        }
      }
    });
  });

  // Retorno ao início clicando na logo/marca
  const brandLink = document.querySelector('header a.brand');
  if (brandLink) {
    brandLink.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      isNavigating = true;
      if (navTimeout) clearTimeout(navTimeout);
      const preferReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: preferReduced ? 'auto' : 'smooth' });
      setActiveButton(sectionIds[0]);
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', '#inicio');
      }
      navTimeout = setTimeout(() => {
        isNavigating = false;
      }, 900);
    });
  }

  // Observer para destacar seção durante a rolagem livre do leitor
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -45% 0px',
      threshold: [0, 0.15]
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      if (isNavigating) return;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const navTarget = entry.target.id === 'evolucao' ? 'comparacao-salarial' : entry.target.id;
          setActiveButton(navTarget);
        }
      });
    }, observerOptions);

    [...sectionIds, 'evolucao'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        sectionObserver.observe(el);
      }
    });
  }

  // Listener para extremos (topo e rodapé da página)
  let scrollThrottle = false;
  window.addEventListener('scroll', () => {
    if (isNavigating || scrollThrottle) return;

    scrollThrottle = true;
    window.requestAnimationFrame(() => {
      scrollThrottle = false;
      if (isNavigating) return;

      if (window.scrollY < 80) {
        setActiveButton(sectionIds[0]);
        return;
      }

      const atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 70);
      if (atBottom) {
        setActiveButton(sectionIds[sectionIds.length - 1]);
      }
    });
  }, { passive: true });

  // Barra de Progresso de Leitura Contínua via GPU (scaleX) - Máxima Fluidez no Smartphone
  const progressBar = document.getElementById('readingProgressBar');
  if (progressBar) {
    let progressTicking = false;
    function updateProgress() {
      if (progressTicking) return;
      progressTicking = true;
      window.requestAnimationFrame(() => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollableHeight > 0) {
          const ratio = Math.min(1, Math.max(0, window.scrollY / scrollableHeight));
          progressBar.style.transform = 'scaleX(' + ratio + ')';
        }
        progressTicking = false;
      });
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }
})();
