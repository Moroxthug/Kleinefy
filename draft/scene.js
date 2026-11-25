/* Kleinefy draft home: the twelve real product screens on a helix in WebGL.
   Scrolling the section turns the helix screen by screen, dragging turns it by hand, pointing at a screen lifts it and
   looks closer, and clicking a screen jumps to that product's tour. The HTML deck stays in place as the fallback for
   reduced motion or no WebGL. Rules: .claude/skills/kleinefy-design/references/motion.md, WebGL. */
import * as THREE from '../assets/vendor/three/three.module.min.js';

const d=document.documentElement;
const section=document.getElementById('expand');
const canvas=document.getElementById('helix');
const cap=document.getElementById('helixCap');

function start(){
  if(!d.classList.contains('motion')||!section||!canvas)return;
  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'})}catch(e){return}
  if(!renderer.getContext())return;

  /* the screens come from the tours further down, with their real alt text and product */
  const items=[...document.querySelectorAll('[data-case] .view img')].map(im=>{
    const c=im.closest('[data-case]');
    return {src:im.getAttribute('src'),alt:im.alt,name:c.querySelector('h3').textContent.trim(),id:c.id};
  });
  const N=items.length;if(!N)return;

  const STEP=Math.PI*2/9,R=2.6,DY=0.58,PW=1.6,PH=1.0,FOV=30;
  const phone=()=>innerWidth<640;
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,phone()?1.5:2));
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(FOV,1,.1,100);
  const group=new THREE.Group();scene.add(group);

  const css=n=>getComputedStyle(d).getPropertyValue(n).trim();
  function tokenColor(name,fallback){
    const probe=document.createElement('span');probe.style.color=css(name)||fallback;document.body.appendChild(probe);
    const rgb=getComputedStyle(probe).color;probe.remove();
    const m=rgb.match(/[\d.]+/g)||[0,0,0];
    return new THREE.Color().setRGB(m[0]/255,m[1]/255,m[2]/255,THREE.SRGBColorSpace);
  }
  const uBg={value:tokenColor('--bg','#0a0a0a')},uLine={value:tokenColor('--border-strong','#555')};

  const vert=`
    uniform float uVel,uHover,uIn;uniform vec2 uMouse;varying vec2 vUv;
    void main(){
      vUv=uv;vec3 p=position;
      p.z+=sin(uv.x*3.14159)*uVel*.18;
      float dm=distance(uv,uMouse);
      p.z+=uHover*.07*(1.-smoothstep(0.,.6,dm));
      p.z-=(1.-uIn)*1.4;
      gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    }`;
  const frag=`
    uniform sampler2D uMap;uniform float uHover,uVel,uIn,uFade,uAspect,uReady;uniform vec2 uMouse;uniform vec3 uBg,uLine;varying vec2 vUv;
    float rbox(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
    void main(){
      vec2 c=vUv-.5;
      vec2 uv=.5+c*(1.-.06*uHover);
      float dm=distance(vUv*vec2(uAspect,1.),uMouse*vec2(uAspect,1.));
      uv+=(vUv-uMouse)*-.03*uHover*(1.-smoothstep(0.,.35,dm));
      float split=.004*uHover+.01*min(abs(uVel),1.);
      vec3 col=vec3(texture2D(uMap,uv+vec2(split,0.)).r,texture2D(uMap,uv).g,texture2D(uMap,uv-vec2(split,0.)).b);
      col=mix(uBg,col,uReady);
      float g=dot(col,vec3(.299,.587,.114));
      col=mix(vec3(g),col,.5+.5*max(uHover,uFade*uFade));
      col=mix(uBg,col,.25+.75*uFade);
      float sd=rbox(c*vec2(uAspect,1.),vec2(uAspect*.5,.5),.035);
      float a=1.-smoothstep(-.002,.002,sd);
      float line=1.-smoothstep(0.,.004,abs(sd+.003));
      col=mix(col,uLine,line*.7);
      gl_FragColor=vec4(col,a*uIn);
      #include <colorspace_fragment>
    }`;

  const loader=new THREE.TextureLoader();
  const aniso=renderer.capabilities.getMaxAnisotropy();
  const geo=new THREE.PlaneGeometry(PW,PH,40,24);
  const meshes=items.map((it,i)=>{
    const u={uMap:{value:null},uReady:{value:0},uHover:{value:0},uVel:{value:0},uIn:{value:0},uFade:{value:1},uAspect:{value:PW/PH},uMouse:{value:new THREE.Vector2(.5,.5)},uBg,uLine};
    const m=new THREE.Mesh(geo,new THREE.ShaderMaterial({uniforms:u,vertexShader:vert,fragmentShader:frag,transparent:true}));
    const a=i*STEP;m.position.set(Math.sin(a)*R,-i*DY,Math.cos(a)*R);m.rotation.y=a;
    m.userData={i,u,hover:0,mouse:new THREE.Vector2(.5,.5),mouseT:new THREE.Vector2(.5,.5),inT:0,inStart:0,ready:0};
    loader.load(it.src,t=>{t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=aniso;u.uMap.value=t;m.userData.readyT=1;need()});
    group.add(m);return m;
  });

  /* state */
  let f=0,fPrev=0,vel=0,drag=0,dragV=0,dragging=false,downX=0,lastX=0,moved=0,visible=false,raf=0,last=0,entered=false;
  const ptr=new THREE.Vector2(9,9),par=new THREE.Vector2(),parT=new THREE.Vector2();
  let hovered=null;const ray=new THREE.Raycaster();
  let dist=4,front=-1;

  function resize(){
    const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;
    renderer.setSize(w,h,false);camera.aspect=w/h;
    const frac=camera.aspect>1?.46:.86;
    dist=(PW/frac)/camera.aspect/(2*Math.tan(FOV*Math.PI/360));
    camera.updateProjectionMatrix();need();
  }
  function progress(){const r=section.getBoundingClientRect(),run=r.height-innerHeight;return run>0?Math.min(1,Math.max(0,-r.top/run)):0}
  function caption(i){
    if(i===front)return;front=i;const it=items[i];
    cap.classList.remove('on');
    cap.querySelector('b').textContent=it.name;cap.querySelector('span').textContent=it.alt;
    const a=cap.querySelector('a');a.href='#'+it.id;a.textContent='Go to the '+it.name+' tour';
    requestAnimationFrame(()=>cap.classList.add('on'));
  }

  const v=new THREE.Vector3();
  function frame(t){
    raf=0;if(!visible||document.hidden){last=0;return}
    const dt=last?Math.min(.05,(t-last)/1000):.016;last=t;
    const k=x=>1-Math.exp(-x*dt);
    let busy=false;

    /* scroll sets the base, dragging adds to it with inertia */
    if(!dragging){drag+=dragV*dt;dragV*=Math.exp(-4*dt);if(Math.abs(dragV)>.002)busy=true}
    /* each screen rests in front for part of the scroll before the helix turns on to the next */
    const x=progress()*(N-1),i0=Math.floor(x),fr=x-i0,s=Math.min(1,Math.max(0,(fr-.3)/.4));
    const base=Math.min(N-1,i0+s*s*(3-2*s));
    drag=Math.min(N-1-base+.35,Math.max(-base-.35,drag));
    const target=base+drag;
    f+=(target-f)*k(9);if(Math.abs(target-f)>1e-4)busy=true;
    const v0=(f-fPrev)/dt;fPrev=f;vel+=(Math.max(-3,Math.min(3,v0))-vel)*k(8);if(Math.abs(vel)>.003)busy=true;

    /* pointer parallax */
    par.x+=(parT.x-par.x)*k(6);par.y+=(parT.y-par.y)*k(6);if(par.distanceTo(parT)>1e-3)busy=true;

    group.rotation.y=-f*STEP;
    camera.position.set(par.x*.45,-f*DY+.12+par.y*.25,R+dist);
    camera.lookAt(0,-f*DY,0);
    group.updateMatrixWorld();camera.updateMatrixWorld();

    /* hover by raycast */
    let hit=null;
    if(!dragging&&ptr.x<2){ray.setFromCamera(ptr,camera);const hs=ray.intersectObjects(meshes,false);
      for(const h of hs){if(h.object.userData.u.uIn.value>.9){hit=h;break}}}
    const now=hit?hit.object:null;
    if(now!==hovered){hovered=now;canvas.style.cursor=hovered?'pointer':(dragging?'grabbing':'grab')}

    for(const m of meshes){
      const ud=m.userData,u=ud.u;
      if(entered){const p=Math.min(1,Math.max(0,(t-ud.inStart)/1200));const e=1-Math.pow(1-p,4);u.uIn.value=e;if(p<1)busy=true}
      ud.hover+=((m===hovered?1:0)-ud.hover)*k(5);if(Math.abs((m===hovered?1:0)-ud.hover)>.002)busy=true;
      u.uHover.value=ud.hover;
      if(m===hovered&&hit.uv)ud.mouseT.copy(hit.uv);
      ud.mouse.lerp(ud.mouseT,k(5));u.uMouse.value.copy(ud.mouse);
      if(ud.readyT){u.uReady.value+=(1-u.uReady.value)*k(6);if(u.uReady.value<.995)busy=true}
      u.uVel.value=vel;
      m.getWorldPosition(v);u.uFade.value=Math.min(1,Math.max(0,(v.z+R*.2)/(R*1.2)));
    }

    caption(Math.max(0,Math.min(N-1,Math.round(f))));
    renderer.render(scene,camera);
    if(busy)need();
  }
  function need(){if(!raf&&visible)raf=requestAnimationFrame(frame)}

  /* the entrance plays the first time the section comes into view */
  new IntersectionObserver(es=>{visible=es[0].isIntersecting;
    if(visible&&!entered){entered=true;const t0=performance.now();meshes.forEach((m,i)=>{m.userData.inStart=t0+Math.abs(i-Math.round(progress()*(N-1)))*60})}
    if(visible){last=0;need()}},{threshold:0}).observe(section);
  addEventListener('scroll',need,{passive:true});
  document.addEventListener('visibilitychange',need);
  new ResizeObserver(resize).observe(canvas);

  /* pointer: hover, parallax, drag to turn, click to visit */
  function setPtr(e){const r=canvas.getBoundingClientRect();ptr.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);parT.set(ptr.x,ptr.y)}
  canvas.addEventListener('pointermove',e=>{
    if(e.pointerType!=='touch')setPtr(e);
    if(dragging){const dx=e.clientX-lastX;lastX=e.clientX;moved+=Math.abs(dx);const s=-dx/(canvas.clientWidth*.32);drag+=s;dragV=s/.016*.6}
    need();
  });
  canvas.addEventListener('pointerleave',()=>{ptr.set(9,9);parT.set(0,0);need()});
  canvas.addEventListener('pointerdown',e=>{dragging=true;downX=lastX=e.clientX;moved=0;dragV=0;canvas.setPointerCapture(e.pointerId);canvas.style.cursor='grabbing'});
  canvas.addEventListener('pointerup',e=>{
    dragging=false;canvas.style.cursor=hovered?'pointer':'grab';
    if(moved<6){if(e.pointerType==='touch')setPtr(e);
      ray.setFromCamera(ptr,camera);const hs=ray.intersectObjects(meshes,false);
      if(hs.length){location.hash='#'+items[hs[0].object.userData.i].id}}
    if(e.pointerType==='touch'){ptr.set(9,9);parT.set(0,0)}
    need();
  });
  canvas.addEventListener('pointercancel',()=>{dragging=false;need()});

  /* the theme switch changes the page tokens; the scene follows */
  new MutationObserver(()=>{uBg.value.copy(tokenColor('--bg','#0a0a0a'));uLine.value.copy(tokenColor('--border-strong','#555'));need()}).observe(d,{attributes:true,attributeFilter:['class']});

  section.classList.add('gl');
  dispatchEvent(new Event('resize'));
  resize();need();
}
start();
