(() => {
  const grid = document.querySelector('.risk-grid');
  const filters = document.querySelector('.project-filters');
  const status = document.getElementById('projectFilterStatus');
  if (!grid || !filters || !status) return;

  const groups = {
    highlights: ['SEME', 'SMDET', 'SME', 'SMS ', 'SEPE', 'SF '],
    social: ['SEME', 'SME', 'SMS ', 'SEPE', 'SEHAB', 'SMC '],
    growth: ['SMDET', 'SMT ', 'SIURB', 'SF ', 'SECLIMA', 'SEDP', 'SVMA'],
    governance: ['SEGES', 'SEDP', 'CGM', 'SMSUB', 'PGM']
  };
  const labels = {
    highlights: 'Iniciativas de Alto Impacto Sistêmico',
    social: 'Políticas Sociais & Cidadania (educação, saúde pública, assistência social e esporte)',
    growth: 'Infraestrutura Urbana & Sustentabilidade (mobilidade, drenagem, habitação e clima)',
    governance: 'Gestão Estratégica & Finanças (planejamento, compras públicas, inovação e controle)',
    all: 'Todas as entregas públicas prioritárias para a Cidade de São Paulo'
  };
  const cards = [...grid.querySelectorAll('.risk-card')];
  const divider = grid.querySelector('.risk-grid-break');

  function codeFor(card) {
    return card.querySelector('header small')?.textContent.trim() || '';
  }

  function apply(filter) {
    let visible = 0;
    cards.forEach(card => {
      const show = filter === 'all' || groups[filter].some(code => codeFor(card).startsWith(code));
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (divider) divider.hidden = filter !== 'all';
    filters.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
    status.textContent = labels[filter];
    grid.scrollTo({left:0, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  }

  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (button) apply(button.dataset.filter);
  });
  apply('all');
})();
