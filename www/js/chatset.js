(function(){
 const m=document.querySelector('#menu');if(!m)return;
 const old=document.getElementById('cset');if(old)old.remove();
 m.insertAdjacentHTML('beforeend','<div class="glass" id="cset"><b>تنظیمات چت</b><div class="srow"><span>ریاکشن با دوبار ضربه روی پیام</span><span id="dtv"></span></div><div class="seg"><button id="dtc">تغییر</button><button id="dto">خاموش</button></div><div class="srow"><span>صدای ارسال و دریافت پیام</span></div><div class="seg" id="snds"><button data-v="1">روشن</button><button data-v="0">خاموش</button></div></div>');
 const show=()=>{const e=store.get('dtap','heart_red');document.getElementById('dtv').innerHTML=e?PE.svg(e,26):'<span class="mu">خاموش</span>'};
 const sshow=()=>{const on=store.get('snd',true)!==false;document.querySelectorAll('#snds button').forEach(b=>b.classList.toggle('on',(b.dataset.v=='1')==on))};
 show();sshow();
 document.getElementById('dtc').onclick=()=>PE.picker(n=>{store.set('dtap',n);const s=document.getElementById('pe-sheet');if(s)s.remove();show()});
 document.getElementById('dto').onclick=()=>{store.set('dtap','');show()};
 document.querySelectorAll('#snds button').forEach(b=>b.onclick=()=>{store.set('snd',b.dataset.v=='1');sshow()});
})();
