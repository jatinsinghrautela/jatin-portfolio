import fs from 'node:fs';import ts from 'typescript';import assert from 'node:assert/strict';import {DatabaseSync} from 'node:sqlite';
function load(file,dependencies={}){const exported={};Function('exports','require',ts.transpile(fs.readFileSync(file,'utf8'),{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}))(exported,name=>{if(name in dependencies)return dependencies[name];throw Error('Unexpected test import: '+name)});return exported}
const {d1Media}=load('server/d1-media.ts'),{verifiedHuman}=load('server/turnstile.ts');
const db=new DatabaseSync(':memory:');for(const file of fs.readdirSync('drizzle').filter(f=>f.endsWith('.sql')).sort())db.exec(fs.readFileSync('drizzle/'+file,'utf8'));
const DB={prepare(sql){
 let args=[];const values=()=>args.map(a=>a instanceof ArrayBuffer?Buffer.from(a):a);
 return {bind(...v){args=v;return this},async first(){return db.prepare(sql).get(...values())||null},async all(){return {results:db.prepare(sql).all(...values())}},async run(){return {meta:{changes:Number(db.prepare(sql).run(...values()).changes)}}}};
}};

const env={DB,MEDIA_STORE:'d1'},origin='https://jatinsinghrautela.com';let checks=0;
async function media(method,path='/api/cms/assets',body){const r=await d1Media(new Request(origin+path,{method,body}),env);checks++;return r}
function file(data,name='image.png'){const form=new FormData();form.set('file',new File([data],name));return form}
try{
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aF1sAAAAASUVORK5CYII=','base64');
 const uploaded=await media('POST',undefined,file(png));assert.equal(uploaded.status,200);const asset=(await uploaded.json()).url;
 const image=await media('GET',asset);assert.equal(image.headers.get('Content-Type'),'image/png');assert.deepEqual(Buffer.from(await image.arrayBuffer()),png);
 assert.ok([400,413].includes((await media('POST',undefined,file(Buffer.alloc(1_000_001)))).status));
 assert.equal((await media('POST',undefined,file('<script>bad</script>'))).status,400);
 assert.equal((await media('GET','/api/cms/assets?cursor=invalid')).status,400);
 db.prepare('INSERT INTO published_content VALUES (1,1,?,0)').run(JSON.stringify({image:asset}));assert.equal((await media('DELETE','/api/cms/assets?key='+asset.split('/').pop())).status,409);
 db.exec('DELETE FROM published_content');db.prepare('INSERT INTO content_revisions VALUES (1,?,0)').run(JSON.stringify({image:asset}));assert.equal((await media('DELETE','/api/cms/assets?key='+asset.split('/').pop())).status,409);
 db.exec('DELETE FROM content_revisions');assert.equal((await media('DELETE','/api/cms/assets?key='+asset.split('/').pop())).status,200);assert.equal((await media('GET',asset)).status,404);
 // Stored size metadata exercises the atomic quota guard without allocating 50 MB in a test.
 db.prepare('INSERT INTO media_assets VALUES (?,?,?,?,0)').run('quota.webp','image/webp',50_000_000,Buffer.from('x'));assert.equal((await media('POST',undefined,file(png))).status,409);db.exec('DELETE FROM media_assets');
 for(let i=0;i<100;i++)db.prepare('INSERT INTO media_assets VALUES (?,?,?,?,0)').run(`item-${i}.webp`,'image/webp',1,Buffer.from('x'));
 assert.equal((await media('POST',undefined,file(png))).status,409);assert.equal((await(await media('GET')).json()).assets.length,50);
 const originalFetch=globalThis.fetch;let action='contact',hostname='jatinsinghrautela.com',accepted=true;
 globalThis.fetch=async()=>Response.json({success:accepted,action,hostname});
 const secure={REQUIRE_TURNSTILE:'true',TURNSTILE_SECRET_KEY:'mock-private-key',TURNSTILE_SITE_KEY:'mock-public-key'},request=new Request(origin+'/api/contact');
 try{assert.equal(await verifiedHuman(request,secure,'token','contact'),true);checks++;action='login';assert.equal(await verifiedHuman(request,secure,'token','contact'),false);checks++;action='contact';hostname='other.example';assert.equal(await verifiedHuman(request,secure,'token','contact'),false);checks++;hostname='jatinsinghrautela.com';accepted=false;assert.equal(await verifiedHuman(request,secure,'token','contact'),false);checks++;assert.equal(await verifiedHuman(request,secure,'','contact'),false);checks++;assert.equal(await verifiedHuman(request,{REQUIRE_TURNSTILE:'true'},'token','contact'),false);checks++;}finally{globalThis.fetch=originalFetch}
 const config=JSON.parse(fs.readFileSync('wrangler.free.jsonc','utf8'));assert.equal(config.vars.MEDIA_STORE,'d1');assert.equal(config.vars.REQUIRE_TURNSTILE,'true');assert.ok(!config.r2_buckets);assert.equal(config.workers_dev,false);assert.deepEqual(config.routes,[{pattern:'jatinsinghrautela.com',custom_domain:true}]);
 for(const p of ['index.html','projects/index.html','cockpit/index.html','projects/opsradar/index.html'])assert.match(fs.readFileSync('dist/free/client/'+p,'utf8'),/data-path=/);
 console.log(`${checks} free-deployment storage/security checks passed: upload bytes/signatures, used-media protection, atomic file/library caps, pagination, Turnstile hostname/action/failure checks, static output and no R2. No external requests or owner credential changes.`);
}finally{db.close()}
