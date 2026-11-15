const PE=(()=>{
const F='#f3ebff';
const st=(w=1.5)=>`fill="none" stroke="${F}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const HEART='M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11z';
const COL={face:['#7a4ad8','#1b0c3e'],red:['#ff7b8f','#c4152f'],pink:['#ffa6dc','#d03a98'],orange:['#ffbe70','#e0620c'],yellow:['#ffec8a','#e6a800'],green:['#7cefaa','#0f8f58'],blue:['#8ccbff','#2459d4'],purple:['#cdaeff','#6a28dc'],white:['#ffffff','#b9bed4'],black:['#555570','#0c0c14']};
const defs='<svg width="0" height="0" style="position:absolute"><defs>'+Object.keys(COL).map(k=>`<radialGradient id="pe_${k}" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="${COL[k][0]}"/><stop offset="1" stop-color="${COL[k][1]}"/></radialGradient>`).join('')+'<linearGradient id="pe_gl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs></svg>';
document.body.insertAdjacentHTML('afterbegin',defs);

const E={
 dot:(x,y)=>`<circle cx="${x}" cy="${y}" r="1.5" fill="${F}"/>`,
 big:(x,y)=>`<circle cx="${x}" cy="${y}" r="2" fill="${F}"/>`,
 happy:(x,y)=>`<path ${st()} d="M${x-1.9} ${y+.9}Q${x} ${y-2} ${x+1.9} ${y+.9}"/>`,
 closed:(x,y)=>`<path ${st()} d="M${x-1.9} ${y}Q${x} ${y+1.8} ${x+1.9} ${y}"/>`,
 x:(x,y)=>`<path ${st()} d="M${x-1.5} ${y-1.5}l3 3m0-3l-3 3"/>`,
 heart:(x,y)=>`<path transform="translate(${x-2.16} ${y-2.16}) scale(.18)" fill="#ff7ab8" d="${HEART}"/>`
};
const M={
 smile:`<path ${st()} d="M8 14.6Q12 19 16 14.6"/>`,
 grin:`<path d="M7.4 14Q12 21.5 16.6 14z" fill="${F}"/>`,
 sad:`<path ${st()} d="M8.5 18Q12 14.6 15.5 18"/>`,
 flat:`<path ${st()} d="M9 16.6h6"/>`,
 open:`<ellipse cx="12" cy="17" rx="1.9" ry="2.4" fill="${F}"/>`,
 tongue:`<path ${st()} d="M8 14.6Q12 19 16 14.6"/><path d="M10.4 16.9v1.5a1.6 1.6 0 0 0 3.2 0v-1.5z" fill="#ff7ab8"/>`,
 smirk:`<path ${st()} d="M9 16.4Q13 18 16 14.8"/>`
};
const TEAR='<path d="M5.6 12.6q-1.5 2.1 0 3.2q1.5-1.1 0-3.2z" fill="#7dd3fc"/><path d="M18.4 12.6q-1.5 2.1 0 3.2q1.5-1.1 0-3.2z" fill="#7dd3fc"/>';
const BLUSH='<ellipse cx="5.8" cy="14" rx="1.6" ry="1" fill="#ff7ab8" opacity=".55"/><ellipse cx="18.2" cy="14" rx="1.6" ry="1" fill="#ff7ab8" opacity=".55"/>';
const BROWS=`<path ${st()} d="M6 6.8l4.4 1.6M18 6.8l-4.4 1.6"/>`;
const SWEAT='<path d="M19 4.5q-1.8 2.6 0 3.8q1.8-1.2 0-3.8z" fill="#7dd3fc"/>';
const ZZ=`<path ${st(1.1)} d="M15 3.5h4l-4 4h4"/>`;
const GLASSES=`<path d="M5 8.6h6v3.2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM13 8.6h6v3.2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" fill="#0b0618" stroke="${F}" stroke-width=".9"/><path ${st(1)} d="M11 9.6h2"/>`;
const gloss='<ellipse cx="9" cy="5.6" rx="5.5" ry="2.8" fill="url(#pe_gl)"/>';
const face=(a,b,m,x='')=>`<circle cx="12" cy="12" r="11" fill="url(#pe_face)" stroke="#fff" stroke-opacity=".18"/>`+(a?a(8.4,10):'')+(b?b(15.6,10):'')+m+x+gloss;
const heart=c=>`<path d="${HEART}" fill="url(#pe_${c})"/><path d="M6.2 9a2.8 2.8 0 0 1 2.2-2.6" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.4" stroke-linecap="round"/>`;

const L=[];const add=(c,n,s)=>L.push({c,n,s});
add('faces','smile',face(E.dot,E.dot,M.smile));
add('faces','grin',face(E.dot,E.dot,M.grin));
add('faces','laugh',face(E.happy,E.happy,M.grin));
add('faces','joy',face(E.happy,E.happy,M.grin,TEAR));
add('faces','wink',face(E.dot,E.closed,M.smile));
add('faces','love',face(E.heart,E.heart,M.grin));
add('faces','cool',face(null,null,M.smile,GLASSES));
add('faces','tongue',face(E.dot,E.closed,M.tongue));
add('faces','blush',face(E.happy,E.happy,M.smile,BLUSH));
add('faces','think',face(E.dot,E.dot,M.smirk));
add('faces','neutral',face(E.dot,E.dot,M.flat));
add('faces','sweat',face(E.dot,E.dot,M.smirk,SWEAT));
add('faces','sad',face(E.dot,E.dot,M.sad));
add('faces','cry',face(E.dot,E.dot,M.sad,TEAR));
add('faces','angry',face(E.dot,E.dot,M.sad,BROWS));
add('faces','wow',face(E.big,E.big,M.open));
add('faces','sleepy',face(E.closed,E.closed,M.flat,ZZ));
add('faces','dizzy',face(E.x,E.x,M.grin));
['red','pink','orange','yellow','green','blue','purple','black','white'].forEach(c=>add('hearts','heart_'+c,heart(c)));

add('symbols','thumb','<rect x="2.5" y="11" width="4.2" height="10" rx="1.3" fill="url(#pe_blue)"/><path d="M8.2 11.6L11.8 4a2 2 0 0 1 3.3 1.7L14.2 10H19a2 2 0 0 1 2 2.4l-1.3 6.6a2 2 0 0 1-2 1.6H8.2z" fill="url(#pe_purple)"/>');
add('symbols','star','<path d="M12 2.5l2.9 6.5 7.1.6-5.4 4.6 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.6 9.1 9z" fill="url(#pe_yellow)"/>');
add('symbols','bolt','<path d="M13 2L4 14h7l-1 8 10-13h-7z" fill="url(#pe_orange)"/>');
add('symbols','fire','<path d="M12 2.5c.8 3.6 5.8 5.4 5.8 11.2a5.8 5.8 0 0 1-11.6 0c0-2.8 1.6-4.2 2.8-6.4.9 1 1.7 1.8 2.8 1.8 0-2.6-.8-4.4 0-6.6z" fill="url(#pe_orange)"/><path d="M12 21a3 3 0 0 1-3-3c0-2 1.6-2.8 3-5 1.4 2.2 3 3 3 5a3 3 0 0 1-3 3z" fill="url(#pe_yellow)"/>');
add('symbols','sparkle','<path d="M12 2Q13.2 10.8 22 12Q13.2 13.2 12 22Q10.8 13.2 2 12Q10.8 10.8 12 2z" fill="url(#pe_yellow)"/>');
add('symbols','check','<circle cx="12" cy="12" r="10.5" fill="url(#pe_green)"/><path d="M7.5 12.4l3 3 6-6.4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>');
add('symbols','cross','<circle cx="12" cy="12" r="10.5" fill="url(#pe_red)"/><path d="M8.5 8.5l7 7m0-7l-7 7" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>');

add('nature','sun','<circle cx="12" cy="12" r="5" fill="url(#pe_yellow)"/><path d="M12 1.8v2.4M12 19.8v2.4M1.8 12h2.4M19.8 12h2.4M4.8 4.8l1.7 1.7M17.5 17.5l1.7 1.7M19.2 4.8l-1.7 1.7M6.5 17.5l-1.7 1.7" stroke="#ffd44d" stroke-width="1.8" stroke-linecap="round"/>');
add('nature','moon','<path d="M20 14.6A8.6 8.6 0 1 1 9.4 4a7 7 0 0 0 10.6 10.6z" fill="url(#pe_white)"/>');
add('nature','cloud','<circle cx="8" cy="14" r="4" fill="#e8ebff"/><circle cx="13" cy="10.5" r="5" fill="#e8ebff"/><circle cx="17.5" cy="14.5" r="3.5" fill="#e8ebff"/><rect x="8" y="14" width="10" height="4" fill="#e8ebff"/>');
add('nature','drop','<path d="M12 2.5c3.6 4.6 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 2.4-6.4 6-11z" fill="url(#pe_blue)"/>');
add('nature','flower','<g fill="#ff8ac6"><circle cx="12" cy="6.8" r="3.3"/><circle cx="16.9" cy="10.4" r="3.3"/><circle cx="15.1" cy="16.1" r="3.3"/><circle cx="8.9" cy="16.1" r="3.3"/><circle cx="7.1" cy="10.4" r="3.3"/></g><circle cx="12" cy="12" r="2.6" fill="url(#pe_yellow)"/>');
add('nature','leaf','<path d="M4 20C4 10 10 4 20 4c0 10-6 16-16 16z" fill="url(#pe_green)"/><path d="M4 20l9-9" stroke="#fff" stroke-opacity=".6" stroke-width="1.2" stroke-linecap="round"/>');
add('nature','apple','<path d="M12 7.5c-2-1.6-7-1-7 5 0 4.5 3 8.5 5.2 8.5 1 0 1.2-.5 1.8-.5s.8.5 1.8.5c2.2 0 5.2-4 5.2-8.5 0-6-5-6.6-7-5z" fill="url(#pe_red)"/><path d="M12 7.5c0-2 .8-3.6 2.2-4.5" stroke="#8a5a2b" stroke-width="1.5" fill="none" stroke-linecap="round"/><ellipse cx="16" cy="4.6" rx="2.6" ry="1.3" transform="rotate(-25 16 4.6)" fill="url(#pe_green)"/>');
add('nature','cherry','<path d="M8 13c1-5 3-8 6-10M16.5 12.2c0-4-.5-6.5-2.5-9.2" stroke="#2e9e5b" stroke-width="1.4" fill="none" stroke-linecap="round"/><circle cx="8" cy="17" r="4" fill="url(#pe_red)"/><circle cx="16.5" cy="16" r="3.8" fill="url(#pe_red)"/>');

add('objects','gift','<rect x="3.5" y="10" width="17" height="11" rx="1.8" fill="url(#pe_pink)"/><rect x="2.5" y="7" width="19" height="4.2" rx="1.4" fill="url(#pe_red)"/><rect x="10.8" y="7" width="2.4" height="14" fill="url(#pe_yellow)"/><path d="M12 7c-1-3.5-5-4-5-1.7C7 7 12 7 12 7zM12 7c1-3.5 5-4 5-1.7C17 7 12 7 12 7z" fill="url(#pe_yellow)"/>');
add('objects','crown','<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-1.8 11H4.8z" fill="url(#pe_yellow)"/><circle cx="3" cy="8" r="1.4" fill="#ff7b8f"/><circle cx="12" cy="5" r="1.4" fill="#ff7b8f"/><circle cx="21" cy="8" r="1.4" fill="#ff7b8f"/>');
add('objects','gem','<path d="M12 21L2.5 9.5l4-6h11l4 6z" fill="url(#pe_blue)"/><path d="M2.5 9.5h19M8 3.5l4 6 4-6M12 9.5V21" stroke="#fff" stroke-opacity=".55" stroke-width=".9" fill="none"/>');
add('objects','bell','<path d="M12 3a6 6 0 0 0-6 6c0 5-2 6-2 7.5h16C20 15 18 14 18 9a6 6 0 0 0-6-6z" fill="url(#pe_yellow)"/><circle cx="12" cy="19.5" r="2" fill="url(#pe_orange)"/>');
add('objects','coin','<circle cx="12" cy="12" r="10.5" fill="url(#pe_yellow)"/><circle cx="12" cy="12" r="8" fill="none" stroke="#c98200" stroke-opacity=".6" stroke-width="1"/><path d="M9.5 16.5V7.5h3a2.6 2.6 0 0 1 0 5.2h-3" fill="none" stroke="#b86e00" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>');
add('objects','gamepad','<rect x="2" y="7" width="20" height="11" rx="5" fill="url(#pe_purple)"/><path d="M7.5 10.5V15M5.2 12.7h4.6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><circle cx="16" cy="11.5" r="1.1" fill="#ffec8a"/><circle cx="18.4" cy="14" r="1.1" fill="#ffa6dc"/>');

const MAP={};L.forEach(e=>MAP[e.n]=e);
const CATS=[{k:'faces',i:'smile'},{k:'hearts',i:'heart_red'},{k:'symbols',i:'star'},{k:'nature',i:'sun'},{k:'objects',i:'gift'}];
const svg=(n,s=24)=>MAP[n]?`<svg class="pe" viewBox="0 0 24 24" width="${s}" height="${s}">${MAP[n].s}</svg>`:'';
const render=t=>String(t).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])).replace(/:([a-z0-9_]+):/g,(m,n)=>MAP[n]?svg(n,22):m);
function picker(cb){
 let sh=document.getElementById('pe-sheet');
 if(sh){sh.remove();return}
 sh=document.createElement('div');sh.id='pe-sheet';
 sh.innerHTML='<div class="pe-tabs">'+CATS.map(c=>`<button data-c="${c.k}">${svg(c.i,22)}</button>`).join('')+'</div><div class="pe-grid"></div>';
 document.body.appendChild(sh);
 const grid=sh.querySelector('.pe-grid');
 const show=k=>{
  grid.innerHTML=L.filter(e=>e.c==k).map(e=>`<button data-n="${e.n}">${svg(e.n,34)}</button>`).join('');
  sh.querySelectorAll('.pe-tabs button').forEach(b=>b.classList.toggle('on',b.dataset.c==k));
 };
 sh.querySelector('.pe-tabs').onclick=e=>{const b=e.target.closest('button');if(b)show(b.dataset.c)};
 grid.onclick=e=>{const b=e.target.closest('button');if(b)cb(b.dataset.n)};
 show(CATS[0].k);
}
return {list:L,cats:CATS,svg,render,picker};
})();
