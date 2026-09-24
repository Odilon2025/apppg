const historyData = [
  { level: 1, app15: 9000, app22: 12000, appPct: '33,3%', amci15: 13900, amci22: 15300, amciPct: '10,1%', isPiso: true, bgPct: '#ff6b6b' },
  { level: 2, app15: 10080, app22: 13200, appPct: '31,0%', amci15: 14734, amci22: 16065, amciPct: '9,0%', bgPct: '#f89e78' },
  { level: 3, app15: 10684.80, app22: 13530, appPct: '26,6%', amci15: 15102.35, amci22: 16386.30, amciPct: '8,5%', bgPct: '#fba985' },
  { level: 4, app15: 11325.89, app22: 13868.25, appPct: '22,4%', amci15: 15479.91, amci22: 16714.03, amciPct: '8,0%', bgPct: '#fcb695' },
  { level: 5, app15: 12005.44, app22: 14214.96, appPct: '18,4%', amci15: 15866.91, amci22: 17048.31, amciPct: '7,4%', bgPct: '#fed09b' },
  { level: 6, app15: 12725.77, app22: 14570.33, appPct: '14,5%', amci15: 16263.58, amci22: 17389.27, amciPct: '6,9%', bgPct: '#fee29e' },
  { level: 7, app15: 13998.94, app22: 16318.77, appPct: '16,6%', amci15: 17239.39, amci22: 18258.74, amciPct: '5,9%', bgPct: '#fed59a' },
  { level: 8, app15: 14698.26, app22: 16726.74, appPct: '13,8%', amci15: 17670.38, amci22: 18623.91, amciPct: '5,4%', bgPct: '#fef1a2' },
  { level: 9, app15: 15433.17, app22: 17144.91, appPct: '11,1%', amci15: 18112.14, amci22: 18990.39, amciPct: '4,9%', bgPct: '#fef4a8' },
  { level: 10, app15: 16204.83, app22: 17573.53, appPct: '8,4%', amci15: 18564.90, amci22: 19376.32, amciPct: '4,4%', bgPct: '#f0f6b4' },
  { level: 11, app15: 17015.08, app22: 18012.87, appPct: '5,9%', amci15: 19029.07, amci22: 19763.84, amciPct: '3,9%', bgPct: '#e1f3bd' },
  { level: 12, app15: 18716.58, app22: 19869.32, appPct: '6,2%', amci15: 20170.81, amci22: 20752.04, amciPct: '2,9%', bgPct: '#d7f0b5' },
  { level: 13, app15: 19558.83, app22: 20366.05, appPct: '4,1%', amci15: 20574.23, amci22: 21063.32, amciPct: '2,4%', bgPct: '#cef0b0' },
  { level: 14, app15: 20438.98, app22: 20875.20, appPct: '2,1%', amci15: 20985.71, amci22: 21379.27, amciPct: '1,9%', bgPct: '#c6eea8' },
  { level: 15, app15: 21358.73, app22: 21397.08, appPct: '0,2%', amci15: 21405.42, amci22: 21699.95, amciPct: '1,4%', isTeto: true, bgPct: '#bfeaa0' }
];

const fmtBRL = v => v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const histTable = document.querySelector('#historyTable');
if (histTable) {
  const getRowBg = (idx) => {
    if (idx === 0) return '#ffffff';
    if (idx < 6) return idx % 2 === 1 ? '#e2eff7' : '#f0f6fc';
    if (idx < 11) return idx % 2 === 1 ? '#f4e3d3' : '#faf0e7';
    if (idx < 14) return idx % 2 === 1 ? '#e8edf2' : '#f3f6f9';
    return '#ddf2d7';
  };

  const rowsHtml = historyData.map((r, i) => {
    const rowBg = getRowBg(i);
    let levelCell = '';
    if (r.isPiso) {
      levelCell = `<div class="photo-cell-level-flex"><span class="photo-badge-orange">Piso</span> <strong class="photo-piso-num">1</strong></div>`;
    } else if (r.isTeto) {
      levelCell = `<div class="photo-cell-level-flex"><span class="photo-badge-orange">Teto</span> <strong class="photo-teto-num">15</strong></div>`;
    } else {
      levelCell = `<strong class="photo-level-num">${r.level}</strong>`;
    }

    const isFirst = i === 0;
    const isLast = i === 14;

    const cellAppPct = isFirst
      ? `<div class="photo-badge-highlight-red">33,3%</div>`
      : isLast
      ? `<strong class="photo-green-val">0,2%</strong>`
      : r.appPct;

    const cellAmciPct = isFirst
      ? `<div class="photo-badge-highlight-red">10,1%</div>`
      : isLast
      ? `<strong class="photo-green-val">1,4%</strong>`
      : r.amciPct;

    const valClass = isFirst ? 'photo-red-val' : isLast ? 'photo-green-val' : '';

    return `
      <tr style="background-color: ${rowBg};">
        <td class="photo-cell-level">${levelCell}</td>
        <td class="photo-cell-num ${valClass}">${fmtBRL(r.app15)}</td>
        <td class="photo-cell-num ${valClass}">${fmtBRL(r.app22)}</td>
        <td class="photo-cell-pct ${isFirst ? 'photo-pct-first' : ''}" style="background-color: ${r.bgPct};">${cellAppPct}</td>
        <td class="photo-cell-num ${valClass}">${fmtBRL(r.amci15)}</td>
        <td class="photo-cell-num ${valClass}">${fmtBRL(r.amci22)}</td>
        <td class="photo-cell-pct ${isFirst ? 'photo-pct-first' : ''}" style="background-color: ${r.bgPct};">${cellAmciPct}</td>
      </tr>
    `;
  }).join('');

  const totalHtml = `
    <tr class="photo-total-row">
      <td class="photo-cell-level"><strong>TOTAL</strong></td>
      <td class="photo-cell-num"><strong>223.245,30</strong></td>
      <td class="photo-cell-num"><strong>249.668,01</strong></td>
      <td class="photo-cell-pct"><strong>11,8%</strong></td>
      <td class="photo-cell-num"><strong>265.098,80</strong></td>
      <td class="photo-cell-num"><strong>278.816,69</strong></td>
      <td class="photo-cell-pct"><strong>5,2%</strong></td>
    </tr>
  `;

  histTable.innerHTML = `
    <table class="photo-styled-table">
      <thead>
        <tr>
          <th style="width: 75px;">Nível</th>
          <th>APPGG 2015 (R$)</th>
          <th>APPGG 2022 (R$)</th>
          <th class="th-pct">Crescimento %<br>APPGG</th>
          <th>AMCI 2015 (R$)</th>
          <th>AMCI 2022 (R$)</th>
          <th class="th-pct">Crescimento %<br>AMCI</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
        ${totalHtml}
      </tbody>
    </table>
  `;
}
