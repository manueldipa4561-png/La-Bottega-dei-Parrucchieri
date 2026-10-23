/* Tutte le pagine: menu in alto a destra, prenotazione su WhatsApp, comparse, filtri colore, orari di oggi.
   Menu e prenotazione sono scritti qui una volta sola, così restano uguali in ogni pagina. */
(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const WA='393291097048',AR='<i class="ar" aria-hidden="true">↗︎</i>';
const PAGES=[['index.html','Home'],['colore.html','Colore'],['servizi.html','Servizi'],['maison.html','La Maison'],['shop.html','Haircare'],['contatti.html','Contatti']];
const here=document.body.dataset.page||'index.html';
const WHO=['Fabio','Liviana','Francesca','Mario','Daniela','Nausica'];
const SVC=['Consulenza colore','Colore e schiariture','Effetto Bottega','Taglio e styling','Sposa e occasioni','Trattamenti e haircare','Estensioni','Altro servizio'];

document.body.insertAdjacentHTML('beforeend',
  '<dialog class="menu" id="menu" aria-label="Menu"><div class="mn">'+
    '<header><span class="eyebrow">Menu</span><button class="xbtn" type="button" id="menuClose" aria-label="Chiudi il menu">×</button></header>'+
    '<nav aria-label="Pagine del sito">'+PAGES.map(([f,n],i)=>'<a href="'+f+'" style="--i:'+i+'"'+(f===here?' aria-current="page"':'')+'><span class="eyebrow bz">0'+i+'</span>'+n+AR+'</a>').join('')+'</nav>'+
    '<div class="mn-foot"><button class="btn full" type="button" data-book>Prenota un appuntamento</button><p class="eyebrow">Piazza Garibaldi 13, Pescara · <a href="tel:+3908568782">085 68782</a></p></div>'+
  '</div></dialog>'+
  '<dialog id="sheet" aria-labelledby="h-sheet"><div class="sh">'+
    '<header><div><p class="eyebrow bz">La Bottega dei Parrucchieri</p><h2 class="serif" id="h-sheet">Parliamo dei tuoi capelli.</h2></div><button class="xbtn" type="button" id="close" aria-label="Chiudi">×</button></header>'+
    '<form id="book" novalidate>'+
      '<label class="f"><span>Servizio d\'interesse</span><select name="svc" id="svc" required>'+SVC.map(s=>'<option>'+s+'</option>').join('')+'</select></label>'+
      '<fieldset class="chips"><legend>Con chi</legend><label class="chip"><input type="radio" name="who" value="Nessuna preferenza" checked><span>Chi è libero</span></label>'+WHO.map(w=>'<label class="chip"><input type="radio" name="who" value="'+w+'"><span>'+w+'</span></label>').join('')+'</fieldset>'+
      '<div class="two"><label class="f"><span>Giorno</span><input type="date" name="day" id="day" required></label><label class="f"><span>Ora</span><select name="time" id="time" required></select></label></div>'+
      '<label class="f"><span>Il tuo nome</span><input name="name" autocomplete="given-name" maxlength="60" placeholder="Come ti chiami?" required></label>'+
      '<label class="f"><span>Telefono</span><input name="tel" type="tel" autocomplete="tel" inputmode="tel" maxlength="20" pattern="[0-9 +]{6,20}" required></label>'+
      '<label class="f"><span>Cosa desideri realizzare?</span><textarea name="msg" rows="3" maxlength="400" placeholder="Raccontaci il risultato che immagini"></textarea></label>'+
      '<p class="dep" id="dep">Per sposa ed estensioni il salone può chiedere una piccola caparra per bloccare la data. Si scala dal conto.</p>'+
      '<button class="btn full" type="submit">Invia la richiesta'+AR+'</button>'+
      '<p class="fine center">La richiesta parte da WhatsApp: ti confermiamo l\'orario prima che tu venga.</p>'+
    '</form>'+
    '<div class="ok" id="ok" hidden><h2 class="serif" id="okT" tabindex="-1">Manca un tocco.</h2><p id="okP"></p><p>Si è aperto WhatsApp con la tua richiesta: premi Invia e il salone ti conferma l\'orario. Se non si è aperto, usa il pulsante.</p>'+
      '<div class="row-b center"><a class="btn" id="okWa" href="#" target="_blank" rel="noopener">Apri WhatsApp'+AR+'</a><button class="btn ol" type="button" id="okClose">Chiudi</button></div></div>'+
  '</div></dialog>');

/* menu: si apre dal pulsante in alto a destra, si chiude con X, ESC, tocco fuori o su un link */
const menu=$('#menu'),mb=$('#menuBtn');
mb.addEventListener('click',()=>{if(!menu.open){menu.showModal();mb.setAttribute('aria-expanded','true')}});
menu.addEventListener('close',()=>mb.setAttribute('aria-expanded','false'));
$('#menuClose').addEventListener('click',()=>menu.close());
menu.addEventListener('click',e=>{if(e.target===menu||e.target.closest('a,[data-book]'))menu.close()});

/* comparsa delle sezioni: solo sotto lo schermo all'avvio (niente lampi), una volta sola, 45ms l'una */
if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window){
  document.documentElement.classList.add('js');
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
  const SEL='h2,.intro,.split-img,.filters,.gallery li,.svc li,.cred li,.founder,.mfw,.mate,.contact li,.visit>div,.phil,.row-b,.all,.plist.best,.tiles li';
  $$('.sec').filter(s=>s.getBoundingClientRect().top>innerHeight*.9).forEach(s=>{
    const seen=new Map();
    $$(SEL,s).forEach(el=>{const k=seen.get(el.parentNode)||0;seen.set(el.parentNode,k+1);el.style.setProperty('--i',Math.min(k,6));el.classList.add('rv');io.observe(el)});
  });
}

/* Home: palco 3D. Lo scroll scorre i capitoli (dissolvenza incrociata), le etichette e il contatore;
   poi la foto si apre a tutto schermo. Un solo ciclo, solo mentre il palco o la foto sono visibili. */
const stage=$('#stage'),reveal=$('#reveal');
if(stage){
  const motion=!matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(motion)document.documentElement.classList.add('js3d');
  const top=$('.top');
  new IntersectionObserver(([e])=>top.classList.toggle('over',e.isIntersecting),{rootMargin:'0px 0px -100% 0px'}).observe(stage);
  if(motion){
    const P=el=>{const r=el.getBoundingClientRect(),d=r.height-innerHeight;return d>0?Math.min(1,Math.max(0,-r.top/d)):0};
    const chs=$$('.ch',stage).map(el=>({el,a:+el.dataset.a,b:+el.dataset.b})),spec=$$('.spec li',stage).map(el=>({el,a:+el.dataset.a}));
    const n=$('#chN'),bar=$('#chBar'),img=reveal&&$('.rv-img',reveal),txt=reveal&&$('.rv-t',reveal);
    const vis={s:true,r:false};let raf=0,lastN=-1;
    const paint=()=>{
      raf=0;
      if(vis.s){const p=P(stage);
        chs.forEach(c=>{const o=Math.min(1,Math.max(0,Math.min((p-c.a)/.04,(c.b-p)/.04)));c.el.style.opacity=o;c.el.style.transform='translateY('+((1-o)*24).toFixed(1)+'px)';c.el.classList.toggle('on',o>.5)});
        spec.forEach(s=>s.el.classList.toggle('on',p>=s.a));
        const k=Math.min(4,Math.floor((p+.02)/.2));if(k!==lastN){lastN=k;n.textContent='0'+k}
        bar.style.transform='scaleX('+p.toFixed(3)+')'}
      if(vis.r&&img){const p=P(reveal),q=Math.min(1,p/.7),e=1-Math.pow(1-q,3),o=Math.min(1,Math.max(0,(p-.55)/.25));
        img.style.transform='scale('+(.42+.58*e).toFixed(4)+') rotate('+(-5*(1-e)).toFixed(2)+'deg)';
        img.style.borderRadius=(28*(1-e)).toFixed(1)+'px';
        txt.style.opacity=o;txt.style.transform='translateY('+(20*(1-o)).toFixed(1)+'px)'}
    };
    const kick=()=>{if(!raf)raf=requestAnimationFrame(paint)};
    new IntersectionObserver(([e])=>{vis.s=e.isIntersecting;kick()}).observe(stage);
    if(reveal)new IntersectionObserver(([e])=>{vis.r=e.isIntersecting;kick()}).observe(reveal);
    addEventListener('scroll',kick,{passive:true});addEventListener('resize',kick,{passive:true});kick();
  }
}

/* Home: i più amati scorrono di lato; le frecce avanzano di una scheda */
const rail=$('#rail');
$$('[data-rail]').forEach(b=>b.addEventListener('click',()=>{
  const card=rail&&rail.querySelector('.pc');if(!card)return;
  rail.scrollBy({left:(+b.dataset.rail)*(card.offsetWidth+parseFloat(getComputedStyle(rail).columnGap||0)),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
}));

/* Colore: filtra le foto per colore; quelle che restano arrivano in sequenza */
const tags=$$('[data-filter]'),cards=$$('#gallery li');
tags.forEach(t=>t.addEventListener('click',()=>{
  const f=t.dataset.filter;let k=0;
  tags.forEach(x=>x.setAttribute('aria-pressed',x===t));
  cards.forEach(c=>{c.hidden=f!=='all'&&c.dataset.cat!==f;c.classList.remove('pop');c.classList.add('in')});
  void document.body.offsetWidth;
  cards.forEach(c=>{if(!c.hidden){c.style.setProperty('--i',Math.min(k++,6));c.classList.add('pop')}});
}));

/* barra "Prenota" in basso (telefono): compare dopo il primo blocco della pagina */
const bar=$('#stickyBook'),first=$('main>section');
if(bar&&first)new IntersectionObserver(([e])=>bar.classList.toggle('on',!e.isIntersecting&&e.boundingClientRect.top<0)).observe(first);

/* prenotazione: la richiesta parte da WhatsApp */
const dlg=$('#sheet'),form=$('#book'),svc=$('#svc'),day=$('#day'),time=$('#time'),dep=$('#dep'),ok=$('#ok');
for(let h=9;h<19;h++)for(const mm of ['00','30']){const o=document.createElement('option');o.textContent=h+':'+mm;time.append(o)}
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const next=()=>{const d=new Date();d.setDate(d.getDate()+1);if(d.getDay()===0)d.setDate(d.getDate()+1);return d};
day.min=iso(new Date());const mx=new Date();mx.setMonth(mx.getMonth()+3);day.max=iso(mx);
const sync=()=>dep.classList.toggle('on',svc.value==='Sposa e occasioni'||svc.value==='Estensioni');
svc.addEventListener('change',sync);
const radios=$$('input[name=who]',form),WH=radios.map(i=>i.value);
const open=(s,w)=>{
  form.hidden=false;ok.hidden=true;
  if(SVC.includes(s))svc.value=s;
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

/* orari: oggi e aperto ora, ora di Pescara (home e contatti) */
const live=$('#live');
if(live){
  const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Rome',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(x=>[x.type,x.value]));
  const dow=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(p.weekday),min=+p.hour*60+ +p.minute;
  const li=$('#hours li[data-d="'+dow+'"]');if(li)li.classList.add('today');
  const isOpen=dow>0&&min>=540&&min<1140;
  const when=min<540&&dow>0?'apre alle 9:00':dow===6?'riapre lunedì alle 9:00':'riapre domani alle 9:00';
  live.textContent=isOpen?'Aperto ora · fino alle 19:00':'Ora chiuso · '+when;
  live.classList.toggle('open',isOpen);
}
})();
