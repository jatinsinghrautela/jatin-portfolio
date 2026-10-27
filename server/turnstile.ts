export async function verifiedHuman(request:Request,env:Cloudflare.Env,token:unknown,action:'contact'|'login'){
 if(env.REQUIRE_TURNSTILE!=='true')return true;
 if(!env.TURNSTILE_SECRET_KEY||!env.TURNSTILE_SITE_KEY||typeof token!=='string'||!token||token.length>2048)return false;
 try{const body=new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:token});const ip=request.headers.get('CF-Connecting-IP');if(ip)body.set('remoteip',ip);
  const response=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body,signal:AbortSignal.timeout(8000)});
  const result=await response.json() as {success?:boolean;hostname?:string;action?:string};return response.ok&&result.success===true&&result.hostname===new URL(request.url).hostname&&result.action===action;
 }catch{return false}
}
