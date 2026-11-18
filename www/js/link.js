(function(){
 if(localStorage.getItem('picko_server'))return;
 const US=['https://raw.githubusercontent.com/mobenmk/Picko-link/main/server.json','https://raw.githubusercontent.com/mobenmk/picko-link/main/server.json'];
 async function go(){
  for(const u of US){
   try{
    const r=await fetch(u+'?t='+Date.now(),{cache:'no-store'});
    if(!r.ok)continue;
    const j=await r.json();
    if(j.url){if(j.url!==PICKO_SERVER){PICKO_SERVER=j.url;store.set('link',j.url)}return}
   }catch(e){}
  }
 }
 go();
 setInterval(()=>{if(document.body.classList.contains('offline'))go()},20000);
})();
