/* V91 - scroll-driven Agent Management city analogy.
 * Scene artwork/physics adapted from the supplied Intelligent intersection HTML.
 * Four narrative phases scrub with native scroll; only the final live junction loops.
 * All content, fonts, navigation, and controls belong to the portfolio.
 */
(() => {
'use strict';
const root=document.querySelector('[data-agent-city-story]');
if(!root) return;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let controller=null;
function activate(){
  root.classList.toggle('is-reduced',reduced.matches);
  if(reduced.matches){controller?.suspend();return;}
  if(!controller){
    try{controller=buildScene();}
    catch(error){root.classList.remove('is-enhanced','is-ready');console.warn('City story: using the readable still fallback.',error);}
  }
  controller?.refresh();
}
function buildScene(){
root.classList.add('is-enhanced');

const BG='#f3f0e7', OR='#9c4e3b', INK='#292e26';
const WORLD=120, RW=1.2, SW=0.6, TX=60, TY=60, STOP=1.8, DUR=7, FDT=1/60;
const mod=(a,n)=>((a%n)+n)%n, clamp=(v,a,b)=>v<a?a:v>b?b:v;
const sstep=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t)};
const s5=u=>{u=clamp(u,0,1);return u*u*u*(u*(u*6-15)+10)};
const backOut=(u,s=1.8)=>{u=clamp(u,0,1);const v=u-1;return 1+(s+1)*v*v*v+s*v*v};
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const colorCache=new Map();
const hex=h=>{let c=colorCache.get(h);if(!c){c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));colorCache.set(h,c);}return c;};
const shade=(h,k)=>'rgb('+hex(h).map(v=>Math.round(clamp(v*k,0,255))).join(',')+')';
const mix=(a,b,k)=>{const A=hex(a),B=hex(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*k)).join(',')+')'};
const orA=a=>'rgba(156,78,59,'+a.toFixed(3)+')', ylA=a=>'rgba(230,216,184,'+a.toFixed(3)+')';

/* ---------------- responsive canvas ---------------- */
const cv=root.querySelector('.agent-city-story__canvas'), ctx=cv.getContext('2d', {alpha:false});
if(!ctx){root.classList.remove('is-enhanced');return null;}
let W=2,H=2,DPR=1,CW=1,sceneScale=1,originX=.5,originY=.5;
function resize(){
  const r=cv.getBoundingClientRect();
  if(r.width<1 || r.height<1) return;
  const portrait=r.width<800 && r.height>r.width*.8;
  // Keep the junction clear of the text; retain the supplied camera animation.
  sceneScale=portrait?1:.78; originX=portrait?.5:.69; originY=portrait?.70:.57;
  DPR=Math.min(window.devicePixelRatio||1,1.5,Math.sqrt(3000000/(r.width*r.height)));
  CW=Math.max(1,r.width); W=Math.max(2,Math.round(r.width*DPR)); H=Math.max(2,Math.round(r.height*DPR));
  if(cv.width!==W || cv.height!==H){cv.width=W;cv.height=H;}
}

/* ---------------- camera ---------------- */
// frame width in world units, keyframed in log space -> one continuous decelerating dive
const KT=[0,1.5,3,4.5,6,7], KV=[700,170,80,44,34.6,34].map(Math.log), KM=[-0.55,-0.72,-0.45,-0.28,-0.03,0];
function lnDen(t){if(t<=0)return KV[0];if(t>=7)return KV[5];let i=0;while(t>KT[i+1])i++;const h=KT[i+1]-KT[i],s=(t-KT[i])/h,s2=s*s,s3=s2*s;
  return(2*s3-3*s2+1)*KV[i]+(s3-2*s2+s)*h*KM[i]+(-2*s3+3*s2)*KV[i+1]+(s3-s2)*h*KM[i+1];}
let unit=1,ucss=1,D=100,cIX=0,cIY=0,PX=0,PY=0;
function setCam(t){const den=Math.exp(lnDen(t));unit=W*sceneScale/den;ucss=CW*sceneScale/den;D=den*1.6;const e=s5(t/4.6);
  const cx=56.5+3.5*e, cy=63.5-3.5*e, cz=0.9*e; cIX=(cx-cy)*0.866; cIY=(cx+cy)*0.5-cz*0.9;}
// isometric projection with a weak height-based perspective term for parallax
function P(x,y,z){const f=D/(D-z*0.55);PX=W*originX+((x-y)*0.866-cIX)*unit*f;PY=H*originY+((x+y)*0.5-z*0.9-cIY)*unit*f;}
function mv(x,y,z){P(x,y,z);ctx.moveTo(PX,PY)}
function ln(x,y,z){P(x,y,z);ctx.lineTo(PX,PY)}
function circ(x,y,r){ctx.beginPath();ctx.arc(x,y,Math.max(0.1,r),0,6.2832);ctx.fill();}
function onScr(x,y,m){P(x,y,0);return PX>-m&&PX<W+m&&PY>-m&&PY<H+m;}

function box(x0,y0,x1,y1,z0,z1,top,left,right,stroke,lw){
  ctx.beginPath();mv(x0,y1,z0);ln(x1,y1,z0);ln(x1,y1,z1);ln(x0,y1,z1);ctx.closePath();ctx.fillStyle=left;ctx.fill();
  ctx.beginPath();mv(x1,y1,z0);ln(x1,y0,z0);ln(x1,y0,z1);ln(x1,y1,z1);ctx.closePath();ctx.fillStyle=right;ctx.fill();
  ctx.beginPath();mv(x0,y0,z1);ln(x1,y0,z1);ln(x1,y1,z1);ln(x0,y1,z1);ctx.closePath();ctx.fillStyle=top;ctx.fill();
  if(stroke){ctx.beginPath();mv(x0,y1,z0);ln(x1,y1,z0);ln(x1,y0,z0);ln(x1,y0,z1);ln(x0,y0,z1);ln(x0,y1,z1);ctx.closePath();
    mv(x1,y1,z0);ln(x1,y1,z1);ln(x0,y1,z1);mv(x1,y1,z1);ln(x1,y0,z1);ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}
}

/* ---------------- city ---------------- */
const R=rng(20260611);
const blocks=[], statics=[];
const PALS=[['#FDFDF8','#ECEBE2','#D9D7CB'],['#F8F4EA','#EAE4D7','#D5CEBF'],['#F5F5F1','#E2E2DC','#CACAC3'],['#FFFDF6','#EFEADD','#DDD5C4']];
const DARK=['#46474C','#36373C','#2A2B2F'];
function mkB(x0,y0,x1,y1,h,o){o=o||{};if(x1-x0<0.6||y1-y0<0.6)return;
  const b={type:'b',boxes:[],roof:[],spire:null,dark:!!o.dark,tower:!!o.tower,grid:R()<0.45,pal:o.dark?DARK:PALS[(R()*PALS.length)|0]};
  if(o.tower){const t1=h*(0.55+R()*0.15);b.boxes.push([x0,y0,x1,y1,0,t1]);const i=Math.min(x1-x0,y1-y0)*0.16;
    b.boxes.push([x0+i,y0+i,x1-i,y1-i,t1,h]);
    if(R()<0.45)b.spire=[(x0+x1)/2,(y0+y1)/2,h,h+1.2+R()*1.6];
    else{const j=i*2.3;b.boxes.push([x0+j,y0+j,x1-j,y1-j,h,h+0.55]);}}
  else{b.boxes.push([x0,y0,x1,y1,0,h]);
    if(R()<0.45&&x1-x0>1.6&&y1-y0>1.6){const w=0.45+R()*0.5,rx=x0+0.3+R()*Math.max(0,x1-x0-w-0.6),ry=y0+0.3+R()*Math.max(0,y1-y0-w-0.6);b.roof.push([rx,ry,rx+w,ry+w*0.8,h,h+0.32]);}}
  const last=b.boxes[b.boxes.length-1];b.top=b.spire?b.spire[3]:last[5];b.hs=b.boxes[1]?b.boxes[1][5]:last[5];
  b.f=[x0,y0,x1,y1];b.x=(x0+x1)/2;b.y=(y0+y1)/2;b.key=b.x+b.y;statics.push(b);}
function split(x0,y0,x1,y1,m){const g=0.45,fx=x0+(x1-x0)*(0.38+R()*0.24),fy=y0+(y1-y0)*(0.38+R()*0.24);
  if(m===1)return[[x0,y0,x1,y1]];if(m===2)return[[x0,y0,fx-g/2,y1],[fx+g/2,y0,x1,y1]];
  if(m===3)return[[x0,y0,x1,fy-g/2],[x0,fy+g/2,x1,y1]];
  if(m===4)return[[x0,y0,fx-g/2,fy-g/2],[fx+g/2,y0,x1,fy-g/2],[x0,fy+g/2,fx-g/2,y1],[fx+g/2,fy+g/2,x1,y1]];
  return[[x0,y0,fx-g/2,y1],[fx+g/2,y0,x1,fy-g/2],[fx+g/2,fy+g/2,x1,y1]];}
const ins=(l,a)=>[l[0]+a*R(),l[1]+a*R(),l[2]-a*R(),l[3]-a*R()];
function addTree(x,y,r){statics.push({type:'t',x,y,r:r||0.32+R()*0.14,h:0.95+R()*0.5,key:x+y,ph:R()*6.28,top:1.5});}
function treeLot(l,sp){for(let x=l[0]+sp/2;x<l[2]-0.1;x+=sp)for(let y=l[1]+sp/2;y<l[3]-0.1;y+=sp)if(R()<0.85)addTree(x+(R()-0.5)*0.3,y+(R()-0.5)*0.3);}

for(let bi=0;bi<12;bi++)for(let bj=0;bj<12;bj++){
  const bx=bi*10,by=bj*10,x0=bx+RW+SW,y0=by+RW+SW,x1=bx+10-RW-SW,y1=by+10-RW-SW;
  const d=Math.hypot(bx+5-TX,by+5-TY);if(d>68)continue;
  const back=(bi+bj)<12, blk={x0,y0,x1,y1,park:false,plaza:false};blocks.push(blk);const L=[x0,y0,x1,y1];
  if(bi===6&&bj===6){ // open plaza in front of the junction, trees toward the viewer
    blk.plaza=true;blk.green=[x0+2.4,y0+2.4,x1-0.3,y1-0.3];treeLot(blk.green,1.25);
    mkB(x0+0.5,y1-1.6,x0+1.5,y1-0.5,0.6);mkB(x1-1.6,y0+0.5,x1-0.5,y0+1.4,0.7);
  }else if((bi===5&&bj===6)||(bi===6&&bj===5)){ // low-rise flanks keep queues readable
    split(...L,4).forEach((l,i)=>{l=ins(l,0.25);if(i===3&&R()<0.6)treeLot(l,1.2);else mkB(...l,1.0+R()*1.1);});
  }else if(bi===5&&bj===5){ // backdrop behind the junction
    split(...L,5).forEach((l,i)=>{l=ins(l,0.25);if(i===1)mkB(...l,12.5,{tower:true});else mkB(...l,i===0?6.5:4.6);});
  }else{
    const pt=back?(d<32?0.5:0.24):(d<26?0.1:0.2), r=R();
    if(r<0.1&&d>12){blk.park=true;treeLot(L,1.3);}
    else if(r<0.1+pt){const ls=split(...L,R()<0.5?5:2),ti=(R()*ls.length)|0;
      ls.forEach((l,i)=>{l=ins(l,0.25);if(i===ti)mkB(...l,9+R()*(back?11:6),{tower:true,dark:R()<0.28});else mkB(...l,2.4+R()*3.6);});}
    else{const m=1+((R()*5)|0),cap=(!back&&d<26)?4:6.5;
      split(...L,m).forEach(l=>{l=ins(l,0.3);if(R()<0.08)treeLot(l,1.2);else mkB(...l,(d>40?1.4:2.3)+R()*(cap-2.2));});}
  }
}
// street trees (kept off the streets that feed the monitored junction)
for(let j=0;j<12;j++){const Rr=j*10;for(let k=0;k<12;k++){const a=k*10+RW+SW+0.9,b=(k+1)*10-RW-SW-0.9,mid=(a+b)/2;
  for(const ax of ['x','y'])for(const side of[-1,1]){if(R()>0.3)continue;
    if(Rr===60&&Math.abs(mid-60)<16)continue;
    const o=Rr+side*(RW+SW/2);for(let s=a;s<=b;s+=2.1){const x=ax==='x'?s:o,y=ax==='x'?o:s;if(Math.hypot(x-TX,y-TY)<64)addTree(x,y,0.3);}}}}
// signal poles at every junction: [dx,dy, arm dir, arm length, controlled axis]
const POLE=[[-1.5,-1.5,0,1,0.9,'x'],[1.5,-1.5,-1,0,2.1,'y'],[1.5,1.5,0,-1,0.9,'x'],[-1.5,1.5,1,0,2.1,'y']];
for(let i=0;i<12;i++)for(let j=0;j<12;j++){const X=i*10,Y=j*10;if(Math.hypot(X-TX,Y-TY)>62)continue;
  for(const p of POLE)statics.push({type:'p',x:X+p[0],y:Y+p[1],ax:p[2],ay:p[3],al:p[4],axis:p[5],ix:i,iy:j,key:X+p[0]+Y+p[1],top:3.2,target:i===6&&j===6});}
statics.sort((a,b)=>a.key-b.key);
const buildings=statics.filter(o=>o.type==='b');

/* ---------------- traffic ---------------- */
const LO=rng(4242), offsets=[];for(let i=0;i<144;i++)offsets.push(LO()*8);
const JAM0=0.8, REL=6.05;
function green(ix,iy,axis,t){let ph;
  if(ix===6&&iy===6&&t>=JAM0){if(t<REL)return false;ph=mod(t-REL,8);}
  else ph=mod(t+offsets[ix*12+iy],8);
  return axis==='x'?ph<3.4:(ph>=4&&ph<7.4);}
// vehicle colours taken from the sticky notes on the Agent Management case study
const CARC=['#e6d8b8','#e6d8b8','#e6d8b8','#d7decd','#f3f0e7','#f3f0e7','#e6d8b8','#d7decd','#f3f0e7'];
function mkCar(r){const t=r();let c;
  if(t<0.07)c={k:'bus',L:2.2,Wd:0.62,H:0.64,vmax:3.6+r()*0.6};
  else if(t<0.16)c={k:'van',L:1.15,Wd:0.56,H:0.52,vmax:4+r()*0.9};
  else if(t<0.2)c={k:'taxi',L:0.98,Wd:0.52,H:0.36,vmax:4.4+r()*0.9};
  else c={k:'car',L:0.92+r()*0.12,Wd:0.5,H:0.34,vmax:4.3+r()*1.1};
  const col=c.k==='taxi'?'#e6d8b8':c.k==='bus'?(r()<0.5?'#f3f0e7':'#e6d8b8'):CARC[(r()*CARC.length)|0];
  c.col=[col,shade(col,0.93),shade(col,0.8)];c.v=0;c.p=0;c.np=0;c.brake=false;return c;}
const DENS={'x60:1':2.0,'y60:1':2.6,'x60:-1':5.2,'y60:-1':3.8};
const CR0=rng(777), lanes=[], TL={};
for(let j=0;j<12;j++){const Rr=j*10;for(const axis of['x','y'])for(const dir of[1,-1]){
  const ln={axis,R:Rr,dir,off:Rr-0.6*dir,cars:[]};const key=axis+Rr+':'+dir;const m=DENS[key]||(4.6+CR0()*3);
  let p=CR0()*WORLD,run=0;while(run<WORLD-3){const c=mkCar(CR0);c.p=mod(p,WORLD);c.v=c.vmax*0.8;c.ln=ln;ln.cars.push(c);
    const g=0.7+(-Math.log(1-CR0()*0.95))*(m-1);p+=dir*(c.L+g);run+=c.L+g;}
  if(Rr===60){ln.target=true;TL[axis+(dir>0?'p':'n')]=ln;}
  lanes.push(ln);}}
function step(dt,t){
  for(const ln of lanes){const cs=ln.cars,n=cs.length,dir=ln.dir;
    for(let k=0;k<n;k++){const c=cs[k],ld=cs[(k+1)%n];
      let obs=n>1?mod((ld.p-c.p)*dir,WORLD)-(ld.L+c.L)/2:999;
      const front=c.p+dir*c.L/2;let ci,ds;
      if(dir>0){ci=Math.ceil((front-0.05+STOP)/10)*10;ds=ci-STOP-front;}else{ci=Math.floor((front+0.05-STOP)/10)*10;ds=front-(ci+STOP);}
      if(ds>-0.05&&ds<7){const cm=mod(ci,WORLD)/10,ix=ln.axis==='x'?cm:ln.R/10,iy=ln.axis==='x'?ln.R/10:cm;
        if(!green(ix,iy,ln.axis,t))obs=Math.min(obs,ds);}
      const des=c.vmax*clamp((obs-0.3)/2.4,0,1);
      c.v=Math.max(0,c.v+clamp(des-c.v,-10*dt,2.8*dt));c.brake=des<c.v-0.05||c.v<0.4;c.np=c.p+c.v*dt*dir;}
    for(const c of cs)c.p=mod(c.np,WORLD);}
}

/* ---------------- monitoring cameras ---------------- */
const cams=[
  {px:58.5,py:58.5,ln:'xp',start:4.55,aim:[52.6,59.4]},
  {px:61.5,py:58.5,ln:'yp',start:4.78,aim:[59.4,52.6]},
  {px:61.5,py:61.5,ln:'xn',start:5.01,aim:[67.4,60.6]},
  {px:58.5,py:61.5,ln:'yn',start:5.24,aim:[60.6,67.4]},
].map(c=>{c.type='k';c.key=c.px+c.py+0.05;c.a=Math.atan2(c.aim[1]-c.py,c.aim[0]-c.px);c.a0=c.a+Math.PI*0.5;return c;});
const QORDER=['xp','yp','xn','yn'], qs={xp:0,yp:0,xn:0,yn:0};
function stopC(l){return l.dir>0?60-STOP:60+STOP}
function queueExt(l){const s=stopC(l),arr=[];
  for(const c of l.cars){const ds=(s-(c.p+l.dir*c.L/2))*l.dir;if(ds>-0.3&&ds<18)arr.push([ds,c]);}
  arr.sort((a,b)=>a[0]-b[0]);let last=0;for(const[ds,c]of arr){if(c.v>1.3||ds-last>1.6)break;last=ds+c.L;}return last;}

/* ---------------- clouds ---------------- */
const CL=rng(99), clouds=[];
for(let i=0;i<46;i++){const n=4+((CL()*4)|0),puffs=[];
  for(let k=0;k<n;k++){const u=(k/(n-1))*2-1,rr=0.3+CL()*0.28+(1-Math.abs(u))*0.26;puffs.push([u*0.95+(CL()-0.5)*0.15,-rr*0.55-(1-Math.abs(u))*0.12,rr]);}
  clouds.push({a:CL()*6.283,r:0.05+Math.pow(CL(),0.9)*1.1,z:0.45+(i/46)*4.6+CL()*0.25,s:0.55+CL()*0.75,puffs});}
clouds.sort((p,q)=>q.z-p.z);
const ocv=document.createElement('canvas'),octx=ocv.getContext('2d');
function cloudPath(c2,cx,cy,S,pf,dy,k){c2.beginPath();for(const p of pf){const x=cx+p[0]*S,y=cy+p[1]*S+dy,r=p[2]*S*k;c2.moveTo(x+r,y);c2.arc(x,y,r,0,6.2832);}
  c2.moveTo(cx+1.25*S*k,cy-0.12*S+dy);c2.ellipse(cx,cy-0.12*S+dy,1.25*S*k,0.24*S*k,0,0,6.2832);}
function drawClouds(t){if(t>2)return;
  const c=5.1*(0.5-0.5*Math.cos(Math.PI*clamp(t/1.8,0,1))),sh=mix(BG,'#E4E2D5',sstep(0,0.45,t));
  for(const cl of clouds){const d=cl.z-c;if(d<0.06)continue;const k=1/d;
    const al=clamp((d-0.06)/0.32,0,1)*clamp((5.4-d)/0.8,0,1);if(al<0.01)continue;
    const cx=W*0.5+Math.cos(cl.a)*cl.r*k*W*0.26,cy=H*0.5+Math.sin(cl.a)*cl.r*k*W*0.17-k*W*0.012,S=cl.s*k*W*0.075;
    const bx0=Math.max(0,Math.floor(cx-S*2.4)),bx1=Math.min(W,Math.ceil(cx+S*2.4)),by0=Math.max(0,Math.floor(cy-S*1.9)),by1=Math.min(H,Math.ceil(cy+S*0.5));
    if(bx1<=bx0||by1<=by0)continue;
    if(al>0.995){cloudPath(ctx,cx,cy,S,cl.puffs,S*0.06,1);ctx.fillStyle=sh;ctx.fill();cloudPath(ctx,cx,cy,S,cl.puffs,-S*0.02,0.96);ctx.fillStyle=BG;ctx.fill();continue;}
    const w=bx1-bx0,h=by1-by0;if(ocv.width<w)ocv.width=w;if(ocv.height<h)ocv.height=h;
    octx.setTransform(1,0,0,1,0,0);octx.clearRect(0,0,w,h);octx.translate(-bx0,-by0);
    cloudPath(octx,cx,cy,S,cl.puffs,S*0.06,1);octx.fillStyle=sh;octx.fill();cloudPath(octx,cx,cy,S,cl.puffs,-S*0.02,0.96);octx.fillStyle=BG;octx.fill();
    ctx.globalAlpha=al;ctx.drawImage(ocv,0,0,w,h,bx0,by0,w,h);ctx.globalAlpha=1;}
}

/* ---------------- ground layers ---------------- */
function drawGround(){
  ctx.fillStyle='#f3f0e7';ctx.beginPath();mv(0,0,0);ln(WORLD,0,0);ln(WORLD,WORLD,0);ln(0,WORLD,0);ctx.closePath();ctx.fill();
  const m=unit*9,q=(b)=>{mv(b[0],b[1],0);ln(b[2],b[1],0);ln(b[2],b[3],0);ln(b[0],b[3],0);ctx.closePath();};
  ctx.beginPath();for(const b of blocks)if(!b.park&&!b.plaza&&onScr((b.x0+b.x1)/2,(b.y0+b.y1)/2,m))q([b.x0,b.y0,b.x1,b.y1]);ctx.fillStyle='#e4dfd2';ctx.fill();
  ctx.beginPath();for(const b of blocks)if(b.plaza)q([b.x0,b.y0,b.x1,b.y1]);ctx.fillStyle='#f3f0e7';ctx.fill();
  ctx.beginPath();for(const b of blocks){if(b.park)q([b.x0,b.y0,b.x1,b.y1]);if(b.plaza)q(b.green);}ctx.fillStyle='#DEE2CD';ctx.fill();
  ctx.beginPath();for(let j=0;j<12;j++){const r=j*10;q([0,r-RW,WORLD,r+RW]);q([r-RW,0,r+RW,WORLD]);}ctx.fillStyle='#252f29';ctx.fill();
}
function drawMarks(){if(ucss<4.5)return;
  ctx.beginPath();const dl=0.65;
  for(let j=0;j<12;j++){const r=j*10;for(let k=0;k<12;k++){const a=k*10+RW+0.5,b=k*10+10-RW-0.5,mid=(a+b)/2;
    if(onScr(mid,r,unit*7))for(let s=a;s<b-0.1;s+=dl*2){mv(s,r,0);ln(Math.min(s+dl,b),r,0);}
    if(onScr(r,mid,unit*7))for(let s=a;s<b-0.1;s+=dl*2){mv(r,s,0);ln(r,Math.min(s+dl,b),0);}}}
  ctx.strokeStyle='rgba(243,240,231,0.45)';ctx.lineWidth=Math.max(1,unit*0.05);ctx.lineCap='butt';ctx.stroke();
  if(ucss<8)return;
  ctx.beginPath();const stops=[];
  for(let i=0;i<12;i++)for(let j=0;j<12;j++){const X=i*10,Y=j*10;if(!onScr(X,Y,unit*4))continue;stops.push([X,Y]);
    for(const sg of[-1,1]){const a=X+sg*1.3,b=X+sg*1.65,c=Y+sg*1.3,d=Y+sg*1.65;
      for(let y=Y-1.05;y<Y+1.0;y+=0.3){mv(a,y,0);ln(b,y,0);ln(b,y+0.15,0);ln(a,y+0.15,0);ctx.closePath();}
      for(let x=X-1.05;x<X+1.0;x+=0.3){mv(x,c,0);ln(x+0.15,c,0);ln(x+0.15,d,0);ln(x,d,0);ctx.closePath();}}}
  ctx.fillStyle='rgba(243,240,231,0.72)';ctx.fill();
  ctx.beginPath();for(const[X,Y]of stops){const s=STOP-0.05;
    mv(X-s,Y-1.15,0);ln(X-s,Y-0.05,0);mv(X+s,Y+0.05,0);ln(X+s,Y+1.15,0);mv(X-1.15,Y-s,0);ln(X-0.05,Y-s,0);mv(X+0.05,Y+s,0);ln(X+1.15,Y+s,0);}
  ctx.strokeStyle='rgba(243,240,231,0.8)';ctx.lineWidth=Math.max(1,unit*0.06);ctx.stroke();
}
function drawShadows(){ctx.beginPath();
  for(const b of buildings){if(!onScr(b.x,b.y,unit*16))continue;const[x0,y0,x1,y1]=b.f,h=b.hs,a=0.5*h,c=0.14*h;
    mv(x0,y0,0);ln(x1,y0,0);ln(x1+a,y0+c,0);ln(x1+a,y1+c,0);ln(x0+a,y1+c,0);ln(x0,y1,0);ctx.closePath();}
  ctx.fillStyle='rgba(41,46,38,0.07)';ctx.fill();}
function drawDecals(t){
  // congestion: soft orange heat under queued lanes
  const qa=0.42*sstep(2.9,3.7,t)*(1-sstep(4.7,5.8,t));
  if(qa>0.004)for(const k of QORDER){const l=TL[k],e=qs[k];if(e<0.4)continue;const s=stopC(l),en=s-l.dir*e,hw=0.46,o=l.off;
    const pts=l.axis==='x'?[[s,o-hw],[en,o-hw],[en,o+hw],[s,o+hw]]:[[o-hw,s],[o-hw,en],[o+hw,en],[o+hw,s]];
    P(...(l.axis==='x'?[s,o]:[o,s]),0);const hx=PX,hy=PY;P(...(l.axis==='x'?[en,o]:[o,en]),0);
    const g=ctx.createLinearGradient(hx,hy,PX,PY);g.addColorStop(0,ylA(qa));g.addColorStop(1,ylA(qa*0.12));
    ctx.beginPath();pts.forEach((p,i)=>i?ln(p[0],p[1],0):mv(p[0],p[1],0));ctx.closePath();ctx.fillStyle=g;ctx.fill();
    ctx.beginPath();if(l.axis==='x'){mv(s,o-hw,0);ln(s,o+hw,0);}else{mv(o-hw,s,0);ln(o+hw,s,0);}
    ctx.strokeStyle=ylA(Math.min(0.95,qa*2.2));ctx.lineWidth=Math.max(1.2,unit*0.07);ctx.stroke();}
  // camera fields of view
  for(const c of cams){const p=t-c.start;if(p<0.55)continue;const l=TL[c.ln],g=s5((p-0.6)/0.5);if(g<=0)continue;
    const bl=0.42,ax=c.px+Math.cos(c.a)*bl,ay=c.py+Math.sin(c.a)*bl,s=stopC(l),F=1.6+6.6*g,fc=s-l.dir*F,w=1.15;
    const FL=l.axis==='x'?[fc,l.off-w]:[l.off-w,fc],FR=l.axis==='x'?[fc,l.off+w]:[l.off+w,fc],FC=l.axis==='x'?[fc,l.off]:[l.off,fc];
    P(ax,ay,0);const x0=PX,y0=PY;P(FC[0],FC[1],0);
    const gr=ctx.createLinearGradient(x0,y0,PX,PY);gr.addColorStop(0,orA(0.32*g));gr.addColorStop(1,orA(0));
    ctx.beginPath();mv(ax,ay,0);ln(FL[0],FL[1],0);ln(FR[0],FR[1],0);ctx.closePath();ctx.fillStyle=gr;ctx.fill();
    const ge=ctx.createLinearGradient(x0,y0,PX,PY);ge.addColorStop(0,orA(0.85*g));ge.addColorStop(1,orA(0));
    ctx.beginPath();mv(ax,ay,0);ln(FL[0],FL[1],0);mv(ax,ay,0);ln(FR[0],FR[1],0);ctx.strokeStyle=ge;ctx.lineWidth=Math.max(1,unit*0.03);ctx.stroke();
    // a single scan on activation, then a quiet periodic one
    let q=(p-0.65)/0.6,qa2=0.6;if(q>1){q=mod(p-1.25,3.4)/1.1;qa2=0.28;}
    if(q>=0&&q<=1){const L1=[ax+(FL[0]-ax)*q,ay+(FL[1]-ay)*q],R1=[ax+(FR[0]-ax)*q,ay+(FR[1]-ay)*q];
      ctx.beginPath();mv(L1[0],L1[1],0);ln(R1[0],R1[1],0);ctx.strokeStyle=orA(qa2*(1-q)*g);ctx.lineWidth=Math.max(1,unit*0.04);ctx.stroke();}}
}

/* ---------------- objects ---------------- */
function drawBuilding(b){const st=b.dark?'rgba(20,20,22,0.6)':'rgba(41,46,38,0.30)',lw=clamp(unit*0.025,0.6,1.8*DPR),[tp,lf,rt]=b.pal;
  for(const x of b.boxes){box(x[0],x[1],x[2],x[3],x[4],x[5],tp,lf,rt,st,lw);if(ucss>9)windows(b,x);}
  if(ucss>6)for(const r of b.roof)box(r[0],r[1],r[2],r[3],r[4],r[5],tp,lf,rt,st,lw*0.8);
  if(b.spire){ctx.beginPath();mv(b.spire[0],b.spire[1],b.spire[2]);ln(b.spire[0],b.spire[1],b.spire[3]);ctx.strokeStyle=INK;ctx.lineWidth=Math.max(1,unit*0.05);ctx.lineCap='round';ctx.stroke();}}
function windows(b,x){const[x0,y0,x1,y1,z0,z1]=x;if(z1-z0<1.1)return;const sp=b.tower?0.55:0.8,i=0.18;ctx.beginPath();
  for(let z=z0+0.55;z<z1-0.3;z+=sp){mv(x0+i,y1,z);ln(x1-i,y1,z);mv(x1,y0+i,z);ln(x1,y1-i,z);}
  if(b.tower||b.grid){const vs=b.tower?0.5:0.75;for(let a=x0+vs;a<x1-0.15;a+=vs){mv(a,y1,z0+0.35);ln(a,y1,z1-0.25);}for(let a=y0+vs;a<y1-0.15;a+=vs){mv(x1,a,z0+0.35);ln(x1,a,z1-0.25);}}
  ctx.strokeStyle=b.dark?'rgba(243,240,231,0.14)':'rgba(41,46,38,0.11)';ctx.lineWidth=Math.max(0.5,unit*0.018);ctx.stroke();}
function drawTree(o,t){const sw=Math.sin(t*1.4+o.ph)*0.025;
  if(ucss>6){ctx.beginPath();mv(o.x,o.y,0);ln(o.x,o.y,o.h*0.45);ctx.strokeStyle='rgba(41,46,38,0.5)';ctx.lineWidth=Math.max(0.8,unit*0.04);ctx.stroke();}
  P(o.x+sw,o.y-sw,o.h*0.72);const r=o.r*unit*(D/(D-o.h*0.4));
  ctx.fillStyle='#BCC2A6';circ(PX,PY,r);ctx.fillStyle='#D2D7BF';circ(PX-r*0.22,PY-r*0.26,r*0.7);
  if(ucss>10){ctx.beginPath();ctx.arc(PX,PY,r,0,6.2832);ctx.strokeStyle='rgba(41,46,38,0.16)';ctx.lineWidth=Math.max(0.6,unit*0.016);ctx.stroke();}}
function drawPole(o,t){const zt=3,lw=Math.max(1,unit*0.055),hx=o.x+o.ax*o.al,hy=o.y+o.ay*o.al;
  ctx.beginPath();mv(o.x,o.y,0);ln(o.x,o.y,zt);ln(hx,hy,zt);ctx.strokeStyle=INK;ctx.lineWidth=lw;ctx.lineCap='round';ctx.stroke();
  if(ucss>9){box(hx-0.1,hy-0.1,hx+0.1,hy+0.1,zt-0.44,zt-0.02,'#252f29','#252f29',INK,null);
    if(o.target){P(hx+0.1,hy+0.1,zt-0.22);ctx.fillStyle=green(o.ix,o.iy,o.axis,t)?'#86AE91':'#d7decd';circ(PX,PY,Math.max(1.3*DPR,unit*0.055));}}}
function band(x0,y0,x1,y1,za,zb,col){ctx.beginPath();mv(x0+0.08,y1,za);ln(x1-0.08,y1,za);ln(x1-0.08,y1,zb);ln(x0+0.08,y1,zb);ctx.closePath();
  mv(x1,y0+0.08,za);ln(x1,y1-0.08,za);ln(x1,y1-0.08,zb);ln(x1,y0+0.08,zb);ctx.closePath();ctx.fillStyle=col;ctx.fill();}
function drawCar(c,t){const l=c.ln,ax=l.axis==='x',d=l.dir,x=ax?c.p:l.off,y=ax?l.off:c.p,hl=c.L/2,hw=c.Wd/2;
  const x0=ax?x-hl:x-hw,x1=ax?x+hl:x+hw,y0=ax?y-hw:y-hl,y1=ax?y+hw:y+hl,[tp,lf,rt]=c.col;
  if(ucss<7){ctx.fillStyle=tp;ctx.beginPath();mv(x0,y0,0.2);ln(x1,y0,0.2);ln(x1,y1,0.2);ln(x0,y1,0.2);ctx.fill();return;}
  const st=ucss>16?'rgba(41,46,38,0.42)':null,lw=Math.max(0.6,unit*0.022);
  if(c.k==='bus'||c.k==='van'){box(x0,y0,x1,y1,0.06,c.H,tp,lf,rt,st,lw);if(ucss>10)band(x0,y0,x1,y1,c.H*0.45,c.H*0.78,'#3E3F44');}
  else{const bz=c.H*0.55;box(x0,y0,x1,y1,0.06,bz,tp,lf,rt,st,lw);
    if(ucss>11){const sh=-0.08*c.L*d,ca=hl*0.48;const cx0=ax?x+sh-ca:x0+0.05,cx1=ax?x+sh+ca:x1-0.05,cy0=ax?y0+0.05:y+sh-ca,cy1=ax?y1-0.05:y+sh+ca;
      box(cx0,cy0,cx1,cy1,bz,c.H,tp,'#4A4B50','#3C3D42',st,lw);
      if(c.k==='taxi'){const mx=(cx0+cx1)/2,my=(cy0+cy1)/2;box(mx-0.08,my-0.08,mx+0.08,my+0.08,c.H,c.H+0.07,'#252f29','#252f29',INK,null);}}}
}
function drawCam(c,t){const p=t-c.start;if(p<0)return;
  const bl=0.42*backOut(p/0.22,2.2);let sc=backOut((p-0.1)/0.28,1.9);const _u=backOut((p-0.1)/0.28,1.9),yaw=c.a0+(c.a-c.a0)*backOut((p-0.34)/0.34,1.6);
  const ox=Math.cos(c.a),oy=Math.sin(c.a),mx=c.px+ox*bl,my=c.py+oy*bl,mz=2.68;
  ctx.beginPath();mv(c.px,c.py,mz);ln(mx,my,mz);ctx.strokeStyle=INK;ctx.lineWidth=Math.max(1.4,unit*0.05);ctx.lineCap='round';ctx.stroke();
  P(c.px,c.py,mz);ctx.fillStyle=INK;circ(PX,PY,Math.max(1.5,unit*0.05));
  if(sc<0.02)return;
  sc*=1.35;const L=0.66*sc,Wd=0.3*sc,Hh=0.27*sc,yx=Math.cos(yaw),yy=Math.sin(yaw),cx=mx+yx*0.18*sc,cy=my+yy*0.18*sc,z0=mz-Hh*0.55,z1=mz+Hh*0.45;
  const loc=[[L/2,Wd/2],[L/2,-Wd/2],[-L/2,-Wd/2],[-L/2,Wd/2]].map(([a,b])=>[cx+a*yx-b*yy,cy+a*yy+b*yx]);
  const faces=[];for(let i=0;i<4;i++){const A=loc[i],B=loc[(i+1)%4],mxF=(A[0]+B[0])/2,myF=(A[1]+B[1])/2,nx=mxF-cx,ny=myF-cy,nl=Math.hypot(nx,ny)||1;
    if((nx+ny)/nl>0.02)faces.push({A,B,i,nx:nx/nl,ny:ny/nl,k:mxF+myF});}
  faces.sort((a,b)=>a.k-b.k);const lw=Math.max(0.8,unit*0.022);
  for(const f of faces){const s=clamp(0.5+0.5*(f.ny-f.nx)/1.414,0,1);
    ctx.beginPath();mv(f.A[0],f.A[1],z0);ln(f.B[0],f.B[1],z0);ln(f.B[0],f.B[1],z1);ln(f.A[0],f.A[1],z1);ctx.closePath();
    ctx.fillStyle=mix('#C9441C','#9c4e3b',s);ctx.fill();ctx.strokeStyle='rgba(41,46,38,0.7)';ctx.lineWidth=lw;ctx.stroke();
    if(f.i===0&&ucss>12){P((f.A[0]+f.B[0])/2,(f.A[1]+f.B[1])/2,(z0+z1)/2);const r=0.085*sc*unit;ctx.fillStyle=INK;circ(PX,PY,r);ctx.fillStyle='#5C5D62';circ(PX-r*0.25,PY-r*0.25,r*0.35);}}
  // charcoal sun hood, extended past the lens
  const ext=0.13*sc,h=[[L/2+ext,Wd/2+0.02*sc],[L/2+ext,-Wd/2-0.02*sc],[-L/2,-Wd/2-0.02*sc],[-L/2,Wd/2+0.02*sc]].map(([a,b])=>[cx+a*yx-b*yy,cy+a*yy+b*yx]);
  ctx.beginPath();h.forEach((q,i)=>i?ln(q[0],q[1],z1+0.02):mv(q[0],q[1],z1+0.02));ctx.closePath();ctx.fillStyle=INK;ctx.fill();
  if(p>0.62){const on=p>0.95||(Math.floor((p-0.62)/0.08)%2===0);
    P(cx-yx*L*0.3,cy-yy*L*0.3,z1+0.04);const r=Math.max(1.3*DPR,0.05*sc*unit);
    if(on){ctx.fillStyle='#f3f0e7';circ(PX,PY,r);ctx.fillStyle=OR;circ(PX,PY,r*0.6);}
    const hp=(p-0.62)/0.5;if(hp<1){ctx.beginPath();ctx.arc(PX,PY,r*(1.5+hp*3.5),0,6.2832);ctx.strokeStyle=orA(0.5*(1-hp));ctx.lineWidth=Math.max(1,unit*0.02);ctx.stroke();}}}

const vis=[];
function drawObjects(t){vis.length=0;const m=unit*4;
  for(const o of statics){P(o.x,o.y,0);if(PX<-m*2||PX>W+m*2||PY<-m||PY>H+m+(o.top||0)*unit*1.1)continue;if(o.type==='p'&&ucss<3.5)continue;vis.push(o);}
  for(const l of lanes)for(const c of l.cars){const x=l.axis==='x'?c.p:l.off,y=l.axis==='x'?l.off:c.p;P(x,y,0);if(PX<-m||PX>W+m||PY<-m||PY>H+m)continue;c.key=x+y;c.type='c';vis.push(c);}
  for(const c of cams)if(t>=c.start)vis.push(c);
  vis.sort((a,b)=>a.key-b.key);
  for(const o of vis){switch(o.type){case'b':drawBuilding(o);break;case't':drawTree(o,t);break;case'p':drawPole(o,t);break;case'c':drawCar(o,t);break;case'k':drawCam(o,t);break;}}}
function drawFade(){const r2=60*1.2247*unit;if(r2>Math.hypot(W,H)*2.2)return;P(TX,TY,0);
  ctx.save();ctx.translate(PX,PY);ctx.scale(1,0.577);const g=ctx.createRadialGradient(0,0,0,0,0,r2);
  g.addColorStop(0,'rgba(243,240,231,0)');g.addColorStop(0.68,'rgba(243,240,231,0)');g.addColorStop(1,'rgba(243,240,231,1)');
  ctx.fillStyle=g;ctx.fillRect(-W*12,-H*24,W*24,H*48);ctx.restore();}

// once cameras arrive, quiet the rest of the city so the junction carries the frame
function drawFocus(t){const a=0.34*sstep(4.4,5.3,t);if(a<0.005)return;P(TX,TY,1);
  const r=21*1.2247*unit;ctx.save();ctx.translate(PX,PY);ctx.scale(1,0.6);const g=ctx.createRadialGradient(0,0,r*0.45,0,0,r);
  g.addColorStop(0,'rgba(243,240,231,0)');g.addColorStop(1,'rgba(243,240,231,'+a.toFixed(3)+')');ctx.fillStyle=g;ctx.fillRect(-W*12,-H*24,W*24,H*48);ctx.restore();}
// detection brackets on vehicles inside each camera's field of view
function drawDetect(t){for(const c of cams){const p=t-c.start;if(p<0.6)continue;const l=TL[c.ln],g=s5((p-0.6)/0.5),F=1.6+6.6*g,s=stopC(l);
    ctx.beginPath();let any=false;
    for(const v of l.cars){const ds=(s-(v.p+l.dir*v.L/2))*l.dir;if(ds<-0.2||ds>F-0.3)continue;any=true;
      const ax=l.axis==='x',x=ax?v.p:l.off,y=ax?l.off:v.p,hl=v.L/2+0.12,hw=v.Wd/2+0.12,k=0.2;
      const x0=ax?x-hl:x-hw,x1=ax?x+hl:x+hw,y0=ax?y-hw:y-hl,y1=ax?y+hw:y+hl;
      for(const[cx,cy,sx,sy]of[[x0,y0,1,1],[x1,y0,-1,1],[x1,y1,-1,-1],[x0,y1,1,-1]]){mv(cx+sx*k,cy,0.02);ln(cx,cy,0.02);ln(cx,cy+sy*k,0.02);}
      const zt=v.H+0.06;mv(x0,y0,zt);ln(x0+k,y0,zt);mv(x0,y0,zt);ln(x0,y0+k,zt);mv(x1,y1,zt);ln(x1-k,y1,zt);mv(x1,y1,zt);ln(x1,y1-k,zt);}
    if(any){ctx.strokeStyle=orA(0.95*g);ctx.lineWidth=Math.max(1.2,unit*0.035);ctx.lineCap='round';ctx.stroke();}}}
// redraw cameras above the focus veil so they stay crisp
function drawCamsTop(t){if(t<4.4)return;for(const c of cams)drawCam(c,t);}
function render(t){setCam(Math.min(t,DUR));ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=BG;ctx.fillRect(0,0,W,H);
  const haze=1-s5((t-0.3)/1.3);
  if(haze<0.999){drawGround();drawMarks();drawShadows();drawDecals(t);drawObjects(t);drawFocus(t);drawDetect(t);drawCamsTop(t);drawFade();}
  if(haze>0.001){ctx.globalAlpha=haze;ctx.fillStyle=BG;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;}
  drawClouds(t);}

/* ---------------- deterministic scroll frames ---------------- */
// Bake once in short idle slices. Never replay 7 seconds of traffic simulation
// for each wheel/touch event. Adjacent 30 Hz snapshots interpolate continuously.
const cars=lanes.flatMap(l=>l.cars), snapshots=[], queueFrames=[];
const CACHE_FPS=30, CACHE_STEP=2, TOTAL_STEPS=Math.round(DUR/FDT);
const stage=root.querySelector('.agent-city-story__stage');
const panels=[...root.querySelectorAll('[data-city-panel]')];
const ticks=[...root.querySelectorAll('.agent-city-story__progress i')];
const guide=root.querySelector('[data-city-guide]');
const starts=[0,1.5,3,4.5], ends=[1.5,3,4.5,7];
let warm=0,baked=0,ready=false,preparing=false;
let raf=0,lastNow=0,lastPaint=-1,forcePaint=true;
let startY=0,endY=0,narrativeDistance=1,viewportHeight=1;
let targetT=0,displayT=0,mode='scrub',holdT=DUR,holdAccumulator=0;
let paused=false,phase=-1;

function capture(){
  const values=new Float32Array(cars.length*3);
  cars.forEach((c,i)=>{values[i*3]=c.p;values[i*3+1]=c.v;values[i*3+2]=c.brake?1:0;});
  snapshots.push(values);
  queueFrames.push(Float32Array.from(QORDER,k=>queueExt(TL[k])));
}
function schedulePreparation(){
  if(preparing||ready) return;
  preparing=true;
  const schedule=()=>{
    if('requestIdleCallback' in window) window.requestIdleCallback(prepare,{timeout:120});
    else window.setTimeout(()=>prepare(null),16);
  };
  function prepare(deadline){
    const began=performance.now();
    // Bound initialization slices even when the browser gives a long idle slot.
    do{
      if(warm<1200){step(FDT,-20+warm*FDT);warm++;}
      else if(!snapshots.length){capture();}
      else if(baked<TOTAL_STEPS){step(FDT,baked*FDT);baked++;if(baked%CACHE_STEP===0)capture();}
      else{
        ready=true;preparing=false;applySnapshot(0);resize();render(0);
        root.classList.add('is-ready');refresh();return;
      }
    }while(performance.now()-began<7 && (!deadline||deadline.didTimeout||deadline.timeRemaining()>1));
    schedule();
  }
  schedule();
}
function applySnapshot(t){
  const frame=clamp(t,0,DUR)*CACHE_FPS;
  const a=Math.min(snapshots.length-1,Math.floor(frame)),b=Math.min(snapshots.length-1,a+1),f=frame-a;
  const A=snapshots[a],B=snapshots[b];
  for(let i=0;i<cars.length;i++){
    const j=i*3,c=cars[i];let distance=B[j]-A[j];
    // A car crossing the edge of the circular city must not traverse the map.
    if(distance>WORLD/2)distance-=WORLD;else if(distance<-WORLD/2)distance+=WORLD;
    c.p=mod(A[j]+distance*f,WORLD);c.v=A[j+1]+(B[j+1]-A[j+1])*f;
    c.brake=(f<.5?A[j+2]:B[j+2])>.5;
  }
  QORDER.forEach((k,i)=>{qs[k]=queueFrames[a][i]+(queueFrames[b][i]-queueFrames[a][i])*f;});
}

/* ---------------- native scroll / final live hold ---------------- */
function measure(){
  const rect=root.getBoundingClientRect();
  viewportHeight=window.innerHeight;
  startY=rect.top+window.scrollY;endY=startY+rect.height;
  const pinHeight=stage.getBoundingClientRect().height;
  // 450 svh of storytelling + 100 svh of final hold in a 650 svh section.
  // Derive from actual CSS dimensions rather than assuming a desktop viewport.
  narrativeDistance=Math.max(1,rect.height-pinHeight*2);
}
function setUI(t,isHold){
  const current=t<1.5?0:t<3?1:t<4.5?2:3;
  if(current!==phase){
    phase=current;root.dataset.cityPhase=['clouds','city','junction','cameras'][phase];
  }
  panels.forEach((panel,i)=>{
    const fadeIn=i===0?1:sstep(starts[i]-.10,starts[i]+.16,t);
    const fadeOut=i===3?1:1-sstep(ends[i]-.16,ends[i]+.10,t);
    const opacity=fadeIn*fadeOut;
    panel.style.opacity=opacity.toFixed(3);
    panel.style.transform=`translate3d(0,${((1-fadeIn)*12-(1-fadeOut)*10).toFixed(2)}px,0)`;
  });
  ticks.forEach((tick,i)=>tick.style.setProperty('--city-progress',clamp((t-starts[i])/(ends[i]-starts[i]),0,1).toFixed(3)));
  const nextGuide=isHold?'Scroll to continue':'Scroll to explore';
  if(guide.textContent!==nextGuide)guide.textContent=nextGuide;
  root.dataset.cityMode=isHold?(paused?'paused':'hold'):'scrub';
  // Useful for inspecting the live integration without exposing global APIs.
  root.dataset.cityTime=t.toFixed(3);
}
function visible(){return endY>window.scrollY && startY<window.scrollY+viewportHeight;}
function blocked(){return document.hidden||reduced.matches||document.body.classList.contains('menu-open');}
function request(){
  if(!raf&&!blocked()){raf=requestAnimationFrame(frame);}
}
function suspend(){if(raf)cancelAnimationFrame(raf);raf=0;lastNow=0;}
function refresh(){
  if(reduced.matches)return;
  resize();measure();forcePaint=true;request();
}
function frame(now){
  raf=0;
  if(blocked()||!visible()){lastNow=0;return;}
  if(!ready){schedulePreparation();return;}
  const dt=lastNow?Math.min(.05,(now-lastNow)/1000):1/60;lastNow=now;
  targetT=clamp((window.scrollY-startY)/narrativeDistance,0,1)*DUR;
  // Short, time-based damping gives touch, wheel and keyboard the same feel.
  displayT+=(targetT-displayT)*(1-Math.exp(-dt*16));
  if(Math.abs(targetT-displayT)<.002)displayT=targetT;
  const isHold=targetT>=DUR-.001 && displayT>=DUR-.012;
  if(isHold){
    displayT=DUR;
    if(mode!=='hold'){
      applySnapshot(DUR);holdT=DUR;holdAccumulator=0;mode='hold';forcePaint=true;
    }
    if(!paused){
      holdAccumulator+=dt;
      while(holdAccumulator>=FDT){step(FDT,holdT);holdT+=FDT;holdAccumulator-=FDT;}
      QORDER.forEach(k=>{qs[k]+=(queueExt(TL[k])-qs[k])*(1-Math.exp(-dt*6));});
      render(holdT);
    }else if(forcePaint){render(holdT);}
  }else{
    if(mode==='hold'){mode='scrub';forcePaint=true;}
    if(forcePaint||Math.abs(displayT-lastPaint)>.0001){applySnapshot(displayT);render(displayT);}
  }
  setUI(displayT,isHold);lastPaint=displayT;forcePaint=false;
  if((isHold&&!paused)||Math.abs(targetT-displayT)>.001)request();
  else lastNow=0;
}

window.addEventListener('scroll',request,{passive:true});
window.addEventListener('resize',refresh,{passive:true});
window.visualViewport?.addEventListener('resize',refresh,{passive:true});
window.addEventListener('pagehide',suspend);
window.addEventListener('pageshow',refresh);
document.addEventListener('visibilitychange',()=>{if(document.hidden)suspend();else refresh();});
// The existing menu locks the page. Freeze the city behind it, then resume.
new MutationObserver(()=>{if(blocked())suspend();else request();}).observe(document.body,{attributes:true,attributeFilter:['class']});
if('ResizeObserver' in window){
  const observer=new ResizeObserver(refresh);
  observer.observe(stage);observer.observe(document.querySelector('main'));
}
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting)){schedulePreparation();refresh();}
    else suspend();
  },{rootMargin:'100% 0px'});
  observer.observe(root);
}else schedulePreparation();
document.fonts?.ready.then(refresh);
// Preparation is deliberately deferred until the story is close to the viewport.
setUI(0,false);resize();measure();request();
return {refresh,suspend};
}
reduced.addEventListener?.('change',activate);
activate();
})();
