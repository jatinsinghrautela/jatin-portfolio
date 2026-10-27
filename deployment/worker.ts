import {portfolioApi} from '../server/portfolio-api';
export default {async fetch(request:Request,env:Cloudflare.Env,ctx:ExecutionContext){
 const url=new URL(request.url);if(/^\/(?:hq|cms|control-room)(?:\/|$)/.test(url.pathname))return new Response('Not found',{status:404});
 if(!url.pathname.startsWith('/api/'))return env.ASSETS!.fetch(request);
 const cacheable=!request.headers.get('Cookie')?.includes('portfolio_owner=')&&request.method==='GET'&&(url.pathname==='/api/content'||url.pathname.startsWith('/api/assets/'));
 const key=new Request(url.origin+url.pathname);const cache=(caches as unknown as {default:Cache}).default;
 if(cacheable){const cached=await cache.match(key);if(cached)return cached}
 const response=await portfolioApi(request,env);if(!response)return Response.json({error:'Not found.'},{status:404});
 if(request.method==='PUT'&&url.pathname==='/api/cms/content'&&response.ok)ctx.waitUntil(cache.delete(new Request(url.origin+'/api/content')));
 if(cacheable&&response.ok){const copy=new Response(response.body,response);copy.headers.set('Cache-Control',url.pathname==='/api/content'?'public, max-age=30':'public, max-age=31536000, immutable');copy.headers.delete('Set-Cookie');ctx.waitUntil(cache.put(key,copy.clone()));return copy}return response;
}};
