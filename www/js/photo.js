const Photo=(()=>{
const q=s=>document.querySelector(s);
const A=()=>store.get('auth',null);
const stack=[];
const svg=p=>`<svg viewBox="0 0 24 24">${p}</svg>`;
const X='<path d="M6 6l12 12M18 6L6 18"/>';
const OK='<path d="M5 12.5l4.2 4.2L19 7"/>';
function toast(t){let e=q('#toast');if(!e){e=document.createElement('div');e.id='toast';document.body.appendChild(e)}e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2200)}
function push(el){document.body.appendChild(el);stack.push(el)}
function pop(){const e=stack.pop();if(e)e.remove();return !!e}
function closeAll(){while(stack.length)pop()}
async function upload(du){
 const a=A();if(!a)return;
 try{
  const r=await fetch(PICKO_SERVER+'/api/avatar',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+a.token},body:JSON.stringify({img:du})});
  if(!r.ok)throw 0;
  store.set('avpv',Date.now());
  closeAll();
  if(typeof MenuUI!=='undefined')MenuUI.refresh();
  toast('عکس پروفایل عوض شد');
 }catch(e){toast('آپلود نشد، سرور رو چک کن')}
}
function pickFile(){
 const inp=document.createElement('input');inp.type='file';inp.accept='image/*';
 inp.onchange=()=>{
  const f=inp.files&&inp.files[0];if(!f)return;
  const url=URL.createObjectURL(f),img=new Image();
  img.onload=()=>crop(img);
  img.onerror=()=>toast('عکس خونده نشد');
  img.src=url;
 };
 inp.click();
}
function crop(img){
 const S=Math.min(innerWidth-32,Math.round(innerHeight*0.6),420);
 const st={rot:0,flip:false,z:1,ox:0,oy:0};
 const d=document.createElement('div');d.className='crp';
 d.innerHTML=`<div class="crh"><button class="lb">بازگشت</button></div><div class="crs"><canvas id="cv" width="${S}" height="${S}" style="width:${S}px;height:${S}px"></canvas></div><div class="crc"><input type="range" id="cz" min="100" max="300" value="100"><b id="czv"></b></div><div class="crt"><button class="cb2" id="crot">${svg('<path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4"/>')}</button><button class="cb2" id="cflip">${svg('<path d="M12 3v18M8 7L3 12l5 5zM16 7l5 5-5 5z"/>')}</button><button class="cok" id="cok">${svg(OK)}</button></div>`;
 push(d);
 const cv=q('#cv'),cx=cv.getContext('2d'),zs=q('#cz'),zv=q('#czv');
 function render(ctx,size,mask){
  const f=size/S;
  ctx.fillStyle='#000';ctx.fillRect(0,0,size,size);
  const r=st.rot%2==1,iw=r?img.height:img.width,ih=r?img.width:img.height;
  const sc=(S/Math.min(iw,ih))*st.z*f;
  ctx.save();
  ctx.translate(size/2+st.ox*f,size/2+st.oy*f);
  ctx.rotate(st.rot*Math.PI/2);
  if(st.flip)ctx.scale(-1,1);
  ctx.scale(sc,sc);
  ctx.drawImage(img,-img.width/2,-img.height/2);
  ctx.restore();
  if(mask){ctx.fillStyle='rgba(0,0,0,.6)';ctx.beginPath();ctx.rect(0,0,size,size);ctx.arc(size/2,size/2,size/2-2,0,Math.PI*2,true);ctx.fill('evenodd')}
 }
 const draw=()=>{render(cx,S,true);zv.textContent=Math.round(st.z*100).toLocaleString('fa-IR')+'٪'};
 draw();
 const pts=new Map();let pd=0,ps=1;
 cv.style.touchAction='none';
 cv.onpointerdown=e=>{
  cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);
  if(pts.size==2){const[a,b]=[...pts.values()];pd=Math.hypot(a[0]-b[0],a[1]-b[1]);ps=st.z}
 };
 cv.onpointermove=e=>{
  if(!pts.has(e.pointerId))return;
  const p=pts.get(e.pointerId);
  if(pts.size==1){st.ox+=e.clientX-p[0];st.oy+=e.clientY-p[1]}
  pts.set(e.pointerId,[e.clientX,e.clientY]);
  if(pts.size==2&&pd){const[a,b]=[...pts.values()];const dd=Math.hypot(a[0]-b[0],a[1]-b[1]);st.z=Math.min(3,Math.max(1,ps*dd/pd));zs.value=Math.round(st.z*100)}
  draw();
 };
 const up=e=>{pts.delete(e.pointerId);pd=0};
 cv.onpointerup=up;cv.onpointercancel=up;
 zs.oninput=()=>{st.z=zs.value/100;draw()};
 q('#crot').onclick=()=>{st.rot=(st.rot+1)%4;draw()};
 q('#cflip').onclick=()=>{st.flip=!st.flip;draw()};
 d.querySelector('.lb').onclick=()=>pop();
 q('#cok').onclick=()=>{const c=document.createElement('canvas');c.width=c.height=256;render(c.getContext('2d'),256,false);upload(c.toDataURL('image/jpeg',0.85))};
}
function emojiEd(){
 const GR=[['#22d3ee','#3b82f6'],['#f472b6','#a855f7'],['#fbbf24','#f97316'],['#34d399','#0ea5e9'],['#fb7185','#ef4444'],['#94a3b8','#475569']];
 let n=PE.list[0].n,g=0;
 const d=document.createElement('div');d.className='crp';
 d.innerHTML=`<div class="crh"><button class="lb">بازگشت</button></div><div class="crs"><div class="epv" id="epv"></div></div><div class="gsw" id="gsw">${GR.map((c,i)=>`<button data-g="${i}" style="background:linear-gradient(135deg,${c[0]},${c[1]})"></button>`).join('')}</div><div class="egr" id="egr">${PE.list.map(e=>`<button data-n="${e.n}">${PE.svg(e.n,34)}</button>`).join('')}</div><div class="crt"><span></span><button class="cok" id="eok">${svg(OK)}</button></div>`;
 push(d);
 const pv=()=>{const e=q('#epv');e.style.background='linear-gradient(135deg,'+GR[g][0]+','+GR[g][1]+')';e.innerHTML=PE.svg(n,120)};pv();
 d.querySelector('.lb').onclick=()=>pop();
 q('#gsw').onclick=e=>{const b=e.target.closest('button');if(b){g=+b.dataset.g;pv()}};
 q('#egr').onclick=e=>{const b=e.target.closest('button');if(b){n=b.dataset.n;pv()}};
 q('#eok').onclick=()=>{
  const it=PE.list.find(x=>x.n==n),defs=q('svg[width="0"] defs');
  const s='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512">'+(defs?defs.outerHTML:'')+it.s+'</svg>';
  const im=new Image();
  im.onload=()=>{
   const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');
   const gr=x.createLinearGradient(0,0,256,256);gr.addColorStop(0,GR[g][0]);gr.addColorStop(1,GR[g][1]);
   x.fillStyle=gr;x.fillRect(0,0,256,256);x.drawImage(im,48,48,160,160);
   upload(c.toDataURL('image/jpeg',0.88));
  };
  im.onerror=()=>toast('ساخت عکس نشد');
  im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s);
 };
}
function paint(){
 const S=Math.min(innerWidth-32,Math.round(innerHeight*0.5),420);
 const CL=['#ffffff','#fbbf24','#f472b6','#22d3ee','#34d399','#ef4444','#111111'];
 let col=CL[0],sz=14,dr=false,lx=0,ly=0;
 const d=document.createElement('div');d.className='crp';
 d.innerHTML=`<div class="crh"><button class="lb">بازگشت</button></div><div class="crs"><div class="pg" style="width:${S}px;height:${S}px"><canvas id="pcv" width="${S}" height="${S}" style="width:${S}px;height:${S}px"></canvas></div></div><div class="gsw" id="pcl">${CL.map(c=>`<button data-c="${c}" style="background:${c}"></button>`).join('')}</div><div class="crc"><input type="range" id="psz" min="4" max="40" value="14"><button class="mb" id="pclr">پاک کردن</button></div><div class="crt"><span></span><button class="cok" id="pok">${svg(OK)}</button></div>`;
 push(d);
 const cv=q('#pcv'),x=cv.getContext('2d');
 const fill=()=>{x.fillStyle='#1b1033';x.fillRect(0,0,S,S)};fill();
 const pos=e=>{const r=cv.getBoundingClientRect();return[(e.clientX-r.left)*S/r.width,(e.clientY-r.top)*S/r.height]};
 cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);dr=true;[lx,ly]=pos(e);x.fillStyle=col;x.beginPath();x.arc(lx,ly,sz/2,0,6.3);x.fill()};
 cv.onpointermove=e=>{if(!dr)return;const[px,py]=pos(e);x.strokeStyle=col;x.lineWidth=sz;x.lineCap='round';x.beginPath();x.moveTo(lx,ly);x.lineTo(px,py);x.stroke();lx=px;ly=py};
 const up=()=>{dr=false};cv.onpointerup=up;cv.onpointercancel=up;
 q('#pcl').onclick=e=>{const b=e.target.closest('button');if(b)col=b.dataset.c};
 q('#psz').oninput=e=>{sz=+e.target.value};
 q('#pclr').onclick=fill;
 d.querySelector('.lb').onclick=()=>pop();
 q('#pok').onclick=()=>{const c=document.createElement('canvas');c.width=c.height=256;c.getContext('2d').drawImage(cv,0,0,256,256);upload(c.toDataURL('image/jpeg',0.88))};
}
function start(){
 if(!A()){toast('اول وارد حساب شو');return}
 closeAll();
 const d=document.createElement('div');d.className='pks';
 d.innerHTML=`<div class="pkb"><div class="fh"><b>انتخاب عکس</b><button class="pk" id="pkx">${svg(X)}</button></div><div class="pkg"><button class="pt gal" id="p-gal">${svg('<rect x="4" y="5" width="16" height="14" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M5 17l4.5-4.5 3 3 2.5-2.5L19 17"/>')}<span>گالری</span></button><button class="pt emo" id="p-emo">${PE.svg('joy',52)}<span>استفاده از ایموجی</span></button><button class="pt pnt" id="p-pnt">${svg('<path d="M12 4a8 8 0 1 0 0 16c1.3 0 2-.8 2-1.7 0-1.3-1-1.5-1-2.6 0-.8.7-1.2 1.5-1.2H17a3 3 0 0 0 3-3C20 7.5 16.5 4 12 4z"/><circle cx="8.5" cy="11" r=".8"/><circle cx="12" cy="8" r=".8"/><circle cx="15.5" cy="9.5" r=".8"/>')}<span>نقاشی</span></button></div></div>`;
 push(d);
 d.onclick=e=>{if(e.target==d)pop()};
 q('#pkx').onclick=()=>pop();
 q('#p-gal').onclick=pickFile;
 q('#p-emo').onclick=emojiEd;
 q('#p-pnt').onclick=paint;
}
return{start,back:()=>pop()};
})();
