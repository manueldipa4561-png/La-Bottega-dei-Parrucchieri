/* Menu a tutto schermo (tre lineette): si chiude con X, ESC, tocco fuori o su un link. */
(()=>{
  const m=document.getElementById('menu'),b=document.getElementById('menuBtn');
  if(!m||!b)return;
  b.addEventListener('click',()=>{if(!m.open)m.showModal()});
  document.getElementById('menuClose').addEventListener('click',()=>m.close());
  m.addEventListener('click',e=>{if(e.target===m||e.target.closest('a,[data-book]'))m.close()});
})();
