const Ludo=(()=>{
const COLS=['#ff5c7a','#34d399','#fbbf24','#60a5fa'];
const NAMES=['قرمز','سبز','زرد','آبی'];
const START=[0,13,26,39],SAFE=[0,13,26,39,8,21,34,47];
const P=[];
const seg=(x,y,dx,dy,n)=>{for(let i=0;i<n;i++)P.push([x+dx*i,y+dy*i])};
seg(1,6,1,0,5);seg(6,5,0,-1,6);seg(7,0,1,0,2);seg(8,1,0,1,5);seg(9,6,1,0,6);seg(14,7,0,1,2);seg(13,8,-1,0,5);seg(8,9,0,1,6);seg(7,14,-1,0,2);seg(6,13,0,-1,5);seg(5,8,-1,0,6);seg(0,7,0,-1,2);
const COL=[0,1,2,3].map(p=>[0,1,2,3,4,5].map(i=>[[1+i,7],[7,1+i],[13-i,7],[7,13-i]][p]));
const BASE=[[0,0],[9,0],[9,9],[0,9]];
const slot=(p,i)=>[BASE[p][0]+2+(i%2)*2,BASE[p][1]+2+(i>>1)*2];
const xy=(p,s,i)=>{if(s<0)return slot(p,i);const c=s<=50?P[(START[p]+s)%52]:COL[p][s-51];return[c[0]+.5,c[1]+.5]};
let S=null,ac=null;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function snd(f,d=.08,t='sine',v=.12){try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();const o=ac.createOscillator(),g=ac.createGain();o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+d);o.connect(g);g.connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
const DOTS={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
const dice=(v,c)=>`<svg viewBox="0 0 40 40" width="64" height="64"><rect x="2" y="2" width="36" height="36" rx="10" fill="rgba(255,255,255,.1)" stroke="${c}" stroke-width="2"/>${(DOTS[v]||[]).map(k=>`<circle cx="${11+(k%3)*9}" cy="${11+((k/3)|0)*9}" r="3.2" fill="#fff"/>`).join('')}</svg>`;
function coins(n){store.set('coins',store.get('coins',0)+n);$('#coinn').textContent=store.get('coins',0)}
const msg=t=>{const e=$('#lmsg');if(e)e.textContent=t};
function board(){
 let s='<rect x=".1" y=".1" width="14.8" height="14.8" rx=".7" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.12)" stroke-width=".05"/>';
 BASE.forEach((b,p)=>{s+=`<rect x="${b[0]+.3}" y="${b[1]+.3}" width="5.4" height="5.4" rx=".6" fill="${COLS[p]}" fill-opacity=".12" stroke="${COLS[p]}" stroke-opacity=".5" stroke-width=".06"/>`;for(let i=0;i<4;i++){const[x,y]=slot(p,i);s+=`<circle cx="${x}" cy="${y}" r=".55" fill="rgba(0,0,0,.35)" stroke="${COLS[p]}" stroke-opacity=".4" stroke-width=".05"/>`}});
 P.forEach(([x,y],t)=>{const sp=START.indexOf(t);s+=`<rect x="${x+.06}" y="${y+.06}" width=".88" height=".88" rx=".2" fill="${sp>=0?COLS[sp]:'#fff'}" fill-opacity="${sp>=0?.38:.07}" stroke="#fff" stroke-opacity=".12" stroke-width=".03"/>`;if(SAFE.includes(t)&&sp<0)s+=`<circle cx="${x+.5}" cy="${y+.5}" r=".2" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width=".05"/>`});
 COL.forEach((c,p)=>c.slice(0,5).forEach(([x,y])=>{s+=`<rect x="${x+.06}" y="${y+.06}" width=".88" height=".88" rx=".2" fill="${COLS[p]}" fill-opacity=".3" stroke="${COLS[p]}" stroke-opacity=".5" stroke-width=".03"/>`}));
 [[[6,6],[6,9]],[[6,6],[9,6]],[[9,6],[9,9]],[[6,9],[9,9]]].forEach((e,p)=>{s+=`<polygon points="${e[0]} ${e[1]} 7.5,7.5" fill="${COLS[p]}" fill-opacity=".45"/>`});
 S.act.forEach(p=>{for(let i=0;i<4;i++)s+=`<g class="pc" id="pc${p}${i}"><circle r=".5" fill="transparent"/><circle class="ring" r=".46"/><circle r=".34" fill="${COLS[p]}" stroke="#000" stroke-opacity=".4" stroke-width=".04"/><circle cx="-.1" cy="-.12" r=".12" fill="#fff" opacity=".55"/></g>`});
 return s;
}
function draw(){
 const g={};
 S.act.forEach(p=>S.pcs[p].forEach((s,i)=>{const[x,y]=xy(p,s,i);const k=x+','+y;(g[k]=g[k]||[]).push([p,i,x,y,s])}));
 for(const k in g){const a=g[k];a.forEach(([p,i,x,y,s],n)=>{const o=s<0?0:(n-(a.length-1)/2)*.2;$('#pc'+p+i).setAttribute('style',`transform:translate(${x+o}px,${y}px)`)})}
}
const at=(t,ex)=>{const o=[];S.act.forEach(q=>{if(q!=ex)S.pcs[q].forEach((s,j)=>{if(s>=0&&s<=50&&(START[q]+s)%52==t)o.push([q,j])})});return o};
const mv=(p,r)=>[0,1,2,3].filter(i=>{const s=S.pcs[p][i];return s<0?r==6:s+r<=56});
function bot(p,r,m){let best=m[0],bs=-1e9;for(const i of m){const s=S.pcs[p][i],n=s<0?0:s+r;let sc=n;if(s<0)sc+=30;if(n==56)sc+=60;if(n<=50){const t=(START[p]+n)%52;if(!SAFE.includes(t)&&at(t,p).length)sc+=80;if(SAFE.includes(t))sc+=15}if(sc>bs){bs=sc;best=i}}return best}
async function move(p,i,r){
 let s=S.pcs[p][i];
 if(s<0){S.pcs[p][i]=0;draw();snd(440,.1,'triangle');await sleep(240)}
 else for(let k=0;k<r;k++){S.pcs[p][i]=++s;draw();snd(380+k*25,.06);await sleep(190)}
 s=S.pcs[p][i];
 if(s<=50){const t=(START[p]+s)%52;if(!SAFE.includes(t)){const c=at(t,p);if(c.length){c.forEach(([q,j])=>S.pcs[q][j]=-1);draw();snd(150,.25,'sawtooth',.14);S.extra=true;await sleep(380)}}}
 if(s==56){snd(880,.2,'triangle');S.extra=true;if(p==0)coins(1)}
}
const waitRoll=()=>new Promise(res=>{const b=$('#ldice');b.classList.add('on');b.onclick=()=>{b.onclick=null;b.classList.remove('on');res()}});
const pick=m=>new Promise(res=>{m.forEach(i=>{const g=$('#pc'+S.cur+i);g.classList.add('hl');g.onclick=()=>{m.forEach(j=>{const h=$('#pc'+S.cur+j);h.classList.remove('hl');h.onclick=null});res(i)}})});
async function roll(p){const b=$('#ldice');let v=1;for(let k=0;k<7;k++){v=1+Math.random()*6|0;b.innerHTML=dice(v,COLS[p]);snd(300+k*40,.05,'square',.05);await sleep(70)}v=1+Math.random()*6|0;b.innerHTML=dice(v,COLS[p]);snd(520,.12,'triangle');return v}
function turnUI(p){$('#lturn').innerHTML=`نوبت <i class="dot" style="background:${COLS[p]}"></i>${p==0?'تو':'ربات '+NAMES[p]}`;msg(p==0?'تاس رو بزن':'')}
async function run(){
 while(S&&!S.dead){
  const p=S.act[S.i];S.cur=p;S.extra=false;turnUI(p);
  if(p==0)await waitRoll();else await sleep(650);
  if(!S||S.dead)return;
  const r=await roll(p);
  const m=mv(p,r);
  if(!m.length){msg('حرکتی نداره');await sleep(900);S.i=(S.i+1)%S.act.length;continue}
  let k;
  if(p==0&&m.length>1){msg('مهره رو انتخاب کن');k=await pick(m)}else{k=p==0?m[0]:bot(p,r,m);await sleep(250)}
  if(!S||S.dead)return;
  await move(p,k,r);
  if(S.pcs[p].every(s=>s==56)){over(p);return}
  if(r!=6&&!S.extra)S.i=(S.i+1)%S.act.length;
 }
}
function over(p){
 const w=p==0,rw=w?(S.act.length==2?20:30):0;if(w){coins(rw);snd(660,.3,'triangle')}
 const d=document.createElement('div');d.className='over';
 d.innerHTML=`<div class="glass"><h2>${w?'بردی':'ربات '+NAMES[p]+' برد'}</h2><p class="mu">${w?'+'+rw+' پیکوین':'دفعه‌ی بعد'}</p><div class="row"><button class="pb" id="again">دوباره</button><button class="pb" id="exit">بازگشت</button></div></div>`;
 document.body.appendChild(d);
 const m=S.act.length;
 $('#again').onclick=()=>{d.remove();start(m)};$('#exit').onclick=()=>{d.remove();home()};
}
function start(m){
 S={act:m==2?[0,2]:[0,1,2,3],pcs:[0,1,2,3].map(()=>[-1,-1,-1,-1]),i:0,dead:false,extra:false};
 $('#games').innerHTML=`<div class="lhead"><button class="lb" id="lback">بازگشت</button><span id="lturn"></span></div><div id="lboard"><svg viewBox="0 0 15 15">${board()}</svg></div><div class="ldock"><button id="ldice">${dice(1,COLS[0])}</button><div id="lmsg" class="mu"></div></div>`;
 $('#lback').onclick=home;draw();run();
}
function home(){
 if(S)S.dead=true;S=null;
 $('#games').innerHTML=`<div class="glass"><b>لودو</b><p class="mu">بدون اینترنت و بدون سرور بازی کن</p><div class="row"><button class="pb" data-m="2">۲ نفره با ربات</button><button class="pb" data-m="4">۴ نفره با ربات</button></div></div><div class="glass mu">بازی آنلاین بعد از ساخت سرور (بخش ۵) اضافه می‌شه</div>`;
 document.querySelectorAll('.pb[data-m]').forEach(b=>b.onclick=()=>start(+b.dataset.m));
}
home();
return{home,start};
})();
