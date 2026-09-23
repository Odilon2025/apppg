const APP = [13815.84,15197.43,15577.36,15966.79,16365.96,16775.11,18788.14,19257.84,19739.29,20232.76,20738.60,22875.96,23447.85,24034.05,24634.90];
const AMCI = [21527.50,23680.25,24745.86,25859.43,27023.10,28239.14,31063.05,32150.26,33275.52,34440.16,35645.57,37427.85,37989.26,38559.10,38751.90];
const GEP = 1998.73;
const $ = id => document.getElementById(id);
const brl = value => value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const brlMobile = value => value.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
const pct = value => `${value.toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})}%`;

const CAREER_TIME = [
  '3 anos de carreira',
  '4,5 anos de carreira',
  '6 anos de carreira',
  '7,5 anos de carreira',
  '9 anos de carreira',
  '10,5 anos de carreira',
  '12 anos de carreira',
  '13,5 anos de carreira',
  '15 anos de carreira',
  '16,5 anos de carreira',
  '18 anos de carreira',
  '19,5 anos de carreira',
  '21 anos de carreira',
  '22,5 anos de carreira',
  '24 anos de carreira'
];

function fullTarget(i){ return AMCI[i] + GEP; }

function renderFront(){
  const head = '<div><span>Nível</span><span>Ref. (Tempo de carreira)</span><span>APPGG (Atual)</span><span>AMCI (PL 699/2026)</span></div>';
  const rows = APP.map((app,i)=>{
    const level = i < 6 ? 'I' : i < 11 ? 'II' : 'III';
    return `<div><b>${level}</b><span><strong>${i+1}</strong> <small class="career-time">(${CAREER_TIME[i]})</small></span><strong>${brl(app)}</strong><span class="amci-target">${brl(AMCI[i])}</span></div>`;
  }).join('');
  $('frontTable').innerHTML = head + rows;

  const mobileHead = '<div><span>Ref. (Tempo)</span><span>APPGG (R$)</span><span>AMCI — PL 699 (R$)</span></div>';
  const mobileRows = APP.map((app,i)=>{
    return `<div><div><strong>${i+1}</strong> <small class="career-time">(${CAREER_TIME[i]})</small></div><span>${brlMobile(app)}</span><b>${brlMobile(AMCI[i])}</b></div>`;
  }).join('');
  let mobileTable = document.getElementById('frontTableMobile');
  if (!mobileTable) {
    mobileTable = document.createElement('div');
    mobileTable.id = 'frontTableMobile';
    mobileTable.className = 'front-table-mobile';
    mobileTable.setAttribute('aria-label','Comparação salarial direta por referência');
    $('frontTable').insertAdjacentElement('afterend', mobileTable);
  }
  mobileTable.innerHTML = mobileHead + mobileRows;
}

renderFront();
$('shareTop').addEventListener('click',async()=>{
  const data={title:document.title,text:'APPGG × AMCI: comparação salarial direta e impacto orçamentário.',url:location.href};
  if(navigator.share){ try{await navigator.share(data);}catch(_){} }
  else { await navigator.clipboard.writeText(location.href); const button=$('shareTop'); const old=button.textContent; button.textContent='Link copiado'; setTimeout(()=>button.textContent=old,1400); }
});
