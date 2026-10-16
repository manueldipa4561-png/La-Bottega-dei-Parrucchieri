/* La F del logo in oro: mesh 3D estrusa dal logo (js/logo-mesh.bin), gira senza mai fermarsi.
   Canvas trasparente: niente riquadro dietro. Se WebGL non c'e, resta la versione CSS (#ls). */
(()=>{
  const cv=document.getElementById('gl'),root=document.documentElement,fail=()=>root.classList.add('gl-fail'); /* gl-fail: mostra la versione CSS */
  if(!cv||matchMedia('(prefers-reduced-motion: reduce)').matches){fail();return}
  const gl=cv.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:true,powerPreference:matchMedia('(pointer: coarse)').matches?'default':'high-performance'});
  if(!gl){fail();return}
  const SPIN=.7,CAMZ=6.2,TF=1/Math.tan(17.5*Math.PI/180); /* rad/s: un giro ogni ~9 s, costante */

  const mul=(a,b)=>{const o=new Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+r]*b[c*4+k];o[c*4+r]=s}return o};
  const RX=a=>{const c=Math.cos(a),s=Math.sin(a);return[1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]};
  const RY=a=>{const c=Math.cos(a),s=Math.sin(a);return[c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]};
  const persp=a=>{const n=.1,f=40;return[TF/a,0,0,0,0,TF,0,0,0,0,(f+n)/(n-f),-1,0,0,2*f*n/(n-f),0]};
  const trans=(x,y,z)=>[1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1];

  const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o};
  const prog=gl.createProgram();
  gl.attachShader(prog,sh(gl.VERTEX_SHADER,`
attribute vec3 p,n;attribute vec2 t;uniform mat4 uPV,uM;varying vec3 vN,vW;varying vec2 vT;varying float vF;
void main(){vec4 w=uM*vec4(p,1.);vW=w.xyz;vN=(uM*vec4(n,0.)).xyz;vT=t;vF=abs(n.z)>.5?(n.z>0.?1.:-1.):0.;gl_Position=uPV*w;}`));
  gl.attachShader(prog,sh(gl.FRAGMENT_SHADER,`
precision mediump float;varying vec3 vN,vW;varying vec2 vT;varying float vF;uniform sampler2D uH;uniform mat4 uR;
float h(vec2 u){return texture2D(uH,u).r;}
vec3 env(vec3 r){float y=r.y;
 vec3 c=mix(vec3(.07,.045,.02),vec3(.62,.46,.2),smoothstep(-.7,.65,y));
 c+=vec3(1.,.86,.55)*smoothstep(.35,.5,y)*(1.-smoothstep(.62,.8,y))*1.5;
 c+=vec3(1.,.9,.65)*pow(max(0.,1.-abs(r.x+.5)*3.2),3.)*smoothstep(-.4,.2,y)*1.2;
 c+=vec3(1.,.95,.8)*pow(max(0.,1.-abs(r.x-.65)*6.),4.)*.8;
 c+=vec3(.55,.12,.1)*smoothstep(-.5,-.35,y)*(1.-smoothstep(-.3,-.15,y))*.8;
 return c;}
void main(){
 vec3 N=normalize(vN);
 if(abs(vF)>.5){
  vec2 e=vec2(1./700.,1./430.)*1.5;
  float gx=h(vT+vec2(e.x,0.))-h(vT-vec2(e.x,0.)),gy=h(vT+vec2(0.,e.y))-h(vT-vec2(0.,e.y));
  vec3 nm=normalize(vec3(-gx*5.,gy*5.,vF));
  N=normalize((uR*vec4(nm,0.)).xyz);
 }
 vec3 V=normalize(vec3(0.,0.,${CAMZ.toFixed(1)})-vW);if(dot(N,V)<0.)N=-N;
 vec3 R=reflect(-V,N);
 float fr=pow(1.-max(dot(N,V),0.),3.);
 vec3 c=env(R)*vec3(1.,.82,.45)*1.05+fr*vec3(1.,.8,.4)*.35;
 c+=pow(max(dot(R,normalize(vec3(.35,.55,.75))),0.),70.)*vec3(1.,.95,.8)*1.3;
 gl_FragColor=vec4(pow(c,vec3(.92)),1.);
}`));
  gl.linkProgram(prog);
  if(!gl.getProgramParameter(prog,gl.LINK_STATUS)){console.error('logo3d shader',gl.getProgramInfoLog(prog));fail();return}

  let ready=false,nIdx=0,A=1,PV=null,vis=true,raf=0;
  const U=n=>gl.getUniformLocation(prog,n),uPV=U('uPV'),uM=U('uM'),uR=U('uR'),uH=U('uH');
  const aP=gl.getAttribLocation(prog,'p'),aN=gl.getAttribLocation(prog,'n'),aT=gl.getAttribLocation(prog,'t');

  const resize=()=>{const d=Math.min(devicePixelRatio||1,matchMedia('(pointer: coarse)').matches?1.5:2),w=cv.clientWidth,h=Math.max(cv.clientHeight,1);
    cv.width=Math.round(w*d);cv.height=Math.round(h*d);gl.viewport(0,0,cv.width,cv.height);
    A=w/h;PV=mul(persp(A),trans(0,0,-CAMZ))};

  const draw=time=>{
    raf=0;if(!ready||!vis||document.hidden)return;
    const t=time*.001;
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    const M=mul(RX(-.14+Math.sin(t*.4)*.04),RY(t*SPIN));
    gl.uniformMatrix4fv(uPV,false,PV);gl.uniformMatrix4fv(uM,false,M);gl.uniformMatrix4fv(uR,false,M);
    gl.drawElements(gl.TRIANGLES,nIdx,gl.UNSIGNED_SHORT,0);
    raf=requestAnimationFrame(draw);
  };

  Promise.all([
    fetch('js/logo-mesh.bin').then(r=>r.arrayBuffer()),
    new Promise((ok,ko)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=ko;i.src='img/f-height.png'})
  ]).then(([buf,img])=>{
    const [nv,ni]=new Uint32Array(buf,0,2),vOff=8,iOff=vOff+nv*32;
    const verts=new Float32Array(buf,vOff,nv*8),idx=new Uint16Array(buf,iOff,ni);
    const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,verts,gl.STATIC_DRAW);
    const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,idx,gl.STATIC_DRAW);
    const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.LUMINANCE,gl.LUMINANCE,gl.UNSIGNED_BYTE,img);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    nIdx=ni;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER,vb);
    gl.enableVertexAttribArray(aP);gl.vertexAttribPointer(aP,3,gl.FLOAT,false,32,0);
    gl.enableVertexAttribArray(aN);gl.vertexAttribPointer(aN,3,gl.FLOAT,false,32,12);
    gl.enableVertexAttribArray(aT);gl.vertexAttribPointer(aT,2,gl.FLOAT,false,32,24);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);
    gl.uniform1i(uH,0);
    document.documentElement.classList.add('gl3d'); /* il canvas diventa visibile: solo ora ha una misura */
    resize();addEventListener('resize',resize,{passive:true});
    gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);
    ready=true;
    new IntersectionObserver(([e])=>{vis=e.isIntersecting;if(vis&&!raf)raf=requestAnimationFrame(draw)}).observe(cv);
    draw(performance.now()); /* primo frame subito: niente buco quando si nasconde la versione CSS */
  }).catch(e=>{console.error('logo3d',e);fail()});

  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!raf&&ready&&vis)raf=requestAnimationFrame(draw)});
  cv.addEventListener('webglcontextlost',e=>{e.preventDefault();ready=false;root.classList.remove('gl3d');fail()});
})();
