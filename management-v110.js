(()=>{'use strict';
 const carousel=document.querySelector('.mr-period-carousel');
 if(carousel){
  const slides=[...carousel.querySelectorAll('.mr-period-exploration')],controls=carousel.querySelector('.mr-carousel-controls'),dots=[...carousel.querySelectorAll('[data-period-slide]')],prev=carousel.querySelector('[data-period-prev]'),next=carousel.querySelector('[data-period-next]'),status=carousel.querySelector('[data-period-status]');
  let selected=0,start=null;
  function show(n){selected=Math.max(0,Math.min(slides.length-1,n));slides.forEach((e,i)=>{e.hidden=i!==selected;e.setAttribute('aria-hidden',String(i!==selected));});dots.forEach((b,i)=>b.setAttribute('aria-current',String(i===selected)));prev.disabled=selected===0;next.disabled=selected===slides.length-1;status.textContent=`${selected+1} of ${slides.length}`;carousel.dataset.slide=String(selected+1);}
  prev.addEventListener('click',()=>show(selected-1));next.addEventListener('click',()=>show(selected+1));dots.forEach(d=>d.addEventListener('click',()=>show(Number(d.dataset.periodSlide))));
  controls.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();show(e.key==='Home'?0:e.key==='End'?slides.length-1:selected+(e.key==='ArrowRight'?1:-1));dots[selected].focus({preventScroll:true});});
  carousel.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')start={x:e.clientX,y:e.clientY};},{passive:true});carousel.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)show(selected+(dx<0?1:-1));},{passive:true});carousel.addEventListener('pointercancel',()=>start=null,{passive:true});
  carousel.classList.add('is-enhanced');controls.hidden=false;show(0);
 }
 const fine=matchMedia('(hover:hover) and (pointer:fine)'),states=[];
 document.querySelectorAll('[data-funnel-note]').forEach(note=>{let pinned=false,inside=false,focused=false;const detail=document.getElementById(note.getAttribute('aria-controls'));
  function update(open){note.setAttribute('aria-expanded',String(open));detail.setAttribute('aria-hidden',String(!open));}function close(){pinned=false;update(false);}
  note.classList.add('is-enhanced');update(false);note.addEventListener('pointerenter',e=>{if(fine.matches&&e.pointerType!=='touch'){inside=true;update(true);}});note.addEventListener('pointerleave',()=>{inside=false;if(!pinned&&!focused)update(false);});note.addEventListener('focus',()=>{focused=note.matches(':focus-visible');if(focused)update(true);});note.addEventListener('blur',()=>{focused=false;if(!pinned&&!inside)update(false);});note.addEventListener('click',()=>{pinned=!pinned;update(pinned);});note.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();}});states.push({note,close});
 });document.addEventListener('pointerdown',e=>states.forEach(s=>{if(!s.note.contains(e.target))s.close();}));
})();
