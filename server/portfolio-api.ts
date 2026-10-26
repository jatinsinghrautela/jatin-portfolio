import {contentSchema,defaultContent} from '../lib/content-model';
const encoder=new TextEncoder();
const cookieName='portfolio_owner';
const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
export const json=(value:unknown,status=200,extra:HeadersInit={})=>Response.json(value,{status,headers:{...headers,...extra}});
const digest=async(value:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value)))).map(v=>v.toString(16).padStart(2,'0')).join('');
function sameOrigin(request:Request){return request.headers.get('Origin')===new URL(request.url).origin}
async function readJson(request:Request){if(!request.headers.get('Content-Type')?.startsWith('application/json'))throw new Error('Expected JSON');const text=await request.text();if(text.length>600000)throw new Error('Request too large');return JSON.parse(text)}
async function limit(env:Cloudflare.Env,request:Request,kind:string,max:number,seconds:number){if(!env.DB)return false;const ip=request.headers.get('CF-Connecting-IP')||'local';const key=await digest(`${env.CMS_PASSWORD_HASH||'portfolio'}:${kind}:${ip}`);const now=Date.now();await env.DB.prepare('DELETE FROM request_limits WHERE expires_at < ?').bind(now).run();const row=await env.DB.prepare('INSERT INTO request_limits (key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key,now+seconds*1000).first<{count:number}>();return !!row&&row.count<=max}
async function authenticated(request:Request,env:Cloudflare.Env){if(!env.DB||!env.CMS_PASSWORD_HASH)return false;const token=request.headers.get('Cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName+'='))?.slice(cookieName.length+1);if(!token||!/^[a-f0-9]{64}$/.test(token))return false;const row=await env.DB.prepare('SELECT expires_at FROM owner_sessions WHERE token_hash=?').bind(await digest(`${env.CMS_PASSWORD_HASH}:${token}`)).first<{expires_at:number}>();return !!row&&row.expires_at>Date.now()}
async function passwordMatches(password:string,hash:string){const[algorithm,rounds,saltHex,expected]=hash.split('$');if(algorithm!=='pbkdf2'||rounds!=='100000'||!saltHex||!expected)return false;const salt=Uint8Array.from(saltHex.match(/../g)||[],h=>parseInt(h,16));const key=await crypto.subtle.importKey('raw',encoder.encode(password),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations:100000},key,256);const actual=Array.from(new Uint8Array(bits)).map(v=>v.toString(16).padStart(2,'0')).join('');let difference=actual.length^expected.length;for(let i=0;i<actual.length;i++)difference|=actual.charCodeAt(i)^(expected.charCodeAt(i)||0);return difference===0}
const cookie=(request:Request,value:string,age:number)=>`${cookieName}=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${age}${new URL(request.url).protocol==='https:'?'; Secure':''}`;
async function readContent(env:Cloudflare.Env){const row=await env.DB?.prepare('SELECT version,body FROM published_content WHERE id=1').first<{version:number;body:string}>();return {version:row?.version||0,content:row?contentSchema.parse(JSON.parse(row.body)):defaultContent}}
export async function portfolioApi(request:Request,env:Cloudflare.Env):Promise<Response|null>{const url=new URL(request.url),path=url.pathname;if(!path.startsWith('/api/'))return null;
 try{
 if(path==='/api/content'&&request.method==='GET')return json(await readContent(env));
 if(path==='/api/contact'&&request.method==='POST'){
  if(!sameOrigin(request))return json({error:'Request origin is not allowed.'},403);
  if(!env.RESEND_API_KEY||!env.CONTACT_FROM||!env.CONTACT_TO)return json({error:'Message delivery is temporarily unavailable. Please try again later or use the social links to get in touch.'},503);
  if(!await limit(env,request,'contact',5,3600))return json({error:'Too many messages. Please try again later.'},429);
  const body=await readJson(request);const name=typeof body.name==='string'?body.name.trim():'',email=typeof body.email==='string'?body.email.trim():'',message=typeof body.message==='string'?body.message.trim():'';
  if(body.website)return json({error:'Unable to submit this message.'},400);
  if(name.length<1||name.length>120||/[\r\n]/.test(name)||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>254||message.length<10||message.length>4000||typeof body.startedAt!=='number'||Date.now()-body.startedAt<1500||Date.now()-body.startedAt>86400000||typeof body.requestId!=='string'||!/^[a-f0-9-]{36}$/.test(body.requestId))return json({error:'Please check your name, email, and message, then try again.'},400);
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`contact/${body.requestId}`},body:JSON.stringify({from:env.CONTACT_FROM,to:[env.CONTACT_TO],reply_to:email,subject:`Portfolio enquiry from ${name}`,text:`Name: ${name}\nEmail: ${email}\n\n${message}`}),signal:AbortSignal.timeout(10000)});const result=await response.json() as {id?:string};if(!response.ok||!result.id)return json({error:'The message could not be delivered right now. Please try again later.'},502);return json({sent:true});
 }
 if(path==='/api/cms/session'){
  if(request.method==='GET')return json({authenticated:await authenticated(request,env),configured:!!(env.DB&&env.CMS_OWNER_USERNAME&&env.CMS_PASSWORD_HASH)});
  if(!sameOrigin(request))return json({error:'Request origin is not allowed.'},403);
  if(request.method==='DELETE'){const token=request.headers.get('Cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName+'='))?.slice(cookieName.length+1);if(token&&env.DB)await env.DB.prepare('DELETE FROM owner_sessions WHERE token_hash=?').bind(await digest(`${env.CMS_PASSWORD_HASH}:${token}`)).run();return json({ok:true},200,{'Set-Cookie':cookie(request,'',0)})}
  if(request.method==='POST'){
   if(!env.DB||!env.CMS_PASSWORD_HASH||!env.CMS_OWNER_USERNAME)return json({error:'Owner login needs server configuration. See CMS_SETUP.md.'},503);
   if(!await limit(env,request,'login',5,900))return json({error:'Too many sign-in attempts. Try again in 15 minutes.'},429);
   const body=await readJson(request);if(typeof body.username!=='string'||typeof body.password!=='string'||body.password.length>256||body.username.length>64)return json({error:'Invalid username or password.'},401);
   const valid=await passwordMatches(body.password,env.CMS_PASSWORD_HASH);if(body.username.toLowerCase()!==env.CMS_OWNER_USERNAME.toLowerCase()||!valid)return json({error:'Invalid username or password.'},401);
   const token=Array.from(crypto.getRandomValues(new Uint8Array(32))).map(v=>v.toString(16).padStart(2,'0')).join('');await env.DB.prepare('DELETE FROM owner_sessions WHERE expires_at < ?').bind(Date.now()).run();await env.DB.prepare('INSERT INTO owner_sessions (token_hash,expires_at) VALUES (?,?)').bind(await digest(`${env.CMS_PASSWORD_HASH}:${token}`),Date.now()+28800000).run();return json({authenticated:true},200,{'Set-Cookie':cookie(request,token,28800)});
  }
 }
 if(path.startsWith('/api/cms/')){
  if(!await authenticated(request,env))return json({error:'Please sign in as the owner.'},401);
  if(request.method!=='GET'&&!sameOrigin(request))return json({error:'Request origin is not allowed.'},403);
  const db=env.DB!;
  if(path==='/api/cms/content'){
   if(request.method==='GET')return json(await readContent(env));
   if(request.method==='PUT'){
    const body=await readJson(request);const parsed=contentSchema.safeParse(body.content);if(!parsed.success)return json({error:'Check the highlighted content structure.',issues:parsed.error.issues.slice(0,20).map(v=>`${v.path.join('.')}: ${v.message}`)},400);if(!Number.isInteger(body.version)||body.version<0)return json({error:'Invalid revision.'},400);
    const old=await readContent(env);if(old.version!==body.version)return json({error:'The content changed in another session. Reload before publishing.'},409);
    const now=Date.now(),encoded=JSON.stringify(parsed.data);let changed=0;
    if(old.version===0){const result=await db.prepare('INSERT OR IGNORE INTO published_content (id,version,body,updated_at) VALUES (1,1,?,?)').bind(encoded,now).run();changed=result.meta.changes}
    else{const results=await db.batch([db.prepare('INSERT OR IGNORE INTO content_revisions (version,body,created_at) SELECT version,body,? FROM published_content WHERE id=1 AND version=?').bind(now,old.version),db.prepare('UPDATE published_content SET version=version+1,body=?,updated_at=? WHERE id=1 AND version=?').bind(encoded,now,old.version)]);changed=results[1].meta.changes}
    if(!changed)return json({error:'Another edit was published. Reload before publishing.'},409);await db.prepare('DELETE FROM content_revisions WHERE version NOT IN (SELECT version FROM content_revisions ORDER BY version DESC LIMIT 20)').run();return json({version:old.version+1,content:parsed.data});
   }
  }
  if(path==='/api/cms/revisions'&&request.method==='GET'){const version=url.searchParams.get('version');if(version){const row=await db.prepare('SELECT version,body FROM content_revisions WHERE version=?').bind(Number(version)).first<{version:number;body:string}>();return row?json({version:row.version,content:JSON.parse(row.body)}):json({error:'Revision not found.'},404)}return json({revisions:(await db.prepare('SELECT version,created_at FROM content_revisions ORDER BY version DESC LIMIT 20').all()).results})}
  if(path==='/api/cms/assets'){
   if(!env.BUCKET)return json({error:'Media storage is not configured.'},503);
   if(request.method==='GET'){const list=await env.BUCKET.list({limit:100,...(url.searchParams.get('cursor')?{cursor:url.searchParams.get('cursor')!}:{})});return json({assets:list.objects.map(o=>({url:`/api/assets/${o.key}`,size:o.size})),cursor:list.truncated?list.cursor:undefined})}
   if(request.method==='DELETE'){const key=url.searchParams.get('key')||'';if(!/^[a-f0-9-]{36}\.(png|jpg|webp|pdf)$/.test(key))return json({error:'Invalid asset.'},400);const current=await readContent(env);if(JSON.stringify(current.content).includes(`/api/assets/${key}`)||await db.prepare('SELECT version FROM content_revisions WHERE instr(body,?)>0 LIMIT 1').bind(`/api/assets/${key}`).first())return json({error:'This asset is used by published content or a retained revision.'},409);await env.BUCKET.delete(key);return json({deleted:true})}
   if(request.method==='POST'){
    if(Number(request.headers.get('Content-Length'))>6500000)return json({error:'Choose a file smaller than 6 MB.'},413);
    const form=await request.formData();const file=form.get('file');if(!(file instanceof File)||file.size>6000000)return json({error:'Choose an image or PDF smaller than 6 MB.'},400);
    const data=await file.arrayBuffer(),bytes=new Uint8Array(data);let ext='',type='';if(bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71){ext='png';type='image/png'}else if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255){ext='jpg';type='image/jpeg'}else if(new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP'){ext='webp';type='image/webp'}else if(new TextDecoder().decode(bytes.slice(0,5))==='%PDF-'){ext='pdf';type='application/pdf'}else return json({error:'Only PNG, JPEG, WebP, and PDF files are supported.'},400);
    const key=`${crypto.randomUUID()}.${ext}`;await env.BUCKET.put(key,data,{httpMetadata:{contentType:type}});return json({url:`/api/assets/${key}`});
   }
  }
 }
 if(path.startsWith('/api/assets/')&&request.method==='GET'){const key=path.slice('/api/assets/'.length);if(!/^[a-f0-9-]{36}\.(png|jpg|webp|pdf)$/.test(key)||!env.BUCKET)return json({error:'Not found.'},404);const object=await env.BUCKET.get(key);if(!object)return json({error:'Not found.'},404);return new Response(object.body,{headers:{'Content-Type':object.httpMetadata?.contentType||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=31536000, immutable',...(key.endsWith('.pdf')?{'Content-Disposition':'attachment; filename="resume.pdf"'}:{})}})}
 return null;
 }catch{return json({error:'The service is temporarily unavailable. Please try again shortly.'},503)}
}
