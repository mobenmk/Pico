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
function applyPrefs(){applyTheme();syncNight();applyWalls();
 const r=document.documentElement;
 r.style.setProperty('--bf',store.get('fs',17)+'px');
 const bg=store.get('cbg','');if(bg)r.dataset.cbg=bg;else delete r.dataset.cbg;
 document.body.classList.toggle('noanim',store.get('anim',true)===false||store.get('eco',false)===true);
}
const tg=(id,on)=>`<button class="tg${on?' on':''}" id="${id}"></button>`;
function bindTg(id,fn){const b=q('#'+id);b.onclick=()=>{const on=!b.classList.contains('on');b.classList.toggle('on',on);fn(on)}}
function sub(title,html,init,back){
 closeSub(true);
 const d=document.createElement('div');d.id='spg';d.className='spg';
 d.innerHTML=`<div class="sph"><button class="bk">${svg('<path d="M19 12H5M11 6l-6 6 6 6"/>')}</button><b>${title}</b></div><div class="spc">${html}</div>`;
 document.body.appendChild(d);
 d._back=back;d.querySelector('.bk').onclick=()=>closeSub();
 if(init)init(d);
}
function closeSub(instant){
 const d=q('#spg');if(!d)return false;if(!instant&&d._back){d._back();return true}
 clearInterval(d._t);d.id='';
 if(instant)d.remove();else{d.classList.add('out');setTimeout(()=>d.remove(),180)}
 return true;
}
function copy(t){
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).catch(()=>{});
 else{const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}a.remove()}
}
const THEMES=[['purple','#8b5cf6','#2563eb'],['blue','#3b82f6','#06b6d4'],['green','#22c55e','#14b8a6'],['rose','#ec4899','#f43f5e'],['orange','#f97316','#eab308']];
const CG={'':'#2a1456',blue:'#10305e',green:'#0f4a3a',rose:'#5e1030',black:'#000000'};
function applyTheme(){
 const r=document.documentElement,s=r.style;
 const t=THEMES.find(x=>x[0]==store.get('theme2','purple'))||THEMES[0];
 s.setProperty('--ac',t[1]);s.setProperty('--ac2',t[2]);
 s.setProperty('--br',store.get('br',22)+'px');
 s.setProperty('--glow',store.get('lbg','')||'#2a1456');
 s.setProperty('--cg',CG[store.get('cbg','')]||'#2a1456');
 r.dataset.bt=store.get('bt','glass');r.dataset.cl=store.get('cl','two');
 s.setProperty('--nc',(store.get('ncol','')||'').split(',')[0]||'transparent');
}
const mq=window.matchMedia?matchMedia('(prefers-color-scheme: dark)'):null;
function syncNight(){
 if(store.get('autonight',false)!==true||!mq)return;
 const cur=document.documentElement.dataset.theme!=='light';
 if(cur!==mq.matches){const t=q('#thm');if(t)t.click()}
}
if(mq&&mq.addEventListener)mq.addEventListener('change',syncNight);
const IC={
 img:'<rect x="4" y="5" width="16" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="M5 17l4.5-4.5 3 3 2.5-2.5L19 17"/>',
 pal:'<path d="M12 4a8 8 0 1 0 0 16c1.3 0 2-.8 2-1.7 0-1.3-1-1.5-1-2.6 0-.8.7-1.2 1.5-1.2H17a3 3 0 0 0 3-3C20 7.5 16.5 4 12 4z"/><circle cx="8.5" cy="11" r=".8"/><circle cx="12" cy="8" r=".8"/><circle cx="15.5" cy="9.5" r=".8"/>',
 fx:'<circle cx="12" cy="12" r="8.5"/><path d="M8 12h.01M12 8h.01M12 12h.01M12 16h.01M16 12h.01"/>',
 bub:'<path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H11l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/>',
 tick:'<path d="M5 12.5l4.2 4.2L19 7"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
 moon:'<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>',
 globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c3 3.2 3 13.8 0 17M12 3.5c-3 3.2-3 13.8 0 17"/>',
 play:'<circle cx="12" cy="12" r="8.5"/><path d="M10 8.5l5 3.5-5 3.5z"/>',
 sticker:'<rect x="4" y="4" width="16" height="16" rx="5"/><path d="M8.5 13.5c1 2 5 2 6 0M9 9.5h.01M15 9.5h.01"/>',
 cake:'<rect x="5" y="12" width="14" height="7" rx="1.5"/><path d="M5 15.5c2 1.5 3-1.5 5 0s3-1.5 5 0 3 1.5 4 0M9 12V9M12 12V8.5M15 12V9"/>',
 at:'<circle cx="12" cy="12" r="3.3"/><path d="M15.3 12v1.4a2 2 0 0 0 4 0V12a7.3 7.3 0 1 0-3 5.9"/>',
 mega:'<path d="M4 10v4l12 4V6z"/><path d="M7 14l1 5h3l-1-4.5M19 9a4 4 0 0 1 0 6"/>',
 ai:'<path d="M7 4l1.2 3 3 1.2-3 1.2L7 12.4 5.8 9.4 2.8 8.2l3-1.2zM15 9l1.5 4 4 1.5-4 1.5L15 20l-1.5-4-4-1.5 4-1.5z"/>',
 out:'<path d="M9 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3M15 8l4 4-4 4M19 12H9"/>'
};
const icoP=(c,p)=>`<span class="mi" style="background:${c}">${svg(p)}</span>`;
const srow=(ic,t,s,right,a)=>`<div class="sr" data-a="${a||''}">${ic?`<span class="si">${svg(ic)}</span>`:''}<div class="mt"><b>${t}</b>${s?`<small>${s}</small>`:''}</div>${right||''}</div>`;
const trow=(t,s,id,on)=>`<div class="sr"><div class="mt"><b>${t}</b>${s?`<small>${s}</small>`:''}</div>${tg(id,on)}</div>`;
const acrow=(c,p,val,label,a)=>`<div class="mr" data-a="${a}">${icoP(c,p)}<div class="mt"><b>${val}</b><small>${label}</small></div></div>`;
const lg=(a,b,i)=>`<svg viewBox="0 0 64 64"><defs><linearGradient id="lgx${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="#120a24"/><path d="M14 14h36a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H32l-9 8v-8h-9a8 8 0 0 1-8-8V22a8 8 0 0 1 8-8z" fill="url(#lgx${i})"/><path d="M26 38V24h8a5 5 0 0 1 0 10h-8" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const TK='<svg class="tk rd" viewBox="0 0 18 12" width="16" height="11" fill="none" stroke="#9a9aaa" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6.5l3.5 3.5L11 2"/><path d="M6 6.5l3.5 3.5L16 2"/></svg>';
function sheet(html,init){
 const d=document.createElement('div');d.className='pks mn';
 d.innerHTML=`<div class="pkb">${html}</div>`;
 document.body.appendChild(d);
 d.onclick=e=>{if(e.target==d)d.remove()};
 if(init)init(d);
}
function bgSheet(kind){
 const cur=kind=='c'?store.get('cbg',''):store.get('lbg','');
 sheet(`<div class="fh"><b>${kind=='c'?'تغییر پس‌زمینه گفتگو':'تغییر پس‌زمینه لیست گفتگوها'}</b></div><div class="bgs" id="bgs2">${BG.map(b=>`<button data-b="${b[0]}" data-c="${b[1]}" style="background:${b[1]}" class="${(kind=='c'?cur==b[0]:(cur==''?b[0]=='':cur==b[1]))?'on':''}"></button>`).join('')}</div>`,d=>{
  q('#bgs2').onclick=e=>{
   const b=e.target.closest('button');if(!b)return;
   if(kind=='c')store.set('cbg',b.dataset.b);else store.set('lbg',b.dataset.b==''?'':b.dataset.c);
   applyPrefs();d.remove();
  };
 });
}
function btSheet(){
 const cur=store.get('bt','glass');
 sheet(`<div class="fh"><b>نوع حباب پیام</b></div><div class="mc">${[['glass','شیشه‌ای'],['solid','ساده']].map(o=>`<div class="sw" data-o="${o[0]}"><span>${o[1]}</span>${cur==o[0]?`<span class="ck">${svg(G.tick)}</span>`:''}</div>`).join('')}</div>`,d=>{
  d.querySelectorAll('[data-o]').forEach(e=>e.onclick=()=>{store.set('bt',e.dataset.o);applyPrefs();d.remove();const v=q('#btv');if(v)v.textContent=e.dataset.o=='solid'?'ساده':'شیشه‌ای'});
 });
}
function reactSheet(){
 sheet(`<div class="fh"><b>ریاکشن دوبار ضربه</b></div><div class="sw"><span id="dtv3"></span><span><button class="mb" id="dtc3">تغییر</button> <button class="mb" id="dto3">خاموش</button></span></div>`,()=>{
  const dv=()=>{const e=store.get('dtap','heart_red');q('#dtv3').innerHTML=e?PE.svg(e,28):'<span class="mu">خاموش</span>'};dv();
  q('#dtc3').onclick=()=>PE.picker(n=>{store.set('dtap',n);const s=q('#pe-sheet');if(s)s.remove();dv()});
  q('#dto3').onclick=()=>{store.set('dtap','');dv()};
 });
}
function pgChat(){
 const fs=store.get('fs',17),br=store.get('br',22),cl=store.get('cl','two'),th=store.get('theme2','purple');
 const night=document.documentElement.dataset.theme!=='light';
 const c=(k,def)=>store.get('c_'+k,def)===true;
 const ml=n=>`<div class="ml"><s></s><div><u></u><u></u>${n==3?'<u></u>':''}</div></div>`;
 const PV=`<div class="pvw"><div class="bub"><div class="rp"><b>Picko</b><span>سلام!</span></div><div class="bt">امروز چه خبر؟</div><small><span class="tm">۰۰:۵۵</span></small></div><div class="bub me"><div class="bt">همه‌چی خوبه</div><small><span class="tm">۰۱:۱۰</span><span class="tkw">${TK}</span></small></div></div>`;
 const thm=THEMES.map(t=>`<button data-t="${t[0]}" class="${th==t[0]?'on':''}"><i style="background:linear-gradient(135deg,${t[1]},${t[2]})"></i><i class="d"></i></button>`).join('');
 const icons=[['پیش‌فرض','#a855f7','#22d3ee'],['کلاسیک','#60a5fa','#2563eb'],['اقیانوس','#22d3ee','#0ea5e9'],['غروب','#fb7185','#f59e0b']].map((x,i)=>`<button data-i="${i}" class="${i==0?'on':''}">${lg(x[1],x[2],i)}<span>${x[0]}</span></button>`).join('');
 const sw=store.get('swp',1);
 const sws=['بایگانی کردن','بی‌صدا کردن','حذف کردن'].map((t,i)=>`<button data-s="${i}" class="${sw==i?'on':''}">${t}</button>`).join('');
 const html=`
 <div class="mc"><div class="msec">اندازه متن پیام</div><div class="sl2"><input type="range" id="fsz" min="14" max="22" step="1" value="${fs}"><span class="sv2" id="fszv">${fs}</span></div></div>
 ${PV}
 <div class="mc">${srow(IC.img,'تغییر پس‌زمینه گفتگو','','','bgc')}${srow(IC.img,'تغییر پس‌زمینه لیست گفتگوها','','','bgl')}${srow(IC.pal,'تغییر رنگ نام','','','nc')}${srow(IC.fx,'افکت پس زمینه','',`<span class="sv" id="fxv">${FXN[store.get('fx','off')]||FXN.off}</span>`,'fx')}${srow(IC.bub,'نوع حباب پیام','',`<span class="sv" id="btv">${BTN[store.get('bt','glass')]||'Glass'}</span>`,'bt')}${srow(IC.tick,'نوع تیک خوانده شدن پیام','',`<span class="sv">${(TKN.find(x=>x[0]==store.get('tk','stock'))||TKN[0])[1]}</span>`,'tk')}</div>
 <div class="mc"><div class="msec">پوسته رنگی</div><div class="thm" id="thm2">${thm}</div>${srow(night?IC.sun:IC.moon,night?'تغییر به حالت روز':'تغییر به حالت شب','','','night')}${srow(IC.pal,'جستجوی پوسته‌ها','','','soon')}</div>
 <div class="mc"><div class="msec">گوشه‌های پیام</div><div class="sl2"><input type="range" id="brs" min="4" max="28" step="1" value="${br}"><span class="sv2" id="brv">${br}</span></div></div>
 <div class="mc"><div class="msec">نمای لیست گفتگوها</div><div class="cls" id="cls"><button data-c="two" class="${cl=='two'?'on':''}">${ml(2)}<span>دو خطی</span></button><button data-c="three" class="${cl=='three'?'on':''}">${ml(3)}<span>سه خطی</span></button></div></div>
 <div class="mc"><div class="msec">آیکون برنامه</div><div class="aic" id="aic">${icons}</div></div>
 <div class="mc"><div class="msec">الگوی حرکتی کشیدن در لیست گفتگوها</div><div class="sws" id="sws">${sws}</div></div>
 <p class="mu hint">انتخاب کنید که در هنگام کشیدن گفتگو به سمت چپ در لیست گفتگوها، کدام عملیات انجام شود.</p>
 <div class="mc">${srow(IC.moon,'حالت شب خودکار','پیش‌فرض سیستم تاریک',tg('t-auto',store.get('autonight',false)===true),'')}${srow(IC.globe,'مرورگر درون‌برنامه','لینک‌های خارجی در داخل برنامه باز شوند',tg('c-browser',c('browser',false)),'')}${srow(IC.play,'انیمیشن‌ها','جلوه‌های حرکتی را برای ذخیره انرژی خاموش کنید',tg('t-anim',store.get('anim',true)!==false),'')}${srow(IC.sticker,'استیکرها و اموجی‌ها','مدیریت استیکرها، اموجی‌ها و واکنش‌ها','','react')}</div>
 <div class="mc"><div class="msec">رسانه‌ها و صدا</div>${trow('صدای پیام‌ها','','t-snd',store.get('snd',true)!==false)}${trow('زدن برای نمایش رسانه بعدی','در هنگام مشاهده رسانه‌ها، در نزدیکی لبه صفحه بزنید تا رسانه‌های دیگر را مشاهده کنید','c-next',c('next',false))}${trow('بالا بردن جهت گوش دادن','با بالا بردن تلفن همراه به سمت گوش خود، صدا را به هندزفری انتقال دهید','c-ear',c('ear',true))}${trow('بالا بردن جهت صحبت','با بالا بردن تلفن همراه به سمت گوش خود، پیام‌های صوتی ضبط کنید','c-speak',c('speak',false))}${trow('مکث موزیک در هنگام ضبط','هنگامی که شروع به ضبط پیام ویدیویی می‌کنید، موزیک مکث شود','c-prec',c('prec',false))}${trow('مکث موزیک هنگام پخش رسانه','','c-pmed',c('pmed',false))}${srow(null,'میکروفن پیام‌های صوتی','','<span class="sv">داخلی</span>','soon')}</div>
 <div class="mc"><div class="msec">سایر تنظیمات</div>${trow('به اشتراک‌گذاری مستقیم','نمایش گفتگوهای اخیر در منوی به اشتراک‌گذاری اندروید','c-share',c('share',true))}${trow('ارسال با Enter','','t-enter',store.get('enter',false)===true)}${srow(null,'واحدهای فاصله','','<span class="sv">خودکار</span>','soon')}</div>`;
 sub('تنظیمات گفتگو',html,d=>{
  const fsl=q('#fsz'),fv=q('#fszv');
  fsl.oninput=()=>{store.set('fs',+fsl.value);applyPrefs();fv.textContent=fsl.value};
  const brs=q('#brs'),bv=q('#brv');
  brs.oninput=()=>{store.set('br',+brs.value);applyPrefs();bv.textContent=brs.value};
  q('#thm2').onclick=e=>{const b=e.target.closest('button');if(!b)return;store.set('theme2',b.dataset.t);applyPrefs();q('#thm2').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x==b))};
  q('#cls').onclick=e=>{const b=e.target.closest('button');if(!b)return;store.set('cl',b.dataset.c);applyPrefs();q('#cls').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x==b))};
  q('#aic').onclick=e=>{const b=e.target.closest('button');if(b&&b.dataset.i!='0')toast('به‌زودی')};
  q('#sws').onclick=e=>{const b=e.target.closest('button');if(!b)return;store.set('swp',+b.dataset.s);q('#sws').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x==b))};
  bindTg('t-auto',on=>{store.set('autonight',on);syncNight()});
  bindTg('t-anim',on=>{store.set('anim',on);applyPrefs()});
  bindTg('t-snd',on=>store.set('snd',on));
  bindTg('t-enter',on=>store.set('enter',on));
  ['browser','next','ear','speak','prec','pmed','share'].forEach(k=>bindTg('c-'+k,on=>store.set('c_'+k,on)));
  d.querySelectorAll('[data-a]').forEach(e=>e.onclick=()=>{
   const k=e.dataset.a;if(!k)return;
   if(k=='bgc')pgWall('c');else if(k=='bgl')pgWall('l');else if(k=='bt')pgBub();else if(k=='tk')pgTick();else if(k=='nc')pgName();else if(k=='fx')fxSheet();else if(k=='react')reactSheet();
   else if(k=='night'){const t=q('#thm');if(t)t.click();pgChat()}
   else toast('به‌زودی');
  });
 });
}
const TKN=[['stock','Stock'],['bold','Bold'],['slim','Slim'],['dots','Dots'],['cubes','Cubes'],['lines','Lines'],['hearts','Hearts'],['ring','Rings'],['arrow','Arrows']];
const BTS=[['glass','Glass'],['solid','Solid'],['tail','Telegram'],['ios','iOS'],['square','Square'],['lines','Lines'],['edge','Edge'],['pill','Pill']];
const BTN={};BTS.forEach(b=>{BTN[b[0]]=b[1]});
const FXN={off:'غیرفعال',date:'بر اساس تاریخ',snow:'دانه‌های برف',fire:'آتش‌بازی'};
const WALLS=[['','radial-gradient(circle at 80% -10%,#2a1456,transparent 50%),#050507'],['green','linear-gradient(160deg,#d7e08a,#7fb77a 50%,#d6dcb5)'],['fog','#d3dae6'],['aurora','linear-gradient(135deg,#f472b6,#fbbf24 45%,#22d3ee)'],['peach','linear-gradient(160deg,#f9a8d4,#fcd34d 55%,#fb923c)'],['lilac','linear-gradient(160deg,#e9d5ff,#bfdbfe 60%,#dcfce7)'],['candy','linear-gradient(160deg,#bef264,#fbbf24 60%,#86efac)'],['space','linear-gradient(160deg,#4f46e5,#c4b5fd 70%,#f0abfc)'],['sunrise','linear-gradient(160deg,#fb7185,#fbbf24 60%,#fde68a)'],['mint','linear-gradient(160deg,#60a5fa,#86efac 60%,#fde68a)'],['violet','linear-gradient(160deg,#7c3aed,#4f46e5 60%,#2563eb)'],['rose','linear-gradient(160deg,#f43f5e,#a855f7 60%,#6366f1)']];
const DARKS=[['#0e4a5c','#1b2a4e'],['#18284a','#1f1f3d'],['#14403c','#1b2740'],['#2a2e38','#15171c'],['#3a2a40','#241a3f'],['#3a2724','#5a3d2e'],['#1f5566','#1d2d57'],['#12435a','#3d2f66'],['#33472e','#12403a'],['#1d3141','#1d3141'],['#111c26','#111c26'],['#0b1020','#0b1020'],['#1f3a1f','#1f3a1f'],['#152016','#152016'],['#0e170f','#0e170f'],['#33332a','#33332a'],['#2b2520','#2b2520'],['#1d1b1a','#1d1b1a'],['#4a3030','#4a3030'],['#341f24','#341f24'],['#25161a','#25161a']];
const PAT='url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27130%27 height=%27130%27 viewBox=%270 0 130 130%27%3E%3Cg fill=%27none%27 stroke=%27%23ffffff%27 stroke-opacity=%27.16%27 stroke-width=%271.4%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Ccircle cx=%2722%27 cy=%2726%27 r=%276%27/%3E%3Cpath d=%27M78 20l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z%27/%3E%3Cpath d=%27M100 78c6-4 12 4 6 8M26 88l8-6 8 6M62 108h14%27/%3E%3C/g%3E%3C/svg%3E")';
const PAL=[['#5aa9e6'],['#7ccf6e'],['#e8a95a'],['#e88a7a'],['#8f8fe8'],['#52c9c0'],['#e8749a'],['#0b5394','#4fb8ff'],['#1b7f35','#a8e868'],['#c25a14','#eab35a'],['#9c3040','#ff9b87'],['#5b2fc9','#c79bff'],['#0b6a86','#3fd8cf'],['#8a3a74','#ff8fb5'],['#3b82f6','#ef4444'],['#fb923c','#16a34a'],['#4ade80','#ef4444'],['#22d3ee','#16a34a'],['#22d3ee','#fb923c'],['#a78bfa','#f97316'],['#3b82f6','#f59e0b']];
function applyWalls(){
 const r=document.documentElement,s=r.style;
 s.setProperty('--pat',PAT);
 const cw=store.get('cwcss','');
 if(cw){s.setProperty('--cw',cw);r.dataset.wp=store.get('cwpat',0)?'p':'1'}else{s.removeProperty('--cw');delete r.dataset.wp}
 const lw=store.get('lwcss','');
 if(lw){s.setProperty('--lw',lw);r.dataset.lw='1'}else{s.removeProperty('--lw');delete r.dataset.lw}
}
function pickImg(cb){
 const inp=document.createElement('input');inp.type='file';inp.accept='image/*';
 inp.onchange=()=>{
  const f=inp.files&&inp.files[0];if(!f)return;
  const url=URL.createObjectURL(f),img=new Image();
  img.onload=()=>{
   const k=Math.min(1,1080/Math.max(img.width,img.height)),w=Math.round(img.width*k),h=Math.round(img.height*k);
   const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);
   URL.revokeObjectURL(url);
   const du=c.toDataURL('image/jpeg',0.75);
   if(du.length>1800000){toast('تصویر خیلی بزرگه');return}
   cb(du);
  };
  img.onerror=()=>toast('عکس خونده نشد');
  img.src=url;
 };
 inp.click();
}
function setWall(kind,sel,css,pat){
 const k=kind=='c'?'cw':'lw';
 store.set(k+'css',css);store.set(k+'sel',sel);
 if(kind=='c'){store.set('cwpat',pat?1:0);store.set('cbg','')}
 applyPrefs();
}
function pgWall(kind){
 const key=kind=='c'?'cw':'lw',sel=store.get(key+'sel','');
 const tiles=WALLS.map(w=>`<button class="wt${sel==w[0]?' on':''}" data-id="${w[0]}" style="background:${w[1]}">${sel==w[0]?`<span class="wck">${svg(IC.tick)}</span>`:''}</button>`).join('');
 const off=kind=='l'?srow('<circle cx="12" cy="12" r="8.5"/><path d="M8 12h8"/>','غیرفعال کردن پس‌زمینه لیست گفتگوها','','','off'):'';
 sub(kind=='c'?'پس‌زمینه گفتگو':'پس‌زمینه لیست گفتگوها',`<div class="mc">${srow(IC.img,'انتخاب از گالری','','','gal')}${srow(IC.pal,'تنظیم رنگ','','','col')}${off}</div><div class="wgrid" id="wg">${tiles}</div>`,d=>{
  d.querySelectorAll('.wt').forEach(e=>e.onclick=()=>{
   const w=WALLS.find(x=>x[0]==e.dataset.id);
   setWall(kind,w[0],w[0]==''?'':w[1],w[0]!=='');
   pgWall(kind);
  });
  d.querySelectorAll('[data-a]').forEach(e=>e.onclick=()=>{
   const k=e.dataset.a;
   if(k=='gal')pickImg(du=>{setWall(kind,'img','url('+du+') center/cover no-repeat',false);pgWall(kind)});
   else if(k=='col')pgColors(kind);
   else if(k=='off'){setWall('l','','',false);pgWall('l')}
  });
 },()=>pgChat());
}
function hsv2hex(h,s,v){
 const f=n=>{const k=(n+h/60)%6;return v-v*s*Math.max(0,Math.min(k,4-k,1))};
 const x=n=>Math.round(f(n)*255).toString(16).padStart(2,'0');
 return '#'+x(5)+x(3)+x(1);
}
function hex2hsv(hx){
 const r=parseInt(hx.slice(1,3),16)/255,g=parseInt(hx.slice(3,5),16)/255,b=parseInt(hx.slice(5,7),16)/255;
 const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;
 let h=0;
 if(d){if(mx==r)h=((g-b)/d)%6;else if(mx==g)h=(b-r)/d+2;else h=(r-g)/d+4;h*=60;if(h<0)h+=360}
 return [h,mx?d/mx:0,mx];
}
function pgColors(kind){
 const sel=store.get((kind=='c'?'cw':'lw')+'sel','');
 const t=DARKS.map((p,i)=>`<button class="wt${sel=='c'+i?' on':''}" data-i="${i}" style="background:linear-gradient(155deg,${p[0]},${p[1]})">${sel=='c'+i?`<span class="wck">${svg(IC.tick)}</span>`:''}</button>`).join('');
 sub('رنگی را انتخاب کنید',`<div class="wgrid sq" id="wg"><button class="wt plus" id="cst">${svg('<path d="M12 5v14M5 12h14"/>')}</button>${t}</div>`,d=>{
  q('#cst').onclick=()=>pgPick(kind);
  d.querySelectorAll('.wt[data-i]').forEach(e=>e.onclick=()=>{
   const p=DARKS[+e.dataset.i];
   setWall(kind,'c'+e.dataset.i,'linear-gradient(155deg,'+p[0]+','+p[1]+')',false);
   pgWall(kind);
  });
 },()=>pgWall(kind));
}
function pgPick(kind){
 let h=260,s=.6,v=.5,grad=false;
 const css=()=>{const a=hsv2hex(h,s,v);return grad?'linear-gradient(155deg,'+a+','+hsv2hex((h+40)%360,s,Math.max(.15,v-.2))+')':a};
 sub('رنگ دلخواه',`<div class="pkv" id="pkv"><div class="pkb2"><div class="bub"><div class="bt">پیام دریافتی</div></div><div class="bub me"><div class="bt">پیام ارسالی</div></div></div></div><div class="sv-sq" id="sq"><i id="sqd"></i></div><input type="range" class="hue" id="hue" min="0" max="359" value="${h}"><div class="mc"><div class="sw"><span>گرادیان</span>${tg('t-grad',false)}</div><div class="sw"><span>کد رنگ</span><input class="fld hexf" id="hex" dir="ltr" maxlength="7"></div></div><button class="apply" id="pka">اعمال</button>`,d=>{
  const sq=q('#sq'),dot=q('#sqd'),pv=q('#pkv'),hue=q('#hue'),hexi=q('#hex');
  const paint=()=>{
   sq.style.background='linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,hsl('+h+',100%,50%))';
   dot.style.left=(s*100)+'%';dot.style.top=((1-v)*100)+'%';
   pv.style.background=css();hexi.value=hsv2hex(h,s,v);
  };
  const mv=e=>{const r=sq.getBoundingClientRect();s=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));v=1-Math.min(1,Math.max(0,(e.clientY-r.top)/r.height));paint()};
  sq.style.touchAction='none';
  sq.onpointerdown=e=>{sq.setPointerCapture(e.pointerId);mv(e);sq.onpointermove=mv};
  sq.onpointerup=()=>{sq.onpointermove=null};
  hue.oninput=()=>{h=+hue.value;paint()};
  hexi.onchange=()=>{const x=hexi.value.trim();if(/^#[0-9a-fA-F]{6}$/.test(x)){[h,s,v]=hex2hsv(x);hue.value=Math.round(h);paint()}};
  bindTg('t-grad',on=>{grad=on;paint()});
  q('#pka').onclick=()=>{setWall(kind,'x'+Date.now(),css(),false);pgWall(kind)};
  paint();
 },()=>pgColors(kind));
}
function pgTick(){
 const cur=store.get('tk','stock');
 const rows=TKN.map(t=>`<div class="tkrow${cur==t[0]?' on':''}" data-k="${t[0]}"><div class="bub me"><div class="bt">${t[1]}</div><small><span class="tm">۵:۵۹ بعدازظهر</span><span class="tkw"><svg class="tk" style="color:#fff" viewBox="0 0 18 12" width="16" height="11">${TKS[t[0]](2)}</svg></span></small></div></div>`).join('');
 sub('نوع تیک خوانده شدن پیام',`<div class="tkp">${rows}</div>`,d=>{
  d.querySelectorAll('.tkrow').forEach(e=>e.onclick=()=>{store.set('tk',e.dataset.k);d.querySelectorAll('.tkrow').forEach(x=>x.classList.toggle('on',x==e))});
 },()=>pgChat());
}
function pgBub(){
 const cur=store.get('bt','glass');
 const tk=`<svg class="tk" style="color:#fff" viewBox="0 0 18 12" width="16" height="11">${TKS[store.get('tk','stock')](2)}</svg>`;
 const rows=BTS.map(b=>`<div class="bprev${cur==b[0]?' on':''}" data-bt="${b[0]}" data-k="${b[0]}"><div class="bub"><div class="bt">${b[1]}</div><small><span class="tm">۵:۴۴ بعدازظهر</span></small></div><div class="bub me"><div class="bt">${b[1]}</div><small><span class="tm">۵:۵۹ بعدازظهر</span><span class="tkw">${tk}</span></small></div></div>`).join('');
 document.documentElement.dataset.bt='glass';
 sub('نوع حباب پیام',`<div class="bpl">${rows}</div>`,d=>{
  d.querySelectorAll('.bprev').forEach(e=>e.onclick=()=>{store.set('bt',e.dataset.k);d.querySelectorAll('.bprev').forEach(x=>x.classList.toggle('on',x==e))});
 },()=>{applyPrefs();pgChat()});
}
function fxSheet(){
 const cur=store.get('fx','off');
 sheet(`<div class="fh"><b>افکت پس زمینه</b></div>${Object.keys(FXN).map(k=>`<div class="rad" data-f="${k}"><span>${FXN[k]}</span><i class="${cur==k?'on':''}"></i></div>`).join('')}`,d=>{
  d.querySelectorAll('[data-f]').forEach(e=>e.onclick=()=>{store.set('fx',e.dataset.f);d.remove();const v=q('#fxv');if(v)v.textContent=FXN[e.dataset.f]});
 });
}
G.star='<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>';
let NAMETAB='n';
function iconSheet(kind){
 const key=kind=='r'?'ricon':'picon';
 sheet(`<div class="fh"><b>${kind=='r'?'آیکون پاسخ‌ها':'آیکون پروفایل'}</b><button class="mb" id="icn0">غیرفعال</button></div><div class="egr" id="egr2">${PE.list.map(e=>`<button data-n="${e.n}">${PE.svg(e.n,34)}</button>`).join('')}</div>`,d=>{
  const pick=async n=>{
   if(typeof Wallet==='undefined'||!Wallet.pa()){d.remove();toast('آیکون ویژه‌ی پریمیوم است');pgShop(()=>pgName());return}
   const a=A();
   try{
    const r=await fetch(PICKO_SERVER+'/api/pricon',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+a.token},body:JSON.stringify({icon:n,kind})});
    if(!r.ok)throw 0;
    store.set(key,n);d.remove();pgName();
   }catch(e){toast('ذخیره نشد، سرور رو چک کن')}
  };
  q('#icn0').onclick=()=>pick('');
  q('#egr2').onclick=e=>{const b=e.target.closest('button');if(b)pick(b.dataset.n)};
 });
}
async function pgShop(backFn){
 const a=A();
 if(!a){toast('اول وارد حساب شو');return}
 await Wallet.sync();
 const st=Wallet.state(),pa=Wallet.pa();
 const pd=st.prem>st.now?new Date(st.prem*1000).toLocaleDateString('fa-IR',{day:'numeric',month:'long',year:'numeric'}):'';
 const plans=[['d7','۷ روز','۶۰'],['d30','۳۰ روز','۲۰۰'],['y1','۱ سال','۱۸۰۰']].map(p=>`<div class="sw plan" data-p="${p[0]}"><span>پریمیوم ${p[1]}</span><button class="mb">${st.own?'رایگان':p[2]+' پیکوین'}</button></div>`).join('');
 const ben=['تغییر رنگ نام (حتی گرادیان)','آیکون روی پاسخ‌ها و پروفایل','ستاره‌ی پریمیوم کنار اسمت'].map(t=>`<div class="sw"><span>${t}</span><span class="ck">${svg(G.tick)}</span></div>`).join('');
 const owner=st.own?`<div class="mc"><div class="msec">پنل مالک</div><input class="fld" id="gu" dir="ltr" placeholder="نام کاربری"><input class="fld" id="gn" type="number" placeholder="تعداد پیکوین"><button class="pb" id="gs">ارسال پیکوین</button></div>`:'';
 sub('پریمیوم و پیکوین',`<div class="bal"><div class="big">${svg(G.star)}</div><b>${st.own?'∞':st.coins.toLocaleString('fa-IR')}</b><small>پیکوین شما</small></div><div class="mc"><div class="sw"><span>وضعیت پریمیوم</span><b>${st.own?'نامحدود (مالک)':(pa?'فعال تا '+pd:'غیرفعال')}</b></div></div><div class="mc"><div class="msec">مزایای پریمیوم</div>${ben}</div><div class="mc"><div class="msec">خرید پریمیوم</div>${plans}</div><div class="mc"><div class="msec">پیکوین از کجا؟</div><div class="sw"><span>لودو بازی کن و ببر</span><button class="mb" id="gogm">بازی‌ها</button></div></div>${owner}`,d=>{
  d.querySelectorAll('.plan').forEach(e=>e.onclick=async()=>{try{await Wallet.buy(e.dataset.p);toast('پریمیوم فعال شد');pgShop(backFn)}catch(x){toast(x.message)}});
  q('#gogm').onclick=()=>{closeSub(true);if(typeof go==='function')go('games')};
  const gs=q('#gs');
  if(gs)gs.onclick=async()=>{try{await Wallet.give({username:q('#gu').value.trim(),n:+q('#gn').value});toast('ارسال شد');q('#gn').value=''}catch(x){toast(x.message)}};
 },backFn);
}
function pgName(){
 const a=A();
 if(!a){toast('اول وارد حساب شو');return}
 let sel=store.get('ncol','');
 const val=p=>p.join(',');
 const pa=()=>typeof Wallet!=='undefined'&&Wallet.pa();
 const paint=()=>{
  const tab=NAMETAB;
  const c1=(sel||'#60a5fa').split(',')[0],nm=esc(a.name),sty=sel?ncStyle(sel):'color:#60a5fa';
  const ik=tab=='n'?'ricon':'picon',icn=store.get(ik,'');
  const pal=PAL.map((p,i)=>`<button class="pc r${Math.floor(i/7)}${val(p)==sel?' on':''}" data-v="${val(p)}" style="${p.length==1?'background:'+p[0]:'background:linear-gradient(135deg,'+p[0]+' 50%,'+p[1]+' 50%)'}"></button>`).join('');
  const ban=pa()?'':`<div class="premb"><span>تغییر رنگ نام ویژه‌ی پریمیوم است</span><button class="mb" id="pgb">دریافت</button></div>`;
  const top=tab=='n'?`<div class="npv"><span class="avc">${esc((a.name||'?')[0])}</span><div class="nbub"><div class="sn" style="${sty}">${nm}</div><div class="rq" style="border-color:${c1}">${icn?`<i class="rpi">${PE.svg(icn,28)}</i>`:''}<b style="${sty}">${nm}</b><span>پاسخ به پیام شما</span></div><p>نام شما در گروه‌ها و پاسخ‌ها با رنگ انتخاب‌شده نمایش داده می‌شود.</p></div></div>`:`<div class="ringw"><div class="ring" style="box-shadow:0 0 0 5px ${c1}"><span>${esc((a.name||'?')[0])}</span></div><p class="mu">آنلاین</p></div>`;
  q('#nb').innerHTML=ban+top+`<div class="mc"><div class="pal" id="pal">${pal}</div>${srow(null,tab=='n'?'افزودن آیکون به پاسخ‌ها':'افزودن آیکون به پروفایل','',`<span class="sv">${icn?PE.svg(icn,24):'غیرفعال'}</span>`,'ico')}</div><p class="mu hint">از این رنگ برای نام شما، پاسخ‌هایی که ارسال می‌کنید استفاده خواهد شد.</p>`;
  q('#pal').onclick=e=>{const b=e.target.closest('button');if(!b)return;sel=b.dataset.v;paint()};
  q('#nb [data-a=ico]').onclick=()=>iconSheet(tab=='n'?'r':'p');
  const pb=q('#pgb');if(pb)pb.onclick=()=>pgShop(()=>pgName());
 };
 sub('تغییر رنگ نام',`<div class="tabs2"><button data-t="n" class="${NAMETAB=='n'?'on':''}">نام</button><button data-t="p" class="${NAMETAB=='p'?'on':''}">پروفایل</button></div><div id="nb"></div><button class="apply" id="nap">اعمال</button>`,d=>{
  paint();
  d.querySelectorAll('.tabs2 button').forEach(b=>b.onclick=()=>{NAMETAB=b.dataset.t;d.querySelectorAll('.tabs2 button').forEach(x=>x.classList.toggle('on',x==b));paint()});
  fetch(PICKO_SERVER+'/api/pbio',{headers:{Authorization:'Bearer '+a.token}}).then(r=>r.json()).then(j=>{
   if(typeof j.col==='string'){sel=j.col;store.set('ncol',sel)}
   if(typeof j.ricon==='string')store.set('ricon',j.ricon);
   if(typeof j.picon==='string')store.set('picon',j.picon);
   paint();
  }).catch(()=>{});
  q('#nap').onclick=async()=>{
   if(!pa()){toast('برای تغییر رنگ نام پریمیوم لازمه');pgShop(()=>pgName());return}
   try{
    const r=await fetch(PICKO_SERVER+'/api/pcol',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+a.token},body:JSON.stringify({col:sel})});
    if(!r.ok)throw 0;
    store.set('ncol',sel);applyPrefs();toast('ذخیره شد');pgChat();
   }catch(e){toast('ذخیره نشد، سرور رو چک کن')}
  };
 },()=>pgChat());
}
function pgAcct(){
 const a=A();
 if(!a){toast('اول وارد حساب شو');return}
 const parts=String(a.name||'').split(' ');
 const first=parts[0]||'',last=parts.slice(1).join(' ');
 const bday=store.get('bday','');
 const bd=bday?new Date(bday+'T00:00:00').toLocaleDateString('fa-IR',{day:'numeric',month:'long',year:'numeric'}):'تعیین نشده';
 const html=`
 <div class="mc"><div class="msec">نام شما</div><input class="fld" id="afn" maxlength="30" value="${esc(first)}" placeholder="نام"><input class="fld" id="aln" maxlength="30" value="${esc(last)}" placeholder="نام خانوادگی"></div>
 <div class="mc"><div class="bio"><input class="fld" id="abi" maxlength="70" placeholder="درباره"><span class="cnt" id="acn">۷۰</span></div></div>
 <p class="mu hint">چند کلمه درباره شما.</p>
 <div class="mc"><div class="msec">اطلاعات شما</div>${acrow('#ff9f0a',IC.at,'@'+esc(a.username),'نام کاربری','cpu')}${acrow('#2f9bff',IC.cake,bd,'تولد','bday')}</div>
 <p class="mu hint">تاریخ تولد فقط روی همین گوشی ذخیره می‌شه.</p>
 <div class="mc"><div class="mr" data-a="soon">${icoP('#ff9f0a',IC.mega)}<div class="mt"><b>کانال شخصی</b></div></div><div class="mr" data-a="soon">${icoP('#a855f7',IC.ai)}<div class="mt"><b>خودکارسازی گفتگو</b></div><span class="bdg">جدید</span></div></div>
 <p class="mu hint">رباتی را انتخاب کنید که از طرف شما به پیام‌ها پاسخ دهد.</p>
 <div class="mc"><div class="mr lo" data-a="logout"><div class="mt"><b>خروج از حساب کاربری</b></div>${svg(IC.out)}</div></div>
 <button class="fabok" id="aok">${svg(IC.tick)}</button>`;
 sub('حساب کاربری',html,d=>{
  const f1=q('#afn'),f2=q('#aln'),bi=q('#abi'),ok=q('#aok');
  let b0=store.get('bio','');
  const dirty=()=>{
   const n=(f1.value.trim()+' '+f2.value.trim()).trim();
   q('#acn').textContent=(70-bi.value.length).toLocaleString('fa-IR');
   ok.style.display=(n&&(n!==a.name||bi.value!==b0))?'flex':'none';
  };
  [f1,f2,bi].forEach(x=>x.oninput=dirty);
  bi.value=b0;dirty();
  fetch(PICKO_SERVER+'/api/pbio',{headers:{Authorization:'Bearer '+a.token}}).then(r=>r.json()).then(j=>{if(typeof j.bio==='string'){b0=j.bio;bi.value=b0;dirty()}}).catch(()=>{});
  d.querySelectorAll('[data-a]').forEach(e=>e.onclick=()=>{
   const k=e.dataset.a;
   if(k=='cpu'){copy(a.username);toast('کپی شد')}
   else if(k=='bday'){
    const i=document.createElement('input');i.type='date';i.value=store.get('bday','');
    i.style.cssText='position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(i);
    i.onchange=()=>{store.set('bday',i.value);i.remove();pgAcct()};
    setTimeout(()=>{if(i.isConnected)i.remove()},60000);
    try{if(i.showPicker)i.showPicker();else i.click()}catch(x){i.click()}
   }
   else if(k=='logout'){store.set('auth',null);closeSub(true);build();if(typeof Chat!=='undefined')Chat.render()}
   else toast('به‌زودی');
  });
  ok.onclick=async()=>{
   const n=(f1.value.trim()+' '+f2.value.trim()).trim();if(!n)return;
   const h={'Content-Type':'application/json',Authorization:'Bearer '+a.token};
   try{
    if(n!==a.name){const r=await fetch(PICKO_SERVER+'/api/pname',{method:'POST',headers:h,body:JSON.stringify({name:n})});if(!r.ok)throw 0;a.name=n;store.set('auth',a)}
    if(bi.value!==b0){const r=await fetch(PICKO_SERVER+'/api/pbio',{method:'POST',headers:h,body:JSON.stringify({bio:bi.value})});if(!r.ok)throw 0;b0=bi.value;store.set('bio',b0)}
    closeSub(true);build();toast('ذخیره شد');
   }catch(e){toast('ذخیره نشد، سرور رو چک کن')}
  };
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
 const cur=store.get('lang','fa');
 const L=[['fa','فارسی'],['da','دری'],['en','English']];
 sub('زبان',`<div class="mc">${L.map(l=>`<div class="sw" data-l="${l[0]}"><span>${l[1]}</span>${cur==l[0]?`<span class="ck">${svg(G.tick)}</span>`:''}</div>`).join('')}</div>`,()=>{
  document.querySelectorAll('#spg [data-l]').forEach(e=>e.onclick=()=>{if(typeof I18n!=='undefined')I18n.set(e.dataset.l);pgLang()});
 });
}
function pgAbout(){
 sub('درباره',`<div class="mh"><div class="mav">P</div><h2>Picko</h2><p>نسخه‌ی آزمایشی</p></div><div class="mc"><div class="sw"><span>پیام‌رسان شخصی پیکو</span></div></div>`);
}
function aimg(a){return a&&a.id?`<img class="avi" src="${PICKO_SERVER}/api/avatar/${a.id}?v=${store.get('avpv',0)}" onerror="this.remove()">`:''}
function pickPhoto(){
 const a=A();
 if(!a){toast('اول وارد حساب شو');return}
 const inp=document.createElement('input');inp.type='file';inp.accept='image/*';
 inp.onchange=()=>{
  const f=inp.files&&inp.files[0];if(!f)return;
  const url=URL.createObjectURL(f),img=new Image();
  img.onload=async()=>{
   const s=Math.min(img.width,img.height),c=document.createElement('canvas');
   c.width=c.height=256;
   c.getContext('2d').drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,256,256);
   URL.revokeObjectURL(url);
   try{
    const r=await fetch(PICKO_SERVER+'/api/avatar',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+a.token},body:JSON.stringify({img:c.toDataURL('image/jpeg',0.82)})});
    if(!r.ok)throw 0;
    store.set('avpv',Date.now());build();toast('عکس پروفایل عوض شد');
   }catch(e){toast('آپلود نشد، سرور رو چک کن')}
  };
  img.onerror=()=>toast('عکس خونده نشد');
  img.src=url;
 };
 inp.click();
}
function editInfo(){
 const a=A();
 if(!a){toast('اول وارد حساب شو');return}
 sub('ویرایش اطلاعات',`<div class="mc"><div class="sl"><input class="in" id="enm" maxlength="30" value="${esc(a.name)}" placeholder="اسم نمایشی"><button class="pb" id="esv">ذخیره</button><p class="err" id="eer"></p></div></div>`,()=>{
  q('#esv').onclick=async()=>{
   const v=q('#enm').value.trim();
   if(!v){q('#eer').textContent='اسم نباید خالی باشه';return}
   try{
    const r=await fetch(PICKO_SERVER+'/api/pname',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+a.token},body:JSON.stringify({name:v})});
    if(!r.ok)throw 0;
    a.name=v;store.set('auth',a);closeSub(true);build();toast('ذخیره شد');
   }catch(e){q('#eer').textContent='ذخیره نشد، سرور رو چک کن'}
  };
 });
}
function pgData(){
 sub('داده‌ها و ذخیره‌سازی',`<div class="mc"><div class="msec">دانلود خودکار</div><div class="sw"><span>دانلود خودکار عکس‌ها</span>${tg('t-dl',store.get('autodl',true)!==false)}</div></div><p class="mu hint">اگه خاموش باشه، عکس‌ها فقط با زدن روی «دانلود» باز می‌شن و داده‌ی کمتری مصرف می‌شه.</p><div class="mc"><div class="msec">کیفیت عکس‌های ارسالی</div><div class="seg" id="iq"><button data-q="std" class="${store.get('imgq','std')=='std'?'on':''}">معمولی</button><button data-q="hq" class="${store.get('imgq','std')=='hq'?'on':''}">بالا</button></div></div><p class="mu hint">کیفیت بالا عکس رو تا ۱۹۲۰ پیکسل می‌فرسته و حجم بیشتری داره.</p>`,()=>{
  bindTg('t-dl',on=>store.set('autodl',on));
  q('#iq').onclick=e=>{const b=e.target.closest('button');if(!b)return;store.set('imgq',b.dataset.q);q('#iq').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x==b))};
 });
}
function act(a){if(a=='shop'){pgShop();return}if(a=='data'){pgData();return}if(a=='cam'){if(typeof Photo!=='undefined')Photo.start();else pickPhoto();return}
 if(a=='edit'){editInfo();return}
 if(a=='goset'){const c=q('#mset').querySelectorAll('.mc')[2];if(c)c.scrollIntoView({behavior:'smooth',block:'start'});return}
 if(a=='chat')pgChat();else if(a=='acct')pgAcct();else if(a=='pk')pgPk();else if(a=='eco')pgEco();else if(a=='lang')pgLang();else if(a=='about')pgAbout();
 else toast('به‌زودی');
}
function main(){
 const a=A()||{name:'Picko',username:'guest'};
 const ch=esc((a.name||'?')[0]);
 return `<div class="mh"><div class="mav">${aimg(a)}${ch}<button class="mcam" data-a="cam">${svg(G.cam)}</button></div><h2>${esc(a.name)}</h2><p>آنلاین · <span dir="ltr">@${esc(a.username)}</span></p><div class="mbtns"><button class="mbn" data-a="cam">${svg(G.cam)}<span>تنظیم عکس</span></button><button class="mbn" data-a="edit">${svg('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>')}<span>ویرایش اطلاعات</span></button><button class="mbn" data-a="goset">${svg(G.gear)}<span>تنظیمات</span></button></div></div>
 <div class="mc"><div class="msec">حساب‌های کاربری</div><div class="mr" data-a="acct"><span class="mav2">${aimg(a)}${ch}</span><div class="mt"><b>${esc(a.name)}</b></div></div>${row('user','#22b8cf','مدیریت حساب‌ها','','soon')}</div>
 <div class="mc">${row('gear','#34c759','تنظیمات پیکو','','pk')}${row('star','#f59e0b','پریمیوم و پیکوین','پریمیوم رو با پیکوین بخر','shop')}${row('info','#ff9f0a','درباره','','about')}</div>
 <div class="mc">${row('user','#2f9bff','حساب کاربری','اسم، نام کاربری، خروج از حساب','acct')}${row('chat','#ff9f0a','تنظیمات گفتگو','پس‌زمینه، حالت شب، انیمیشن‌ها','chat')}${row('key','#34c759','حریم خصوصی و امنیت','آخرین بازدید، دستگاه‌ها، کلیدهای عبور','soon')}${row('spk','#ff4d6d','اعلان‌ها','صداها، تماس‌ها، نشانگرها','soon')}${row('data','#3b82f6','داده‌ها و ذخیره‌سازی','تنظیمات دانلود رسانه','data')}${row('folder','#2f9bff','پوشه‌های گفتگو','مرتب‌سازی گفتگوها در پوشه‌ها','soon')}${row('laptop','#22b8cf','دستگاه‌ها','مدیریت دستگاه‌های متصل شده','soon')}${row('bat','#ff9f0a','ذخیره انرژی','کاهش مصرف انرژی در شارژ کم','eco')}${row('globe','#a855f7','زبان',({fa:'فارسی',da:'دری',en:'English'})[store.get('lang','fa')],'lang')}</div>
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
return{back:()=>{const s=q('.pks.mn');if(s){s.remove();return true}return closeSub()},refresh:()=>build()};
})();
