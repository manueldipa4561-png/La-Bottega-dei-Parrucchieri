/* Linea Bottega: catalogo, scheda prodotto, carrello e ordine su WhatsApp.
   Condiviso da index.html (vetrina: <ul data-shop="id,id">) e shop.html (#catalog, #catnav).
   Prezzi indicativi dalle schede del salone; p:null = prezzo in salone.
   u:[min,max,unità] = durata stimata di una confezione (capelli medi), i = INCI trascritto dall'etichetta. */
(()=>{
  const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
  const WA='393291097048',F='Farmaca International',KEY='bottega-cart';
  const C=[
    {id:'kit',n:'Kit',d:'Le routine complete: tre o quattro prodotti che lavorano insieme, a un prezzo più basso.'},
    {id:'anticrespo',n:'Anticrespo',d:'Smooth Active: per capelli lisci o mossi, morbidi e disciplinati più a lungo.'},
    {id:'riparazione',n:'Riparazione',d:'Trattamento Lamellare e Bio Botulin Filler per capelli porosi, sfibrati e trattati.'},
    {id:'ricci',n:'Ricci',d:'Curl Control: detergere, nutrire e definire ricci morbidi e ordinati.'},
    {id:'nutrimento',n:'Nutrimento',d:'Oli, elisir e maschere per luce, morbidezza e protezione dal calore.'},
    {id:'kids',n:'Kids',d:'Delicati per i più piccoli: capelli senza nodi, anche dopo il sole.'},
    {id:'anticaduta',n:'Anticaduta',d:'Protoplasmina di Farmaca International: programmi e integratori consigliati in salone.'}
  ];
  const P=[
    {id:'kit-lamellare',c:'kit',l:'Trattamento Lamellare',n:'Kit Trattamento Lamellare',p:49.9,was:57.7,tag:'Best seller',k:['lamellare-shampoo','lamellare-conditioner','lamellare-lozione'],d:'La routine completa per capelli più forti, sani e luminosi: deterge e prepara, nutre e ripara, tratta e sigilla.'},
    {id:'kit-anticrespo',c:'kit',l:'Smooth Active',n:'Kit Anti-crespo',p:49.9,was:58.7,k:['smooth-shampoo','smooth-conditioner','fluido-anticrespo'],d:'La routine completa per capelli più lisci, morbidi e luminosi più a lungo.'},
    {id:'kit-ricci',c:'kit',l:'Curl Control',n:'Kit Ricci Perfetti',p:69.9,was:82.7,k:['curl-shampoo','argan-essence','curl-disciplinante','curl-rock'],d:'La routine completa per ricci definiti, nutriti e disciplinati.'},
    {id:'kit-kids',c:'kit',l:'Kids',n:'Kit Kids · capelli senza nodi',p:null,k:['kids-shampoo','kids-keratin'],d:'Step 1 lava, step 2 proteggi: la routine completa per capelli morbidi, districati e facili da pettinare.'},
    {id:'smooth-shampoo',u:[25,30,'lavaggi'],c:'anticrespo',l:'Smooth Active',n:'Smooth Active Shampoo',s:'250 ml',p:18.9,d:'Shampoo anticrespo per capelli lisci o mossi, con estratto di avena e vitamine. Deterge in profondità, aiuta a controllare il crespo e lascia i capelli morbidi, setosi e luminosi.',b:['Deterge in modo delicato','Controlla il crespo','Ideale per uso frequente']},
    {id:'smooth-conditioner',u:[20,25,'applicazioni'],c:'anticrespo',l:'Smooth Active',n:'Smooth Active Conditioner',s:'250 ml',p:18.9,d:'Balsamo anticrespo ad azione districante con estratto di avena. Nutre la fibra e mantiene i capelli lisci e disciplinati, morbidi e facili da pettinare.',b:['Nutre e idrata in profondità','Districa e ammorbidisce','Riduce l\'effetto crespo']},
    {id:'fluido-anticrespo',u:[50,75,'applicazioni'],c:'anticrespo',l:'Smooth Active',n:'Fluido Anticrespo',s:'150 ml',p:20.9,d:'Fluido concentrato lisciante con olio di argan e oli essenziali. Nutre all\'istante capelli secchi, sfibrati o trattati e li lascia morbidi e lucenti, senza appesantire.',b:['Elimina il crespo','Disciplina e liscia','Protegge la fibra capillare']},
    {id:'lamellare-shampoo',u:[25,30,'lavaggi'],c:'riparazione',l:'Trattamento Lamellare',n:'Shampoo Riparatore',s:'250 ml',p:18.9,d:'Detergente delicato per capelli porosi, secchi e danneggiati. Deterge senza aggredire e prepara la fibra al trattamento lamellare.',b:['Deterge in modo delicato','Aiuta a riparare la fibra','Capelli più morbidi e luminosi']},
    {id:'lamellare-conditioner',u:[20,25,'applicazioni'],c:'riparazione',l:'Trattamento Lamellare',n:'Conditioner Riparatore',s:'250 ml',p:18.9,d:'Condizionante ad azione riparatrice per capelli porosi, secchi e danneggiati. Nutre e districa senza appesantire: capelli morbidi, setosi e più facili da pettinare.',b:['Nutre e ripara la fibra','Districa e ammorbidisce','Riduce l\'effetto crespo']},
    {id:'lamellare-lozione',u:[25,30,'applicazioni'],c:'riparazione',l:'Trattamento Lamellare',n:'Lozione Nutriente',s:'250 ml',p:19.9,d:'Trattamento lamellare intensivo: penetra nella fibra, aiuta a ripararla e rinforzarla e dona lucentezza, morbidezza e protezione.',b:['Ripara e rinforza la fibra','Lucentezza e morbidezza','Ideale per capelli trattati e sensibilizzati']},
    {id:'botulin-shampoo',u:[25,30,'lavaggi'],i:'Aqua (Water), Disodium Cocoamphodiacetate, Cocamidopropyl Betaine, Sodium Lauroyl Sarcosinate, Coco-Glucoside, PEG-18 Glyceryl Oleate/Cocoate, Parfum (Fragrance), Citric Acid, Sodium Benzoate, Sodium Lauroyl Oat Amino Acids, Glycerin, Potassium Sorbate, Polyquaternium-6, Glycine Soja (Soybean) Oil, Hydrolyzed Keratin, Hydrolyzed Collagen, Wheat Amino Acids, Soy Amino Acids, Arginine HCl, Serine, Threonine, Glycine Soja (Soybean) Seed Extract, Benzyl Alcohol, Citrus Aurantium (Orange) Peel Oil, Hexamethylindanopyran, Hexyl Cinnamal, Limonene, Linalool, Linalyl Acetate. Non contiene parabeni, oli minerali, siliconi, SLES, SLS, sali.',c:'riparazione',l:'Bio Botulin Filler',n:'Bio Botulin Filler Shampoo',s:'250 ml',p:null,d:'Shampoo effetto filler volumizzante, riparatore e protettivo, per capelli più forti, più voluminosi e più vitali.',b:['Effetto filler','Volume e corpo','Ripara e protegge']},
    {id:'botulin-maschera',u:[12,16,'applicazioni'],c:'riparazione',l:'Bio Botulin Filler',n:'Bio Botulin Filler Maschera',s:'250 ml',p:null,d:'Trattamento intensivo ai semi di lino, senza SLS, SLES, parabeni e sali, per capelli secchi, fragili e spenti. Effetto filler riparatore e protettivo.',b:['Effetto filler riparatore','Rinforza la fibra','Luce e morbidezza']},
    {id:'curl-shampoo',u:[25,30,'lavaggi'],i:'Aqua (Water), Sodium Coceth Sulfate, Cocamidopropyl Betaine, Polyquaternium-7, Panthenol, Glycerin, Hydrolyzed Keratin, Sodium Chloride, Phenoxyethanol, Parfum (Fragrance), VP/DMAPA Acrylates Copolymer, PEG-200 Hydrogenated Glyceryl Palmate, PEG-7 Glyceryl Cocoate, Styrene/Acrylates Copolymer, Aloe Barbadensis Leaf Juice Powder, Maltodextrin, Allantoin, Tetrasodium EDTA, Citric Acid, Ethylhexylglycerin, Sodium Dehydroacetate, Limonene.',c:'ricci',l:'Curl Control',n:'Curl Control Shampoo',s:'250 ml',p:18.9,d:'Deterge delicatamente, idrata e disciplina il riccio con aloe vera, cheratina e pantenolo. Contrasta il crespo e dona morbidezza e luminosità.',b:['Deterge in modo delicato','Idrata e protegge','Definisce il riccio']},
    {id:'curl-disciplinante',u:[20,30,'applicazioni'],i:'Aqua (Water), Hydroxyethylcellulose, Hydrolyzed Wheat Gluten, Panthenol, Aloe Barbadensis Leaf Juice, Hydrolyzed Soy Protein, Polyquaternium-11, Cocos Nucifera (Coconut) Oil, VP/DMAPA Acrylates Copolymer, Hydrolyzed Corn Protein, VP/Dimethylaminoethylmethacrylate Copolymer, Ethylhexylglycerin, Tocopherol, Dimethiconol, Lecithin, Ascorbyl Palmitate, Caprylyl Glycol, Phenoxyethanol, Dimethicone, Parfum (Fragrance), Sodium Benzoate, Citric Acid, Potassium Sorbate.',c:'ricci',l:'Curl Control',n:'Disciplinante Capelli Ricci',s:'100 ml',p:19.9,d:'Trattamento senza risciacquo con aloe vera, pantenolo e olio di cocco. Disciplina e valorizza la forma naturale del riccio: morbido, ordinato e leggero.',b:['Controlla il crespo','Mantiene il riccio morbido','Non appesantisce']},
    {id:'curl-rock',u:[40,50,'applicazioni'],c:'ricci',l:'Curl Control',n:'Curl Rock Ricci Perfetti',s:'200 ml',p:20.9,d:'Fluido definizione ricci senza risciacquo. Definisce e valorizza la forma naturale del riccio, elastico, morbido e luminoso, senza effetto appesantito.',b:['Definisce ricci e onde','Elasticità e lucentezza','Mantiene la forma più a lungo']},
    {id:'argan-essence',u:[12,16,'applicazioni'],c:'nutrimento',l:'Argan Essence',n:'Argan Essence Maschera Nutriente',s:'250 ml',p:22.9,d:'Trattamento nutriente all\'olio di argan per capelli secchi, ricci e sensibilizzati. Nutre la fibra, migliora la pettinabilità e dona morbidezza e luminosità.',b:['Nutre in profondità','Capelli più morbidi','Migliora la pettinabilità']},
    {id:'argan-oil',u:[150,200,'applicazioni'],i:'Cyclopentasiloxane, Dimethiconol, Argania Spinosa Kernel Oil, Keratin Amino Acids, Linum Usitatissimum (Linseed) Seed Oil, Parfum (Fragrance), Benzyl Alcohol, Benzyl Benzoate, Benzyl Salicylate, Coumarin, Hexyl Cinnamal, Limonene, Linalool, CI 47000, CI 26100.',c:'nutrimento',l:'Siero nutriente e lucidante',n:'Argan Oil',s:'100 ml',p:null,d:'L\'elisir all\'olio di argan: nutre, protegge dal calore di piastra e phon e dona lucentezza immediata. Formula leggera che non unge. Poche gocce sul palmo, poi su lunghezze e punte.',b:['Nutre in profondità','Lucentezza immediata','Protegge dal calore']},
    {id:'gold-touch',c:'nutrimento',l:'Elisir · uso professionale',n:'Gold Touch',p:null,d:'L\'elisir di lunga vita per i tuoi capelli: olio di argan e di macadamia restituiscono volume, lucentezza e morbidezza e donano un tocco setoso.',b:['Correzione pH','Tocco setoso','Brillantezza intensa']},
    {id:'kids-shampoo',u:[35,40,'lavaggi'],i:'Aqua, Sodium Laureth Sulfate, Glycerin, Sodium Gluconate, Trideceth-2 Carboxamide MEA, Cocamidopropyl Betaine, Caprylyl/Capryl Glucoside, PEG-7 Glyceryl Cocoate, Sodium Chloride, Limonene, Laureth-2, PEG/PPG-120/10 Trimethylolpropane Trioleate, Parfum, Hydrolyzed Wheat Protein, Quaternium-80, Linalool, Saccharide Isomerate, Hydrolyzed Chestnut Extract, Hexyl Cinnamal, Dehydroacetic Acid.',c:'kids',l:'Kids',n:'Shampoo Sciogli Nodi Protettivo',s:'250 ml',p:null,d:'Detersione delicata per i più piccoli: aiuta a sciogliere i nodi e protegge i capelli, anche dopo il sole.',b:['Districa i nodi','Deterge delicatamente','Ideale anche dopo il sole']},
    {id:'kids-keratin',u:[50,70,'applicazioni'],i:'Aqua (Water), Cetearyl Alcohol, Behentrimonium Chloride, Cyclopentasiloxane, Panthenol, Propylene Glycol, Isopropyl Alcohol, EDTA, Ethylhexyl Methoxycinnamate, Hydrolyzed Keratin, Parfum (Fragrance), Geraniol, Benzyl Salicylate, Hexyl Cinnamal, Hydroxycitronellal, Limonene, Linalool, Phenoxyethanol, Methylparaben, Propylparaben, Ethylparaben, Butylparaben.',c:'kids',l:'Kids',n:'Keratin 10',s:'150 ml',p:null,d:'Trattamento senza risciacquo alla cheratina, 10 benefici in un solo gesto: nutre, districa, disciplina e protegge i capelli dei più piccoli.',b:['Districa e rende setosi','Protegge da piastra e phon','Ideale per l\'uso quotidiano']},
    {id:'posology',c:'anticaduta',l:'Protoplasmina · '+F,n:'Posology A · Programma intensivo anticaduta',p:null,brand:F,d:'Programma intensivo di 4 settimane che agisce in 4 fasi, con azione specifica anti-age a rilascio graduale. Nella confezione anche l\'integratore Tricosammina in regalo.',b:['4 settimane, 4 fasi','Azione anti-age a rilascio graduale','Tricosammina in regalo']},
    {id:'komplex',c:'anticaduta',l:'Protoplasmina · '+F,n:'Komplex Intensive',p:null,brand:F,d:'Intervento tricologico rinforzante ad azione densificante anticaduta, con Bioxinol e Ganother. Clinicamente testato: −76,57% di perdita dei capelli in 45 giorni (dato del produttore).',b:['Rinforzante e densificante','Clinicamente testato']},
    {id:'tricoactive',c:'anticaduta',l:'Protoplasmina · '+F,n:'Tricoactive · Bio integratore',p:null,brand:F,d:'Bio integratore coadiuvante la crescita fisiologica dei capelli, con Bioxinol Komplex.',b:['Sostiene la crescita fisiologica','Con Bioxinol Komplex']},
    {id:'balance',c:'anticaduta',l:'Protoplasmina · '+F,n:'Hair System Balance',p:null,brand:F,d:'Trattamento ad azione coordinata anti-age anticaduta, dall\'esterno e dall\'interno: bagno trattante densificante e trattamento Balance. Tricosammina in regalo.',b:['Doppia azione','Anti-age anticaduta','Tricosammina in regalo']}
  ];
  const byId=Object.fromEntries(P.map(p=>[p.id,p])),known=id=>Object.hasOwn(byId,id);
  const eur=new Intl.NumberFormat('it-IT',{style:'currency',currency:'EUR'});
  const img=id=>'img/shop/'+id+'.webp';
  const hook=p=>p.k?p.k.length+' prodotti'+(p.was?' · risparmi '+Math.round((1-p.p/p.was)*100)+'%':''):(p.b?p.b[0]:'');
  const ONE={lavaggi:'lavaggio',applicazioni:'applicazione'};
  const useText=p=>!p.u?'':'Dura circa '+p.u[0]+'-'+p.u[1]+' '+p.u[2]+' (stima)'+(p.p==null?'':' · ≈ '+eur.format(p.p/((p.u[0]+p.u[1])/2))+' a '+ONE[p.u[2]]);
  const priceHTML=p=>p.p==null?'<span class="tbd">Prezzo in salone</span>':'<b>'+eur.format(p.p)+'</b>'+(p.was?'<s>'+eur.format(p.was)+'</s>':'');
  let tt;const toast=m=>{const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),3200)};
  const buzz=ms=>{try{if(navigator.vibrate&&(!navigator.userActivation||navigator.userActivation.isActive))navigator.vibrate(ms)}catch(e){}};

  /* carrello: {id: quantità}, validato perché localStorage è input non fidato */
  let cart={};
  try{const raw=JSON.parse(localStorage.getItem(KEY)||'{}');for(const id in raw){const q=raw[id];if(known(id)&&Number.isInteger(q)&&q>0&&q<100)cart[id]=q}}catch(e){}
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(cart))}catch(e){}};

  /* schede prodotto: vetrina in home, catalogo per categorie nello shop */
  const card=p=>'<li class="pc"><button class="pimg" type="button" data-open="'+p.id+'" aria-label="Dettagli: '+p.n+'">'+(p.tag?'<span class="badge lab">'+p.tag+'</span>':'')+'<img src="img/shop/sm/'+p.id+'.webp" srcset="img/shop/sm/'+p.id+'.webp 480w, '+img(p.id)+' 800w" sizes="(max-width:759px) 46vw, 24vw" width="800" height="800" alt="'+p.n+'" loading="lazy" decoding="async"></button><div class="pi"><span class="lab">'+p.l+(p.s?' · '+p.s:'')+'</span><h3>'+p.n+'</h3><span class="pt">'+hook(p)+'</span><div class="pb"><span class="pr">'+priceHTML(p)+'</span><button class="add" type="button" data-add="'+p.id+'" aria-label="Aggiungi '+p.n+' al carrello">+</button></div></div></li>';
  $$('[data-shop]').forEach(ul=>{ul.innerHTML=ul.dataset.shop.split(',').filter(known).map(id=>card(byId[id])).join('')});
  const catalog=$('#catalog'),catnav=$('#catnav');
  if(catnav)catnav.innerHTML='<div class="wrap">'+C.map(c=>'<a class="cat" href="#'+c.id+'">'+c.n+'</a>').join('')+'</div>';
  if(catalog)catalog.innerHTML=C.map(c=>'<section class="pcat" id="'+c.id+'" aria-labelledby="h-'+c.id+'"><div class="wrap"><div class="pcat-h"><h2 class="x" id="h-'+c.id+'">'+c.n+'</h2><p>'+c.d+'</p></div><ul class="plist">'+P.filter(p=>p.c===c.id).map(card).join('')+'</ul></div></section>').join('');

  /* finestre: scheda prodotto, carrello e pulsante carrello, uguali in tutte le pagine */
  document.body.insertAdjacentHTML('beforeend',
    '<button class="cfab" id="cfab" type="button" data-cart hidden>Carrello <i id="cfabn">0</i></button>'+
    '<dialog id="pdlg" aria-labelledby="h-pd"><div class="sh"><header><span class="lab muted" id="pd-l"></span><button class="xbtn" type="button" data-close aria-label="Chiudi" autofocus>×</button></header><div class="pd-grid"><div><div class="pd-img"><img id="pd-img" width="800" height="800" alt=""></div><div class="pd-th" id="pd-th"></div></div><div><h2 class="x pd-h" id="h-pd"></h2><p class="pd-p" id="pd-p"></p><p class="pd-u" id="pd-u"></p><p class="pd-t" id="pd-t"></p><p id="pd-d"></p><p class="lab muted" id="pd-bh"></p><ul class="pd-b" id="pd-b"></ul><div id="pd-i"></div><button class="btn full" type="button" id="pd-add">Aggiungi al carrello</button><p class="pd-note lab muted">Ritiro gratis in salone · ordine su WhatsApp</p></div></div></div></dialog>'+
    '<dialog id="cart" aria-labelledby="h-cart"><div class="sh"><header><h2 class="x" id="h-cart">Carrello</h2><button class="xbtn" type="button" data-close aria-label="Chiudi" autofocus>×</button></header><p class="empty" id="cempty">Il carrello è vuoto. <a href="shop.html" data-close>Scopri la linea Bottega</a></p><ul class="cl" id="cl"></ul>'+
    '<form id="order" novalidate><p class="ctot" aria-live="polite"><span>Totale</span><b id="ctot"></b></p><fieldset class="chips"><legend>Come lo ricevi</legend><label class="chip"><input type="radio" name="ship" value="Ritiro in salone, Piazza Garibaldi 13" checked><span>Ritiro in salone · gratis</span></label><label class="chip"><input type="radio" name="ship" value="Spedizione a casa (indirizzo in chat)"><span>Spedizione a casa</span></label></fieldset><button class="btn full" type="submit">Invia l\'ordine su WhatsApp</button><ol class="how"><li>Si apre WhatsApp con l\'ordine già scritto: ti confermiamo disponibilità e totale. Per la consegna a casa ti diciamo costo e tempi prima che tu paghi.</li><li>Paghi solo dopo la conferma: al ritiro in salone o con un link di pagamento.</li><li>Il tuo numero lo usiamo solo per questo ordine: niente pubblicità, non lo diamo a nessuno.</li></ol><p class="note center">Vende La Bottega dei Parrucchieri · Piazza Garibaldi 13, Pescara · 085 68782</p></form></div></dialog>');

  /* scheda prodotto */
  const pd=$('#pdlg'),pdImg=$('#pd-img'),th=$('#pd-th');let cur=null;
  const openP=id=>{
    const p=byId[id];cur=id;
    $('#pd-l').textContent=p.l+(p.s?' · '+p.s:'');$('#h-pd').textContent=p.n;$('#pd-p').innerHTML=priceHTML(p);$('#pd-d').textContent=p.d;$('#pd-t').textContent=p.k?hook(p):'';$('#pd-bh').textContent=p.k?'Contiene':'Perché sceglierlo';
    $('#pd-b').innerHTML=(p.k?p.k.map(k=>byId[k].n+(byId[k].s?' · '+byId[k].s:'')):p.b||[]).map(x=>'<li>'+x+'</li>').join('');
    $('#pd-u').textContent=useText(p);
    $('#pd-i').innerHTML=p.k?'':p.i?'<details class="pd-inci"><summary>Ingredienti (INCI)</summary><p>'+p.i+'</p></details>':'<p class="pd-inci">INCI completo su richiesta: <a href="https://wa.me/'+WA+'?text='+encodeURIComponent('Ciao! Mi mandate l\'INCI di '+p.n+'?')+'" target="_blank" rel="noopener">chiedilo su WhatsApp</a></p>';
    const views=[[img(id),'Fronte']];if(p.open)views.push([img(p.open),'Dentro la scatola']);
    pdImg.src=views[0][0];pdImg.alt=p.n;
    th.innerHTML=views.length>1?views.map((v,i)=>'<button type="button" aria-pressed="'+!i+'" data-v="'+v[0]+'"><img src="'+v[0]+'" width="64" height="64" alt=""><span class="lab">'+v[1]+'</span></button>').join(''):'';
    if(!pd.open)pd.showModal();
  };
  th.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(!b)return;pdImg.src=b.dataset.v;$$('button',th).forEach(x=>x.setAttribute('aria-pressed',x===b))});
  $('#pd-add').addEventListener('click',()=>{add(cur,1);pd.close()});

  /* carrello */
  const cd=$('#cart'),fab=$('#cfab'),cl=$('#cl'),order=$('#order');
  const total=()=>{
    const ids=Object.keys(cart),priced=ids.filter(id=>byId[id].p!=null);
    if(!priced.length)return 'Da confermare';
    return eur.format(priced.reduce((a,id)=>a+byId[id].p*cart[id],0))+(priced.length<ids.length?' + da confermare':'');
  };
  const paint=()=>{
    const ids=Object.keys(cart),n=ids.reduce((a,id)=>a+cart[id],0);
    fab.hidden=!n;$('#cfabn').textContent=n;fab.setAttribute('aria-label','Apri il carrello: '+n+(n===1?' prodotto':' prodotti'));
    cl.innerHTML=ids.map(id=>{const p=byId[id],q=cart[id];return '<li><img src="'+img(id)+'" width="64" height="64" alt=""><div><b>'+p.n+'</b><span class="lab muted">'+(p.p==null?'Prezzo da confermare':eur.format(p.p*q))+'</span></div><div class="qty"><button type="button" data-q="'+id+'" data-d="-1" aria-label="Togli un '+p.n+'">−</button><output>'+q+'</output><button type="button" data-q="'+id+'" data-d="1" aria-label="Aggiungi un '+p.n+'">+</button></div></li>'}).join('');
    $('#ctot').textContent=total();$('#cempty').hidden=!!n;order.hidden=!n;
  };
  const add=(id,d)=>{if(!known(id))return;const q=Math.min(99,(cart[id]||0)+d);if(q>0)cart[id]=q;else delete cart[id];save();paint();if(d>0){toast(byId[id].n+' nel carrello');buzz(10)}};
  /* la lista si ridisegna: rimetti il focus sullo stesso pulsante, o sulla chiusura se la riga sparisce */
  cl.addEventListener('click',e=>{
    const b=e.target.closest('[data-q]');if(!b)return;const {q,d}=b.dataset;
    add(q,+d);(cl.querySelector('[data-q="'+q+'"][data-d="'+d+'"]')||cd.querySelector('.xbtn')).focus();
  });
  document.addEventListener('click',e=>{
    const a=e.target.closest('[data-add]');if(a){add(a.dataset.add,1);return}
    const o=e.target.closest('[data-open]');if(o){openP(o.dataset.open);return}
    if(e.target.closest('[data-cart]')){paint();cd.showModal();return}
    const x=e.target.closest('[data-close]');if(x)x.closest('dialog').close();
  });
  [pd,cd].forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));
  order.addEventListener('submit',e=>{
    e.preventDefault();
    const lines=Object.keys(cart).map(id=>{const p=byId[id],q=cart[id];return '• '+q+'× '+p.n+(p.s?' ('+p.s+')':'')+': '+(p.p==null?'prezzo da confermare':eur.format(p.p*q))});
    const msg=['Ciao! Vorrei ordinare dalla linea Bottega:',...lines,'Totale: '+total(),'Consegna: '+new FormData(order).get('ship')].join('\n');
    window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(msg),'_blank','noopener');
  });
  paint();

  /* dati strutturati per Google, solo nella pagina shop: un prodotto per scheda, offerta solo se c'è il prezzo */
  if(!catalog)return;
  const ld=document.createElement('script');ld.type='application/ld+json';
  ld.textContent=JSON.stringify({'@context':'https://schema.org','@type':'ItemList',name:'Linea Bottega',itemListElement:P.map((p,i)=>({'@type':'ListItem',position:i+1,item:Object.assign({'@type':'Product',name:p.n,image:new URL(img(p.id),location.href).href,description:p.d,brand:{'@type':'Brand',name:p.brand||'La Bottega dei Parrucchieri'}},p.p==null?{}:{offers:{'@type':'Offer',price:p.p.toFixed(2),priceCurrency:'EUR',availability:'https://schema.org/InStock'}})}))});
  document.head.append(ld);
})();
