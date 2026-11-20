const Contacts=(()=>{
const q=s=>document.querySelector(s);
const A=()=>store.get('auth',null);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const svg=p=>`<svg viewBox="0 0 24 24">${p}</svg>`;
const ico=(c,p)=>`<span class="mi" style="background:${c}">${svg(p)}</span>`;
const P={
 users:'<circle cx="9" cy="9" r="3"/><path d="M3.5 19c.6-3 2.8-4.5 5.5-4.5s4.9 1.5 5.5 4.5M16 6.5a3 3 0 0 1 0 5.5M17 14.7c2 .5 3.3 2 3.5 4.3"/>',
 mega:'<path d="M4 10v4l12 4V6z"/><path d="M7 14l1 5h3l-1-4.5M19 9a4 4 0 0 1 0 6"/>',
 lock:'<rect x="5.5" y="10.5" width="13" height="9" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
 add:'<circle cx="10" cy="9" r="3.2"/><path d="M4 19c.7-3.2 3.2-4.8 6-4.8M17 8v6M14 11h6"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>'
};
function seen(l,n){
 if(!l)return 'مدتی پیش';
 if(n-l<12)return 'آنلاین';
 const d=new Date(l*1000),t=d.toLocaleTimeString('fa-IR',{hour:'2-digit',minute:'2-digit'});
 const z=new Date(n*1000);z.setHours(0,0,0,0);
 if(d>=z)return 'آخرین بازدید امروز '+t;
 if(d>=new Date(z-86400000))return 'آخرین بازدید دیروز '+t;
 return 'آخرین بازدید '+d.toLocaleDateString('fa-IR',{month:'long',day:'numeric'});
}
const avt=u=>`<i class="av" style="background:${['#7c3aed','#2563eb','#db2777','#059669','#d97706'][u.id%5]}"><img class="avi" src="${PICKO_SERVER}/api/avatar/${u.id}" onerror="this.remove()">${esc((u.name||'?')[0])}</i>`;
function toast(t){let e=q('#toast');if(!e){e=document.createElement('div');e.id='toast';document.body.appendChild(e)}e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2200)}
async function api(path,body){
 const a=A(),h={};if(body)h['Content-Type']='application/json';if(a)h.Authorization='Bearer '+a.token;
 const r=await fetch(PICKO_SERVER+path,{method:body?'POST':'GET',headers:h,body:body?JSON.stringify(body):undefined});
 const j=await r.json().catch(()=>({}));
 if(!r.ok)throw new Error(j.error||'خطا');
 return j;
}
let data=null,lastKey=null;
function listHtml(){
 if(!A())return '<div class="empty">برای دیدن مخاطبین وارد حساب شو</div>';
 if(!data)return '<div class="empty">در حال بارگذاری...</div>';
 if(!data.users.length)return '<div class="empty">هنوز مخاطبی نداری. با دکمه‌ی پایین یکی اضافه کن</div>';
 return data.users.map(u=>{const on=data.now-u.last_seen<12;return `<div class="ci" data-u="${u.id}" data-n="${esc(u.name)}"><span class="avw">${avt(u)}${on?'<b class="on-dot"></b>':''}</span><div class="cm"><b>${esc(u.name)}</b><small class="${on?'onl':''}">${seen(u.last_seen,data.now)}</small></div></div>`}).join('');
}
function bindList(){
 document.querySelectorAll('#clst .ci[data-u]').forEach(e=>e.onclick=()=>{if(typeof Chat!=='undefined')Chat.open(+e.dataset.u,e.dataset.n)});
}
function build(){
 const el=q('#contacts');if(!el)return;
 const a=A();lastKey=a?String(a.id):'';
 el.innerHTML=`<div class="mc"><div class="mr" data-c="group">${ico('#2f9bff',P.users)}<div class="mt"><b>گروه جدید</b></div></div><div class="mr" data-c="channel">${ico('#34c759',P.mega)}<div class="mt"><b>کانال جدید</b></div></div><div class="mr" data-c="soon">${ico('#ff9f0a',P.lock)}<div class="mt"><b>گفتگوی محرمانه جدید</b></div></div></div><div class="mc"><div class="msec">مرتب شده بر اساس آخرین زمان بازدید</div><div id="clst">${listHtml()}</div></div><button class="fabc" id="addc">${svg(P.add)}</button>`;
 el.querySelectorAll('[data-c]').forEach(e=>e.onclick=()=>{const k=e.dataset.c;if(k=='soon')toast('به‌زودی');else if(typeof Chat!=='undefined')Chat.create(k)});
 q('#addc').onclick=addUI;
 bindList();
}
async function load(){
 if(!A()){data=null;const l=q('#clst');if(l)l.innerHTML=listHtml();return}
 try{data=await api('/api/contacts');const l=q('#clst');if(l){l.innerHTML=listHtml();bindList()}}catch(e){}
}
function addUI(){
 if(!A()){toast('اول وارد حساب شو');return}
 const d=document.createElement('div');d.id='fs';
 d.innerHTML=`<div class="fbox"><div class="fh"><b>افزودن مخاطب</b><button class="pk" id="ax">${svg(P.x)}</button></div><input class="in" id="aq" placeholder="نام کاربری یا اسم"><div id="al"></div></div>`;
 document.body.appendChild(d);
 const close=()=>d.remove();
 q('#ax').onclick=close;d.onclick=e=>{if(e.target==d)close()};
 let t;
 q('#aq').oninput=()=>{clearTimeout(t);t=setTimeout(async()=>{
  const v=q('#aq').value.trim();if(!v){q('#al').innerHTML='';return}
  try{
   const j=await api('/api/search?q='+encodeURIComponent(v));
   q('#al').innerHTML=j.users.map(u=>`<div class="ci" data-p="${u.id}"><span class="avw">${avt(u)}</span><div class="cm"><b>${esc(u.name)}</b><small>@${esc(u.username)}</small></div></div>`).join('')||'<div class="empty">کاربری پیدا نشد</div>';
   q('#al').querySelectorAll('[data-p]').forEach(e=>e.onclick=async()=>{try{await api('/api/contact_add',{uid:+e.dataset.p});close();toast('اضافه شد');load()}catch(x){toast(x.message)}});
  }catch(x){toast(x.message)}
 },300)};
}
build();load();
setInterval(()=>{const a=A(),k=a?String(a.id):'';if(k!==lastKey){data=null;build();load()}else if(q('#contacts.on'))load()},5000);
return{reload:load};
})();
