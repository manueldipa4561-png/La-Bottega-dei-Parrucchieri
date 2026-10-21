/* Home: filtri colore, prenotazione su WhatsApp, orari di oggi. */
(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const WA='393291097048';

/* 01 / La firma: filtra le foto per colore */
const tags=$$('[data-filter]'),cards=$$('#gallery li');
tags.forEach(t=>t.addEventListener('click',()=>{
  const f=t.dataset.filter;
  tags.forEach(x=>x.setAttribute('aria-pressed',x===t));
  cards.forEach(c=>{c.hidden=f!=='all'&&c.dataset.cat!==f});
}));

/* barra "Prenota" in basso (telefono): compare dopo l'hero */
const bar=$('#stickyBook'),hero=$('.hero');
if(bar&&hero)new IntersectionObserver(([e])=>bar.classList.toggle('on',!e.isIntersecting&&e.boundingClientRect.top<0)).observe(hero);

/* prenotazione: la richiesta parte da WhatsApp */
const dlg=$('#sheet'),form=$('#book'),svc=$('#svc'),day=$('#day'),time=$('#time'),dep=$('#dep'),ok=$('#ok');
for(let h=9;h<19;h++)for(const mm of ['00','30']){const o=document.createElement('option');o.textContent=h+':'+mm;time.append(o)}
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const next=()=>{const d=new Date();d.setDate(d.getDate()+1);if(d.getDay()===0)d.setDate(d.getDate()+1);return d};
day.min=iso(new Date());const mx=new Date();mx.setMonth(mx.getMonth()+3);day.max=iso(mx);
const sync=()=>dep.classList.toggle('on',svc.value==='Sposa e occasioni'||svc.value==='Estensioni');
svc.addEventListener('change',sync);
const radios=$$('input[name=who]',form),SV=[...svc.options].map(o=>o.value),WH=radios.map(i=>i.value);
const open=(s,w)=>{
  form.hidden=false;ok.hidden=true;
  if(SV.includes(s))svc.value=s;
  const who=WH.includes(w)?w:'Nessuna preferenza';radios.forEach(i=>i.checked=i.value===who);
  if(!day.value)day.value=iso(next());
  sync();if(!dlg.open)dlg.showModal();
};
document.addEventListener('click',e=>{const b=e.target.closest('[data-book]');if(!b)return;e.preventDefault();open(b.dataset.svc,b.dataset.who)});
if(location.hash==='#prenota')open();
$('#close').addEventListener('click',()=>dlg.close());$('#okClose').addEventListener('click',()=>dlg.close());
dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
day.addEventListener('input',()=>{const d=new Date(day.value+'T12:00');day.setCustomValidity(d.getDay()===0?'La domenica il salone è chiuso':'')});
form.addEventListener('submit',e=>{
  e.preventDefault();
  if(!form.checkValidity()){form.reportValidity();return}
  const f=new FormData(form),d=new Date(f.get('day')+'T12:00'),w=f.get('who'),note=String(f.get('msg')||'').trim();
  const when=d.toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'});
  const what=f.get('svc')+(w==='Nessuna preferenza'?'':' con '+w)+', '+when+' alle '+f.get('time');
  const msg='Ciao! Vorrei prenotare: '+what+'.\nNome: '+f.get('name')+'\nTelefono: '+f.get('tel')+(note?'\nVorrei: '+note:'');
  const url='https://wa.me/'+WA+'?text='+encodeURIComponent(msg);
  $('#okP').textContent=what+'.';$('#okWa').href=url;
  form.hidden=true;ok.hidden=false;$('#okT').focus();window.open(url,'_blank','noopener');
  form.reset();day.value='';
});

/* orari: oggi e aperto ora, ora di Pescara */
const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Rome',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(x=>[x.type,x.value]));
const dow=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(p.weekday),min=+p.hour*60+ +p.minute;
const li=$('#hours li[data-d="'+dow+'"]');if(li)li.classList.add('today');
const isOpen=dow>0&&min>=540&&min<1140,live=$('#live');
const when=min<540&&dow>0?'apre alle 9:00':dow===6?'riapre lunedì alle 9:00':'riapre domani alle 9:00';
live.textContent=isOpen?'Aperto ora · fino alle 19:00':'Ora chiuso · '+when;
live.classList.toggle('open',isOpen);
})();
