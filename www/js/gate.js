const Gate=(()=>{
let guest=false,mode='login',el=null,sent=false;
const A=()=>store.get('auth',null);
const logo='<svg viewBox="0 0 64 64"><defs><linearGradient id="gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a855f7"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs><rect width="64" height="64" rx="18" fill="#120a24"/><path d="M14 14h36a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8H32l-9 8v-8h-9a8 8 0 0 1-8-8V22a8 8 0 0 1 8-8z" fill="url(#gl)"/><path d="M26 38V24h8a5 5 0 0 1 0 10h-8" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const $=id=>document.getElementById(id);
async function call(path,body){
 let r;
 try{r=await fetch(PICKO_SERVER+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})}catch(e){throw new Error('مشکل از سرور')}
 const j=await r.json().catch(()=>({}));
 if(!r.ok)throw new Error(j.error||'خطا');
 return j;
}
const inp=(id,ph,extra)=>`<input class="in" id="${id}" placeholder="${ph}" ${extra||''}>`;
function draw(){
 const t={login:'ورود',signup:'ساخت حساب',forgot:'بازیابی رمز'}[mode];
 let f='';
 if(mode=='login'){
  f=inp('gu','نام کاربری یا جیمیل','autocapitalize="none" autocomplete="username" dir="ltr"')+inp('gp','رمز عبور','type="password" autocomplete="current-password"');
 }else if(mode=='signup'){
  f=inp('gu','نام کاربری (انگلیسی)','autocapitalize="none" autocomplete="off" dir="ltr"')+inp('gn','اسم نمایشی','maxlength="30"')+inp('gp','رمز عبور (حداقل ۸ حرف، حرف و عدد)','type="password" autocomplete="new-password"')
   +inp('ge','جیمیل (اختیاری، برای بازیابی رمز)','type="email" autocapitalize="none" autocomplete="email" dir="ltr"')
   +'<div id="gcw" style="display:none">'+inp('gc','کد ۶ رقمی ایمیل','inputmode="numeric" maxlength="6" dir="ltr"')+'</div>'
   +'<button class="lnk" id="gsend" type="button">ارسال کد به جیمیل</button>';
 }else{
  f=inp('ge','جیمیلی که به حسابت وصله','type="email" autocapitalize="none" autocomplete="email" dir="ltr"')
   +'<button class="lnk" id="gsend" type="button">ارسال کد</button>'
   +'<div id="gcw" style="display:none">'+inp('gc','کد ۶ رقمی ایمیل','inputmode="numeric" maxlength="6" dir="ltr"')+inp('gp','رمز جدید (حداقل ۸ حرف، حرف و عدد)','type="password" autocomplete="new-password"')+'</div>';
 }
 const go=mode=='forgot'?'تغییر رمز':t;
 el.innerHTML=`<div class="gbox glass"><div class="glogo">${logo}</div><h2>Picko</h2><b>${t}</b>${f}<button class="pb" id="gok">${go}</button><p class="err" id="gerr"></p>`
  +(mode=='login'?'<button class="lnk" id="gfg" type="button">رمزم رو فراموش کردم</button><br><button class="lnk" id="gsw" type="button">حساب نداری؟ بساز</button>':'<button class="lnk" id="gsw" type="button">'+(mode=='signup'?'حساب داری؟ وارد شو':'برگشت به ورود')+'</button>')
  +'<br><button class="lnk" id="gguest" type="button">ادامه بدون حساب (فقط بازی)</button></div>';
 sent=false;
 $('gsw').onclick=()=>{mode=mode=='login'?'signup':'login';draw()};
 if($('gfg'))$('gfg').onclick=()=>{mode='forgot';draw()};
 $('gguest').onclick=()=>{guest=true;hide()};
 const sb=$('gsend');
 if(sb)sb.onclick=async()=>{
  const e=$('gerr');e.textContent='';
  const em=$('ge').value.trim();
  if(!em){e.textContent='جیمیل رو وارد کن';return}
  sb.disabled=true;
  try{
   await call('/api/email/code',{email:em,purpose:mode=='signup'?'signup':'reset'});
   sent=true;$('gcw').style.display='block';sb.textContent='ارسال دوباره (بعد از ۶۰ ثانیه)';
   e.textContent='کد به جیمیلت فرستاده شد (پوشه‌ی اسپم رو هم نگاه کن)';e.style.color='#34d399';
  }catch(x){e.textContent=x.message;e.style.color=''}
  setTimeout(()=>{if(sb.isConnected)sb.disabled=false},60000);
  if(!sent)sb.disabled=false;
 };
 $('gok').onclick=async()=>{
  const e=$('gerr');e.style.color='';e.textContent='';
  const b=$('gok');b.disabled=true;
  try{
   let j;
   if(mode=='login')j=await call('/api/login',{username:$('gu').value.trim(),password:$('gp').value});
   else if(mode=='signup'){
    const em=$('ge').value.trim();
    if(em&&!sent)throw new Error('اول کد ایمیل رو بگیر یا ایمیل رو خالی بذار');
    j=await call('/api/register',{username:$('gu').value.trim(),name:$('gn').value.trim(),password:$('gp').value,email:em,code:em?$('gc').value.trim():''});
   }else{
    if(!sent)throw new Error('اول کد ایمیل رو بگیر');
    j=await call('/api/reset',{email:$('ge').value.trim(),code:$('gc').value.trim(),password:$('gp').value});
   }
   store.set('auth',j);hide();
   if(typeof Chat!=='undefined')Chat.render();
  }catch(x){e.textContent=x.message}
  b.disabled=false;
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
