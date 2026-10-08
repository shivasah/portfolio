(()=>{
'use strict';
const mount=document.querySelector('[data-report-tools-strip]');if(!mount)return;
const DUR=13;
/* ---------- easing (same curves as the site) ---------- */
function bez(x1,y1,x2,y2){const cx=3*x1,bx=3*(x2-x1)-cx,ax=1-cx-bx,cy=3*y1,by=3*(y2-y1)-cy,ay=1-cy-by;
  const X=t=>((ax*t+bx)*t+cx)*t,Y=t=>((ay*t+by)*t+cy)*t;
  return x=>{if(x<=0)return 0;if(x>=1)return 1;let a=0,b=1,t=x;for(let i=0;i<24;i++){if(X(t)<x)a=t;else b=t;t=(a+b)/2;}return Y(t);};}
const IN=bez(.2,.8,.2,1),OUT=bez(.42,0,1,1),MOVE=bez(.65,0,.35,1),HAND=bez(0,0,.58,1),LIN=x=>x;
const cl=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,k)=>a+(b-a)*k;
const tw=(t,s,d,f)=>(f||IN)(cl((t-s)/d,0,1));

/* ---------- palette & helpers ---------- */
const INK='#292e26',SOFT='#666c5e',MUTED='#666c5e',PAPER='#f3f0e7',P2='#e4dfd2',OR='#9c4e3b',LINE='rgba(41,46,38,.14)',LS='rgba(41,46,38,.24)';
const STICKY={y:'#e6d8b8',b:'#e6d8b8',p:'#d7decd'};
const svg=mount.querySelector('svg'),NS='http://www.w3.org/2000/svg';
const el=(tag,a,p)=>{const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);(p||svg).appendChild(e);return e;};
const txt=(p,x,y,s,o)=>{o=o||{};const e=el('text',Object.assign({x,y,'font-family':o.hand?'Cabinet Grotesk, Avenir Next, Helvetica Neue, Arial, sans-serif':'Syne, Helvetica Neue, Helvetica, Arial, sans-serif','font-size':o.size||11,fill:o.fill||INK,'font-weight':o.w||400},o.anchor?{'text-anchor':o.anchor}:{},o.tab?{'font-variant-numeric':'tabular-nums'}:{}),p);e.textContent=s;return e;};
const op=(e,v)=>e.setAttribute('opacity',cl(v,0,1).toFixed(3));
const prep=p=>{const L=p.getTotalLength();p.style.strokeDasharray=L+' '+L;return{p,L};};
const draw=(o,k)=>{o.p.style.strokeDashoffset=(o.L*(1-k)).toFixed(2);op(o.p,k>0.001?1:0);};

/* ---------- a tiny sketch renderer: every line is drawn twice, slightly off, like a pen ---------- */
let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
const j=a=>(rnd()-0.5)*2*a;
function rl(x1,y1,x2,y2,amp){amp=amp==null?1.1:amp;const len=Math.hypot(x2-x1,y2-y1)||1,nx=-(y2-y1)/len,ny=(x2-x1)/len;let d='';
  for(let p=0;p<2;p++){const o=p?0.8:0,ex=(x2-x1)/len*1.6,ey=(y2-y1)/len*1.6,bow=j(Math.min(2.2,len*0.012)+amp*0.4);
    const ax=x1-ex*rnd()+j(amp)+o,ay=y1-ey*rnd()+j(amp),bx=x2+ex*rnd()+j(amp),by=y2+ey*rnd()+j(amp)+o*0.4;
    const mx=(ax+bx)/2+nx*bow,my=(ay+by)/2+ny*bow;d+=`M${ax.toFixed(1)} ${ay.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)} `;}
  return d;}
const rr=(x,y,w,h,amp)=>rl(x,y,x+w,y,amp)+rl(x+w,y,x+w,y+h,amp)+rl(x+w,y+h,x,y+h,amp)+rl(x,y+h,x,y,amp);
function rc(cx,cy,r){let d='';for(let p=0;p<2;p++){const n=10,a0=rnd()*6.28;for(let i=0;i<=n+1;i++){const a=a0+i/n*6.6,rr2=r*(1+j(0.12));const x=cx+Math.cos(a)*rr2,y=cy+Math.sin(a)*rr2;d+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)+' ';}}return d;}
function hatch(x,y,w,h,gap){let d='';for(let s=-h;s<w;s+=gap){const x1=x+Math.max(0,s),y1=y+h-Math.max(0,-s)*0+(s<0?h+s:h)-(s<0?0:0);
    // 45° lines clipped to the box
    const sx=x+s,sy=y+h,ex=x+s+h,ey=y;let ax=sx,ay=sy,bx=ex,by=ey;
    if(ax<x){ay-=(x-ax);ax=x;}if(bx>x+w){by+=(bx-(x+w));bx=x+w;}if(ax>=bx)continue;d+=rl(ax,ay,bx,by,0.5).split(' M')[0]+' ';}return d;}
const P=(d,a,p)=>el('path',Object.assign({d,fill:'none',stroke:INK,'stroke-width':1.3,'stroke-linecap':'round','stroke-linejoin':'round'},a||{}),p);
const H=(p,x,y,s,o)=>txt(p,x,y,s,Object.assign({hand:1},o||{}));

/* ---------- layout: four windows on one desk ---------- */
const CW=272,CH=196,CY=82,XS=[94,474,854,1234];
const root=el('g');
const loopP=prep(el('path',{d:'M1370 74 C 1330 18, 1000 14, 800 16 C 560 18, 290 20, 236 70',fill:'none',stroke:INK,'stroke-width':2,'stroke-linecap':'round'},root));
const loopH=prep(el('path',{d:'M226 56 L235 72 L250 62',fill:'none',stroke:INK,'stroke-width':2,'stroke-linecap':'round','stroke-linejoin':'round'},root));
const loopTx=txt(root,800,40,'every month, again.',{hand:1,size:22,anchor:'middle',fill:SOFT});
const conn=[0,1,2].map(i=>{const x0=XS[i]+CW+12,x1=XS[i+1]-14,y=CY+CH/2;
  return{line:prep(el('path',{d:`M${x0} ${y+4} C ${x0+30} ${y-10}, ${x1-34} ${y+12}, ${x1} ${y}`,fill:'none',stroke:INK,'stroke-width':1.8,'stroke-linecap':'round'},root)),
         head:prep(el('path',{d:`M${x1-10} ${y-7} L${x1} ${y} L${x1-10} ${y+7}`,fill:'none',stroke:INK,'stroke-width':1.8,'stroke-linecap':'round','stroke-linejoin':'round'},root)),x0,x1,y};});
function windowCard(i,title){const g=el('g',{},root);const x=XS[i];
  P(hatch(x+7,CY+8,CW,CH,6),{stroke:'rgba(41,46,38,.22)','stroke-width':1},g);       // pencil-hatched shadow
  el('rect',{x,y:CY,width:CW,height:CH,fill:PAPER},g);
  P(rr(x,CY,CW,CH,1.2),{'stroke-width':1.5},g);
  P(rl(x+2,CY+28,x+CW-2,CY+28,0.8),{stroke:LS},g);
  [0,1,2].forEach(k=>P(rc(x+16+k*11,CY+14,3.2),{'stroke-width':1,stroke:SOFT},g));
  H(g,x+52,CY+19,title,{size:12.5,fill:SOFT});return g;}
const labels=['QuickBooks','Excel','Word','Email'],verbs=['export the numbers','paste & reformat','chart & write it up','attach & send'];
const cards=labels.map((l,i)=>{const g=windowCard(i,['Profit and Loss · March','march-report.xlsx','March report.docx','New message'][i]);
  const lab=el('g',{},root);txt(lab,XS[i],CY+CH+30,'0'+(i+1),{size:11,fill:OR,w:600});txt(lab,XS[i]+22,CY+CH+30,l,{size:15,w:500});txt(lab,XS[i],CY+CH+50,verbs[i],{size:12,fill:MUTED});
  return{g,lab};});
function bars(g,x,base,list,bw,gap){return list.map((h,k)=>{const id='rts110-cb'+(seed++);const cp=el('clipPath',{id},g);const r=el('rect',{x:x+k*(bw+gap)-3,y:base,width:bw+6,height:0},cp);
  const b=el('g',{'clip-path':`url(#${id})`},g);const fill=k===list.length-1?OR:INK;
  P(hatch(x+k*(bw+gap),base-h,bw,h,3),{stroke:fill,'stroke-width':1},b);P(rr(x+k*(bw+gap),base-h,bw,h,0.6),{stroke:fill,'stroke-width':1.2},b);return{h,r,base};});}

/* -- 01 QuickBooks -- */
const Q=XS[0],qRows=[['Income',11942],['Cost of goods sold',7404],['Gross profit',4538],['Expenses',3120],['Net income',1418]];
const qG=el('g',{},cards[0].g);
H(qG,Q+18,CY+54,'Profit and Loss',{size:17});H(qG,Q+18,CY+71,'Grasshopper Landscapes · March 2026',{size:10.5,fill:MUTED});
const qSel=el('g',{opacity:0},qG);P(hatch(Q+12,CY+80,CW-24,104,7),{stroke:'rgba(156,78,59,.45)','stroke-width':1},qSel);P(rr(Q+11,CY+79,CW-22,106,1),{stroke:OR,'stroke-width':1.5},qSel);
const qR=qRows.map((r,k)=>{const y=CY+97+k*20;const row=el('g',{},qG);const bold=k===2||k===4;
  H(row,Q+18,y,r[0],{size:13,fill:bold?INK:SOFT});const v=H(row,Q+CW-18,y,'',{size:13,anchor:'end',fill:bold?INK:SOFT});
  if(k<4)P(rl(Q+18,y+6,Q+CW-18,y+6,0.6),{stroke:LINE,'stroke-width':1},row);return{row,v,val:r[1]};});
const qBtn=el('g',{opacity:0},qG);el('rect',{x:Q+CW-90,y:CY+38,width:74,height:24,fill:PAPER},qBtn);P(rr(Q+CW-90,CY+38,74,24,0.8),{},qBtn);H(qBtn,Q+CW-53,CY+55,'Export ↓',{size:13,anchor:'middle'});

/* -- 02 Excel -- */
const E=XS[1],gx=E+14,gy=CY+38,colW=[22,72,50,48,46],rowH=18,nR=8;
const eG=el('g',{},cards[1].g);
let cx=gx;const colX=colW.map(w=>{const x=cx;cx+=w;return x;});const gw=cx-gx;
P(hatch(gx,gy,gw,rowH,5),{stroke:'rgba(41,46,38,.12)','stroke-width':1},eG);
let gd='';for(let r=0;r<=nR;r++)gd+=rl(gx,gy+r*rowH,gx+gw,gy+r*rowH,0.5);colX.concat([gx+gw]).forEach(x=>gd+=rl(x,gy,x,gy+nR*rowH,0.5));
P(gd,{stroke:LS,'stroke-width':1},eG);
['','A','B','C','D'].forEach((h,k)=>H(eG,colX[k]+colW[k]/2,gy+13,h,{size:10.5,fill:MUTED,anchor:'middle'}));
for(let r=1;r<nR;r++)H(eG,gx+11,gy+r*rowH+13,String(r),{size:10.5,fill:MUTED,anchor:'middle'});
const eCells=qRows.map((r,k)=>{const y=gy+(k+2)*rowH+13;
  const lab=H(eG,colX[1]+4,y,r[0].length>12?r[0].slice(0,11)+'…':r[0],{size:11});
  const raw=H(eG,colX[2]+3,y,String(r[1]),{size:11,fill:MUTED});
  const fix=H(eG,colX[2]+colW[2]-4,y,r[1].toLocaleString('en-US'),{size:11,anchor:'end',fill:k===2||k===4?INK:SOFT});
  return{lab,raw,fix};});
const eHead=H(eG,colX[1]+4,gy+rowH+13,'March',{size:11.5});
const eSweep=el('g',{opacity:0},eG);P(hatch(colX[2]+1,gy+rowH*2+1,colW[2]-2,rowH*5-2,6),{stroke:'rgba(156,78,59,.45)','stroke-width':1},eSweep);P(rr(colX[2],gy+rowH*2,colW[2],rowH*5,0.8),{stroke:OR,'stroke-width':1.5},eSweep);
const chG=el('g',{},eG);const chX=colX[3]+12,chB=gy+nR*rowH-8;
const chBg=el('g',{opacity:0},chG);el('rect',{x:colX[3]+4,y:chB-56,width:94,height:62,fill:'#fff'},chBg);P(rr(colX[3]+4,chB-56,94,62,0.8),{},chBg);
const chBars=bars(chG,chX,chB,[42,30,20,14,8],11,5);

/* -- 03 Word -- */
const Wd=XS[2],pX=Wd+46,pY=CY+38,pW=CW-92,pH=CH-46;
const wG=el('g',{},cards[2].g);
P(hatch(Wd+12,CY+31,CW-24,CH-34,9),{stroke:'rgba(41,46,38,.08)','stroke-width':1},wG);
el('rect',{x:pX,y:pY,width:pW,height:pH+4,fill:'#fff'},wG);P(rr(pX,pY,pW,pH+4,0.8),{stroke:LS},wG);
const wTitle=H(wG,pX+14,pY+21,'March report',{size:14});
const wChart=el('g',{opacity:0},wG);P(rr(pX+14,pY+29,pW-28,52,0.7),{stroke:LINE},wChart);
const wBars=bars(wChart,pX+24,pY+75,[42,30,20,14,8],14,8);
const wLines=[pW-28,pW-40,pW-28,pW-70,pW-34,pW-90].map((w,k)=>{const p=prep(P(rl(pX+14,pY+94+k*9,pX+14+w,pY+94+k*9,0.7).split(' M')[0],{stroke:'rgba(41,46,38,.6)','stroke-width':1.6},wG));return{w,p};});
const wCaret=el('rect',{x:pX+14,y:pY+88,width:1.5,height:11,fill:INK,opacity:0},wG);
const wNote=txt(cards[2].g,Wd+CW-8,CY+CH-6,'',{hand:1,size:15,anchor:'end',fill:SOFT});

/* -- 04 Email -- */
const M=XS[3];const mG=el('g',{},cards[3].g);
const mBody=el('g',{},mG);
[['To','client@grasshopper.co'],['Subject','March management report']].forEach((r,k)=>{const y=CY+53+k*25;H(mBody,M+16,y,r[0],{size:12,fill:MUTED});H(mBody,M+72,y,r[1],{size:12.5});P(rl(M+16,y+8,M+CW-16,y+8,0.6),{stroke:LS,'stroke-width':1},mBody);});
[150,190,120].forEach((w,k)=>P(rl(M+16,CY+114+k*11,M+16+w,CY+114+k*11,0.7).split(' M')[0],{stroke:'rgba(41,46,38,.4)','stroke-width':1.6},mBody));
const mAtt=el('g',{opacity:0},mBody);el('rect',{x:M+16,y:CY+146,width:156,height:28,fill:PAPER},mAtt);P(rr(M+16,CY+146,156,28,0.8),{},mAtt);
P(rr(M+24,CY+152,13,16,0.5)+rl(M+27,CY+158,M+34,CY+158,0.3)+rl(M+27,CY+162,M+33,CY+162,0.3),{'stroke-width':1},mAtt);
H(mAtt,M+44,CY+165,'March report.docx',{size:12});
const mSend=el('g',{},mG);const sendR=el('rect',{x:M+CW-82,y:CY+146,width:66,height:28,rx:3,fill:INK},mSend);P(rr(M+CW-83,CY+145,68,30,1),{'stroke-width':1.4},mSend);H(mSend,M+CW-49,CY+165,'Send',{size:14,anchor:'middle',fill:PAPER});
const mSent=el('g',{opacity:0},mG);H(mSent,M+CW/2,CY+116,'Sent',{size:20,anchor:'middle'});
const sentTick=prep(el('path',{d:`M${M+CW/2-12} ${CY+80} l8 8 l16 -18`,fill:'none',stroke:OR,'stroke-width':2.4,'stroke-linecap':'round','stroke-linejoin':'round'},mSent));
const plane=el('g',{opacity:0},root);el('path',{d:'M0 0 L26 -10 L10 4 Z',fill:PAPER},plane);P(rl(0,0,26,-10,0.5)+rl(26,-10,10,4,0.5)+rl(10,4,0,0,0.5)+rl(10,4,12,12,0.4)+rl(12,12,15,1,0.4),{'stroke-width':1.3},plane);
const trail=prep(el('path',{d:`M${M+CW-50} ${CY+150} C ${M+CW+10} ${CY+120}, ${M+CW+10} ${CY+40}, ${M+CW+60} ${CY-30}`,fill:'none',stroke:INK,'stroke-width':1.2,'stroke-dasharray':'3 5','stroke-linecap':'round'},root));

/* -- payloads travelling between tools -- */
function slip(w,h,inner){const g=el('g',{opacity:0},root);el('rect',{x:-w/2,y:-h/2,width:w,height:h,fill:'#fff'},g);P(rr(-w/2,-h/2,w,h,0.7),{},g);inner(g);return g;}
const fly1=slip(54,38,g=>[0,1,2,3].forEach(k=>P(rl(-18,-10+k*7,k===2?6:12,-10+k*7,0.5).split(' M')[0],{'stroke-width':1.5},g)));
const fly2=slip(60,42,g=>[18,12,8,5].forEach((h,k)=>P(hatch(-20+k*11,12-h,7,h,2.5)+rr(-20+k*11,12-h,7,h,0.3),{stroke:k===3?OR:INK,'stroke-width':1},g)));
const fly3=slip(42,54,g=>{P(hatch(-13,-19,26,12,3),{stroke:'rgba(41,46,38,.35)','stroke-width':1},g);[0,1,2,3].forEach(k=>P(rl(-13,2+k*6,k===3?3:13,2+k*6,0.4).split(' M')[0],{stroke:'rgba(41,46,38,.6)','stroke-width':1.5},g));});
function along(g,c,k,lift){const x=lerp(c.x0-10,c.x1+16,k),y=c.y-Math.sin(k*Math.PI)*lift;g.setAttribute('transform',`translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(Math.sin(k*Math.PI)*-6).toFixed(1)})`);op(g,k>0&&k<1?Math.min(1,k*8,(1-k)*8):0);}
const growBars=(list,k0,t)=>list.forEach((b,k)=>{const h=b.h*tw(t,k0+k*0.08,0.5);b.r.setAttribute('y',(b.base-h-2).toFixed(1));b.r.setAttribute('height',(h>0.5?h+4:0).toFixed(1));});

/* ---------- the timeline ---------- */
let LOOP=true;
function render(t){
  // intro: windows land, arrows draw
  cards.forEach((c,i)=>{const k=tw(t,0.1+i*0.12,0.6);c.g.setAttribute('transform',`translate(0,${(16*(1-k)).toFixed(2)})`);op(c.g,k);op(c.lab,tw(t,0.3+i*0.12,0.6));});
  conn.forEach((c,i)=>{draw(c.line,tw(t,0.6+i*0.12,0.5,HAND));draw(c.head,tw(t,1.0+i*0.12,0.2,HAND));});
  // 01 QuickBooks
  qR.forEach((r,k)=>{const s=0.9+k*0.12;op(r.row,tw(t,s,0.4));r.v.textContent=t<s?'':Math.round(r.val*cl((t-s)/0.6,0,1)).toLocaleString('en-US');});
  op(qBtn,tw(t,1.8,0.3));const press=tw(t,2.2,0.12)*(1-tw(t,2.34,0.2));qBtn.setAttribute('transform',`translate(0,${(1.5*press).toFixed(2)})`);
  op(qSel,tw(t,2.25,0.25)*(1-tw(t,3.0,0.3,OUT)));
  along(fly1,conn[0],tw(t,2.5,0.9,MOVE),26);
  // 02 Excel: raw paste…
  const paste=tw(t,3.35,0.25);eCells.forEach((c,k)=>{op(c.lab,paste);op(c.raw,paste*(1-tw(t,4.2+k*0.08,0.2)));op(c.fix,tw(t,4.2+k*0.08,0.25));});op(eHead,paste);
  // …then fixed by hand, column by column
  op(eSweep,tw(t,3.9,0.25)*(1-tw(t,4.9,0.3,OUT)));
  op(chBg,tw(t,4.95,0.25));chBg.setAttribute('transform',`translate(0,${(6*(1-tw(t,4.95,0.4))).toFixed(1)})`);growBars(chBars,5.0,t);
  along(fly2,conn[1],tw(t,5.9,0.9,MOVE),26);
  // 03 Word: chart lands, summary typed manually
  op(wTitle,tw(t,6.5,0.3));op(wChart,tw(t,6.75,0.3));growBars(wBars,6.75,t+10);
  const ty=cl((t-7.1)/1.9,0,1);let rem=ty*wLines.reduce((a,l)=>a+l.w,0),cx2=pX+14,cy2=pY+88;
  wLines.forEach((l,k)=>{const w=Math.max(0,Math.min(l.w,rem));rem-=l.w;draw(l.p,w/l.w);if(w>0&&w<l.w){cx2=pX+14+w;cy2=pY+88+k*9;}});
  if(ty>=1){cx2=pX+14+wLines[5].w;cy2=pY+133;}
  wCaret.setAttribute('x',cx2+1);wCaret.setAttribute('y',cy2);op(wCaret,t>7.0&&t<9.4?((t*2.4|0)%2?0.25:1):0);
  wNote.textContent=t>8.0&&t<9.6?'typed by hand':'';op(wNote,tw(t,8.0,0.3)*(1-tw(t,9.3,0.3,OUT)));
  along(fly3,conn[2],tw(t,9.3,0.9,MOVE),30);
  // 04 Email: attachment, send, gone
  const att=tw(t,10.15,0.35);op(mAtt,att);mAtt.setAttribute('transform',`translate(0,${(8*(1-att)).toFixed(1)})`);
  const sp=tw(t,10.6,0.1)*(1-tw(t,10.72,0.2));sendR.setAttribute('fill',t>10.62?OR:INK);mSend.setAttribute('transform',`translate(0,${(1.5*sp).toFixed(2)})`);
  const gone=tw(t,10.8,0.4,OUT);op(mBody,1-gone);op(mSend,1-gone);op(mSent,tw(t,11.1,0.4));draw(sentTick,tw(t,11.15,0.35,HAND));
  const pk=tw(t,10.8,0.9,MOVE);draw(trail,tw(t,10.85,0.8,HAND)*(1-tw(t,12.2,0.3,OUT)));
  plane.setAttribute('transform',`translate(${lerp(M+CW-50,M+CW+64,pk).toFixed(1)},${lerp(CY+150,CY-34,pk*pk).toFixed(1)}) rotate(${(-28*pk).toFixed(1)})`);op(plane,pk>0&&pk<1?1:0);
  // and it starts again next month
  draw(loopP,tw(t,11.4,1.0,HAND));draw(loopH,tw(t,12.3,0.2,HAND));op(loopTx,tw(t,11.9,0.4));
  // loop seam
  op(root,LOOP?1-tw(t,12.55,0.45,OUT):1);
}


const reduced=matchMedia('(prefers-reduced-motion: reduce)');let t=0,visible=false,last=0,raf=0;
function paint(){mount.dataset.stripTime=t.toFixed(2);render(t);}
function tick(now){raf=0;if(!visible||document.hidden||reduced.matches)return;if(last)t=(t+Math.min(.06,(now-last)/1000))%DUR;last=now;paint();raf=requestAnimationFrame(tick);}
function sync(){cancelAnimationFrame(raf);raf=0;last=0;LOOP=!reduced.matches;if(reduced.matches){t=12.5;paint();return;}if(visible&&!document.hidden)raf=requestAnimationFrame(tick);}
if('IntersectionObserver' in window){new IntersectionObserver(es=>{visible=es.some(e=>e.isIntersecting);sync();},{threshold:.12}).observe(mount);}else visible=true;
reduced.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>{paint();sync();});
})();