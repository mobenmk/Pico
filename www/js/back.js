(function(){
 const A=window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.App;
 if(!A)return;
 A.addListener('backButton',()=>{
  if(window.PKBack&&PKBack())return;
  if(typeof Photo!=='undefined'&&Photo.back())return;
  if(typeof MenuUI!=='undefined'&&MenuUI.back())return;
  if(typeof Chat!=='undefined'&&Chat.back())return;
  const lb=document.getElementById('lback');
  if(lb&&document.querySelector('#games.on')){lb.click();return}
  if(store.get('tab','chats')!=='chats'){go('chats');return}
  if(A.minimizeApp)A.minimizeApp();else A.exitApp();
 });
})();
