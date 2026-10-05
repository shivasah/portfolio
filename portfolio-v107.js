/* v107 - The lifecycle disclosure grows its scene, not the neighboring cards. */
(() => {
 'use strict';
 const section=document.querySelector('body.page-case-agent #agent-lifecycle');
 if(!section)return;
 const details=section.querySelector('details.lifecycle-why');
 const body=details && details.querySelector('.story-accordion__body');
 if(!body)return;
 let previous=-1;
 const sync=()=>{
  const height=details.open ? Math.max(0,body.getBoundingClientRect().height) : 0;
  if(Math.abs(height-previous)<.1)return;
  previous=height;
  section.style.setProperty('--lifecycle-more',height.toFixed(3)+'px');
 };
 // Observe animated body height so the top rows stay fixed during the entire
 // opening/closing motion, not just after the animation has finished.
 if('ResizeObserver' in window)new ResizeObserver(sync).observe(body);
 details.addEventListener('toggle',sync);
 window.addEventListener('resize',sync,{passive:true});
 sync();
})();
