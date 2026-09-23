const APP = [13815.84,15197.43,15577.36,15966.79,16365.96,16775.11,18788.14,19257.84,19739.29,20232.76,20738.60,22875.96,23447.85,24034.05,24634.90];
const AMCI = [21527.50,23680.25,24745.86,25859.43,27023.10,28239.14,31063.05,32150.26,33275.52,34440.16,35645.57,37427.85,37989.26,38559.10,38751.90];
const GEP = 1998.73;
const $ = id => document.getElementById(id);
const brl = value => value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const brlMobile = value => value.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const pct = value => `${value.toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})}%`;

function fullTarget(i){ return AMCI[i] + GEP; }

function renderFront(){
  const head = '<div><span>Nível</span><span>Ref.</span><span>APPGG</span><span>AMCI total</span><span>AMCI pós-PL</span><span>GEP</span><span>Diferença</span><span>Dif. %</span></div>';
  const rows = APP.map((app,i)=>{
    const level = i < 6 ? 'I' : i < 11 ? 'II' : 'III';
    const total = fullTarget(i), diff = total-app;
    return `<div><b>${level}</b><span>${i+1}</span><strong>${brl(app)}</strong><span class="amci-total">${brl(total)}</span><span>${brl(AMCI[i])}</span><span>${brl(GEP)}</span><em>${brl(diff)}</em><mark>+${pct(diff/app*100)}</mark></div>`;
  }).join('');
  $('frontTable').innerHTML = head + rows;

  const mobileHead = '<div><span>Ref.</span><span>APPGG<br>(R$)</span><span>AMCI total<br>(R$)</span><span>Diferença<br>(R$)</span></div>';
  const mobileRows = APP.map((app,i)=>{
    const total = fullTarget(i), diff = total-app;
    return `<div><strong>${i+1}</strong><span>${brlMobile(app)}</span><b>${brlMobile(total)}</b><em>${brlMobile(diff)}</em></div>`;
  }).join('');
  let mobileTable = document.getElementById('frontTableMobile');
  if (!mobileTable) {
    mobileTable = document.createElement('div');
    mobileTable.id = 'frontTableMobile';
    mobileTable.className = 'front-table-mobile';
    mobileTable.setAttribute('aria-label','Comparação remuneratória por referência');
    $('frontTable').insertAdjacentElement('afterend', mobileTable);
  }
  mobileTable.innerHTML = mobileHead + mobileRows;
}

renderFront();
$('shareTop').addEventListener('click',async()=>{
  const data={title:document.title,text:'APPGG × AMCI: tabela legal e impacto calculado sobre a folha de agosto/2026.',url:location.href};
  if(navigator.share){ try{await navigator.share(data);}catch(_){} }
  else { await navigator.clipboard.writeText(location.href); const button=$('shareTop'); const old=button.textContent; button.textContent='Link copiado'; setTimeout(()=>button.textContent=old,1400); }
});
