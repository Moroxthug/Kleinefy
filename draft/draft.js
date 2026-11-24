(function(){
"use strict";
var d=document.documentElement;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Theme: dark by default, the reader's choice remembered. */
var btn=document.getElementById('theme');
function label(){btn.setAttribute('aria-label',d.classList.contains('dark')?'Switch to light mode':'Switch to dark mode')}
label();
btn.addEventListener('click',function(){
  var dark=!d.classList.contains('dark');
  d.classList.toggle('dark',dark);d.classList.toggle('light',!dark);
  try{localStorage.setItem('theme',dark?'dark':'light')}catch(e){}
  label();
});

/* Recordings: nothing loads until a frame is near the screen, play only while it is in view,
   pause in a hidden tab, and stay on the poster under reduced motion. */
var vids=[].slice.call(document.querySelectorAll('.k-screen video'));
if(reduce||!('IntersectionObserver' in window))return;
var visible=new Set();
var io=new IntersectionObserver(function(es){
  es.forEach(function(e){
    var v=e.target;
    if(e.isIntersecting){visible.add(v);if(!document.hidden){var p=v.play();if(p&&p.catch)p.catch(function(){})}}
    else{visible.delete(v);v.pause()}
  });
},{threshold:.35});
vids.forEach(function(v){io.observe(v)});
document.addEventListener('visibilitychange',function(){
  visible.forEach(function(v){if(document.hidden)v.pause();else{var p=v.play();if(p&&p.catch)p.catch(function(){})}});
});
})();
