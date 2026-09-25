/**
 * EVOLUÇÃO SALARIAL POR NÍVEL (PL 699/2026 × APPGG × AMCI + GEP)
 * Gráfico interativo e fiel à Página 2 da Nota Executiva APOGESP
 */
(() => {
  const APPGG_DATA = [
    13815.84, 15197.43, 15577.36, 15966.79, 16365.96, 16775.11,
    18788.14, 19257.84, 19739.29, 20232.76, 20738.60, 22875.96,
    23447.85, 24034.05, 24634.90
  ];

  const AMCI_DATA = [
    21527.50, 23680.25, 24745.86, 25859.43, 27023.10, 28239.14,
    31063.05, 32150.26, 33275.52, 34440.16, 35645.57, 37427.85,
    37989.26, 38559.10, 38751.90
  ];

  const GEP_VAL = 1998.73;
  const AMCI_GEP_DATA = AMCI_DATA.map(v => v + GEP_VAL);

  const AMCI_DAY1 = 21527.50;
  const AMCI_GEP_DAY1 = 23526.23;

  const fmtBrl = val => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  function initChart() {
    const chartContainer = document.getElementById('evolutionChartSvgWrap');
    if (!chartContainer) return;

    const width = 1000;
    const height = 460;
    const padding = { top: 40, right: 130, bottom: 50, left: 75 };

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const minVal = 10000;
    const maxVal = 44000;

    const getX = index => padding.left + (index / 14) * chartW;
    const getY = val => padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

    // SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('class', 'chart-svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Gráfico de evolução salarial por nível comparando APPGG, AMCI e AMCI com GEP');

    // Defs for gradients & filters
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.15" />
      </filter>
    `;
    svg.appendChild(defs);

    // Y Axis Gridlines and Labels
    const yGridValues = [10000, 15000, 20000, 25000, 30000, 35000, 40000];
    yGridValues.forEach(val => {
      const y = getY(val);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', padding.left);
      line.setAttribute('x2', width - padding.right);
      line.setAttribute('y1', y);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', '#e2e8f0');
      line.setAttribute('stroke-dasharray', val === 20000 ? 'none' : '3 3');
      line.setAttribute('stroke-width', val === 20000 ? '1.5' : '1');
      svg.appendChild(line);

      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', padding.left - 12);
      label.setAttribute('y', y + 4);
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('font-size', '11');
      label.setAttribute('font-family', 'sans-serif');
      label.setAttribute('fill', '#64748b');
      label.textContent = `R$ ${val / 1000}k`;
      svg.appendChild(label);
    });

    // Level Tiers Background shading (Nível I: 1-6, Nível II: 7-11, Nível III: 12-15)
    const tiers = [
      { start: 0, end: 5, label: 'NÍVEL I (Refs. 1 a 6)' },
      { start: 6, end: 10, label: 'NÍVEL II (Refs. 7 a 11)' },
      { start: 11, end: 14, label: 'NÍVEL III (Refs. 12 a 15)' }
    ];

    tiers.forEach((t, i) => {
      const x1 = getX(t.start);
      const x2 = getX(t.end);
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x1 - (i === 0 ? 15 : 0));
      rect.setAttribute('y', padding.top);
      rect.setAttribute('width', (x2 - x1) + (i === 0 ? 15 : 0) + (i === 2 ? 15 : 0));
      rect.setAttribute('height', chartH);
      rect.setAttribute('fill', i % 2 === 0 ? 'rgba(241, 245, 249, 0.45)' : 'rgba(255, 255, 255, 0.2)');
      svg.appendChild(rect);

      // Tier label at bottom
      const tierText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      tierText.setAttribute('x', (x1 + x2) / 2);
      tierText.setAttribute('y', padding.top + 16);
      tierText.setAttribute('text-anchor', 'middle');
      tierText.setAttribute('font-size', '10');
      tierText.setAttribute('font-weight', 'bold');
      tierText.setAttribute('fill', '#94a3b8');
      tierText.setAttribute('letter-spacing', '0.05em');
      tierText.textContent = t.label;
      svg.appendChild(tierText);
    });

    // X Axis Reference Labels (1 to 15)
    for (let i = 0; i < 15; i++) {
      const x = getX(i);
      const isKeyRef = [0, 10, 11, 13, 14].includes(i);

      // Tick line
      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.setAttribute('x1', x);
      tick.setAttribute('x2', x);
      tick.setAttribute('y1', height - padding.bottom);
      tick.setAttribute('y2', height - padding.bottom + 6);
      tick.setAttribute('stroke', isKeyRef ? '#0f172a' : '#cbd5e1');
      tick.setAttribute('stroke-width', isKeyRef ? '2' : '1');
      svg.appendChild(tick);

      // Number Label
      const numLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      numLabel.setAttribute('x', x);
      numLabel.setAttribute('y', height - padding.bottom + 20);
      numLabel.setAttribute('text-anchor', 'middle');
      numLabel.setAttribute('font-size', isKeyRef ? '13' : '11');
      numLabel.setAttribute('font-weight', isKeyRef ? 'bold' : 'normal');
      numLabel.setAttribute('fill', isKeyRef ? '#0f172a' : '#64748b');
      numLabel.textContent = i + 1;
      svg.appendChild(numLabel);
    }

    // X Axis Label
    const xAxisTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xAxisTitle.setAttribute('x', padding.left + chartW / 2);
    xAxisTitle.setAttribute('y', height - 10);
    xAxisTitle.setAttribute('text-anchor', 'middle');
    xAxisTitle.setAttribute('font-size', '12');
    xAxisTitle.setAttribute('font-weight', '700');
    xAxisTitle.setAttribute('letter-spacing', '0.08em');
    xAxisTitle.setAttribute('fill', '#475569');
    xAxisTitle.textContent = 'NÍVEL DA CARREIRA (REFERÊNCIAS 1 A 15)';
    svg.appendChild(xAxisTitle);

    // 1. Horizontal Reference: AMCI 1º Dia (R$ 21.527,50)
    const yDay1 = getY(AMCI_DAY1);
    const lineDay1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    lineDay1.setAttribute('x1', padding.left);
    lineDay1.setAttribute('x2', width - padding.right + 15);
    lineDay1.setAttribute('y1', yDay1);
    lineDay1.setAttribute('y2', yDay1);
    lineDay1.setAttribute('stroke', '#b38a4a');
    lineDay1.setAttribute('stroke-width', '1.8');
    lineDay1.setAttribute('stroke-dasharray', '5 4');
    svg.appendChild(lineDay1);

    const textDay1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textDay1.setAttribute('x', width - padding.right + 22);
    textDay1.setAttribute('y', yDay1 - 3);
    textDay1.setAttribute('font-size', '10');
    textDay1.setAttribute('font-weight', 'bold');
    textDay1.setAttribute('fill', '#8c6d48');
    textDay1.textContent = 'AMCI 1º dia (básico)';
    svg.appendChild(textDay1);

    const valDay1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valDay1.setAttribute('x', width - padding.right + 22);
    valDay1.setAttribute('y', yDay1 + 10);
    valDay1.setAttribute('font-size', '10');
    valDay1.setAttribute('font-weight', 'bold');
    valDay1.setAttribute('fill', '#8c6d48');
    valDay1.textContent = 'R$ 21.527,50';
    svg.appendChild(valDay1);

    // 2. Horizontal Reference: AMCI + GEP 1º Dia (R$ 23.526,23)
    const yGepDay1 = getY(AMCI_GEP_DAY1);
    const lineGepDay1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    lineGepDay1.setAttribute('x1', padding.left);
    lineGepDay1.setAttribute('x2', width - padding.right + 15);
    lineGepDay1.setAttribute('y1', yGepDay1);
    lineGepDay1.setAttribute('y2', yGepDay1);
    lineGepDay1.setAttribute('stroke', '#42617f');
    lineGepDay1.setAttribute('stroke-width', '1.8');
    lineGepDay1.setAttribute('stroke-dasharray', '5 4');
    svg.appendChild(lineGepDay1);

    const textGepDay1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textGepDay1.setAttribute('x', width - padding.right + 22);
    textGepDay1.setAttribute('y', yGepDay1 - 3);
    textGepDay1.setAttribute('font-size', '10');
    textGepDay1.setAttribute('font-weight', 'bold');
    textGepDay1.setAttribute('fill', '#324e68');
    textGepDay1.textContent = 'AMCI + GEP 1º dia';
    svg.appendChild(textGepDay1);

    const valGepDay1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    valGepDay1.setAttribute('x', width - padding.right + 22);
    valGepDay1.setAttribute('y', yGepDay1 + 10);
    valGepDay1.setAttribute('font-size', '10');
    valGepDay1.setAttribute('font-weight', 'bold');
    valGepDay1.setAttribute('fill', '#324e68');
    valGepDay1.textContent = 'R$ 23.525,50';
    svg.appendChild(valGepDay1);

    // Function to generate SVG path string
    function makePath(data) {
      return data.map((val, i) => {
        const x = getX(i);
        const y = getY(val);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' ');
    }

    // Curve 1: APPGG (Deep Tailored Navy)
    const pathAppgg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathAppgg.setAttribute('d', makePath(APPGG_DATA));
    pathAppgg.setAttribute('fill', 'none');
    pathAppgg.setAttribute('stroke', '#122338');
    pathAppgg.setAttribute('stroke-width', '3.2');
    pathAppgg.setAttribute('stroke-linejoin', 'round');
    pathAppgg.setAttribute('stroke-linecap', 'round');
    svg.appendChild(pathAppgg);

    // Curve 2: AMCI (Curatorial Wine)
    const pathAmci = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathAmci.setAttribute('d', makePath(AMCI_DATA));
    pathAmci.setAttribute('fill', 'none');
    pathAmci.setAttribute('stroke', '#8f2428');
    pathAmci.setAttribute('stroke-width', '3.2');
    pathAmci.setAttribute('stroke-linejoin', 'round');
    pathAmci.setAttribute('stroke-linecap', 'round');
    svg.appendChild(pathAmci);

    // Curve 3: AMCI + GEP (Warm Bronze)
    const pathAmciGep = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathAmciGep.setAttribute('d', makePath(AMCI_GEP_DATA));
    pathAmciGep.setAttribute('fill', 'none');
    pathAmciGep.setAttribute('stroke', '#995d2c');
    pathAmciGep.setAttribute('stroke-width', '3.2');
    pathAmciGep.setAttribute('stroke-linejoin', 'round');
    pathAmciGep.setAttribute('stroke-linecap', 'round');
    svg.appendChild(pathAmciGep);

    // Tooltip Element
    let tooltip = document.getElementById('chartTooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'chartTooltip';
      tooltip.className = 'chart-tooltip-box';
      tooltip.style.display = 'none';
      chartContainer.appendChild(tooltip);
    }

    // Points on the curves
    function drawPoints(data, color, typeName) {
      data.forEach((val, i) => {
        const x = getX(i);
        const y = getY(val);
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', [0, 10, 11, 13, 14].includes(i) ? '6' : '4');
        circle.setAttribute('fill', '#ffffff');
        circle.setAttribute('stroke', color);
        circle.setAttribute('stroke-width', '2.5');
        circle.style.cursor = 'pointer';
        circle.style.transition = 'all 0.15s ease';

        // Hover events
        circle.addEventListener('mouseenter', () => {
          circle.setAttribute('r', '8');
          circle.setAttribute('fill', color);
          circle.setAttribute('stroke', '#ffffff');

          const appVal = APPGG_DATA[i];
          const amciVal = AMCI_DATA[i];
          const gepVal = AMCI_GEP_DATA[i];
          const diffVal = amciVal - appVal;
          const diffPct = ((diffVal / appVal) * 100).toFixed(1);

          tooltip.innerHTML = `
            <b>Referência ${i + 1} (${i < 6 ? 'Nível I' : i < 11 ? 'Nível II' : 'Nível III'})</b>
            <div>APPGG (Atual): <strong>${fmtBrl(appVal)}</strong></div>
            <div>AMCI (PL 699/2026): <strong>${fmtBrl(amciVal)}</strong></div>
            <div>AMCI + GEP: <strong>${fmtBrl(gepVal)}</strong></div>
            <div style="margin-top:4px;border-top:1px dashed rgba(255,255,255,0.3);padding-top:4px;color:#fca5a5;">
              Diferença: +${diffPct}% (+${fmtBrl(diffVal)}/mês)
            </div>
          `;
          tooltip.style.display = 'block';
        });

        circle.addEventListener('mouseleave', () => {
          circle.setAttribute('r', [0, 10, 11, 13, 14].includes(i) ? '6' : '4');
          circle.setAttribute('fill', '#ffffff');
          circle.setAttribute('stroke', color);
        });

        svg.appendChild(circle);
      });
    }

    drawPoints(APPGG_DATA, '#122338', 'APPGG');
    drawPoints(AMCI_DATA, '#8f2428', 'AMCI');
    drawPoints(AMCI_GEP_DATA, '#995d2c', 'AMCI + GEP');

    // Add Highlight Badges directly on the SVG
    // Badge 1: Nível 12 (Cruzamento AMCI 1º Dia)
    const x12 = getX(11); // index 11 is ref 12
    const y12 = getY(APPGG_DATA[11]);
    const badge12 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    badge12.innerHTML = `
      <rect x="${x12 - 100}" y="${y12 + 12}" width="200" height="38" rx="4" fill="#1c3e34" filter="url(#shadow)"/>
      <text x="${x12}" y="${y12 + 27}" text-anchor="middle" font-size="10" font-weight="bold" fill="#bbf7d0">✓ Nível 12 · Alcança o piso AMCI</text>
      <text x="${x12}" y="${y12 + 42}" text-anchor="middle" font-size="9" fill="#ffffff">R$ 22.875,96 > R$ 21.527,50</text>
    `;
    svg.appendChild(badge12);

    // Badge 2: Nível 14 (Cruzamento AMCI + GEP 1º Dia)
    const x14 = getX(13); // index 13 is ref 14
    const y14 = getY(APPGG_DATA[13]);
    const badge14 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    badge14.innerHTML = `
      <rect x="${x14 - 105}" y="${y14 - 45}" width="210" height="38" rx="4" fill="#1b354f" filter="url(#shadow)"/>
      <text x="${x14}" y="${y14 - 30}" text-anchor="middle" font-size="10" font-weight="bold" fill="#bae6fd">✓ Nível 14 · Alcança o piso com GEP</text>
      <text x="${x14}" y="${y14 - 15}" text-anchor="middle" font-size="9" fill="#ffffff">R$ 24.034,05 > R$ 23.525,50</text>
    `;
    svg.appendChild(badge14);

    // Badge 3: Nível 11 (Maior Diferença)
    const x11 = getX(10); // index 10 is ref 11
    const y11 = getY(AMCI_DATA[10]);
    const badge11 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    badge11.innerHTML = `
      <rect x="${x11 - 95}" y="${y11 - 44}" width="190" height="38" rx="4" fill="#781d22" filter="url(#shadow)"/>
      <text x="${x11}" y="${y11 - 29}" text-anchor="middle" font-size="10" font-weight="bold" fill="#fecaca">Nível 11 · Maior diferença (+71,9%)</text>
      <text x="${x11}" y="${y11 - 14}" text-anchor="middle" font-size="9" fill="#ffffff">AMCI: R$ 35.645,57 (+R$ 14,9k/mês)</text>
    `;
    svg.appendChild(badge11);

    // Badge 4: Nível 15 (Topo)
    const x15 = getX(14); // index 14 is ref 15
    const y15 = getY(AMCI_DATA[14]);
    const badge15 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    badge15.innerHTML = `
      <rect x="${x15 - 95}" y="${y15 - 44}" width="190" height="38" rx="4" fill="#5c181c" filter="url(#shadow)"/>
      <text x="${x15}" y="${y15 - 29}" text-anchor="middle" font-size="10" font-weight="bold" fill="#fed7aa">Nível 15 · Topo da carreira (+57,3%)</text>
      <text x="${x15}" y="${y15 - 14}" text-anchor="middle" font-size="9" fill="#ffffff">AMCI: R$ 38.751,90 (+R$ 14,1k/mês)</text>
    `;
    svg.appendChild(badge15);

    chartContainer.innerHTML = '';
    chartContainer.appendChild(svg);
    chartContainer.appendChild(tooltip);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChart);
  } else {
    initChart();
  }
})();
