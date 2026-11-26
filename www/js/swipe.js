(function(){
 const ACT=[['arch','بایگانی','#3b82f6'],['mute','بی‌صدا','#f59e0b'],['del','حذف','#ef4444']];
 let g=null;
 function setup(row){
  const k=+store.get('swp',1),a=ACT[k];
  const inArch=!!document.querySelector('#clist .ci.arch[data-arch="0"]');
  const key=(row.dataset.k?'c':'u')+row.dataset.id;
  const muted=store.get('mut',[]).includes(key);
  let label=a[1];
  if(a[0]=='arch'&&inArch)label='خروج از بایگانی';
  if(a[0]=='mute'&&muted)label='صدادار';
  row.classList.add('sw');
  row.style.setProperty('--swc',a[2]);
  row.dataset.act=label;
 }
 document.addEventListener('touchstart',e=>{
  const row=e.target.closest&&e.target.closest('#clist .ci[data-id]');
  if(!row||e.touches.length>1){g=null;return}
  const t=e.touches[0];
  g={row,x:t.clientX,y:t.clientY,dx:0,on:false,dec:false};
 },{passive:true});
 document.addEventListener('touchmove',e=>{
  if(!g)return;
  const t=e.touches[0],dx=t.clientX-g.x,dy=t.clientY-g.y;
  if(!g.dec){
   if(Math.abs(dx)<8&&Math.abs(dy)<8)return;
   g.dec=true;
   if(dx<0&&Math.abs(dx)>Math.abs(dy)*1.2){g.on=true;setup(g.row)}else{g=null;return}
  }
  g.dx=Math.max(dx,-150);
  g.row.style.transition='none';
  g.row.style.transform='translateX('+g.dx+'px)';
 },{passive:true});
 const end=()=>{
  if(!g)return;
  const row=g.row;
  if(g.on){
   row.style.transition='transform .2s';row.style.transform='';
   setTimeout(()=>{row.classList.remove('sw');row.style.transition=''},230);
   if(g.dx<-90&&typeof Chat!=='undefined')Chat.act(!!row.dataset.k,+row.dataset.id,ACT[+store.get('swp',1)][0]);
  }
  g=null;
 };
 document.addEventListener('touchend',end);
 document.addEventListener('touchcancel',end);
})();
