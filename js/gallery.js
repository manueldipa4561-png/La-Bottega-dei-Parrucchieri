/* Galleria "Ogni testa, una storia": quando ci si avvicina, carica subito tutte le foto,
   cosi scorrendo di lato non compaiono riquadri grigi. Prima di allora restano pigre (pagina leggera). */
(()=>{
  const sec=document.getElementById('lavori');
  if(!sec||!('IntersectionObserver' in window))return;
  const io=new IntersectionObserver(([e])=>{
    if(!e.isIntersecting)return;
    sec.querySelectorAll('#row img[loading="lazy"]').forEach(i=>{i.loading='eager'});
    io.disconnect();
  },{rootMargin:'900px 0px'});
  io.observe(sec);
})();
