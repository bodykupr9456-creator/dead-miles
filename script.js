'use strict';
(() => {
 const bg=document.querySelector('#background-video');
 const pause=document.querySelector('#pause-background');
 const dialog=document.querySelector('#trailer-dialog');
 const player=document.querySelector('#trailer-player');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const saveData=navigator.connection?.saveData;
 let requestedPause=reduce.matches||saveData, resumeAfterDialog=false, lastWatch=null;
 function paint(){const playing=!bg.paused;pause.setAttribute('aria-label',playing?'Pause background video':'Play background video');pause.setAttribute('aria-pressed',String(playing));pause.firstElementChild.textContent=playing?'Ⅱ':'▶';}
 async function playBackground(){try {await bg.play();}catch(_){/* The poster stays visible if autoplay is blocked. */}paint();}
 if(!requestedPause)playBackground();else paint();
 bg.addEventListener('play',paint);bg.addEventListener('pause',paint);
 pause.addEventListener('click',()=>{if(bg.paused){requestedPause=false;playBackground();}else{requestedPause=true;bg.pause();}});
 reduce.addEventListener('change',e=>{if(e.matches){requestedPause=true;bg.pause();}});
 const heroObserver=new IntersectionObserver(entries=>{const visible=entries[0].isIntersecting;if(!visible)bg.pause();else if(!requestedPause&&!dialog.open)playBackground();},{threshold:.05});heroObserver.observe(document.querySelector('.hero'));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)bg.pause();else if(!requestedPause&&!dialog.open&&document.querySelector('.hero').getBoundingClientRect().bottom>0)playBackground();});
 function closeTrailer(){player.pause();dialog.close();}
 document.querySelectorAll('[data-watch]').forEach(button=>button.addEventListener('click',()=>{lastWatch=button;resumeAfterDialog=!bg.paused;bg.pause();dialog.showModal();document.body.classList.add('modal-open');player.play().catch(()=>{});}));
 document.querySelector('#close-trailer').addEventListener('click',closeTrailer);
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeTrailer();}});
 dialog.addEventListener('close',()=>{player.pause();document.body.classList.remove('modal-open');if(resumeAfterDialog&&!requestedPause)playBackground();lastWatch?.focus();});
 const toast=document.querySelector('#download-toast');let timer;
 document.querySelectorAll('[data-download]').forEach(link=>link.addEventListener('click',()=>{toast.textContent='Your '+(link.dataset.download==='pc'?'Windows installer':'Android APK')+' download has been requested. Check your browser’s downloads.';toast.hidden=false;clearTimeout(timer);timer=setTimeout(()=>{toast.hidden=true;},6000);}));
})();
