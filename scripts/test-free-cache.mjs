import fs from 'node:fs';import ts from 'typescript';import assert from 'node:assert/strict';
const exported={};let version=1,reads=0,clock=0;const pending=[];
const portfolioApi=async request=>{const path=new URL(request.url).pathname;if(path==='/api/cms/content'&&request.method==='PUT'){version++;return Response.json({version})}if(path==='/api/content'){reads++;return Response.json({version})}return null};
Function('exports','require',ts.transpile(fs.readFileSync('deployment/worker.ts','utf8'),{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}))(exported,()=>({portfolioApi}));
const entries=new Map(),prior=Object.getOwnPropertyDescriptor(globalThis,'caches');
Object.defineProperty(globalThis,'caches',{configurable:true,value:{default:{async match(key){const entry=entries.get(key.url);return entry&&entry.expires>clock?entry.response.clone():undefined},async put(key,response){const seconds=Number(response.headers.get('Cache-Control').match(/max-age=(\d+)/)[1]);entries.set(key.url,{response:response.clone(),expires:clock+seconds*1000})},async delete(key){return entries.delete(key.url)}}}});
const ctx={waitUntil(p){pending.push(p)}},env={ASSETS:{fetch:async()=>new Response('Static page')}};
async function call(path,method='GET',headers={}){const response=await exported.default.fetch(new Request('https://jatinsinghrautela.com'+path,{method,headers}),env,ctx);await Promise.all(pending.splice(0));return response}
try{
 assert.equal(await(await call('/')).text(),'Static page');assert.equal(reads,0);
 assert.equal((await(await call('/api/content')).json()).version,1);assert.equal(reads,1);
 version=2;assert.equal((await(await call('/api/content')).json()).version,1);assert.equal(reads,1);
 assert.equal((await(await call('/api/content','GET',{Cookie:'portfolio_owner=owner'})).json()).version,2);assert.equal(reads,2);
 clock+=31000;assert.equal((await(await call('/api/content')).json()).version,2);assert.equal(reads,3);
 await call('/api/cms/content','PUT');assert.equal((await(await call('/api/content')).json()).version,3);assert.equal(reads,4);
 for(const path of ['/hq','/cms','/control-room'])assert.equal((await call(path)).status,404);
 assert.equal((await call('/api/unknown')).status,404);
 console.log('Static Worker cache checks passed: no public-page API read, 30-second content refresh, owner bypass, publish invalidation, retired URLs and unknown API 404s. No network requests.');
}finally{if(prior)Object.defineProperty(globalThis,'caches',prior);else delete globalThis.caches}
