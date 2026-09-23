(() => {
  const exportBtn = document.getElementById('exportPdf');
  const previewBtn = document.getElementById('previewOnepageBtn');
  const modal = document.getElementById('onepageModal');
  const modalCloseBtn = document.getElementById('closeOnepageModal');
  const modalPrintBtn = document.getElementById('modalPrintBtn');
  const modalSheetClone = document.getElementById('modalSheetClone');

  // Populate preview modal sheet with exact content from executiveOnepage
  const syncModalContent = () => {
    const originalSheet = document.querySelector('#executiveOnepage .onepage-sheet');
    if (originalSheet && modalSheetClone && !modalSheetClone.hasChildNodes()) {
      modalSheetClone.innerHTML = originalSheet.innerHTML;
    }
  };

  const originalTitle = document.title;
  const pdfTitle = 'Nota Executiva PL 699-2026 — Inclusão e Valorização APPGG (1 Página)';

  const preparePrint = () => {
    document.title = pdfTitle;
    document.documentElement.classList.add('pdf-export');
  };

  const restorePrint = () => {
    document.title = originalTitle;
    document.documentElement.classList.remove('pdf-export');
    if (exportBtn) exportBtn.disabled = false;
  };

  const triggerPrint = () => {
    preparePrint();
    if (modal && modal.classList.contains('is-open')) {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
      });
    });
  };

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportBtn.disabled = true;
      triggerPrint();
    });
  }

  if (modalPrintBtn) {
    modalPrintBtn.addEventListener('click', triggerPrint);
  }

  const openModal = () => {
    syncModalContent();
    if (modal) {
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  };

  if (previewBtn) {
    previewBtn.addEventListener('click', e => {
      e.preventDefault();
      openModal();
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  window.addEventListener('beforeprint', preparePrint);
  window.addEventListener('afterprint', restorePrint);

  // Initialize modal content on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncModalContent);
  } else {
    syncModalContent();
  }
})();
