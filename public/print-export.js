(() => {
  const button = document.getElementById('exportPdf');
  if (!button) return;

  const originalTitle = document.title;
  const pdfTitle = 'Razões para modificar o PL 699-2026 — inclusão dos APPGGs';

  const prepare = () => {
    document.title = pdfTitle;
    document.documentElement.classList.add('pdf-export');
  };

  const restore = () => {
    document.title = originalTitle;
    document.documentElement.classList.remove('pdf-export');
    button.disabled = false;
  };

  button.addEventListener('click', () => {
    button.disabled = true;
    prepare();
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
  });

  window.addEventListener('beforeprint', prepare);
  window.addEventListener('afterprint', restore);
})();
