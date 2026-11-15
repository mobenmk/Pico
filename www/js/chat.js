const Chat=(()=>{
let peer=null,last=0,timer=null,open=false,st=null;
const A=()=>store.get('auth',null);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const hm=t=>{const d=new Date(t*1000);return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
const av=(n,id)=>`<i class="av" style="background:${['#7c3aed','#2563eb','#db2777','#059669','#d97706'][id%5]}">${esc((n||'?')[0])}</i>`;
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
 $('#lo').onclick=()=>{store.set('auth',null);render()};
}
const item=(u,sub,t)=>`<div class="ci" data-id="${u.id}" data-n="${esc(u.name)}"><span class="avw">${av(u.name,u.id)}</span><div class="cm"><b>${esc(u.name)}</b><small>${sub}</small></div>${t?'<em>'+t+'</em>':''}</div>`;
const bind=()=>document.querySelectorAll('.ci[data-id]').forEach(e=>e.onclick=()=>openChat(+e.dataset.id,e.dataset.n));
function render(){
 const el=$('#chats');profile();
 if(!A()){authUI(el);return}
 el.innerHTML='<input class="in" id="qs" placeholder="جستجوی کاربر با نام کاربری یا اسم"><div id="clist"></div>';
 $('#qs').oninput=()=>{clearTimeout(st);st=setTimeout(search,300)};
 loadChats();
}
async function search(){
 const q=$('#qs').value.trim();if(!q){loadChats();return}
 try{const j=await api('/api/search?q='+encodeURIComponent(q));$('#clist').innerHTML=j.users.length?j.users.map(u=>item(u,'@'+esc(u.username))).join(''):'<div class="glass empty">کاربری پیدا نشد</div>';bind()}
 catch(e){toast(e.message)}
}
async function loadChats(){
 if(!A())return;
 try{const j=await api('/api/chats');const l=$('#clist');if(!l||($('#qs')&&$('#qs').value.trim()))return;
  l.innerHTML=j.chats.length?j.chats.map(c=>item(c,(c.mine?'تو: ':'')+PE.render(c.text.slice(0,80)),hm(c.ts))).join(''):'<div class="glass empty">هنوز چتی نداری. بالا دنبال یه نفر بگرد</div>';bind()}
 catch(e){}
}
function openChat(id,name){
 if(open)return;
 peer={id,name};last=0;open=true;document.body.classList.add('inchat');
 const v=document.createElement('div');v.id='chatv';
 v.innerHTML=`<div class="chead"><button class="lb" id="cb">بازگشت</button><b>${esc(name)}</b></div><div id="msgs"></div><div class="row cin"><button id="ce"></button><input class="in" id="ci" placeholder="پیام..." autocomplete="off"><button id="cs">ارسال</button></div>`;
 document.body.appendChild(v);
 history.pushState({c:1},'');
 $('#ce').innerHTML=PE.svg('smile',24);
 $('#ce').onclick=()=>PE.picker(n=>{$('#ci').value+=':'+n+':'});
 $('#cs').onclick=send;$('#ci').onkeydown=e=>{if(e.key=='Enter')send()};
 $('#cb').onclick=()=>history.back();
 poll();timer=setInterval(poll,2000);
}
function closeChat(){
 if(!open)return;open=false;clearInterval(timer);
 ['#chatv','#pe-sheet'].forEach(s=>{const e=$(s);if(e)e.remove()});
 document.body.classList.remove('inchat');peer=null;loadChats();
}
window.addEventListener('popstate',closeChat);
async function poll(){
 if(!peer)return;const pid=peer.id;
 try{const j=await api('/api/messages?with='+pid+'&after='+last);if(!peer||peer.id!=pid)return;if(j.messages.length)add(j.messages)}catch(e){}
}
function add(ms){
 const b=$('#msgs');if(!b)return;
 const near=last==0||b.scrollHeight-b.scrollTop-b.clientHeight<120;
 ms.forEach(m=>{if(m.id<=last)return;last=m.id;b.insertAdjacentHTML('beforeend',`<div class="bub ${m.mine?'me':''}">${PE.render(m.text)}<small>${hm(m.ts)}</small></div>`)});
 if(near)b.scrollTop=b.scrollHeight;
}
async function send(){
 const t=$('#ci').value.trim();if(!t||!peer)return;$('#ci').value='';
 try{const j=await api('/api/send',{to:peer.id,text:t});add([j.message])}
 catch(e){toast(e.message);$('#ci').value=t}
}
render();
setInterval(()=>{if(A()&&!open&&$('#chats.on')&&!($('#qs')&&$('#qs').value.trim()))loadChats()},3000);
return{render};
})();
