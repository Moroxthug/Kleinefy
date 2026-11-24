(function(){
"use strict";
var d=document.documentElement;
var motion=d.classList.contains('motion');
function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}

/* Theme: dark by default, the reader's choice remembered, switched with the circle reveal from site.css. */
var themeBtn=document.getElementById('theme');
function label(){themeBtn.setAttribute('aria-label',d.classList.contains('dark')?'Switch to light mode':'Switch to dark mode')}
label();
themeBtn.addEventListener('click',function(e){
  var next=!d.classList.contains('dark');
  function apply(){d.classList.toggle('dark',next);d.classList.toggle('light',!next);try{localStorage.setItem('theme',next?'dark':'light')}catch(x){}label()}
  if(!document.startViewTransition||!motion){apply();return}
  var r=e.currentTarget.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
  d.style.setProperty('--rx',x+'px');d.style.setProperty('--ry',y+'px');
  d.style.setProperty('--rv-end',Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y))*1.1+'px');
  d.classList.add('rv');
  document.startViewTransition(apply).finished.finally(function(){d.classList.remove('rv')});
});

/* Split headings into words so each can rise out of its line. */
$$('[data-words]').forEach(function(h){
  var words=h.textContent.trim().split(/\s+/);
  h.setAttribute('aria-label',h.textContent.trim());
  h.textContent='';
  words.forEach(function(w,i){
    var o=document.createElement('span');o.className='wd';o.setAttribute('aria-hidden','true');
    var s=document.createElement('span');s.textContent=w;o.appendChild(s);o.style.setProperty('--i',i);
    h.appendChild(o);if(i<words.length-1)h.appendChild(document.createTextNode(' '));
  });
});

/* Entrance: the hero headline rises word by word once the page is ready. */
var h1=document.getElementById('hero-h');
if(motion)requestAnimationFrame(function(){requestAnimationFrame(function(){h1.classList.add('in')})});
else h1.classList.add('in');

/* Scroll reveals: blocks and headings rise in once, siblings a beat apart. */
var groups=new Map();
$$('.reveal').forEach(function(el){var p=el.parentElement,n=groups.get(p)||0;el.style.setProperty('--i',Math.min(n,6));groups.set(p,n+1)});
var targets=$$('.reveal,[data-words]').filter(function(el){return el!==h1});
if(motion&&'IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add(e.target.hasAttribute('data-words')?'in':'on');io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:.08});
  targets.forEach(function(el){io.observe(el)});
}else targets.forEach(function(el){el.classList.add(el.hasAttribute('data-words')?'in':'on')});

/* Product tours: the point nearest the middle of the screen picks the browser's screen. */
$$('[data-case]').forEach(function(c){
  var imgs=$$('.view img',c),steps=$$('.steps i',c),pts=$$('.points li',c),cur=-1;
  function show(n){if(n===cur)return;cur=n;
    imgs.forEach(function(im,i){im.classList.toggle('on',i===n);im.classList.toggle('past',i<n)});
    steps.forEach(function(s,i){s.classList.toggle('on',i===n)});
    pts.forEach(function(p,i){p.classList.toggle('on',i===n)})}
  show(0);
  if(!('IntersectionObserver' in window))return;
  var vis=new Map();
  var po=new IntersectionObserver(function(es){
    es.forEach(function(e){vis.set(e.target,e.isIntersecting)});
    var best=-1;pts.forEach(function(p,i){if(vis.get(p)&&best<0)best=i});
    if(best>=0)show(best);
  },{rootMargin:innerWidth<960?'-62% 0px -30% 0px':'-45% 0px -45% 0px'});
  pts.forEach(function(p){po.observe(p)});
});

/* Scroll-linked pieces, only while their part of the page is on screen:
   the header hides going down and returns going up, the brass line tracks reading progress,
   and the hero deck settles flat as it scrolls away. */
var bar=document.getElementById('topbar'),prog=document.getElementById('progress');
var deckWrap=document.getElementById('deckWrap'),deck=document.getElementById('deck');
var lastY=scrollY,ticking=false,deckOn=true;
if('IntersectionObserver' in window)new IntersectionObserver(function(e){deckOn=e[0].isIntersecting}).observe(deckWrap);
function onScroll(){
  ticking=false;
  var y=scrollY,max=d.scrollHeight-innerHeight;
  prog.style.transform='scaleX('+(max>0?Math.min(1,y/max):0)+')';
  bar.classList.toggle('scrolled',y>8);
  if(motion)bar.classList.toggle('hide',y>lastY&&y>400&&!bar.contains(document.activeElement));
  lastY=y;
  if(motion&&deckOn){var r=deckWrap.getBoundingClientRect();var p=Math.min(1,Math.max(0,1-(r.top+r.height*.5)/innerHeight));deck.style.setProperty('--p',p.toFixed(3))}
}
addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});
onScroll();

if(!motion)return;

/* Deck tilt: the fan leans toward the pointer while it is over the hero. */
var hero=document.querySelector('.opening'),tx=0,ty=0,gx=0,gy=0,raf=0;
function tilt(){raf=0;tx+=(gx-tx)*.12;ty+=(gy-ty)*.12;deck.style.setProperty('--tx',tx.toFixed(2)+'deg');deck.style.setProperty('--ty',ty.toFixed(2)+'deg');
  if(Math.abs(gx-tx)>.02||Math.abs(gy-ty)>.02)raf=requestAnimationFrame(tilt)}
hero.addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;var r=hero.getBoundingClientRect();
  gy=((e.clientX-r.left)/r.width-.5)*6;gx=-((e.clientY-r.top)/r.height-.5)*4;if(!raf)raf=requestAnimationFrame(tilt)});
hero.addEventListener('pointerleave',function(){gx=0;gy=0;if(!raf)raf=requestAnimationFrame(tilt)});

/* Magnetic buttons: the main actions lean a little toward the pointer. */
$$('.magnet').forEach(function(b){
  b.addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;var r=b.getBoundingClientRect();
    b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*.3).toFixed(1)+'px)'});
  b.addEventListener('pointerleave',function(){b.style.transform=''});
});

/* Nav links scramble into place on hover or focus (the site's own text scramble). */
var GLYPHS='ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
function scramble(el,text){var total=Math.min(600,220+text.length*30),start=performance.now(),last=0;
  function step(now){var t=now-start;if(now-last>33){last=now;el.textContent=[].map.call(text,function(c,i){return t>=total*(.3+.7*i/Math.max(1,text.length-1))?c:GLYPHS[Math.floor(Math.random()*GLYPHS.length)]}).join('')}
    if(t<total)requestAnimationFrame(step);else el.textContent=text}
  requestAnimationFrame(step)}
$$('[data-scramble]').forEach(function(a){var t=a.textContent;a.addEventListener('pointerenter',function(){scramble(a,t)});a.addEventListener('focus',function(){scramble(a,t)})});
})();
