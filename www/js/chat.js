const Chat=(()=>{
let peer=null,last=0,dl=0,rd=0,timer=null,open=false,st=null,rng=null;
const A=()=>store.get('auth',null);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const hm=t=>{const d=new Date(t*1000);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
const av=(n,id)=>`<i class="av" style="background:${['#7c3aed','#2563eb','#db2777','#059669','#d97706'][id%5]}">${esc((n||'?')[0])}</i>`;
const tick=s=>`<svg class="tk ${s==2?'rd':''}" viewBox="0 0 18 12" width="16" height="11" fill="none" stroke="#9a9aaa" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6.5l3.5 3.5L11 2"/>${s>=1?'<path d="M6 6.5l3.5 3.5L16 2"/>':''}</svg>`;
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
function openChat(id,name){
 if(open)return;
 peer={id,name};last=0;dl=0;rd=0;rng=null;open=true;document.body.classList.add('inchat');
 const v=document.createElement('div');v.id='chatv';
 v.innerHTML=`<div class="chead"><button class="lb" id="cb">بازگشت</button><div class="t"><b>${esc(name)}</b><small id="cst"></small></div></div><div id="msgs"></div><div class="row cin"><button id="ce"></button><div id="ci" contenteditable="true" dir="auto" data-ph="پیام..."></div><button id="cs">ارسال</button></div><div id="epan"></div>`;
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
 buildPanel();
 poll();timer=setInterval(poll,2000);
}
function back(){
 if(!open)return false;
 const p=$('#epan');
 if(p&&p.classList.contains('on')){p.classList.remove('on');return true}
 closeChat();return true;
}
function closeChat(){
 if(!open)return;open=false;clearInterval(timer);
 const v=$('#chatv');if(v)v.remove();
 document.body.classList.remove('inchat');peer=null;loadChats();
}
function setTicks(){
 document.querySelectorAll('#msgs .bub.me').forEach(b=>{
  const id=+b.dataset.id,s=id<=rd?2:(id<=dl?1:0);
  if(b.dataset.s!=s){b.dataset.s=s;b.querySelector('.tkw').innerHTML=tick(s)}
 });
}
async function poll(){
 if(!peer)return;const pid=peer.id;
 try{
  const vis=document.visibilityState==='visible'?'&seen=1':'';
  const j=await api('/api/messages?with='+pid+'&after='+last+vis);
  if(!peer||peer.id!=pid)return;
  dl=j.dlv;rd=j.rd;
  if(j.messages.length)add(j.messages);
  setTicks();
  const s=$('#cst');if(s)s.textContent=seenTxt(j.peer_last,j.now);
 }catch(e){const s=$('#cst');if(s)s.textContent='در حال اتصال...'}
}
function add(ms,force){
 const b=$('#msgs');if(!b)return;
 const near=force||last==0||b.scrollHeight-b.scrollTop-b.clientHeight<120;
 ms.forEach(m=>{if(m.id<=last)return;last=m.id;b.insertAdjacentHTML('beforeend',`<div class="bub ${m.mine?'me':''}" data-id="${m.id}">${PE.render(m.text)}<small>${hm(m.ts)}${m.mine?'<span class="tkw"></span>':''}</small></div>`)});
 if(near)b.scrollTop=b.scrollHeight;
}
async function send(){
 const ci=$('#ci');if(!ci||!peer)return;
 const t=ser(ci).replace(/\u200b/g,'').trim();
 if(!t)return;
 const keep=ci.innerHTML;ci.innerHTML='';rng=null;
 try{const j=await api('/api/send',{to:peer.id,text:t});add([j.message],true);setTicks()}
 catch(e){toast(e.message);const c2=$('#ci');if(c2)c2.innerHTML=keep}
 const ep=$('#epan'),c3=$('#ci');
 if(ep&&c3&&!ep.classList.contains('on'))c3.focus();
}
render();
setInterval(()=>{if(A()&&!open)loadChats()},3000);
return{render,back};
})();
