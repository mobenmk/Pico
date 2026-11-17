(function(){
 const A=window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.App;
 if(!A)return;
 A.addListener('backButton',()=>{
  if(typeof Chat!=='undefined'&&Chat.back())return;
  const lb=document.getElementById('lback');
  if(lb&&document.querySelector('#games.on')){lb.click();return}
  if(store.get('tab','chats')!=='chats'){go('chats');return}
  if(A.minimizeApp)A.minimizeApp();else A.exitApp();
 });
})();
