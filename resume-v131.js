/* v132: optional wayfinding for the fully visible, source-based HTML resume. */
(() => {
 'use strict';
 const page=document.querySelector('[data-resume-page]');
 if(!page)return;
 // Resume-only correction for the shared menu's external trigger focus loop.
 // Use the original event target because the older shared handler runs first.
 const menu=document.getElementById('site-menu');
 const trigger=document.querySelector('.site-menu-trigger');
 document.addEventListener('keydown',event=>{
  if(event.key!=='Tab'||!document.body.classList.contains('menu-open')||!menu)return;
  const targets=[trigger,...menu.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')]
   .filter(el=>el&&!el.closest('[hidden],[inert]')&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden');
  if(!targets.length)return;
  const current=targets.indexOf(event.target);
  const next=current<0?(event.shiftKey?targets.length-1:0):(current+(event.shiftKey?-1:1)+targets.length)%targets.length;
  event.preventDefault();
  event.stopImmediatePropagation();
  targets[next].focus({preventScroll:true});
 },true);
 const links=[...page.querySelectorAll('.cv-index__links a')];
 const sections=links.map(link=>document.getElementById(link.hash.slice(1))).filter(Boolean);
 if(!sections.length||!('IntersectionObserver' in window))return;
 const visible=new Map();
 function setCurrent(id){
  links.forEach(link=>{if(link.hash==='#'+id)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
 }
 // The browser handles anchor movement; no second scrolling or animation clock.
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>visible.set(entry.target.id,{visible:entry.isIntersecting,top:entry.boundingClientRect.top}));
  const candidates=sections.filter(s=>visible.get(s.id)?.visible);
  if(candidates.length)setCurrent(candidates[0].id);
 },{rootMargin:'-110px 0px -48% 0px',threshold:0});
 sections.forEach(section=>observer.observe(section));
 links.forEach(link=>link.addEventListener('click',()=>setCurrent(link.hash.slice(1))));
 setCurrent(location.hash&&sections.some(s=>'#'+s.id===location.hash)?location.hash.slice(1):sections[0].id);
 window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
})();
