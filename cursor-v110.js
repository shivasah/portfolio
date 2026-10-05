/* Existing controller owns magnetism. The split turns with pointer travel,
   then rests; no continuous idle animation and no extra global scroll work. */
(()=>{'use strict';const cursor=document.querySelector('.cursor-duotone-v110');if(!cursor)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');let last=null,angle=0,target=0,raf=0;
 function tick(){raf=0;const delta=((target-angle+540)%360)-180;angle=(angle+delta*.16+360)%360;cursor.style.setProperty('--cursor-angle',`${angle.toFixed(2)}deg`);if(Math.abs(delta)>.3)raf=requestAnimationFrame(tick);}
 document.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||reduced.matches)return;if(last){const dx=e.clientX-last.x,dy=e.clientY-last.y;if(Math.hypot(dx,dy)>3){target=(Math.atan2(dy,dx)*180/Math.PI+450)%360;if(!raf)raf=requestAnimationFrame(tick);}}last={x:e.clientX,y:e.clientY};},{passive:true});
 function stop(){last=null;cancelAnimationFrame(raf);raf=0;}addEventListener('blur',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
})();
