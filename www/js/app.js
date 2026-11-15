const $=s=>document.querySelector(s);
const store={
 get(k,d){try{const v=localStorage.getItem('picko_'+k);return v===null?d:JSON.parse(v)}catch(e){return d}},
 set(k,v){try{localStorage.setItem('picko_'+k,JSON.stringify(v))}catch(e){}}
};
const names={chats:'چت‌ها',contacts:'مخاطبین',games:'بازی‌ها',menu:'منو'};
function go(t){
 document.querySelectorAll('.page').forEach(p=>p.classList.toggle('on',p.id==t));
 document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.t==t));
 $('#title').textContent=names[t];store.set('tab',t);
}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>go(b.dataset.t));
go(store.get('tab','chats'));
$('#coinn').textContent=store.get('coins',0);
async function check(){
 let ok=false;
 try{const c=new AbortController();const id=setTimeout(()=>c.abort(),3000);
  await fetch(PICKO_SERVER+'/ping',{signal:c.signal,mode:'no-cors'});clearTimeout(id);ok=true}catch(e){}
 document.body.classList.toggle('offline',!ok);
 $('#srv').textContent=ok?'متصل':'قطع';
}
check();setInterval(check,5000);
