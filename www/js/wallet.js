const Wallet=(()=>{
const A=()=>store.get('auth',null);
let st={coins:Number(store.get('wal',0))||0,own:false,prem:0,pa:false,now:0};
function toast(t){let e=document.getElementById('toast');if(!e){e=document.createElement('div');e.id='toast';document.body.appendChild(e)}e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2400)}
function show(){
 const e=document.getElementById('coinn');if(!e)return;
 e.textContent=A()?(st.own?'∞':st.coins.toLocaleString('fa-IR')):String(store.get('coins',0));
}
async function call(path,body){
 const a=A();if(!a)throw new Error('وارد حساب نشدی');
 const h={Authorization:'Bearer '+a.token};if(body)h['Content-Type']='application/json';
 let r;
 try{r=await fetch(PICKO_SERVER+path,{method:body?'POST':'GET',headers:h,body:body?JSON.stringify(body):undefined})}catch(e){throw new Error('مشکل از سرور')}
 const j=await r.json().catch(()=>({}));
 if(!r.ok)throw new Error(j.error||'خطا');
 return j;
}
function put(j){
 if(j&&typeof j.coins==='number'){st={coins:j.coins,own:!!j.own,prem:j.prem||0,pa:!!j.pa,now:j.now||st.now};store.set('wal',st.coins)}
 show();
}
async function sync(){if(!A())return st;try{put(await call('/api/wallet'))}catch(e){}return st}
async function earn(n){
 if(!A()){store.set('coins',store.get('coins',0)+n);show();return n}
 try{const j=await call('/api/earn',{n});put(j);return j.granted||0}catch(e){return 0}
}
async function buy(plan){const j=await call('/api/buy',{plan});put(j);return j}
function give(o){return call('/api/give',o)}
function pa(){return st.own||st.prem>Date.now()/1000}
function note(g){toast(g==0?'سقف پیکوین امروز پر شده یا باید کمی صبر کنی':'فقط بخشی از پیکوین ثبت شد')}
const a0=A();let lastKey=a0?String(a0.id):'';
setInterval(()=>{
 const a=A(),k=a?String(a.id):'';
 if(k!==lastKey){lastKey=k;if(a)sync();else{st={coins:0,own:false,prem:0,pa:false,now:0};show()}}
 else if(a)sync();
},15000);
sync();show();
return{state:()=>st,pa,sync,earn,buy,give,show,note};
})();
