(function(){
if(window.__ui3)return;window.__ui3=1;
const q=s=>document.querySelector(s);
const A=()=>store.get('auth',null);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sv=p=>`<svg viewBox="0 0 24 24">${p}</svg>`;
const ARW='<path d="M19 12H5M11 6l-6 6 6 6"/>',XI='<path d="M6 6l12 12M18 6L6 18"/>',DOTS='<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>';
const SHIELD='<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>';
function toast(t){let e=q('#toast');if(!e){e=document.createElement('div');e.id='toast';document.body.appendChild(e)}e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2400)}
async function call(path,body){
 const a=A(),h={};if(a)h.Authorization='Bearer '+a.token;if(body)h['Content-Type']='application/json';
 let r;
 try{r=await fetch(PICKO_SERVER+path,{method:body?'POST':'GET',headers:h,body:body?JSON.stringify(body):undefined})}catch(e){throw new Error('مشکل از سرور')}
 const j=await r.json().catch(()=>({}));
 if(!r.ok)throw new Error(j.error||'خطا');
 return j;
}
const COL=['#7c3aed','#2563eb','#db2777','#059669','#d97706'];
const avH=(id,name,kind)=>`<span class="avw"><i class="av${kind?' sq':''}" style="background:${COL[(+id||0)%5]}">${(!kind&&id)?`<img class="avi" src="${PICKO_SERVER}/api/avatar/${id}" onerror="this.remove()">`:''}${esc((name||'?')[0])}</i></span>`;

let rec=null;
document.addEventListener('click',e=>{
 const x=e.target.closest&&e.target.closest('.ci[data-id],.ci[data-u]');if(!x)return;
 const id=+(x.dataset.id||x.dataset.u);if(!id)return;
 rec={id,name:x.dataset.n||'',kind:x.dataset.k||''};
},true);
if(typeof Chat!=='undefined'&&Chat.open){const o=Chat.open;Chat.open=function(id,name){rec={id:+id,name:name||'',kind:''};return o.apply(this,arguments)}}
function enhanceChat(v){
 if(v.dataset.px)return;v.dataset.px='1';
 const head=v.querySelector('.chead');if(!head)return;
 if(head.querySelector('.bk2'))return;
 const b=head.querySelector('.t b'),nm=b?b.textContent.trim():'';
 const r=(rec&&rec.name&&nm.indexOf(rec.name.trim())===0)?rec:null;
 const cb=head.querySelector('#cb');
 if(cb){cb.className='bk2';cb.innerHTML=sv(ARW)}
 const t=head.querySelector('.t');
 if(t&&!t.querySelector('.tt')){
  const w=document.createElement('div');w.className='tt';
  while(t.firstChild)w.appendChild(t.firstChild);
  t.insertAdjacentHTML('beforeend',avH(r?r.id:0,nm,r?r.kind:''));
  t.appendChild(w);
 }
 if(!head.querySelector('#cm2')){
  const m=document.createElement('button');m.className='bk2';m.id='cm2';m.innerHTML=sv(DOTS);
  m.onclick=()=>{const tt=head.querySelector('.t');if(tt)tt.click()};
  head.appendChild(m);
 }
 if(r&&!r.kind)banner(v,r);
}
async function banner(v,r){
 try{
  const j=await call('/api/uprofile?id='+r.id),u=j.user,me=A();
  if(!u||u.contact||(me&&u.id===me.id)||!v.isConnected||v.querySelector('#cbn'))return;
  const m=v.querySelector('#msgs');if(!m)return;
  m.insertAdjacentHTML('beforebegin',`<div class="cbn" id="cbn">${avH(u.id,u.name)}<div class="cm"><b>${esc(u.name)}</b><small dir="ltr">@${esc(u.username)}</small></div><button class="pb" id="cba">افزودن به مخاطبین</button><button class="pk" id="cbx">${sv(XI)}</button></div>`);
  v.querySelector('#cba').onclick=async()=>{try{await call('/api/contact_add',{uid:u.id});const e=v.querySelector('#cbn');if(e)e.remove();toast('به مخاطبین اضافه شد');if(typeof Contacts!=='undefined'&&Contacts.reload)Contacts.reload()}catch(x){toast(x.message)}};
  v.querySelector('#cbx').onclick=()=>{const e=v.querySelector('#cbn');if(e)e.remove()};
 }catch(e){}
}

const xoIcon=sz=>`<svg viewBox="0 0 64 64" width="${sz}" height="${sz}"><defs><linearGradient id="xg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1e3a8a"/><stop offset="1" stop-color="#0d0719"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#xg)"/><path d="M16 16l12 12M28 16L16 28" stroke="#fb7185" stroke-width="4.5" stroke-linecap="round"/><circle cx="43" cy="43" r="7.5" fill="none" stroke="#22d3ee" stroke-width="4.5"/><path d="M32 10v44M10 32h44" stroke="#fff" stroke-opacity=".22" stroke-width="2"/></svg>`;
function coinTxt(){
 const a=A();
 if(!a)return String(store.get('coins',0));
 const st=(typeof Wallet!=='undefined')?Wallet.state():{coins:0,own:false};
 return st.own?'∞':(st.coins||0).toLocaleString('fa-IR');
}
function ensureGames(){
 const g=q('#games');if(!g)return;
 const grid=g.querySelector('.gridg');if(!grid||!g.querySelector('#app-ludo'))return;
 if(!g.querySelector('#app-xo')){
  grid.insertAdjacentHTML('beforeend',`<button class="app" id="app-xo">${xoIcon(64)}<span>XO</span></button>`);
  g.querySelector('#app-xo').onclick=xoOpen;
 }
 if(!g.querySelector('.hero'))grid.insertAdjacentHTML('beforebegin',`<div class="hero"><div><small>پیکوین شما</small><b id="herob">${coinTxt()}</b></div><p>بازی کن، ببر و پیکوین بگیر. با پیکوین پریمیوم بخر.</p></div>`);
}
setInterval(()=>{const e=q('#herob');if(e)e.textContent=coinTxt()},2500);

const XL=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const xw=b=>{for(const[a,c,d]of XL)if(b[a]!=='-'&&b[a]===b[c]&&b[a]===b[d])return b[a];return b.includes('-')?'':'D'};
let XO=null;
function xoDraw(){const g=q('#xog');if(!g||!XO)return;g.querySelectorAll('button').forEach((e,i)=>{const v=XO.b[i];e.textContent=v==='-'?'':v;e.className=v==='X'?'x':(v==='O'?'o':'')})}
const xm=t=>{const e=q('#xmsg');if(e)e.textContent=t};
const xn=t=>{const e=q('#xnote');if(e)e.textContent=t};
function xoOpen(){
 if(q('#xov'))return;
 const v=document.createElement('div');v.id='xov';
 v.innerHTML=`<div class="chead"><button class="bk2" id="xb">${sv(ARW)}</button><b class="xt">XO</b><span style="width:48px"></span></div><div class="xbody"><p class="mu" id="xmsg"></p><div class="xog" id="xog">${Array.from({length:9},(_,i)=>`<button data-i="${i}"></button>`).join('')}</div><button class="pb play" id="xr">بازی دوباره</button><p class="mu" id="xnote"></p></div>`;
 document.body.appendChild(v);
 q('#xb').onclick=xoClose;q('#xr').onclick=xoNew;
 q('#xog').onclick=e=>{const b=e.target.closest('button');if(b)xoMove(+b.dataset.i)};
 xoNew();
}
function xoClose(){const v=q('#xov');if(v)v.remove();XO=null}
async function xoNew(){
 XO={b:Array(9).fill('-'),over:false,busy:true,id:0,local:!A()};
 xoDraw();xm('نوبت توئه (X)');
 if(!XO.local){
  try{XO.id=(await call('/api/xo/new',{})).id}
  catch(e){toast(e.message);XO.local=true}
 }
 xn(XO.local?'بازی تمرینی، پیکوین نداره':'هر برد ۳ پیکوین (روزی تا ۱۰ برد)');
 if(XO)XO.busy=false;
}
function xoEnd(res,granted){
 XO.over=true;
 if(res==='X')xm(granted>0?'بردی! ۳ پیکوین گرفتی':'بردی!');
 else xm(res==='O'?'ربات برد':'مساوی');
 if(res==='X'&&!XO.local&&!granted)xn('سقف جایزه‌ی امروز پر شده');
 if(granted&&typeof Wallet!=='undefined')Wallet.sync();
}
async function xoMove(i){
 if(!XO||XO.over||XO.busy||XO.b[i]!=='-')return;
 const cur=XO;
 cur.b[i]='X';cur.busy=true;xoDraw();xm('ربات فکر می‌کنه...');
 if(cur.local){
  let w=xw(cur.b);
  if(w){cur.busy=false;return xoEnd(w,0)}
  setTimeout(()=>{
   if(XO!==cur)return;
   const e=cur.b.map((v,k)=>v==='-'?k:-1).filter(k=>k>=0);
   const tw=m=>{for(const k of e){const t=cur.b.slice();t[k]=m;if(xw(t)===m)return k}return null};
   let p=tw('O');if(p===null)p=tw('X');if(p===null)p=cur.b[4]==='-'?4:e[Math.floor(Math.random()*e.length)];
   cur.b[p]='O';cur.busy=false;xoDraw();
   w=xw(cur.b);if(w)xoEnd(w,0);else xm('نوبت توئه (X)');
  },420);
  return;
 }
 try{
  const j=await call('/api/xo/move',{id:cur.id,i});
  if(XO!==cur)return;
  setTimeout(()=>{
   if(XO!==cur)return;
   cur.b=j.board.split('');cur.busy=false;xoDraw();
   if(j.over)xoEnd(j.res,j.granted);else xm('نوبت توئه (X)');
  },j.board.split('O').length>1?420:0);
 }catch(e){
  if(XO!==cur)return;
  cur.b[i]='-';cur.busy=false;xoDraw();xm('نوبت توئه (X)');toast(e.message);
 }
}

function ensureSec(){
 const m=q('#mset');if(!m||m.querySelector('#seccard'))return;
 const c=document.createElement('div');c.className='mc';c.id='seccard';
 c.innerHTML=`<div class="mr"><span class="mi" style="background:#34c759">${sv(SHIELD)}</span><div class="mt"><b>امنیت حساب</b><small>جیمیل بازیابی، تغییر رمز، خروج دستگاه‌های دیگه</small></div></div>`;
 const last=m.lastElementChild;
 if(last)m.insertBefore(c,last);else m.appendChild(c);
 c.onclick=secOpen;
}
async function secOpen(){
 const a=A();
 if(!a){toast('اول وارد حساب شو');return}
 if(q('#pksec'))return;
 const d=document.createElement('div');d.className='pks';d.id='pksec';
 d.innerHTML=`<div class="pkb sx"><div class="fh"><b>امنیت حساب</b><button class="pk" id="sxx">${sv(XI)}</button></div><div class="mc sxc"><div class="msec">جیمیل</div><div id="smail" class="sxi">در حال بارگذاری...</div></div><div class="mc sxc"><div class="msec">تغییر رمز</div><input class="in" id="spo" type="password" placeholder="رمز فعلی" autocomplete="current-password"><input class="in" id="spn" type="password" placeholder="رمز جدید (حداقل ۸ حرف، حرف و عدد)" autocomplete="new-password"><button class="pb" id="spg">تغییر رمز</button></div><button class="pb sxo" id="sall">خروج از بقیه‌ی دستگاه‌ها</button><p class="err" id="serr"></p></div>`;
 document.body.appendChild(d);
 const close=()=>d.remove(),er=t=>{q('#serr').textContent=t};
 q('#sxx').onclick=close;d.onclick=e=>{if(e.target===d)close()};
 const setTok=t=>{const x=A();if(x){x.token=t;store.set('auth',x)}};
 q('#spg').onclick=async()=>{
  er('');
  try{const j=await call('/api/change_password',{old:q('#spo').value,new:q('#spn').value});setTok(j.token);q('#spo').value='';q('#spn').value='';toast('رمز عوض شد')}
  catch(x){er(x.message)}
 };
 q('#sall').onclick=async()=>{
  er('');
  try{const j=await call('/api/logout_all',{});setTok(j.token);toast('دستگاه‌های دیگه خارج شدن')}catch(x){er(x.message)}
 };
 let st;
 try{st=await call('/api/security')}catch(x){q('#smail').textContent=x.message;return}
 const box=q('#smail');
 if(st.email){box.innerHTML=`<p>ایمیل متصل: <b dir="ltr">${esc(st.email)}</b> ✓</p><p class="mu">با این ایمیل می‌تونی رمزت رو بازیابی کنی.</p>`;return}
 if(!st.mail_ready){box.innerHTML='<p class="mu">ایمیلی متصل نیست. ارسال ایمیل روی سرور هنوز راه‌اندازی نشده.</p>';return}
 box.innerHTML=`<p class="mu">یه جیمیل وصل کن تا اگه رمزت رو یادت رفت بتونی بازیابی کنی.</p><input class="in" id="sem" type="email" dir="ltr" placeholder="name@gmail.com" autocapitalize="none"><button class="pb" id="ssd">ارسال کد</button><div id="scw" style="display:none"><input class="in" id="scd" inputmode="numeric" maxlength="6" dir="ltr" placeholder="کد ۶ رقمی"><button class="pb" id="scf">تأیید</button></div>`;
 q('#ssd').onclick=async()=>{
  er('');
  try{await call('/api/email/code',{email:q('#sem').value.trim(),purpose:'link'});q('#scw').style.display='block';toast('کد فرستاده شد')}catch(x){er(x.message)}
 };
 q('#scf').onclick=async()=>{
  er('');
  try{const j=await call('/api/email/link',{email:q('#sem').value.trim(),code:q('#scd').value.trim()});box.innerHTML=`<p>ایمیل متصل شد: <b dir="ltr">${esc(j.email)}</b> ✓</p>`}catch(x){er(x.message)}
 };
}

window.PKBack=()=>{
 for(const s of ['#pksec','#xov']){const e=q(s);if(e){e.remove();if(s==='#xov')XO=null;return true}}
 return false;
};

let pend=false;
function scan(){
 pend=false;
 const v=q('#chatv');if(v)enhanceChat(v);
 ensureGames();ensureSec();
}
new MutationObserver(()=>{if(!pend){pend=true;requestAnimationFrame(scan)}}).observe(document.body,{childList:true,subtree:true});
scan();
})();
