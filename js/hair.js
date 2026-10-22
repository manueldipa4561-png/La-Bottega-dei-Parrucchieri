/* Capelli in bronzo, in 3D: una superficie ondulata fatta di fibre, illuminata come seta.
   Un solo shader a tutto schermo (niente librerie). Ogni <canvas class="hair"> lo usa;
   data-scroll="#id" lega il movimento allo scroll di quella sezione (la home).
   Telefono: meno pixel. Fuori schermo: fermo. Movimento ridotto: un solo fotogramma. */
(()=>{
const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch=matchMedia('(hover: none), (pointer: coarse)').matches;
const DPR=Math.min(devicePixelRatio||1,touch?1.25:1.6);

const VS='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
const FS=`precision highp float;
uniform vec2 uR,uM;uniform float uT,uP;
float H(vec2 p,float t){
  return sin(p.x*1.5+t+sin(p.y*1.2-t*.6)*1.3)*.5
        +sin(p.x*2.9-p.y*.9+t*1.2)*.17
        +sin(p.y*2.1+p.x*.6-t*.9)*.24;
}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uR)/uR.y;
  float t=uT*.18+uP*3.2;
  float a=-.62+uP*.9+uM.x*.06;
  uv=mat2(cos(a),-sin(a),sin(a),cos(a))*uv*(1.55-uP*.35)+uM*.06;
  float e=.004,h=H(uv,t);
  vec2 g=vec2(H(uv+vec2(e,0.),t)-h,H(uv+vec2(0.,e),t)-h)/e;
  vec3 n=normalize(vec3(-g*.55,1.));
  /* fibre: seguono la superficie; ogni ciocca ha la sua luce (rumore per ciocca), niente righe regolari */
  float f=uv.y+h*.55;
  float px=uR.y/(1.55-uP*.35);
  float k=f*px*.06+sin(uv.x*2.3+t*.4)*.9;
  float id=floor(k),fr=fract(k);
  float r1=fract(sin(id*91.7)*43758.5),r2=fract(sin((id+1.)*91.7)*43758.5);
  float lock=mix(r1,r2,smoothstep(0.,1.,fr));
  float fib=.55+.45*lock;
  fib*=.8+.2*sin(f*px*.42+lock*6.28+sin(uv.x*5.)*1.5);
  fib*=.9+.1*sin(f*px*.9+uv.x*11.);
  /* luce: diffusa morbida e due riflessi stretti, come una ciocca lucida */
  vec3 L=normalize(vec3(-.35+uM.x*.4,.55+uM.y*.3,.75));
  vec3 Hv=normalize(L+vec3(0.,0.,1.));
  float d=max(dot(n,L),0.),s=max(dot(n,Hv),0.);
  float spec=pow(s,48.)*1.1+pow(s,7.)*.38;
  vec3 deep=vec3(.08,.05,.03),bronze=vec3(.6,.4,.22),caramel=vec3(.8,.53,.27),gold=vec3(1.,.83,.56);
  vec3 base=mix(bronze,caramel,smoothstep(-.4,.6,h)*(.4+uP*.6));
  vec3 c=mix(deep,base,.28+.72*d)*fib+gold*spec*(.45+.55*lock);
  /* profondità: bordi che sfumano nel marrone del palco */
  float v=smoothstep(1.35,.15,length((gl_FragCoord.xy-.5*uR)/uR.y*vec2(.75,1.)));
  c=mix(vec3(.10,.07,.052),c,v);
  gl_FragColor=vec4(c,1.);
}`;

const scenes=[];
const mouse={x:0,y:0,tx:0,ty:0};
if(!touch)addEventListener('pointermove',e=>{mouse.tx=e.clientX/innerWidth-.5;mouse.ty=.5-e.clientY/innerHeight},{passive:true});

function init(cv){
  const gl=cv.getContext('webgl',{antialias:false,alpha:false,powerPreference:touch?'low-power':'high-performance'});
  if(!gl){cv.classList.add('nogl');return}
  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(o));return o};
  const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,VS));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,FS));gl.linkProgram(p);gl.useProgram(p);
  gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(p,'a');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const U={R:gl.getUniformLocation(p,'uR'),M:gl.getUniformLocation(p,'uM'),T:gl.getUniformLocation(p,'uT'),P:gl.getUniformLocation(p,'uP')};
  const track=cv.dataset.scroll?document.querySelector(cv.dataset.scroll):null;
  const s={cv,gl,U,track,vis:true,p:0,w:0,h:0};
  new IntersectionObserver(([e])=>{s.vis=e.isIntersecting;kick()}).observe(cv);
  scenes.push(s);cv.classList.add('on');
}

/* progresso dello scroll di una sezione alta: 0 in cima, 1 alla fine */
const prog=el=>{const r=el.getBoundingClientRect(),d=r.height-innerHeight;return d>0?Math.min(1,Math.max(0,-r.top/d)):0};

let raf=0,t0=performance.now();
function draw(now){
  raf=0;
  mouse.x+=(mouse.tx-mouse.x)*.05;mouse.y+=(mouse.ty-mouse.y)*.05;
  let any=false;
  for(const s of scenes){
    if(!s.vis)continue;any=true;
    const w=Math.round(s.cv.clientWidth*DPR),h=Math.round(s.cv.clientHeight*DPR);
    if(w!==s.w||h!==s.h){s.cv.width=s.w=w;s.cv.height=s.h=h;s.gl.viewport(0,0,w,h)}
    const target=s.track?prog(s.track):0;s.p+=(target-s.p)*.12;
    s.gl.uniform2f(s.U.R,w,h);s.gl.uniform2f(s.U.M,mouse.x,mouse.y);
    s.gl.uniform1f(s.U.T,still?8:(now-t0)/1000);s.gl.uniform1f(s.U.P,s.p);
    s.gl.drawArrays(s.gl.TRIANGLES,0,3);
  }
  if(any&&!still)raf=requestAnimationFrame(draw);
}
function kick(){if(!raf)raf=requestAnimationFrame(draw)}
document.querySelectorAll('canvas.hair').forEach(cv=>{try{init(cv)}catch(e){cv.classList.add('nogl');console.warn('hair:',e.message)}});
addEventListener('resize',kick,{passive:true});addEventListener('scroll',kick,{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)kick()});
kick();
})();
