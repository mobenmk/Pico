const Gate=(()=>{
let guest=false,reg=false,el=null;
const A=()=>store.get('auth',null);
const logo='<svg viewBox="0 0 64 64"><defs><linearGradient id="gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#3b1d7a"/></linearGradient></defs><rect width="64" height="64" rx="18" fill="url(#gl)"/><text x="32" y="45" text-anchor="middle" font-size="38" font-weight="700" fill="#fff" font-family="sans-serif">P</text></svg>';
async function call(path,body){
 let r;
 try{r=await fetch(PICKO_SERVER+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})}catch(e){throw new Error('مشکل از سرور')}
 const j=await r.json().catch(()=>({}));
 if(!r.ok)throw new Error(j.error||'خطا');
 return j;
}
function draw(){
 el.innerHTML=`<div class="gbox glass"><div class="glogo">${logo}</div><h2>Picko</h2><input class="in" id="gu" placeholder="نام کاربری (انگلیسی)" autocapitalize="none" autocomplete="off">${reg?'<input class="in" id="gn" placeholder="اسم نمایشی">':''}<input class="in" id="gp" type="password" placeholder="رمز عبور (حداقل ۴ حرف)"><button class="pb" id="gok">${reg?'ساخت حساب':'ورود'}</button><p class="mu" id="gsw" style="margin:12px 0 0">${reg?'حساب داری؟ ورود':'حساب نداری؟ ساخت حساب'}</p><p class="err" id="gerr"></p><button class="lnk" id="gguest">ادامه بدون حساب (فقط بازی‌ها)</button></div>`;
 document.getElementById('gsw').onclick=()=>{reg=!reg;draw()};
 document.getElementById('gguest').onclick=()=>{guest=true;hide()};
 document.getElementById('gok').onclick=async()=>{
  const e=document.getElementById('gerr');e.textContent='';
  try{
   const j=await call(reg?'/api/register':'/api/login',{username:document.getElementById('gu').value.trim(),name:reg?document.getElementById('gn').value.trim():'',password:document.getElementById('gp').value});
   store.set('auth',j);hide();
   if(typeof Chat!=='undefined')Chat.render();
  }catch(x){e.textContent=x.message}
 };
}
function show(){
 if(guest||A()||el)return;
 el=document.createElement('div');el.id='gate';document.body.appendChild(el);draw();
}
function hide(){if(el){el.remove();el=null}}
show();
return{show,hide};
})();
