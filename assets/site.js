(function(){
"use strict";
/* Site settings. bookingUrl: a Cal.com or Calendly event link (e.g. https://cal.com/kleinefy/intro). Left empty, the
   booking sheet shows a short form instead. formEndpoint: where that form posts as JSON (Formspree, Basin, your own
   route). Left empty, the form opens the visitor's mail app with everything filled in. */
var KLEINEFY={bookingUrl:'',formEndpoint:'',email:'hello@kleinefy.com'};
var d=document.documentElement;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}

/* theme */
(function(){
  var stored=null;try{stored=localStorage.getItem('theme')}catch(e){}
  var attr=d.getAttribute('data-theme');
  var dark=stored?stored==='dark':attr?attr==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
  d.classList.toggle('dark',dark);d.classList.toggle('light',!dark);
  $('#theme').addEventListener('click',function(e){
    var next=!d.classList.contains('dark');
    var apply=function(){d.classList.toggle('dark',next);d.classList.toggle('light',!next);try{localStorage.setItem('theme',next?'dark':'light')}catch(x){}};
    if(!document.startViewTransition||reduce){apply();return}
    var r=e.currentTarget.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
    var end=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y))*1.1;
    d.style.setProperty('--rx',x+'px');d.style.setProperty('--ry',y+'px');d.style.setProperty('--rv-end',end+'px');
    d.classList.add('rv');
    var t=document.startViewTransition(apply);
    t.finished.finally(function(){d.classList.remove('rv')});
  });
})();

/* nav + rail */
(function(){
  var bar=$('#bar'),btns=$$('button',bar),timer=null;
  function show(){clearTimeout(timer);bar.classList.add('open')}
  function hide(){clearTimeout(timer);timer=setTimeout(function(){bar.classList.remove('open');btns.forEach(function(b){b.classList.remove('lit')})},90)}
  var hold=null;
  bar.addEventListener('pointerenter',function(e){if(e.pointerType==='touch')return;var el=document.elementFromPoint(e.clientX,e.clientY);var b=el&&el.closest('button');hold={x:e.clientX,b:b};show()});
  bar.addEventListener('pointermove',function(e){if(hold&&Math.abs(e.clientX-hold.x)>24)hold=null});
  bar.heldItem=function(b){return hold&&hold.b&&hold.b!==b};
  bar.addEventListener('pointerleave',function(e){if(e.pointerType!=='touch')hide()});
  bar.addEventListener('focusin',show);bar.addEventListener('focusout',function(e){if(!bar.contains(e.relatedTarget))hide()});
  var tapped=false;
  btns.forEach(function(b){
    b.addEventListener('pointerenter',function(e){if(e.pointerType==='touch')return;if(bar.heldItem(b))return;btns.forEach(function(x){x.classList.remove('lit')});b.classList.add('lit')});
    b.addEventListener('click',function(e){
      if(matchMedia('(hover:none)').matches&&!bar.classList.contains('open')&&innerWidth>=640){tapped=true;show();return}
      var t=document.getElementById(b.dataset.to);if(t){t.scrollIntoView({block:'start'});history.replaceState(null,'','#'+b.dataset.to)}else{location.href=(bar.dataset.home||'')+'#'+b.dataset.to;return}
      b.blur();
    });
  });
  document.addEventListener('pointerdown',function(e){if(tapped&&!bar.contains(e.target)){tapped=false;hide()}});
  var ids=['home','work','services','about','stack','contact'];
  var railLinks=$$('#rail a');
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(!en.isIntersecting)return;var id=en.target.id;
    btns.forEach(function(b){b.classList.toggle('active',b.dataset.to===id)});
    railLinks.forEach(function(a){a.classList.toggle('on',a.dataset.s===id)})})},{rootMargin:'-30% 0px -60% 0px'});
  ids.forEach(function(id){var el=document.getElementById(id);if(el)io.observe(el)});
})();

/* webgl helper */
function glCanvas(canvas,frag,uniforms,dpr){
  var gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false});
  if(!gl)return null;
  function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(o));return null}return o}
  var vs=sh(gl.VERTEX_SHADER,'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'),fs=sh(gl.FRAGMENT_SHADER,frag);
  if(!vs||!fs)return null;
  var pr=gl.createProgram();gl.attachShader(pr,vs);gl.attachShader(pr,fs);gl.linkProgram(pr);gl.useProgram(pr);
  var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  var loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
  var U={};function u(n){if(!(n in U))U[n]=gl.getUniformLocation(pr,n);return U[n]}
  var W=0,H=0;
  function size(){var r=canvas.getBoundingClientRect();var w=Math.max(1,Math.round(r.width*dpr)),h=Math.max(1,Math.round(r.height*dpr));if(w!==W||h!==H){W=w;H=h;canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}}
  return {draw:function(t){size();gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform2f(u('uResolution'),W,H);gl.uniform1f(u('uTime'),t);var us=uniforms();for(var k in us){var v=us[k];if(typeof v==='number')gl.uniform1f(u(k),v);else if(v.length===2)gl.uniform2f(u(k),v[0],v[1]);else gl.uniform3f(u(k),v[0],v[1],v[2])}gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}};
}
function hex(h){return [parseInt(h.slice(1,3),16)/255,parseInt(h.slice(3,5),16)/255,parseInt(h.slice(5,7),16)/255]}

var AURORA='precision highp float;uniform vec2 uResolution;uniform float uTime;uniform vec3 uA;uniform vec3 uB;uniform vec3 uC;uniform float uHeight;uniform float uOpacity;uniform float uLean;uniform float uPX;'+
'float hash(float n){return fract(sin(n*127.1)*43758.5453123);}'+
'float vn(float x){float c=floor(x);float t=fract(x);float e=t*t*(3.-2.*t);return mix(hash(c),hash(c+1.),e);}'+
'float waves(float x,float t){float s=0.;float w=.55;float f=1.;for(int o=0;o<4;o++){s+=w*vn(x*f+t*(.35+.15*float(o)));f*=2.07;w*=.5;}return s;}'+
'vec3 col(float x){return x<.5?mix(uA,uB,x*2.):mix(uB,uC,(x-.5)*2.);}'+
'void main(){vec2 uv=gl_FragCoord.xy/uResolution;float ft=1.-uv.y;float t=uTime*.22;float near=exp(-pow((uv.x-uPX)*3.2,2.));float x=uv.x*3.+uLean*near;'+
'float hem=uHeight+.2*(waves(x*.85,t)-.5)+.04*sin(x*1.6+t*1.4);'+
'float curtain=smoothstep(hem+.05,hem-.03,ft)*(.3+.7*smoothstep(0.,max(hem,.01),ft));'+
'float streaks=.82+.18*vn(uv.x*22.+t*1.6);float seam=.55*exp(-pow((ft-hem)/.08,2.));'+
'float light=(curtain*streaks+seam)*.8;float a=clamp(light*uOpacity,0.,1.);gl_FragColor=vec4(col(uv.x)*a,a);}';

var RAYS='precision highp float;uniform vec2 uResolution;uniform float uTime;uniform vec2 uOrigin;uniform vec3 uA;uniform vec3 uB;uniform float uIntensity;uniform float uSpread;uniform float uDensity;uniform float uOpacity;uniform float uLean;'+
'const float PI=3.14159265;float hash(float n){return fract(sin(n*311.7)*43758.5453123);}'+
'float hash2(vec2 p){p=fract(p*vec2(233.34,851.73));p+=dot(p,p+23.45);return fract(p.x*p.y);}'+
'float vn(float x){float c=floor(x);float t=fract(x);return mix(hash(c),hash(c+1.),t*t*(3.-2.*t));}'+
'void main(){vec2 uv=gl_FragCoord.xy/uResolution;float asp=uResolution.x/uResolution.y;vec2 p=vec2(uv.x*asp,uv.y);vec2 s=vec2(uOrigin.x*asp,uOrigin.y);vec2 to=p-s;float dist=length(to);'+
'vec2 tc=vec2(.5*asp,.42)-s;float heading=atan(tc.y,tc.x)+uLean;float ang=mod(atan(to.y,to.x)-heading+PI,2.*PI)-PI;'+
'float fan=exp(-pow(ang/uSpread,2.));float t=uTime*.3;float across=ang*uDensity;'+
'float beams=.6*smoothstep(.3,.92,vn(across+t))+.4*smoothstep(.25,.95,vn(across*1.7-t*.6+19.));beams=.18+.82*beams;'+
'float reach=1./(1.+pow(dist/.9,1.5));float core=.5*exp(-pow(dist/.3,2.));float light=(fan*beams*reach+core)*uIntensity;'+
'vec2 g=p*26.+vec2(t*2.6,-t*1.9);vec2 cell=floor(g);vec2 ins=fract(g)-.5;float seed=hash2(cell);vec2 off=vec2(hash2(cell+3.1),hash2(cell+7.7))-.5;float sz=.035+.05*hash2(cell+1.3);'+
'float mote=step(.62,seed)*smoothstep(sz,sz*.25,length(ins-off*.6))*(.55+.45*sin(uTime*1.8+seed*40.));light+=mote*fan*reach*.8;'+
'light*=smoothstep(0.,.55,uv.y);float a=clamp(light*uOpacity,0.,1.);vec3 c=mix(uA,uB,smoothstep(-uSpread,uSpread,ang));gl_FragColor=vec4(c*a,a);}';

/* weather sky */
(function(){
  var sky=$('#sky');if(!sky)return;var scenes=['aurora','rain','snow','clouds','sun'],idx=0,elapsed=0,hover=false,onScreen=true;
  var levels={aurora:1,rays:0,precip:0},target={aurora:1,rays:0,precip:0};
  var lean={v:0,t:0,px:.5},rlean={v:0,t:0};
  var isDark=function(){return d.classList.contains('dark')};
  var au=glCanvas($('#aurora'),AURORA,function(){lean.v+=(lean.t-lean.v)*.06;var dk=isDark();return {uA:hex(dk?'#2b2b2b':'#b8bcc6'),uB:hex(dk?'#4a4e58':'#8f95a3'),uC:hex(dk?'#2b2b2b':'#b8bcc6'),uHeight:.45,uOpacity:levels.aurora*(dk?.9:.6),uLean:lean.v,uPX:lean.px}},.5);
  var ry=glCanvas($('#rays'),RAYS,function(){rlean.v+=(rlean.t-rlean.v)*.06;var dk=isDark();return dk?{uOrigin:[1,1],uA:hex('#eaebff'),uB:hex('#edf0f5'),uIntensity:1.1,uSpread:.42,uDensity:5,uOpacity:levels.rays*.8,uLean:rlean.v}:{uOrigin:[1,1],uA:hex('#ffd27a'),uB:hex('#ffe9c2'),uIntensity:1.5,uSpread:.8,uDensity:12,uOpacity:levels.rays*.45,uLean:rlean.v}},.5);
  var precip=(function(){
    var cv=$('#precip'),ctx=cv.getContext('2d'),mode='rain',drops=[],flakes=[],ripples=[],drift=[],W=0,H=0,dpr=1;
    function size(){var r=cv.getBoundingClientRect();dpr=1;var w=Math.round(r.width*dpr),h=Math.round(r.height*dpr);if(w!==W||h!==H){W=w;H=h;cv.width=w;cv.height=h;drift=new Array(Math.ceil(W/8)+1).fill(0)}}
    function start(m){mode=m;size();drops=[];flakes=[];ripples=[];drift=drift.map(function(){return 0});
      for(var i=0;i<170;i++)drops.push({x:Math.random()*W,y:Math.random()*H,l:(12+Math.random()*16)*dpr,v:(520+Math.random()*320)*dpr});
      for(var j=0;j<150;j++)flakes.push({x:Math.random()*W,y:Math.random()*H,r:(1.2+Math.random()*2.2)*dpr,v:(28+Math.random()*40)*dpr,ph:Math.random()*6.28,sw:(.4+Math.random()*.8)*dpr})}
    function draw(dt,level,dark){
      if(level<=0.001){if(W)ctx.clearRect(0,0,W,H);return}size();var s=dt/1000;ctx.clearRect(0,0,W,H);ctx.globalAlpha=level;
      var ground=H*.74;
      if(mode==='rain'){
        ctx.strokeStyle=dark?'rgba(170,186,206,.55)':'rgba(90,104,124,.45)';ctx.lineWidth=1*dpr;ctx.lineCap='round';ctx.beginPath();
        drops.forEach(function(d){d.y+=d.v*s;d.x+=d.v*s*.12;if(d.y>ground){if(Math.random()<.35)ripples.push({x:d.x,y:ground+Math.random()*6*dpr,r:1,a:.5});d.y=-d.l-Math.random()*40*dpr;d.x=Math.random()*W}
          ctx.moveTo(d.x,d.y);ctx.lineTo(d.x-d.l*.12,d.y-d.l)});ctx.stroke();
        ctx.strokeStyle=dark?'rgba(170,186,206,1)':'rgba(90,104,124,1)';
        for(var i=ripples.length-1;i>=0;i--){var r=ripples[i];r.r+=60*dpr*s;r.a-=.9*s;if(r.a<=0){ripples.splice(i,1);continue}ctx.globalAlpha=level*r.a;ctx.beginPath();ctx.ellipse(r.x,r.y,r.r,r.r*.22,0,0,6.283);ctx.stroke()}
        ctx.globalAlpha=level*.18;var g=ctx.createLinearGradient(0,ground-20*dpr,0,ground+60*dpr);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,dark?'rgba(170,186,206,.6)':'rgba(90,104,124,.5)');ctx.fillStyle=g;ctx.fillRect(0,ground-20*dpr,W,80*dpr);
      }else{
        ctx.fillStyle=dark?'rgba(242,241,238,.9)':'rgba(176,186,200,.9)';
        flakes.forEach(function(f){f.ph+=s*1.4;f.y+=f.v*s;f.x+=Math.sin(f.ph)*f.sw;var col=Math.max(0,Math.min(drift.length-1,Math.floor(f.x/8)));var top=ground-drift[col];
          if(f.y>top){drift[col]=Math.min(44*dpr,drift[col]+f.r*.7);if(col>0)drift[col-1]=Math.min(44*dpr,drift[col-1]+f.r*.25);if(col<drift.length-1)drift[col+1]=Math.min(44*dpr,drift[col+1]+f.r*.25);f.y=-10;f.x=Math.random()*W}
          ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,6.283);ctx.fill()});
        ctx.globalAlpha=level*(dark?.35:.5);ctx.fillStyle=dark?'rgba(242,241,238,1)':'rgba(176,186,200,1)';ctx.beginPath();ctx.moveTo(0,ground+26*dpr);for(var c=0;c<drift.length;c++){ctx.lineTo(c*8,ground-drift[c])}ctx.lineTo(W,ground+26*dpr);ctx.closePath();ctx.fill();
      }
      ctx.globalAlpha=1}
    return {start:start,draw:draw}})();
  var name=$('#sceneName'),clouds=$('#clouds'),blue=$('#skyblue');
  var labels={aurora:'Kleinefy · Vancouver · aurora',rain:'Kleinefy · Vancouver · rain',snow:'Kleinefy · Vancouver · snow',clouds:'Kleinefy · Vancouver · clouds',sun:'Kleinefy · Vancouver · sun'};
  function setScene(i){idx=i;var s=scenes[idx];sky.dataset.scene=s;var stormy=s==='rain'||s==='snow';target.aurora=(s==='aurora')?1:stormy?.45:0;target.rays=s==='sun'?1:0;target.precip=stormy?1:0;if(stormy)precip.start(s);clouds.style.opacity=(s==='clouds'||s==='sun')?1:0;blue.style.opacity=s==='clouds'?1:0;name.textContent=labels[s];var hint=$('#hint');if(hint)hint.textContent=(s==='aurora'?'An aurora.':s==='rain'?'Rain.':s==='snow'?'Snow.':s==='clouds'?'Clouds.':'Sun.')+' Point at the sky to hold it. Click it for the next.'}
  var last=0;
  function frame(t){
    var dt=Math.min(50,t-last);last=t;
    var step=dt/2500;
    levels.aurora+=Math.max(-step,Math.min(step,target.aurora-levels.aurora));
    levels.rays+=Math.max(-step,Math.min(step,target.rays-levels.rays));
    levels.precip+=Math.max(-step,Math.min(step,target.precip-levels.precip));
    if(onScreen&&document.visibilityState==='visible'){
      if(au&&levels.aurora>0)au.draw(t/1000);else if(au)au.draw(t/1000);
      if(ry)ry.draw(t/1000);
      precip.draw(dt,levels.precip,isDark());
      if(!hover){elapsed+=dt;if(elapsed>=10000){elapsed=0;setScene((idx+1)%scenes.length)}}
    }
    if(!reduce)requestAnimationFrame(frame);
  }
  new IntersectionObserver(function(e){onScreen=e[0].isIntersecting}).observe(sky);
  function inSky(e){var b=sky.getBoundingClientRect();return e.clientX>=b.left&&e.clientX<=b.right&&e.clientY>=b.top&&e.clientY<=b.bottom}
  addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;hover=inSky(e);var b=sky.getBoundingClientRect();var x=(e.clientX-b.left)/b.width;lean.px=Math.min(1,Math.max(0,x));lean.t=hover?(x-.5)*.6:0;rlean.t=hover?(x-.5)*.25:0},{passive:true});
  addEventListener('pointerdown',function(e){if(!inSky(e))return;if(e.target.closest('a,button,input,textarea,select,nav,[role=button]'))return;elapsed=0;setScene((idx+1)%scenes.length)},{passive:true});
  setScene(0);
  if(reduce){if(au)au.draw(0)}else requestAnimationFrame(frame);
})();

/* text scramble */
var GLYPHS='ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$?/';
function scramble(el,text){
  if(reduce){el.textContent=text;return}
  var total=Math.min(760,260+text.length*22),chars=[].slice.call(text);
  var settle=chars.map(function(_,i){var o=chars.length>1?i/(chars.length-1):1;return total*(.25+.6*o+.15*Math.random())});
  var start=performance.now(),lastSwap=0;
  function step(now){var e=now-start;if(now-lastSwap>33){lastSwap=now;el.textContent=chars.map(function(c,i){return c===' '||e>=settle[i]?c:GLYPHS[Math.floor(Math.random()*GLYPHS.length)]}).join('')}
    if(e<total)requestAnimationFrame(step);else el.textContent=text}
  requestAnimationFrame(step);
}
$$('[data-scramble]').forEach(function(a){var t=a.textContent;a.addEventListener('pointerenter',function(){scramble(a,t)});a.addEventListener('focus',function(){scramble(a,t)})});

/* vapor text */
(function(){
  var host=$('#vapor');if(!host)return;
  var phrases=[['Ideas,','made revenue-ready.'],['We take you','to the next level.'],['No empty promises.','Just shipped software.'],['Results','before anything else.'],['Websites, automations,','CRM, ERP and apps.']];
  var LETTER=900,STAG=26,SCAT=140,HOLD=2600;
  function scat(seed){var v=Math.sin(seed*12.9898)*43758.5453;return v-Math.floor(v)}
  function span(ph){return ph.join('').length*STAG+SCAT+LETTER}
  var els=phrases.map(function(ph){
    var p=document.createElement('span');p.className='ph';p.setAttribute('aria-hidden','true');var n=0;
    ph.forEach(function(line){var l=document.createElement('span');l.className='l';
      line.split(' ').forEach(function(word,wi){if(wi)l.appendChild(document.createTextNode(' '));var w=document.createElement('span');w.className='w';
        [].slice.call(word).forEach(function(ch){var c=document.createElement('span');c.className='c';c.textContent=ch;var i=n++;
          c.style.setProperty('--vx',((scat(i+1)-.5)*.5).toFixed(2)+'em');c.style.setProperty('--dx',(.1+scat(i+7)*.5).toFixed(2)+'em');c.style.setProperty('--dy',(-.35-scat(i+13)*.55).toFixed(2)+'em');
          c.style.animationDuration=LETTER+'ms';c.style.animationDelay=Math.round(i*STAG+scat(i+3)*SCAT)+'ms';w.appendChild(c)});
        l.appendChild(w)});
      p.appendChild(l)});
    host.appendChild(p);return p});
  var cur=0;els[0].classList.add('cur');
  if(reduce||phrases.length<2)return;
  var hovered=false,settled=true,waiting=false,onScreen=true;
  new IntersectionObserver(function(e){onScreen=e[0].isIntersecting}).observe(host);
  function setPhase(el,ph){$$('.c',el).forEach(function(c){c.classList.remove('vin','vout');if(ph)c.classList.add(ph)})}
  function doScramble(){var el=els[cur];settled=true;$$('.l',el).forEach(function(l){var text=l.textContent;var saved=l.innerHTML;scramble(l,text);setTimeout(function(){l.innerHTML=saved},800)})}
  function hold(){setTimeout(function(){
    if(!onScreen||hovered||document.visibilityState!=='visible'){hold();return}
    settled=false;var out=els[cur];setPhase(out,'vout');
    setTimeout(function(){out.classList.remove('cur');setPhase(out,null);cur=(cur+1)%els.length;var inn=els[cur];setPhase(inn,'vin');inn.classList.add('cur');
      setTimeout(function(){setPhase(inn,null);settled=true;if(waiting){waiting=false;doScramble()}hold()},span(phrases[cur]))},span(phrases[(cur)]))},HOLD)}
  hold();
  host.addEventListener('pointerenter',function(e){if(e.pointerType==='touch')return;hovered=true;if(!settled){waiting=true;return}doScramble()});
  host.addEventListener('pointerleave',function(){hovered=false;waiting=false});
})();

/* hover accordion */
(function(){
  var items=$$('#acc > li');if(!items.length)return;
  function open(li){items.forEach(function(x){var on=x===li;x.classList.toggle('open',on);$('button',x).setAttribute('aria-expanded',on)})}
  items.forEach(function(li){var b=$('button',li);b.addEventListener('pointerenter',function(e){if(e.pointerType!=='touch')open(li)});b.addEventListener('focus',function(){open(li)});b.addEventListener('click',function(){open(li)})});
})();

/* pixel reveal */
(function(){
  $$('[data-pix]').forEach(function(m){
    var g=document.createElement('div');g.className='pix';
    for(var i=0;i<24;i++){var c=document.createElement('i');var col=i%6,row=Math.floor(i/6);var v=Math.sin((i+1)*91.7)*10000;v=v-Math.floor(v);c.style.transitionDelay=Math.round(((col+row)/8)*700+v*220)+'ms';g.appendChild(c)}
    m.appendChild(g);
    new IntersectionObserver(function(e,io){if(!e[0].isIntersecting)return;io.disconnect();m.classList.add('play');setTimeout(function(){g.remove()},1400)},{threshold:.35}).observe(m);
  });
})();

/* cylinder carousel */
(function(){
  var cyl=$('#cyl'),cap=$('#cylcap');if(!cyl)return;
  var items=[['Next.js','web apps'],['React','interfaces'],['TypeScript','everything'],['Node','services'],['Postgres','data'],['Supabase','auth and storage'],['Stripe','payments'],['WhatsApp API','messaging'],['Claude','AI features'],['Swift','iOS'],['Vercel','hosting'],['n8n','automation']];
  var N=items.length,offset=0,vel=0,dragging=false,lastX=0,lastT=0,hover=false,auto=true;
  var els=items.map(function(it){var e=document.createElement('div');e.className='it';e.innerHTML='<span>'+it[0]+'<small>'+it[1]+'</small></span>';cyl.insertBefore(e,cap);return e});
  var size=160,slot,half,arc=70,minScale=.55;
  function fit(){var w=cyl.clientWidth;var visible=w<640?3:w<1000?5:7;slot=w/visible;size=Math.min(160,slot*.9);half=visible/2+.5;els.forEach(function(e){e.style.width=e.style.height=size+'px'})}
  function wrap(r){while(r>N/2)r-=N;while(r<-N/2)r+=N;return r}
  function render(){
    els.forEach(function(e,i){var rel=wrap(i-offset);var a=Math.min(1,Math.abs(rel)/half);
      if(Math.abs(rel)>half+.5){e.style.display='none';return}e.style.display='';
      var sc=minScale+(1-minScale)*a;var y=arc*(1-a*a);
      e.style.transform='translate(-50%,-50%) translate('+(rel*slot)+'px,'+y+'px) scale('+sc.toFixed(3)+')';e.style.zIndex=String(Math.round(a*10))});
    var c=((Math.round(offset)%N)+N)%N;cap.textContent=items[c][0]+' · '+items[c][1];
  }
  var last=0;
  function tick(t){var dt=Math.min(50,t-last)/1000;last=t;
    if(!dragging){if(Math.abs(vel)>.01){offset+=vel*dt;vel*=Math.pow(.15,dt)}else{vel=0;if(auto&&!hover&&!reduce)offset+=.25*dt;else{var tgt=Math.round(offset);offset+=(tgt-offset)*Math.min(1,dt*6)}}}
    render();if(seen)requestAnimationFrame(tick);else running=false}
  cyl.addEventListener('pointerdown',function(e){dragging=true;auto=false;lastX=e.clientX;lastT=performance.now();vel=0;cyl.setPointerCapture(e.pointerId)});
  cyl.addEventListener('pointermove',function(e){if(!dragging)return;var now=performance.now();var dx=e.clientX-lastX;offset-=dx/slot;vel=-(dx/slot)/Math.max(.001,(now-lastT)/1000);lastX=e.clientX;lastT=now});
  function up(){dragging=false;vel=Math.max(-6,Math.min(6,vel))}
  cyl.addEventListener('pointerup',up);cyl.addEventListener('pointercancel',up);
  cyl.addEventListener('pointerenter',function(e){if(e.pointerType!=='touch')hover=true});cyl.addEventListener('pointerleave',function(){hover=false});
  cyl.tabIndex=0;cyl.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){offset=Math.round(offset)+1;auto=false}if(e.key==='ArrowLeft'){offset=Math.round(offset)-1;auto=false}});
  var seen=false,running=false;function loop(t){if(!seen){running=false;return}tick(t)}
  function tick2(t){last=t}
  new IntersectionObserver(function(e){seen=e[0].isIntersecting;if(seen&&!running){running=true;last=performance.now();requestAnimationFrame(tick)}}).observe(cyl);
  fit();addEventListener('resize',fit);render();
})();

/* handwritten quote */
(function(){
  var fig=$('#hw');if(!fig)return;var quote=fig.dataset.quote,by=fig.dataset.by,MS=34;
  var words=quote.split(/\s+/);var tokens=['“'].concat(words,['”']);
  var bq=document.createElement('blockquote');bq.style.margin='0';
  var sr=document.createElement('p');sr.className='sr';sr.textContent='“'+quote+'”';bq.appendChild(sr);
  var p=document.createElement('p');p.setAttribute('aria-hidden','true');
  var spans=tokens.map(function(t,i){var s=document.createElement('span');s.className='tk';s.innerHTML='<span class="ink">'+t+'</span><span class="tip"></span>';return s});
  spans.forEach(function(s,i){if(i===1||i===spans.length-1){var g=document.createElement('span');g.style.whiteSpace='nowrap';g.appendChild(spans[i-1]);g.appendChild(s);p.appendChild(g);if(i===1)p.appendChild(document.createTextNode(' '))}
    else if(i===0||i===spans.length-2){}else{p.appendChild(s);p.appendChild(document.createTextNode(' '))}});
  bq.appendChild(p);fig.appendChild(bq);
  var fc=document.createElement('figcaption');fc.innerHTML='<i aria-hidden="true"></i><span>'+by+'</span>';fig.appendChild(fc);
  function start(){document.fonts.ready.then(function(){var time=0;
    spans.forEach(function(s,i){var dur=Math.max(1,tokens[i].length)*MS;s.style.setProperty('--t',time+'ms');s.style.setProperty('--d',dur+'ms');time+=dur;var nx=spans[i+1];if(!nx)return;
      var attached=i===0||i===spans.length-2;if(nx.offsetTop>s.offsetTop)time+=250;else if(!attached)time+=60});
    fig.style.setProperty('--ta',(time+400)+'ms');fig.classList.add('go')})}
  new IntersectionObserver(function(e,io){if(!e[0].isIntersecting)return;io.disconnect();start()},{threshold:.4}).observe(fig);
})();
})();
