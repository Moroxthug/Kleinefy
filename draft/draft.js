(function(){
"use strict";
/* Kleinefy draft home. Every effect here answers the reader (pointer, hover, scroll) except the one hero entrance.
   Techniques and timings: .claude/skills/kleinefy-design/references/motion.md, which credits their sources. */
var d=document.documentElement;
var motion=d.classList.contains('motion');
var finePointer=matchMedia('(hover: hover) and (pointer: fine)').matches;
function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
function clamp(v,a,b){return Math.min(b,Math.max(a,v))}

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

/* Headings split into words that rise out of their own line. */
$$('[data-words]').forEach(function(h){
  var words=h.textContent.trim().split(/\s+/);
  h.setAttribute('aria-label',h.textContent.trim());h.textContent='';
  words.forEach(function(w,i){
    var o=document.createElement('span');o.className='wd';o.setAttribute('aria-hidden','true');o.style.setProperty('--i',i);
    var s=document.createElement('span');s.textContent=w;o.appendChild(s);h.appendChild(o);
    if(i<words.length-1)h.appendChild(document.createTextNode(' '));
  });
});

/* Letter roll on links: an aria-hidden copy of the label rolls up into place on hover. */
function letters(text,hidden){var s=document.createElement('span');if(hidden)s.setAttribute('aria-hidden','true');
  [].forEach.call(text,function(c,i){var t=document.createElement('i');t.textContent=c;t.style.setProperty('--n',i);s.appendChild(t)});return s}
$$('[data-roll]').forEach(function(a){
  var text=a.textContent.trim();a.setAttribute('aria-label',a.getAttribute('aria-label')||text);a.textContent='';
  var r=document.createElement('span');r.className='roll';r.setAttribute('aria-hidden','true');
  r.appendChild(letters(text,false));r.appendChild(letters(text,true));a.appendChild(r);
});

/* Scroll-lit statement: words wrapped so each can light on its own. */
var lit=document.getElementById('lit'),litWords=[];
(function(){var words=lit.textContent.trim().split(/\s+/);lit.textContent='';
  words.forEach(function(w,i){var s=document.createElement('span');s.className='lw';s.textContent=w;lit.appendChild(s);litWords.push(s);if(i<words.length-1)lit.appendChild(document.createTextNode(' '))});
  var hl=(lit.dataset.hl||'').split(/\s+/).filter(Boolean);
  for(var i=0;hl.length&&i<=words.length-hl.length;i++){if(hl.every(function(w,k){return words[i+k]===w})){for(var k=0;k<hl.length;k++)litWords[i+k].classList.add('lhl');break}}})();

/* Service icons draw their strokes in. */
$$('.ico').forEach(function(s){[].forEach.call(s.children,function(c){c.setAttribute('pathLength','1')})});

/* Footer wordmark letters. */
var wm=document.getElementById('wordmark');
(function(){var t=wm.textContent;wm.textContent='';[].forEach.call(t,function(c,i){var o=document.createElement('span');o.className='ch';o.style.setProperty('--n',i);var s=document.createElement('span');s.textContent=c;o.appendChild(s);wm.appendChild(o)})})();

/* Entrance: the hero headline rises word by word once the first frame is painted. */
var h1=document.getElementById('hero-h');
if(motion)requestAnimationFrame(function(){requestAnimationFrame(function(){h1.classList.add('in')})});
else h1.classList.add('in');

/* Reveals: blocks, headings and the wordmark rise in once, siblings a beat apart. */
var groups=new Map();
$$('.reveal').forEach(function(el){var p=el.parentElement,n=groups.get(p)||0;el.style.setProperty('--i',Math.min(n,6));groups.set(p,n+1)});
var targets=$$('.reveal,[data-words],.ico').filter(function(el){return el!==h1});
function mark(el){el.classList.add(el.classList.contains('reveal')?'on':'in')}
if(motion&&'IntersectionObserver' in window){
  /* a fully clipped element never counts as visible, so clip-path reveals are watched through their container */
  var proxy=new Map();
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){mark(proxy.get(e.target)||e.target);io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:.08});
  targets.forEach(function(el){if(el.classList.contains('browser')){proxy.set(el.parentElement,el);io.observe(el.parentElement)}else io.observe(el)});
}else targets.forEach(mark);

/* The wordmark sits at the very bottom of the page, so it rises as soon as a fifth of it shows. */
if(motion&&'IntersectionObserver' in window)new IntersectionObserver(function(e,o){if(e[0].isIntersecting){wm.classList.add('in');o.disconnect()}},{threshold:.2}).observe(wm);
else wm.classList.add('in');

/* Product tours: the point nearest the middle of the view picks the browser's screen. */
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

/* The work section takes on the colours of the product in the middle of the view. */
var work=document.getElementById('work'),cases=$$('[data-case]');
if('IntersectionObserver' in window){
  var inMid=new Map();
  var co=new IntersectionObserver(function(es){es.forEach(function(e){inMid.set(e.target,e.isIntersecting)});
    var hit=cases.filter(function(c){return inMid.get(c)})[0];
    if(hit)work.dataset.on=hit.id;else delete work.dataset.on},{rootMargin:'-50% 0px -50% 0px'});
  cases.forEach(function(c){co.observe(c)});
}

/* Vancouver time, refreshed while the line is on screen. */
var clock=document.getElementById('clock'),clockTimer=0;
function tick(){try{clock.textContent=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Vancouver',hour:'numeric',minute:'2-digit'}).format(new Date())}catch(e){}}
tick();
if('IntersectionObserver' in window)new IntersectionObserver(function(e){clearInterval(clockTimer);if(e[0].isIntersecting){tick();clockTimer=setInterval(tick,15000)}}).observe(clock);

/* Copy the address, with the result announced. */
var copyBtn=document.getElementById('copyEmail'),copied=document.getElementById('copied');
copyBtn.addEventListener('click',function(){
  var addr=copyBtn.dataset.email;
  function done(ok){copied.textContent=ok?'Copied':'Select the address: '+addr;setTimeout(function(){copied.textContent=''},2600)}
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(addr).then(function(){done(true)},function(){done(false)});else done(false);
});

/* Scroll-linked pieces. Work happens only on scroll and resize, one write per frame, and each piece is
   measured only while its section is on screen. */
var bar=document.getElementById('topbar'),prog=document.getElementById('progress');
var expand=document.getElementById('expand'),deckWrap=document.getElementById('deckWrap'),deck=document.getElementById('deck'),mid=deck.querySelector('.c-mid');
var services=document.getElementById('services'),track=document.getElementById('track'),trackBar=document.getElementById('trackBar'),band=document.getElementById('callBand'),phones=$$('.phone');
var on={expand:true,lit:true,services:false};
if('IntersectionObserver' in window){
  var so=new IntersectionObserver(function(es){es.forEach(function(e){on[e.target.dataset.k]=e.isIntersecting})});
  expand.dataset.k='expand';lit.dataset.k='lit';services.dataset.k='services';
  [expand,lit,services].forEach(function(el){so.observe(el)});
}
var desk=false,txMax=0;
function measure(){
  desk=innerWidth>=960;
  /* how far the middle card must grow and move to fill the stage */
  var cw=deck.offsetWidth*(desk||innerWidth>640?.62:.78),ch=cw*10/16,sw=innerWidth-(desk?64:32),sh=innerHeight-(desk?140:120);
  var grow=Math.max(1,Math.min(sw/cw,sh/ch));
  deck.style.setProperty('--grow',grow.toFixed(3));
  ch=ch*grow;
  /* the stage centres the deck, so moving the card's centre to the deck's centre centres it on screen */
  deck.style.setProperty('--lift',(deckWrap.offsetHeight/2-mid.offsetTop-ch/2).toFixed(1)+'px');
  /* the services track travels its overflow; the section is that tall plus a screen */
  if(desk&&motion){txMax=Math.max(0,track.scrollWidth-innerWidth);services.style.setProperty('--track-h',(txMax+innerHeight*1.15)+'px');track.style.setProperty('--tx-max',txMax+'px')}
  else{services.style.removeProperty('--track-h')}
}
var lastY=scrollY,ticking=false;
function onScroll(){
  ticking=false;
  var y=scrollY,max=d.scrollHeight-innerHeight;
  prog.style.transform='scaleX('+(max>0?clamp(y/max,0,1):0)+')';
  bar.classList.toggle('scrolled',y>8);
  if(motion)bar.classList.toggle('hide',y>lastY&&y>160&&!bar.contains(document.activeElement));
  lastY=y;
  if(!motion)return;
  if(on.expand){var r=expand.getBoundingClientRect(),run=r.height-innerHeight;var p=run>40?clamp(-r.top/run,0,1):0;deck.style.setProperty('--p',(p*p*(3-2*p)).toFixed(4))}
  if(on.lit){var lr=lit.getBoundingClientRect();var a=innerHeight*.8,b=innerHeight*.2;
    var lp=clamp((a-lr.top)/((a-b)+lr.height*.6),0,1),n=litWords.length;
    litWords.forEach(function(w,i){var s=i/n-.1,e=i/n+.05;w.style.opacity=(.15+.85*clamp((lp-s)/(e-s),0,1)).toFixed(3)})}
  if(on.services&&desk){var sr=services.getBoundingClientRect(),tp=clamp(-sr.top/(sr.height-innerHeight),0,1);track.style.setProperty('--tp',tp.toFixed(4));trackBar.style.transform='scaleX('+tp.toFixed(4)+')'}
  if(desk)phones.forEach(function(ph){var r=ph.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;var q=clamp((innerHeight-r.top)/(innerHeight+r.height),0,1);ph.style.translate='0 '+((.5-q)*90).toFixed(1)+'px'});
  var br=band.getBoundingClientRect();if(br.top<innerHeight&&br.bottom>0)band.style.setProperty('--cr',(1-clamp((innerHeight-br.top)/(innerHeight*.75),0,1)).toFixed(4));
}
function req(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}}
addEventListener('scroll',req,{passive:true});
addEventListener('resize',function(){measure();req()});
measure();onScroll();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){measure();req()});

if(!motion)return;

/* Pointer pieces use a frame-rate-independent follow and stop as soon as they settle. */
function follower(apply,k){var cur={x:0,y:0},tgt={x:0,y:0},raf=0,last=0;
  function step(t){var dt=last?Math.min(.05,(t-last)/1000):.016;last=t;var f=1-Math.exp(-k*dt);
    cur.x+=(tgt.x-cur.x)*f;cur.y+=(tgt.y-cur.y)*f;apply(cur.x,cur.y);
    if(Math.abs(tgt.x-cur.x)>.01||Math.abs(tgt.y-cur.y)>.01)raf=requestAnimationFrame(step);else{raf=0;last=0}}
  return function(x,y){tgt.x=x;tgt.y=y;if(!raf)raf=requestAnimationFrame(step)}}

/* Deck tilt toward the pointer while it is over the stage, flattened as the deck opens. */
if(finePointer){
  var setTilt=follower(function(x,y){deck.style.setProperty('--ty',x.toFixed(2)+'deg');deck.style.setProperty('--tx',y.toFixed(2)+'deg')},10);
  deckWrap.addEventListener('pointermove',function(e){var r=deckWrap.getBoundingClientRect();setTilt(((e.clientX-r.left)/r.width-.5)*7,-((e.clientY-r.top)/r.height-.5)*5)});
  deckWrap.addEventListener('pointerleave',function(){setTilt(0,0)});
}

/* Magnetic main actions: a third of the pointer's offset inside the box plus 60px. */
if(finePointer)$$('.magnet').forEach(function(b){
  var move=follower(function(x,y){b.style.translate=x.toFixed(1)+'px '+y.toFixed(1)+'px'},12);
  addEventListener('pointermove',function(e){var r=b.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy;
    if(Math.abs(dx)<r.width/2+60&&Math.abs(dy)<r.height/2+60)move(dx/3,dy/3);else move(0,0)},{passive:true});
});

/* Fill from the pointer's entry point, retracting toward where it leaves. */
/* Product frames lean toward the pointer. */
if(finePointer)$$('.case-media').forEach(function(m){
  var br=m.querySelector('.browser');
  var tilt=follower(function(x,y){br.style.transform='perspective(1400px) rotateY('+x.toFixed(2)+'deg) rotateX('+y.toFixed(2)+'deg)'},8);
  m.addEventListener('pointermove',function(e){var r=m.getBoundingClientRect();tilt(((e.clientX-r.left)/r.width-.5)*6,-((e.clientY-r.top)/r.height-.5)*5)});
  m.addEventListener('pointerleave',function(){tilt(0,0)});
});

/* A brass marker slides to the stack row under the pointer. */
var stackWrap=document.getElementById('stackWrap'),rowMark=document.getElementById('rowMark');
$$('.stack tbody tr').forEach(function(tr){tr.addEventListener('pointerenter',function(){
  rowMark.style.height=tr.offsetHeight+'px';rowMark.style.transform='translateY('+(tr.offsetTop+tr.parentElement.offsetTop)+'px)';rowMark.classList.add('on')})});
stackWrap.addEventListener('pointerleave',function(){rowMark.classList.remove('on')});

/* The footer wordmark: letters near the pointer lift and turn brass. */
var chs=$$('.ch',wm),endEl=document.querySelector('.end');
if(finePointer){
  endEl.addEventListener('pointermove',function(e){
    chs.forEach(function(c){var r=c.getBoundingClientRect(),dx=Math.abs(e.clientX-(r.left+r.width/2)),k=Math.max(0,1-dx/(r.width*2.2));
      c.style.translate='0 '+(-k*14).toFixed(1)+'%';c.classList.toggle('near',k>.55)})});
  endEl.addEventListener('pointerleave',function(){chs.forEach(function(c){c.style.translate='';c.classList.remove('near')})});
}

$$('.btn.fill').forEach(function(b){
  function at(e){var r=b.getBoundingClientRect();b.style.setProperty('--fx',(e.clientX-r.left)+'px');b.style.setProperty('--fy',(e.clientY-r.top)+'px')}
  b.addEventListener('pointerenter',function(e){at(e);b.classList.add('on')});
  b.addEventListener('pointerleave',function(e){at(e);b.classList.remove('on')});
});
})();
