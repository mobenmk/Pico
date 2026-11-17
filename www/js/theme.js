(function(){
 const root=document.documentElement,b=document.getElementById('thm');
 if(!b)return;
 const sun='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>';
 const moon='<svg viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>';
 function apply(t){root.dataset.theme=t;b.innerHTML=t=='light'?moon:sun;store.set('theme',t)}
 apply(store.get('theme','dark'));
 b.onclick=()=>apply(root.dataset.theme=='light'?'dark':'light');
})();
