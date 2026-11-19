const MenuUI=(()=>{
const q=s=>document.querySelector(s);
const A=()=>store.get('auth',null);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const G={
 user:'<circle cx="12" cy="9" r="3.2"/><path d="M5.5 19c.8-3.2 3.3-4.8 6.5-4.8s5.7 1.6 6.5 4.8"/>',
 chat:'<path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H11l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/><path d="M8 9h8M8 12h5"/>',
 key:'<circle cx="8.5" cy="12" r="3.5"/><path d="M12 12h8M17 12v3M20 12v2"/>',
 spk:'<path d="M4 10v4h3l5 4V6L7 10z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
 data:'<circle cx="12" cy="12" r="8"/><path d="M12 4v8h8"/>',
 folder:'<path d="M3.5 7.5A1.5 1.5 0 0 1 5 6h4l2 2h8a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5z"/>',
 laptop:'<rect x="5" y="6" width="14" height="9" rx="1.5"/><path d="M3 18h18"/>',
 bat:'<rect x="3.5" y="8" width="15" height="8" rx="2"/><path d="M20.5 11v2M6 11v2"/>',
 globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3 3.2 3 13.8 0 17M12 3.5c-3 3.2-3 13.8 0 17"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4L18 18M18 6l-1.6 1.6M7.6 16.4L6 18"/>',
 userx:'<circle cx="10" cy="9" r="3"/><path d="M4.5 19c.7-3 3-4.5 5.5-4.5M16 14l4 4M20 14l-4 4"/>',
 info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
 q:'<circle cx="12" cy="12" r="8.5"/><path d="M9.7 9.6a2.4 2.4 0 1 1 3.4 2.2c-.7.4-1.1.9-1.1 1.7M12 16.6h.01"/>',
 dots:'<path d="M5 6h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-7l-4 3v-3H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z"/><path d="M9 11h.01M12 11h.01M15 11h.01"/>',
 shield:'<path d="M12 4l7 3v5c0 4-3 6.5-7 8-4-1.5-7-4-7-8V7z"/><path d="M9 12l2 2 4-4"/>',
 cam:'<path d="M5 8h2.5L9 6h6l1.5 2H19a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3"/>',
 tick:'<path d="M5 12.5l4.2 4.2L19 7"/>'
};
const svg=p=>`<svg viewBox="0 0 24 24">${p}</svg>`;
const ico=(k,c)=>`<span class="mi" style="background:${c}">${svg(G[k])}</span>`;
const row=(k,c,t,s,a)=>`<div class="mr" data-a="${a}">${ico(k,c)}<div class="mt"><b>${t}</b>${s?'<small>'+s+'</small>':''}</div></div>`;
const BG=[['','#2a1456'],['blue','#10305e'],['green','#0f4a3a'],['rose','#5e1030'],['black','#000000']];
function toast(t){let e=q('#toast');if(!e){e=document.createElement('div');e.id='toast';document.body.appendChild(e)}e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2200)}
function applyPrefs(){
 const r=document.documentElement;
 r.style.setProperty('--bf',store.get('fs',17)+'px');
 const bg=store.get('cbg','');if(bg)r.dataset.cbg=bg;else delete r.dataset.cbg;
 document.body.classList.toggle('noanim',store.get('anim',true)===false||store.get('eco',false)===true);
}
const tg=(id,on)=>`<button class="tg${on?' on':''}" id="${id}"></button>`;
function bindTg(id,fn){const b=q('#'+id);b.onclick=()=>{const on=!b.classList.contains('on');b.classList.toggle('on',on);fn(on)}}
function sub(title,html,init){
 closeSub(true);
 const d=document.createElement('div');d.id='spg';d.className='spg';
 d.innerHTML=`<div class="sph"><button class="lb">بازگشت</button><b>${title}</b></div><div class="spc">${html}</div>`;
 document.body.appendChild(d);
 d.querySelector('.lb').onclick=()=>closeSub();
 if(init)init(d);
}
function closeSub(instant){
 const d=q('#spg');if(!d)return false;
 clearInterval(d._t);d.id='';
 if(instant)d.remove();else{d.classList.add('out');setTimeout(()=>d.remove(),180)}
 return true;
}
function copy(t){
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).catch(()=>{});
 else{const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}a.remove()}
}
function pgChat(){
 const night=document.documentElement.dataset.theme!=='light';
 sub('تنظیمات گفتگو',`
 <div class="mc">
  <div class="sw"><span>حالت شب</span>${tg('t-night',night)}</div>
  <div class="sw"><span>انیمیشن‌ها</span>${tg('t-anim',store.get('anim',true)!==false)}</div>
  <div class="sw"><span>صدای پیام‌ها</span>${tg('t-snd',store.get('snd',true)!==false)}</div>
 </div>
 <div class="mc"><div class="msec">اندازه‌ی متن پیام‌ها</div><div class="sl"><input type="range" id="fsz" min="14" max="22" step="1" value="${store.get('fs',17)}"><small class="mu" id="fszv"></small></div></div>
 <div class="mc"><div class="msec">ریاکشن دوبار ضربه</div><div class="sw"><span id="dtv2"></span><span><button class="mb" id="dtc2">تغییر</button> <button class="mb" id="dto2">خاموش</button></span></div></div>
 <div class="mc"><div class="msec">پس‌زمینه‌ی چت</div><div class="bgs" id="bgs">${BG.map(b=>`<button data-b="${b[0]}" style="background:${b[1]}" class="${store.get('cbg','')==b[0]?'on':''}"></button>`).join('')}</div></div>`,()=>{
  bindTg('t-night',on=>{const cur=document.documentElement.dataset.theme!=='light';if(cur!==on){const t=q('#thm');if(t)t.click()}});
  bindTg('t-anim',on=>{store.set('anim',on);applyPrefs()});
  bindTg('t-snd',on=>store.set('snd',on));
  const f=q('#fsz'),fv=q('#fszv');
  const showF=()=>{fv.textContent=Number(f.value).toLocaleString('fa-IR')+' پیکسل'};showF();
  f.oninput=()=>{store.set('fs',+f.value);applyPrefs();showF()};
  const dv=()=>{const e=store.get('dtap','heart_red');q('#dtv2').innerHTML=e?PE.svg(e,26):'<span class="mu">خاموش</span>'};dv();
  q('#dtc2').onclick=()=>PE.picker(n=>{store.set('dtap',n);const s=q('#pe-sheet');if(s)s.remove();dv()});
  q('#dto2').onclick=()=>{store.set('dtap','');dv()};
  q('#bgs').onclick=e=>{const b=e.target.closest('button');if(!b)return;store.set('cbg',b.dataset.b);applyPrefs();q('#bgs').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x==b))};
 });
}
function pgAcct(){
 const a=A();
 if(!a){toast('اول وارد حساب شو');return}
 sub('حساب کاربری',`<div class="mc"><div class="sw"><span>اسم نمایشی</span><b>${esc(a.name)}</b></div><div class="sw" id="cpu"><span>نام کاربری</span><b dir="ltr">@${esc(a.username)}</b></div></div><p class="mu hint">با زدن روی نام کاربری، کپی می‌شه</p><button class="pb dg" id="lo2">خروج از حساب</button>`,()=>{
  q('#cpu').onclick=()=>{copy(a.username);toast('کپی شد')};
  q('#lo2').onclick=()=>{store.set('auth',null);closeSub(true);build();if(typeof Chat!=='undefined')Chat.render()};
 });
}
function pgPk(){
 sub('تنظیمات پیکو',`<div class="mc"><div class="sw"><span>وضعیت سرور</span><b id="srv2"></b></div></div><div class="mc"><div class="msec">آدرس سرور</div><div class="sl"><input class="in" id="sv2" dir="ltr" autocapitalize="none"><button class="pb" id="svs2">ذخیره</button><button class="pb" id="svr2">برگشت به حالت خودکار</button></div></div>`,d=>{
  q('#sv2').value=(typeof PICKO_SERVER!=='undefined')?PICKO_SERVER:'';
  const st=()=>{const off=document.body.classList.contains('offline');const e=q('#srv2');if(e){e.textContent=off?'قطع':'متصل';e.style.color=off?'#ff8a8a':'#34d399'}};
  st();d._t=setInterval(st,1500);
  q('#svs2').onclick=()=>{let v=q('#sv2').value.trim().replace(/\/+$/,'');if(!v)return;if(!/^https?:\/\//.test(v))v='http://'+v;store.set('server',v);location.reload()};
  q('#svr2').onclick=()=>{try{localStorage.removeItem('picko_server')}catch(e){}location.reload()};
 });
}
function pgEco(){
 sub('ذخیره انرژی',`<div class="mc"><div class="sw"><span>کاهش مصرف انرژی</span>${tg('t-eco',store.get('eco',false)===true)}</div></div><p class="mu hint">با روشن بودنش انیمیشن‌ها خاموش می‌شن تا باتری کمتر مصرف بشه.</p>`,()=>bindTg('t-eco',on=>{store.set('eco',on);applyPrefs()}));
}
function pgLang(){
 sub('زبان',`<div class="mc"><div class="sw"><span>فارسی</span><span class="ck">${svg(G.tick)}</span></div><div class="sw" id="en"><span>English</span><small class="mu">به‌زودی</small></div></div>`,()=>{q('#en').onclick=()=>toast('به‌زودی')});
}
function pgAbout(){
 sub('درباره',`<div class="mh"><div class="mav">P</div><h2>Picko</h2><p>نسخه‌ی آزمایشی</p></div><div class="mc"><div class="sw"><span>پیام‌رسان شخصی پیکو</span></div></div>`);
}
function act(a){
 if(a=='chat')pgChat();else if(a=='acct')pgAcct();else if(a=='pk')pgPk();else if(a=='eco')pgEco();else if(a=='lang')pgLang();else if(a=='about')pgAbout();
 else toast('به‌زودی');
}
function main(){
 const a=A()||{name:'Picko',username:'guest'};
 const ch=esc((a.name||'?')[0]);
 return `<div class="mh"><div class="mav">${ch}<button class="mcam" data-a="soon">${svg(G.cam)}</button></div><h2>${esc(a.name)}</h2><p dir="ltr">@${esc(a.username)}</p></div>
 <div class="mc"><div class="msec">حساب‌های کاربری</div><div class="mr" data-a="acct"><span class="mav2">${ch}</span><div class="mt"><b>${esc(a.name)}</b></div></div>${row('user','#22b8cf','مدیریت حساب‌ها','','soon')}</div>
 <div class="mc">${row('gear','#34c759','تنظیمات پیکو','','pk')}${row('userx','#ff4d6d','حذف کلی حساب کاربری','','soon')}${row('info','#ff9f0a','درباره','','about')}</div>
 <div class="mc">${row('user','#2f9bff','حساب کاربری','اسم، نام کاربری، خروج از حساب','acct')}${row('chat','#ff9f0a','تنظیمات گفتگو','پس‌زمینه، حالت شب، انیمیشن‌ها','chat')}${row('key','#34c759','حریم خصوصی و امنیت','آخرین بازدید، دستگاه‌ها، کلیدهای عبور','soon')}${row('spk','#ff4d6d','اعلان‌ها','صداها، تماس‌ها، نشانگرها','soon')}${row('data','#3b82f6','داده‌ها و ذخیره‌سازی','تنظیمات دانلود رسانه','soon')}${row('folder','#2f9bff','پوشه‌های گفتگو','مرتب‌سازی گفتگوها در پوشه‌ها','soon')}${row('laptop','#22b8cf','دستگاه‌ها','مدیریت دستگاه‌های متصل شده','soon')}${row('bat','#ff9f0a','ذخیره انرژی','کاهش مصرف انرژی در شارژ کم','eco')}${row('globe','#a855f7','زبان','فارسی','lang')}</div>
 <div class="mc"><div class="msec">راهنمایی</div>${row('dots','#ff9f0a','پرسیدن سؤال','','soon')}${row('q','#3b82f6','پرسش‌های متداول پیکو','','soon')}${row('shield','#34c759','سیاست حریم خصوصی','','soon')}</div>`;
}
let lastKey=null;
function build(){
 const m=q('#menu');if(!m)return;
 let h=q('#mset');if(!h){h=document.createElement('div');h.id='mset';m.appendChild(h)}
 const a=A();lastKey=a?a.id+'|'+a.name:'';
 h.innerHTML=main();
 h.querySelectorAll('[data-a]').forEach(e=>e.onclick=()=>act(e.dataset.a));
}
applyPrefs();build();
if(typeof names!=='undefined'){names.menu='تنظیمات';if(store.get('tab','chats')=='menu'){const t=q('#title');if(t)t.textContent='تنظیمات'}}
setInterval(()=>{const a=A();const k=a?a.id+'|'+a.name:'';if(k!==lastKey)build()},1500);
return{back:()=>closeSub()};
})();
