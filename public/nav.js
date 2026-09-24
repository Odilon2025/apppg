// Controle de Navegação e Seção Ativa (Páginas 1 a 8)
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

  // Centraliza o botão ativo apenas dentro da barra horizontal sem interferir na rolagem da janela
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

    // Marca imediatamente o botão como ativo
    setActiveButton(targetId);

    // Mede a altura dinâmica do cabeçalho fixo unificado no topo
    const stickyWrapper = document.querySelector('.sticky-nav-header-wrapper') || document.querySelector('header');
    const headerOffset = stickyWrapper ? stickyWrapper.offsetHeight + 10 : 120;

    const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
    const targetY = Math.max(0, elementPosition - headerOffset);

    const preferReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: targetY,
      behavior: preferReduced ? 'auto' : 'smooth'
    });

    // Permite que o scroll finalize antes de reabilitar o observer
    navTimeout = setTimeout(() => {
      isNavigating = false;
    }, 850);
  }

  // Intercepta cliques nos botões de navegação
  navButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      const href = btn.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.replace('#', '');
        scrollToSection(targetId);
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
          scrollToSection(targetId);
        }
      }
    });
  });

  // Retorno ao início clicando na logo/marca
  const brandLink = document.querySelector('header a.brand');
  if (brandLink) {
    brandLink.addEventListener('click', e => {
      e.preventDefault();
      isNavigating = true;
      if (navTimeout) clearTimeout(navTimeout);
      const preferReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: preferReduced ? 'auto' : 'smooth' });
      setActiveButton(sectionIds[0]);
      navTimeout = setTimeout(() => {
        isNavigating = false;
      }, 850);
    });
  }

  // Observer para destacar seção durante a rolagem livre
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -55% 0px',
      threshold: [0, 0.1, 0.25]
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
  window.addEventListener('scroll', () => {
    if (isNavigating) return;

    if (window.scrollY < 100) {
      setActiveButton(sectionIds[0]);
      return;
    }

    const atBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);
    if (atBottom) {
      setActiveButton(sectionIds[sectionIds.length - 1]);
    }
  }, { passive: true });

  // Barra de Progresso de Leitura Contínua (TDAH & TOC)
  const progressBar = document.getElementById('readingProgressBar');
  if (progressBar) {
    function updateProgress() {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight > 0) {
        const pct = Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100));
        progressBar.style.width = pct + '%';
      }
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }
})();
