const UProf=(()=>{
const q=s=>document.querySelector(s);
const A=()=>store.get('auth',null);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sv=p=>`<svg viewBox="0 0 24 24">${p}</svg>`;
const I={
 back:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
 dots:'<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>',
 call:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
 bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0"/>',
 boff:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0M3 3l18 18"/>',
 msg:'<path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H11l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/>',
 qr:'<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z"/>',
 add:'<circle cx="10" cy="9" r="3.2"/><path d="M4 19c.7-3.2 3.2-4.8 6-4.8M17 8v6M14 11h6"/>',
 gift:'<rect x="4" y="9" width="16" height="11" rx="2"/><path d="M12 9v11M4 13h16M12 9c-2-4-6-4-5-1.5C7.6 9 12 9 12 9zM12 9c2-4 6-4 5-1.5C16.4 9 12 9 12 9z"/>',
 star:'<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>'
};
let el=null;
function toast(t){let e=q('#toast');if(!e){e=document.createElement('div');e.id='toast';document.body.appendChild(e)}e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2300)}
async function api(path,body){
 const a=A(),h={};if(body)h['Content-Type']='application/json';if(a)h.Authorization='Bearer '+a.token;
 let r;
 try{r=await fetch(PICKO_SERVER+path,{method:body?'POST':'GET',headers:h,body:body?JSON.stringify(body):undefined})}catch(e){throw new Error('مشکل از سرور')}
 const j=await r.json().catch(()=>({}));
 if(!r.ok)throw new Error(j.error||'خطا');
 return j;
}
function seen(l,n){
 if(!l)return 'مدتی پیش';
 if(n-l<12)return 'آنلاین';
 const d=new Date(l*1000),t=d.toLocaleTimeString('fa-IR',{hour:'2-digit',minute:'2-digit'});
 const z=new Date(n*1000);z.setHours(0,0,0,0);
 if(d>=z)return 'آخرین بازدید امروز '+t;
 if(d>=new Date(z-86400000))return 'آخرین بازدید دیروز '+t;
 return 'آخرین بازدید '+d.toLocaleDateString('fa-IR',{month:'long',day:'numeric'});
}
function close(){
 if(!el)return false;
 const e=el;el=null;e.classList.add('out');setTimeout(()=>e.remove(),180);
 return true;
}
function giveDlg(id,nm){
 const d=document.createElement('div');d.className='over';
 d.innerHTML=`<div class="glass"><h3>هدیه‌ی پیکوین به ${esc(nm)}</h3><input class="in" id="gq" type="number" min="1" placeholder="تعداد پیکوین"><button class="pb" id="gy">ارسال</button><button class="pb" id="gn">انصراف</button></div>`;
 document.body.appendChild(d);
 q('#gn').onclick=()=>d.remove();
 q('#gy').onclick=async()=>{
  const n=+q('#gq').value;if(!n||n<1){toast('تعداد رو بنویس');return}
  try{await Wallet.give({uid:id,n});d.remove();toast('پیکوین ارسال شد')}catch(e){toast(e.message)}
 };
}
async function show(id,name){
 close();
 let j;
 try{j=await api('/api/uprofile?id='+id)}catch(e){toast(e.message);return}
 const u=j.user,on=j.now-u.last_seen<12;
 const cols=String(u.col||'').split(',').filter(c=>/^#[0-9a-fA-F]{6}$/.test(c));
 const bg='linear-gradient(165deg,'+(cols[0]||'#8b5cf6')+','+(cols[1]||'#3b1d7a')+')';
 const pat=u.picon?Array.from({length:20},(_,i)=>{const x=(i%5)*22+((i>>2)%2)*8+2,y=Math.floor(i/5)*24+6;return `<span style="left:${x}%;top:${y}%">${PE.svg(u.picon,34)}</span>`}).join(''):'';
 const muted=typeof Chat!=='undefined'&&Chat.isMuted(false,id);
 const d=document.createElement('div');d.id='uprof';
 d.innerHTML=`<div class="uph" style="background:${bg}"><div class="upp">${pat}</div><button class="upb" id="upx">${sv(I.back)}</button><button class="upb r" id="upm">${sv(I.dots)}</button><div class="upa"><img src="${PICKO_SERVER}/api/avatar/${u.id}" onerror="this.remove()">${esc((u.name||'?')[0])}</div><h2>${esc(u.name)}${u.prem?`<svg class="ps" viewBox="0 0 24 24" width="20" height="20"><path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z" fill="#fbbf24"/></svg>`:''}${u.owner?'<span class="tag">مالک</span>':''}</h2><p class="ust">${seen(u.last_seen,j.now)}</p><div class="uacts"><button data-a="call">${sv(I.call)}<span>تماس</span></button><button data-a="mute">${sv(muted?I.boff:I.bell)}<span>${muted?'صدادار کردن':'بی‌صدا کردن'}</span></button><button data-a="msg">${sv(I.msg)}<span>پیام</span></button></div></div>
 <div class="upc"><div class="mc">${u.bio?`<div class="uinf"><div><b>${esc(u.bio)}</b><small>بیوگرافی</small></div></div>`:''}<div class="uinf" data-a="cpu"><div><b dir="ltr">@${esc(u.username)}</b><small>نام کاربری</small></div>${sv(I.qr)}</div></div>${j.viewer_owner?`<div class="mc"><div class="mr" data-a="give"><span class="mi" style="background:#f59e0b">${sv(I.gift)}</span><div class="mt"><b>هدیه‌ی پیکوین</b></div></div></div>`:''}<div class="mc"><div class="mr" data-a="addc"><span class="mi" style="background:#2f9bff">${sv(I.add)}</span><div class="mt"><b>${u.contact?'در مخاطبین هستی':'افزودن به مخاطبین'}</b></div></div></div></div>`;
 document.body.appendChild(d);el=d;
 q('#upx').onclick=close;
 q('#upm').onclick=()=>toast('به‌زودی');
 d.querySelectorAll('[data-a]').forEach(e=>e.onclick=async()=>{
  const k=e.dataset.a;
  if(k=='call')toast('به‌زودی');
  else if(k=='mute'){
   if(typeof Chat==='undefined')return;
   Chat.act(false,id,'mute');
   const m=Chat.isMuted(false,id);
   e.querySelector('span').textContent=m?'صدادار کردن':'بی‌صدا کردن';
   e.querySelector('svg').innerHTML=m?I.boff:I.bell;
  }
  else if(k=='msg')close();
  else if(k=='cpu'){
   if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(u.username).catch(()=>{});
   toast('کپی شد');
  }
  else if(k=='addc'){
   if(u.contact)return;
   try{await api('/api/contact_add',{uid:id});u.contact=true;e.querySelector('b').textContent='در مخاطبین هستی';toast('اضافه شد')}catch(x){toast(x.message)}
  }
  else if(k=='give')giveDlg(id,u.name);
 });
}
return{show,close,back:()=>close()};
})();
