const $=s=>document.querySelector(s),
esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),
safeUrl=u=>/^(https?:\/\/|data:image\/|mailto:)/i.test(u||"")?u:"#";
const C=window.CONTENT||{};C.leaders=C.leaders||[];C.rules=C.rules||[];C.socials=C.socials||[];
const S={lang:"ar",theme:"dark"};
try{S.lang=localStorage.getItem("lang")||"ar";S.theme=localStorage.getItem("theme")||"dark"}catch(e){}
const sv=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const pick=(o,k)=>o[k+"_"+S.lang]||o[k+"_ar"]||o[k+"_en"]||"";
const name=()=>C.name||"Ｒｅｓｐｅｃｔ";
function applyTheme(){
 const d=document.documentElement,u=safeUrl(C.bg);
 d.lang=S.lang;d.dir=S.lang=="ar"?"rtl":"ltr";d.dataset.theme=S.theme;
 d.style.setProperty("--bgimg",u!=="#"?`url("${u.replace(/["\\\n]/g,"")}")`:"none");
 if(/^#[0-9a-f]{3,8}$/i.test(C.color||""))d.style.setProperty("--r",C.color);
}
function particles(){
 const cv=$("#bg"),x=cv.getContext("2d");let W,H,P=[];const n=innerWidth<700?28:60;
 const rs=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight};rs();addEventListener("resize",rs);
 for(let i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,z:Math.random()*2+.4,v:Math.random()*.5+.15});
 (function f(){x.clearRect(0,0,W,H);for(const p of P){p.y-=p.v*p.z;if(p.y<0){p.y=H;p.x=Math.random()*W}x.fillStyle="rgba(225,29,46,"+(.25+p.z*.2)+")";x.beginPath();x.arc(p.x,p.y,p.z*1.3,0,7);x.fill()}requestAnimationFrame(f)})();
}
async function loadRemote(){
 try{const r=await fetch("/api/site",{cache:"no-store"});if(!r.ok)return false;const j=await r.json();if(!j.content)return false;
  Object.assign(C,j.content);C.leaders=C.leaders||[];C.rules=C.rules||[];C.socials=C.socials||[];return true}catch(e){return false}
}
