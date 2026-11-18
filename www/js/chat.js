const Chat=(()=>{
let peer=null,last=0,dl=0,rd=0,since=0,timer=null,open=false,st=null,rng=null,replyTo=null,editing=null,lpDone=false;
const sel=new Set(),MS=new Map();
const A=()=>store.get('auth',null);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const hm=t=>{const d=new Date(t*1000);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
const av=(n,id)=>`<i class="av" style="background:${['#7c3aed','#2563eb','#db2777','#059669','#d97706'][id%5]}">${esc((n||'?')[0])}</i>`;
const tick=s=>`<svg class="tk ${s==2?'rd':''}" viewBox="0 0 18 12" width="16" height="11" fill="none" stroke="#9a9aaa" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6.5l3.5 3.5L11 2"/>${s>=1?'<path d="M6 6.5l3.5 3.5L16 2"/>':''}</svg>`;
const ic=p=>`<svg viewBox="0 0 24 24">${p}</svg>`;
const I={
 x:ic('<path d="M6 6l12 12M18 6L6 18"/>'),
 reply:ic('<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 6 6v3"/>'),
 copy:ic('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>'),
 fwd:ic('<path d="M15 5l5 5-5 5"/><path d="M20 10H9a5 5 0 0 0-5 5v4"/>'),
 edit:ic('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'),
 del:ic('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>')
};
const KN=new Set(PE.list.map(e=>e.n));
const U={smile:'🙂',grin:'😁',laugh:'😆',joy:'😂',wink:'😉',love:'😍',cool:'😎',tongue:'😜',blush:'😊',think:'🤔',neutral:'😐',sweat:'😅',sad:'😞',cry:'😢',angry:'😠',wow:'😮',sleepy:'😴',dizzy:'😵',heart_red:'❤️',heart_pink:'🩷',heart_orange:'🧡',heart_yellow:'💛',heart_green:'💚',heart_blue:'💙',heart_purple:'💜',heart_black:'🖤',heart_white:'🤍',thumb:'👍',star:'⭐',bolt:'⚡',fire:'🔥',sparkle:'✨',check:'✅',cross:'❌',sun:'☀️',moon:'🌙',cloud:'☁️',drop:'💧',flower:'🌸',leaf:'🍃',apple:'🍎',cherry:'🍒',gift:'🎁',crown:'👑',gem:'💎',bell:'🔔',coin:'🪙',gamepad:'🎮'};
function seenTxt(l,n){
 if(!l)return 'مدتی پیش';
 if(n-l<12)return 'آنلاین';
 const d=new Date(l*1000),t=d.toLocaleTimeString('fa-IR',{hour:'2-digit',minute:'2-digit'});
 const z=new Date(n*1000);z.setHours(0,0,0,0);
 if(d>=z)return 'آخرین بازدید امروز '+t;
 if(d>=new Date(z-86400000))return 'آخرین بازدید دیروز '+t;
 return 'آخرین بازدید '+d.toLocaleDateString('fa-IR',{month:'long',day:'numeric'});
}
function toast(t){let e=$('#toast');if(!e){e=document.createElement('div');e.id='toast';document.body.appendChild(e)}e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2500)}
async function api(path,body){
 const a=A();const h={};if(body)h['Content-Type']='application/json';if(a)h.Authorization='Bearer '+a.token;
 let r;
 try{r=await fetch(PICKO_SERVER+path,{method:body?'POST':'GET',headers:h,body:body?JSON.stringify(body):undefined})}catch(e){throw new Error('مشکل از سرور')}
 const j=await r.json().catch(()=>({}));
 if(r.status==401&&a){store.set('auth',null);closeChat();render()}
 if(!r.ok)throw new Error(j.error||'خطا');
 return j;
}
function authUI(el){
 let reg=false;
 const draw=()=>{
  el.innerHTML=`<div class="glass"><b>${reg?'ساخت حساب':'ورود'}</b><input class="in" id="au" placeholder="نام کاربری (انگلیسی)" autocapitalize="none" autocomplete="off">${reg?'<input class="in" id="an" placeholder="اسم نمایشی">':''}<input class="in" id="ap" type="password" placeholder="رمز عبور (حداقل ۴ حرف)"><button class="pb" id="ago">${reg?'ثبت‌نام':'ورود'}</button><p class="mu" id="asw" style="text-align:center">${reg?'حساب داری؟ ورود':'حساب نداری؟ ثبت‌نام'}</p><p id="aerr" class="err"></p></div>`;
  $('#asw').onclick=()=>{reg=!reg;draw()};
  $('#ago').onclick=async()=>{
   $('#aerr').textContent='';
   try{const j=await api(reg?'/api/register':'/api/login',{username:$('#au').value.trim(),name:reg?$('#an').value.trim():'',password:$('#ap').value});store.set('auth',j);render()}
   catch(e){$('#aerr').textContent=e.message}
  };
 };draw();
}
function profile(){
 if(!$('#prof'))$('#menu').insertAdjacentHTML('afterbegin','<div class="glass" id="prof"></div>');
 const a=A(),p=$('#prof');
 if(!a){p.innerHTML='<span class="mu">وارد نشدی</span>';return}
 p.innerHTML=`<div class="ci" style="border:0"><span class="avw">${av(a.name,a.id)}</span><div class="cm"><b>${esc(a.name)}</b><small>@${esc(a.username)}</small></div></div><button class="pb" id="lo">خروج از حساب</button>`;
 $('#lo').onclick=()=>{store.set('auth',null);closeChat();render()};
}
const item=(u,sub,t,badge,on)=>`<div class="ci" data-id="${u.id}" data-n="${esc(u.name)}"><span class="avw">${av(u.name,u.id)}${on?'<b class="on-dot"></b>':''}</span><div class="cm"><b>${esc(u.name)}</b><small>${sub}</small></div><div class="cr">${t?'<em>'+t+'</em>':''}${badge?'<span class="badge">'+badge+'</span>':''}</div></div>`;
const bind=()=>document.querySelectorAll('.ci[data-id]').forEach(e=>e.onclick=()=>openChat(+e.dataset.id,e.dataset.n));
function render(){
 const el=$('#chats');profile();
 if(!A()){authUI(el);if(typeof Gate!=='undefined')Gate.show();return}
 el.innerHTML='<input class="in" id="qs" placeholder="جستجوی کاربر با نام کاربری یا اسم"><div id="clist"></div>';
 $('#qs').oninput=()=>{clearTimeout(st);st=setTimeout(search,300)};
 loadChats();
}
async function search(){
 const q=$('#qs').value.trim();if(!q){loadChats();return}
 try{const j=await api('/api/search?q='+encodeURIComponent(q));$('#clist').innerHTML=j.users.length?j.users.map(u=>item(u,'@'+esc(u.username),'',0,false)).join(''):'<div class="glass empty">کاربری پیدا نشد</div>';bind()}
 catch(e){toast(e.message)}
}
async function loadChats(){
 if(!A())return;
 try{const j=await api('/api/chats');const l=$('#clist');if(!l||($('#qs')&&$('#qs').value.trim()))return;
  l.innerHTML=j.chats.length?j.chats.map(c=>item(c,(c.mine?tick(c.st)+' ':'')+PE.render(c.text.slice(0,80)),hm(c.ts),c.unread,j.now-c.last_seen<12)).join(''):'<div class="glass empty">هنوز چتی نداری. بالا دنبال یه نفر بگرد</div>';bind()}
 catch(e){}
}
function ser(n){let s='';n.childNodes.forEach(c=>{if(c.nodeType==3)s+=c.nodeValue;else if(c.classList&&c.classList.contains('ep'))s+=':'+c.dataset.n+':';else if(c.nodeName=='BR')s+='\n';else if(c.nodeName=='DIV')s+='\n'+ser(c);else s+=ser(c)});return s}
function insertEmoji(n){
 const ci=$('#ci');if(!ci)return;
 const sp=document.createElement('span');sp.className='ep';sp.contentEditable='false';sp.dataset.n=n;sp.innerHTML=PE.svg(n,24);
 const z=document.createTextNode('\u200b');
 let r=rng;
 if(!r||!ci.contains(r.startContainer)){r=document.createRange();r.selectNodeContents(ci);r.collapse(false)}
 r.deleteContents();r.insertNode(z);r.insertNode(sp);
 r.setStartAfter(z);r.collapse(true);rng=r;
}
function setComposer(t){
 const ci=$('#ci');ci.innerHTML='';
 t.split(/(:[a-z0-9_]+:)/).forEach(part=>{
  const m=/^:([a-z0-9_]+):$/.exec(part);
  if(m&&KN.has(m[1])){const sp=document.createElement('span');sp.className='ep';sp.contentEditable='false';sp.dataset.n=m[1];sp.innerHTML=PE.svg(m[1],24);ci.appendChild(sp);ci.appendChild(document.createTextNode('\u200b'))}
  else if(part)ci.appendChild(document.createTextNode(part));
 });
 const r=document.createRange();r.selectNodeContents(ci);r.collapse(false);rng=r;
}
function delBack(){
 const ci=$('#ci');if(!ci)return;
 const at=[];
 (function w(n){n.childNodes.forEach(c=>{if(c.nodeType==3){for(let i=0;i<c.nodeValue.length;i++)at.push([c,i])}else if(c.classList&&c.classList.contains('ep'))at.push([c,-1]);else w(c)})})(ci);
 let r=rng;
 if(!r||!ci.contains(r.startContainer)){r=document.createRange();r.selectNodeContents(ci);r.collapse(false)}
 let k=at.length-1;
 while(k>=0){const[n,i]=at[k];const pt=i<0?r.comparePoint(n.parentNode,[...n.parentNode.childNodes].indexOf(n)):r.comparePoint(n,i);if(pt<0)break;k--}
 let nr=null;
 while(k>=0){
  const[n,i]=at[k];
  if(i<0){const p=n.parentNode,ix=[...p.childNodes].indexOf(n);n.remove();nr=document.createRange();nr.setStart(p,ix);nr.collapse(true);break}
  const ch=n.nodeValue[i];n.deleteData(i,1);nr=document.createRange();nr.setStart(n,i);nr.collapse(true);
  if(ch!=='\u200b')break;
  k--;
 }
 if(nr)rng=nr;
}
function buildPanel(){
 const p=$('#epan');
 const kb='<svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="19" height="12" rx="3"/><path d="M6.5 10h.01M10 10h.01M14 10h.01M17.5 10h.01M7 14h10"/></svg>';
 const dl='<svg viewBox="0 0 24 24"><path d="M9 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-6-6z"/><path d="M12.5 10l4 4m0-4l-4 4"/></svg>';
 p.innerHTML=`<div class="ptop"><button class="pk" id="pkb">${kb}</button><div class="pe-tabs">`+PE.cats.map(c=>`<button data-c="${c.k}">${PE.svg(c.i,22)}</button>`).join('')+`</div><button class="pk" id="pdel">${dl}</button></div><div class="pe-grid"></div>`;
 const g=p.querySelector('.pe-grid');
 const show=k=>{g.innerHTML=PE.list.filter(e=>e.c==k).map(e=>`<button data-n="${e.n}">${PE.svg(e.n,34)}</button>`).join('');p.querySelectorAll('.pe-tabs button').forEach(b=>b.classList.toggle('on',b.dataset.c==k))};
 p.querySelector('.pe-tabs').onclick=e=>{const b=e.target.closest('button');if(b)show(b.dataset.c)};
 g.onclick=e=>{const b=e.target.closest('button');if(b)insertEmoji(b.dataset.n)};
 $('#pkb').onclick=togglePanel;
 let ht=null;
 const stop=()=>{clearTimeout(ht);clearInterval(ht)};
 const d=$('#pdel');
 d.onpointerdown=e=>{e.preventDefault();delBack();stop();ht=setTimeout(()=>{ht=setInterval(delBack,90)},400)};
 ['pointerup','pointerleave','pointercancel'].forEach(ev=>d.addEventListener(ev,stop));
 show(PE.cats[0].k);
}
function togglePanel(){
 const p=$('#epan'),ci=$('#ci');
 if(p.classList.contains('on')){p.classList.remove('on');ci.focus();return}
 ci.blur();p.classList.add('on');
 const m=$('#msgs');m.scrollTop=m.scrollHeight;
}
/* ---------- پیام‌ها ---------- */
function bub(m){
 MS.set(m.id,m);
 const f=m.fwd?`<div class="fw">هدایت‌شده از ${esc(m.fwd)}</div>`:'';
 const r=m.reply?`<div class="rp" data-r="${m.reply.id}"><b>${m.reply.mine?'تو':esc(peer.name)}</b><span>${m.reply.text==null?'پیام حذف شده':PE.render(m.reply.text.slice(0,100))}</span></div>`:'';
 return `<div class="bub ${m.mine?'me':''}" data-id="${m.id}"><span class="swi">${I.reply}</span>${f}${r}<div class="bt">${PE.render(m.text)}</div><div class="rxw">${rxHtml(m)}</div><small><span class="ed">${m.edited?'ویرایش‌شده ':''}</span><span class="tm">${hm(m.ts)}</span>${m.mine?'<span class="tkw"></span>':''}<svg class="mo" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="12" cy="19" r="1.7"/></svg></small></div>`;
}
function add(ms,force){
 const b=$('#msgs');if(!b)return;
 const near=force||last==0||b.scrollHeight-b.scrollTop-b.clientHeight<120;
 ms.forEach(m=>{if(m.id<=last)return;last=m.id;b.insertAdjacentHTML('beforeend',bub(m))});
 if(near)b.scrollTop=b.scrollHeight;
}
function rm(id){const b=document.querySelector('#msgs .bub[data-id="'+id+'"]');if(b)b.remove();MS.delete(id);sel.delete(id)}
function applyCh(ch){
 ch.forEach(c=>{
  if(c.gone){rm(c.id);return}
  const m=MS.get(c.id);if(!m)return;
  m.text=c.text;m.edited=c.edited;if('rx' in c)m.rx=c.rx;
  const b=document.querySelector('#msgs .bub[data-id="'+c.id+'"]');
  if(b){b.querySelector('.bt').innerHTML=PE.render(c.text);b.querySelector('.ed').textContent=c.edited?'ویرایش‌شده ':'';b.querySelector('.rxw').innerHTML=rxHtml(m)}
 });
 if(ch.length)paint();
}
function setTicks(){
 document.querySelectorAll('#msgs .bub.me').forEach(b=>{
  const id=+b.dataset.id,s=id<=rd?2:(id<=dl?1:0);
  if(b.dataset.s!=s){b.dataset.s=s;const t=b.querySelector('.tkw');if(t)t.innerHTML=tick(s)}
 });
}
/* ---------- انتخاب و منو ---------- */
const ids=()=>[...sel].sort((a,b)=>a-b);
const focusC=()=>{const c=$('#ci');if(c)c.focus()};
function paint(){
 document.querySelectorAll('#msgs .bub').forEach(b=>b.classList.toggle('sel',sel.has(+b.dataset.id)));
 const v=$('#chatv');if(!v)return;
 v.classList.toggle('sel',sel.size>0);
 if(sel.size){
  $('#scount').textContent=sel.size.toLocaleString('fa-IR')+' انتخاب شده';
  const one=sel.size==1,m=one?MS.get([...sel][0]):null;
  $('#sa-reply').style.display=one?'':'none';
  $('#sa-edit').style.display=(one&&m&&m.mine)?'':'none';
 }
 if(sel.size!=1)closeMenu();
}
const clearSel=()=>{sel.clear();paint()};
const toggle=id=>{if(sel.has(id))sel.delete(id);else sel.add(id);paint()};
function lp(b){
 if(sel.size)return;
 const c=$('#ci');if(c)c.blur();
 sel.add(+b.dataset.id);paint();showMenu(b);
 if(navigator.vibrate)navigator.vibrate(12);
}
function closeMenu(){const e=$('#cmenu');if(e)e.remove()}
function showMenu(b){
 closeMenu();
 const m=MS.get(+b.dataset.id);if(!m)return;
 const items=[['پاسخ',aReply],['کپی',aCopy],['هدایت',aFwd]];
 if(m.mine)items.push(['ویرایش',aEdit]);
 items.push(['حذف',aDel,'dg']);
 const el=document.createElement('div');el.id='cmenu';
 el.innerHTML=items.map((x,i)=>`<button data-i="${i}" class="${x[2]||''}">${x[0]}</button>`).join('');
 $('#chatv').appendChild(el);
 el.onclick=e=>{const bt=e.target.closest('button');if(bt)items[+bt.dataset.i][1]()};
 const r=b.getBoundingClientRect(),h=el.offsetHeight,w=el.offsetWidth;
 let top=r.bottom+6;if(top+h>innerHeight-10)top=Math.max(10,r.top-h-6);
 const left=Math.min(Math.max(10,r.left+(r.width-w)/2),innerWidth-w-10);
 el.style.top=top+'px';el.style.left=left+'px';
}
function bar(kind,m){
 const el=$('#rbar');if(!el)return;
 el.className='on';
 el.innerHTML=`<div class="rbi"><b>${kind=='r'?'پاسخ به '+(m.mine?'خودت':esc(peer.name)):'ویرایش پیام'}</b><span>${PE.render(m.text.slice(0,120))}</span></div><button class="pk" id="rx">${I.x}</button>`;
 $('#rx').onclick=cancelBar;
}
function clearBar(){replyTo=null;editing=null;const el=$('#rbar');if(el){el.className='';el.innerHTML=''}}
function cancelBar(){if(editing){const c=$('#ci');if(c)c.innerHTML='';rng=null}clearBar()}
function swipeReply(id){const m=MS.get(id);if(!m)return;replyTo={id:m.id};editing=null;bar('r',m);focusC()}
function aReply(){const m=MS.get(ids()[0]);if(!m)return;clearSel();replyTo={id:m.id};editing=null;bar('r',m);focusC()}
function aEdit(){const m=MS.get(ids()[0]);if(!m||!m.mine)return;clearSel();editing=m.id;replyTo=null;setComposer(m.text);bar('e',m);focusC()}
function fb(t){const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}a.remove()}
function aCopy(){
 const t=ids().map(i=>{const m=MS.get(i);return m?m.text.replace(/:([a-z0-9_]+):/g,(x,n)=>U[n]||x):''}).join('\n');
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).catch(()=>fb(t));else fb(t);
 clearSel();toast('کپی شد');
}
const aFwd=()=>fwdSheet(ids());
const aDel=()=>delDlg(ids());
async function fwdSheet(list){
 closeMenu();
 const d=document.createElement('div');d.id='fs';
 d.innerHTML=`<div class="fbox"><div class="fh"><b>هدایت به...</b><button class="pk" id="fx">${I.x}</button></div><input class="in" id="fq" placeholder="جستجوی کاربر"><div id="fl"></div></div>`;
 document.body.appendChild(d);
 const close=()=>d.remove();
 $('#fx').onclick=close;d.onclick=e=>{if(e.target==d)close()};
 const draw=us=>{
  $('#fl').innerHTML=us.map(u=>`<div class="ci" data-f="${u.id}"><span class="avw">${av(u.name,u.id)}</span><div class="cm"><b>${esc(u.name)}</b></div></div>`).join('')||'<div class="empty">چیزی پیدا نشد</div>';
  $('#fl').querySelectorAll('[data-f]').forEach(e=>e.onclick=()=>{close();doFwd(list,+e.dataset.f)});
 };
 try{draw((await api('/api/chats')).chats)}catch(e){}
 let t;
 $('#fq').oninput=()=>{clearTimeout(t);t=setTimeout(async()=>{
  const q=$('#fq').value.trim();
  try{if(!q)draw((await api('/api/chats')).chats);else draw((await api('/api/search?q='+encodeURIComponent(q))).users)}catch(e){}
 },300)};
}
async function doFwd(list,to){
 try{
  for(const id of list){const m=MS.get(id);if(!m)continue;await api('/api/send',{to,text:m.text,fwd:m.fwd||(m.mine?A().name:peer.name)})}
  clearSel();toast('هدایت شد');poll();
 }catch(e){toast(e.message)}
}
function delDlg(list){
 closeMenu();
 const allMine=list.every(i=>MS.get(i)&&MS.get(i).mine);
 const d=document.createElement('div');d.className='over';d.id='dd';
 d.innerHTML=`<div class="glass"><h3>${list.length>1?'حذف '+list.length.toLocaleString('fa-IR')+' پیام':'حذف پیام'}</h3><button class="pb" id="d1">حذف برای من</button>${allMine?'<button class="pb dg" id="d2">حذف برای هر دو</button>':''}<button class="pb" id="d0">انصراف</button></div>`;
 document.body.appendChild(d);
 $('#d0').onclick=()=>d.remove();
 const go=async all=>{d.remove();try{await api('/api/delete',{ids:list,all});list.forEach(rm);clearSel()}catch(e){toast(e.message)}};
 $('#d1').onclick=()=>go(false);
 if(allMine)$('#d2').onclick=()=>go(true);
}
function jump(id){const el=document.querySelector('#msgs .bub[data-id="'+id+'"]');if(!el)return;el.scrollIntoView({block:'center',behavior:'smooth'});el.classList.add('flash');setTimeout(()=>el.classList.remove('flash'),1200)}
function rxHtml(m){
 const r=m.rx||{},a=r.me,b=r.peer;if(!a&&!b)return '';
 const chip=(n,c)=>`<span class="rc">${PE.svg(n,16)}${c>1?'<i>'+c.toLocaleString('fa-IR')+'</i>':''}</span>`;
 if(a&&b&&a==b)return `<div class="rx">${chip(a,2)}</div>`;
 return `<div class="rx">${a?chip(a,1):''}${b?chip(b,1):''}</div>`;
}
function refreshRx(id){
 const m=MS.get(id),b=document.querySelector('#msgs .bub[data-id="'+id+'"]');
 if(!m||!b)return;
 const w=b.querySelector('.rxw');w.innerHTML=rxHtml(m);
 const c=w.querySelector('.rc');if(c)c.classList.add('pop');
}
async function react(id){
 const e=store.get('dtap','heart_red');if(!e)return;
 const m=MS.get(id);if(!m)return;
 const nw=(m.rx&&m.rx.me==e)?null:e;
 try{
  await api('/api/react',{id,emoji:nw});
  m.rx=Object.assign({me:null,peer:null},m.rx,{me:nw});
  refreshRx(id);if(navigator.vibrate)navigator.vibrate(10);
 }catch(x){toast(x.message)}
}
let lastTap={id:0,t:0};
function gestures(){
 const box=$('#msgs');let g=null;
 box.addEventListener('touchstart',e=>{
  const b=e.target.closest('.bub');
  if(!b||e.touches.length>1){g=null;return}
  const t=e.touches[0];lpDone=false;
  g={b,x:t.clientX,y:t.clientY,dx:0,sw:false,dec:false,hit:false};
  g.t=setTimeout(()=>{if(g&&!g.sw){lpDone=true;lp(b)}},450);
 },{passive:true});
 box.addEventListener('touchmove',e=>{
  if(!g)return;
  const t=e.touches[0],dx=t.clientX-g.x,dy=t.clientY-g.y;
  if(!g.dec){
   if(Math.abs(dx)<8&&Math.abs(dy)<8)return;
   g.dec=true;clearTimeout(g.t);
   if(dx<0&&Math.abs(dx)>Math.abs(dy)*0.8&&!sel.size)g.sw=true;else{g=null;return}
  }
  g.dx=Math.max(dx,-90);
  g.b.style.transition='none';g.b.style.transform='translateX('+g.dx+'px)';
  const s=g.b.querySelector('.swi');if(s)s.style.opacity=Math.min(1,-g.dx/50);
  if(!g.hit&&g.dx<-50){g.hit=true;if(navigator.vibrate)navigator.vibrate(10)}
 },{passive:true});
 const end=()=>{
  if(!g)return;clearTimeout(g.t);
  if(g.sw){
   const b=g.b;b.style.transition='transform .2s';b.style.transform='';
   const s=b.querySelector('.swi');if(s)s.style.opacity=0;
   if(g.dx<-50)swipeReply(+b.dataset.id);
  }
  g=null;
 };
 box.addEventListener('touchend',end);box.addEventListener('touchcancel',end);
 box.addEventListener('click',e=>{
  const b=e.target.closest('.bub');
  if(!b){closeMenu();return}
  if(lpDone){lpDone=false;return}
  const id=+b.dataset.id;
  if(sel.size){toggle(id);return}
  if(e.target.closest('small')){lp(b);return}
  const n=Date.now();
  if(lastTap.id==id&&n-lastTap.t<320){lastTap={id:0,t:0};react(id);return}
  lastTap={id,t:n};
  const rp=e.target.closest('.rp');if(rp)jump(+rp.dataset.r);
 });
 box.addEventListener('scroll',closeMenu);
 box.addEventListener('contextmenu',e=>e.preventDefault());
}
function openChat(id,name){
 if(open)return;
 peer={id,name};last=0;dl=0;rd=0;since=0;rng=null;replyTo=null;editing=null;sel.clear();MS.clear();open=true;document.body.classList.add('inchat');
 const v=document.createElement('div');v.id='chatv';
 v.innerHTML=`<div class="chead"><button class="lb" id="cb">بازگشت</button><div class="t"><b>${esc(name)}</b><small id="cst"></small></div></div><div class="selbar"><button class="pk" id="sax">${I.x}</button><b id="scount"></b><span class="sp"></span><button class="pk" id="sa-reply">${I.reply}</button><button class="pk" id="sa-edit">${I.edit}</button><button class="pk" id="sa-copy">${I.copy}</button><button class="pk" id="sa-fwd">${I.fwd}</button><button class="pk" id="sa-del">${I.del}</button></div><div id="msgs"></div><div id="rbar"></div><div class="row cin"><button id="ce"></button><div id="ci" contenteditable="true" dir="auto" data-ph="پیام..."></div><button id="cs">ارسال</button></div><div id="epan"></div>`;
 document.body.appendChild(v);
 const ci=$('#ci');
 const saveR=()=>{const s=getSelection();if(s.rangeCount&&ci.contains(s.anchorNode))rng=s.getRangeAt(0).cloneRange()};
 ['keyup','touchend','input','blur','click'].forEach(e=>ci.addEventListener(e,saveR));
 ci.addEventListener('focus',()=>$('#epan').classList.remove('on'));
 ci.addEventListener('paste',e=>{e.preventDefault();document.execCommand('insertText',false,(e.clipboardData||window.clipboardData).getData('text'))});
 $('#ce').innerHTML=PE.svg('smile',24);
 $('#ce').onpointerdown=e=>e.preventDefault();
 $('#ce').onclick=togglePanel;
 $('#cs').onpointerdown=e=>e.preventDefault();
 $('#cs').onclick=send;
 $('#cb').onclick=back;
 $('#sax').onclick=clearSel;$('#sa-reply').onclick=aReply;$('#sa-edit').onclick=aEdit;
 $('#sa-copy').onclick=aCopy;$('#sa-fwd').onclick=aFwd;$('#sa-del').onclick=aDel;
 gestures();buildPanel();
 poll();timer=setInterval(poll,2000);
}
function back(){
 if(!open)return false;
 const x=$('#fs')||$('#dd');if(x){x.remove();return true}
 if(sel.size){clearSel();return true}
 const p=$('#epan');
 if(p&&p.classList.contains('on')){p.classList.remove('on');return true}
 closeChat();return true;
}
function closeChat(){
 if(!open)return;open=false;clearInterval(timer);
 ['#chatv','#cmenu','#fs','#dd'].forEach(s=>{const e=$(s);if(e)e.remove()});
 document.body.classList.remove('inchat');peer=null;sel.clear();MS.clear();replyTo=null;editing=null;loadChats();
}
async function poll(){
 if(!peer)return;const pid=peer.id;
 try{
  const vis=document.visibilityState==='visible'?'&seen=1':'';
  const j=await api('/api/messages?with='+pid+'&after='+last+'&since='+Math.max(0,since-1)+vis);
  if(!peer||peer.id!=pid)return;
  dl=j.dlv;rd=j.rd;since=j.now;
  if(j.messages.length)add(j.messages);
  applyCh(j.changes||[]);
  setTicks();
  const s=$('#cst');if(s)s.textContent=seenTxt(j.peer_last,j.now);
 }catch(e){const s=$('#cst');if(s)s.textContent='در حال اتصال...'}
}
async function send(){
 const ci=$('#ci');if(!ci||!peer)return;
 const t=ser(ci).replace(/\u200b/g,'').trim();
 if(!t)return;
 const keep=ci.innerHTML;ci.innerHTML='';rng=null;
 try{
  if(editing){const id=editing;await api('/api/edit',{id,text:t});applyCh([{id,text:t,gone:false,edited:true}])}
  else{const body={to:peer.id,text:t};if(replyTo)body.reply=replyTo.id;const j=await api('/api/send',body);add([j.message],true);setTicks()}
  clearBar();
 }catch(e){toast(e.message);const c2=$('#ci');if(c2)c2.innerHTML=keep}
 const ep=$('#epan'),c3=$('#ci');
 if(ep&&c3&&!ep.classList.contains('on'))c3.focus();
}
render();
setInterval(()=>{if(A()&&!open)loadChats()},3000);
return{render,back};
})();
