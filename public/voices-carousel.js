(() => {
  const carousel = document.getElementById('voicesCarousel');
  const prev = document.getElementById('voicesPrev');
  const next = document.getElementById('voicesNext');
  const position = document.getElementById('voicesPosition');
  if (!carousel || !prev || !next || !position) return;
  const cards = [...carousel.querySelectorAll('.voice-card')];
  const current = () => cards.reduce((best, card, index) =>
    Math.abs(card.offsetLeft - carousel.scrollLeft) < Math.abs(cards[best].offsetLeft - carousel.scrollLeft) ? index : best, 0);
  const update = () => {
    const index = current();
    position.textContent = `${index + 1} de ${cards.length}`;
    prev.disabled = index === 0;
    next.disabled = index === cards.length - 1;
  };
  const go = delta => cards[Math.max(0, Math.min(cards.length - 1, current() + delta))].scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'});
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  carousel.addEventListener('scroll', () => requestAnimationFrame(update), {passive:true});
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); go(1); }
  });
  update();
})();
