(() => {
  const track = document.querySelector('.fact-check-grid');
  if (!track) return;

  const cards = [...track.querySelectorAll('.fact-check')];
  if (cards.length < 2) return;

  const nav = document.createElement('div');
  nav.className = 'fact-carousel-nav';
  nav.innerHTML = `
    <span aria-live="polite">1 de ${cards.length}</span>
    <div class="fact-carousel-buttons">
      <button type="button" data-direction="-1" aria-label="Fact-check anterior">←</button>
      <button type="button" data-direction="1" aria-label="Próximo fact-check">→</button>
    </div>`;
  track.insertAdjacentElement('afterend', nav);

  const counter = nav.querySelector('span');
  const buttons = [...nav.querySelectorAll('button')];
  let active = 0;

  function update(index) {
    active = Math.max(0, Math.min(cards.length - 1, index));
    counter.textContent = `${active + 1} de ${cards.length}`;
    buttons[0].disabled = active === 0;
    buttons[1].disabled = active === cards.length - 1;
  }

  function go(index) {
    update(index);
    track.scrollTo({
      left: cards[active].offsetLeft - track.offsetLeft,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => go(active + Number(button.dataset.direction)));
  });

  let frame;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => update(Math.round(track.scrollLeft / (track.clientWidth || 1))));
  }, {passive:true});

  update(0);
})();
