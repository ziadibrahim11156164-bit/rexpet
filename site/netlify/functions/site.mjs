import {getStore} from "@netlify/blobs";
import {pbkdf2Sync,randomBytes,timingSafeEqual} from "node:crypto";
const J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{"content-type":"application/json","cache-control":"no-store"}});
const hash=(pw,salt)=>pbkdf2Sync(pw,salt,100000,32,"sha256").toString("hex");
const mk=p=>{const salt=randomBytes(16).toString("hex");return{salt,hash:hash(p,salt)}};
export default async (req)=>{
 const store=getStore({name:"respect",consistency:"strong"});
 const auth=await store.get("auth",{type:"json"});
 if(req.method==="GET"){const content=await store.get("content",{type:"json"});return J({content:content||null,hasPassword:!!auth})}
 if(req.method!=="POST")return J({error:"method"},405);
 let b;try{b=await req.json()}catch{return J({error:"bad"},400)}
 const pw=String(b.password||"");
 if(b.action==="setup"){if(auth)return J({error:"exists"},403);if(pw.length<6)return J({error:"short"},400);await store.setJSON("auth",mk(pw));return J({ok:true})}
 const ok=auth&&(()=>{const a=Buffer.from(hash(pw,auth.salt),"hex"),h=Buffer.from(auth.hash,"hex");return a.length===h.length&&timingSafeEqual(a,h)})();
 if(!ok){await new Promise(r=>setTimeout(r,800));return J({error:"wrong"},401)}
 if(b.action==="login")return J({ok:true});
 if(b.action==="save"){const s=JSON.stringify(b.content||{});if(s.length>4e6)return J({error:"big"},413);await store.set("content",s);return J({ok:true})}
 if(b.action==="chpw"){const n=String(b.newPassword||"");if(n.length<6)return J({error:"short"},400);await store.setJSON("auth",mk(n));return J({ok:true})}
 return J({error:"action"},400);
};
export const config={path:"/api/site"};
