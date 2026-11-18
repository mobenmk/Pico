(function(){
 const m=document.querySelector('#menu');if(!m||document.getElementById('cset'))return;
 m.insertAdjacentHTML('beforeend','<div class="glass" id="cset"><b>تنظیمات چت</b><div class="srow"><span>ریاکشن با دوبار ضربه روی پیام</span><span id="dtv"></span></div><div class="seg"><button id="dtc">تغییر</button><button id="dto">خاموش</button></div></div>');
 const show=()=>{const e=store.get('dtap','heart_red');document.getElementById('dtv').innerHTML=e?PE.svg(e,26):'<span class="mu">خاموش</span>'};
 show();
 document.getElementById('dtc').onclick=()=>PE.picker(n=>{store.set('dtap',n);const s=document.getElementById('pe-sheet');if(s)s.remove();show()});
 document.getElementById('dto').onclick=()=>{store.set('dtap','');show()};
})();
