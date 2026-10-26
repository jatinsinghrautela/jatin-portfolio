import fs from 'node:fs';
import ts from 'typescript';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
const source=fs.readFileSync('server/portfolio-api.ts','utf8').replace("import {contentSchema,defaultContent} from '../lib/content-model';",'const contentSchema = {}; const defaultContent = {};');
const exported={};Function('exports',ts.transpile(source,{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}))(exported);
const sqlite=new DatabaseSync(':memory:');
sqlite.exec('CREATE TABLE owner_settings(id INTEGER PRIMARY KEY,password_hash TEXT NOT NULL,updated_at INTEGER NOT NULL); CREATE TABLE owner_sessions(token_hash TEXT PRIMARY KEY,expires_at INTEGER NOT NULL); CREATE TABLE request_limits(key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires_at INTEGER NOT NULL);');
const DB={prepare(sql){let values=[];return {bind(...args){values=args;return this},async first(){return sqlite.prepare(sql).get(...values)||null},async run(){const r=sqlite.prepare(sql).run(...values);return {meta:{changes:Number(r.changes)}}}}},async batch(statements){sqlite.exec('BEGIN');try{const results=[];for(const stmt of statements)results.push(await stmt.run());sqlite.exec('COMMIT');return results}catch(e){sqlite.exec('ROLLBACK');throw e}}};
const encoder=new TextEncoder(),initial='Initial test password only',next='Next test password only';
const salt=crypto.getRandomValues(new Uint8Array(16)),key=await crypto.subtle.importKey('raw',encoder.encode(initial),'PBKDF2',false,['deriveBits']);
const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt,iterations:100000},key,256);
const hex=v=>Buffer.from(v).toString('hex');
const env={DB,CMS_OWNER_USERNAME:'admin',CMS_PASSWORD_HASH:`pbkdf2$100000$${hex(salt)}$${hex(bits)}`};
let checks=0;
async function call(path,body,cookie='',origin='https://portfolio.example',expected=200){const r=await exported.portfolioApi(new Request('https://portfolio.example'+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',Cookie:cookie},body:JSON.stringify(body)}),env);assert.equal(r.status,expected,`${path}: ${await r.clone().text()}`);checks++;return r}
const sign=async(password,expected=200)=>{const r=await call('/api/cms/session',{username:'admin',password},'','https://portfolio.example',expected);return r.headers.get('Set-Cookie')?.split(';')[0]||''};
try{
 await call('/api/cms/password',{currentPassword:initial,newPassword:next},'','https://portfolio.example',401);
 const first=await sign(initial),second=await sign(initial);
 await call('/api/cms/password',{currentPassword:initial,newPassword:next},first,'https://untrusted.invalid',403);
 await call('/api/cms/password',{currentPassword:initial,newPassword:'short'},first,'https://portfolio.example',400);
 await call('/api/cms/password',{currentPassword:'wrong',newPassword:next},first,'https://portfolio.example',400);
 await call('/api/cms/password',{currentPassword:initial,newPassword:initial},first,'https://portfolio.example',400);
 const changed=await call('/api/cms/password',{currentPassword:initial,newPassword:next},first);
 assert.match(changed.headers.get('Set-Cookie'),/Max-Age=0/);
 assert.equal(sqlite.prepare('SELECT count(*) AS n FROM owner_sessions').get().n,0);
 const hash=sqlite.prepare('SELECT password_hash FROM owner_settings').get().password_hash;
 assert.notEqual(hash,env.CMS_PASSWORD_HASH);assert.ok(!hash.includes(next));assert.match(hash,/^pbkdf2\$100000\$/);
 await call('/api/cms/password',{currentPassword:next,newPassword:initial},second,'https://portfolio.example',401);
 await sign(initial,401);const fresh=await sign(next);assert.ok(fresh);
 // Reset only the isolated test counter so the reverse rotation can be verified.
 sqlite.exec('DELETE FROM request_limits');
 await call('/api/cms/password',{currentPassword:next,newPassword:initial},fresh);
 const finalCookie=await sign(initial);
 for(let i=0;i<4;i++)await call('/api/cms/password',{currentPassword:'wrong',newPassword:next},finalCookie,'https://portfolio.example',400);
 await call('/api/cms/password',{currentPassword:'wrong',newPassword:next},finalCookie,'https://portfolio.example',429);
 console.log(`${checks} isolated password/auth checks passed: current-password validation, length, origin, persistent hash override, old-key rejection, all-session revocation, and repeat rotation. No local owner credentials changed.`);
}finally{sqlite.close()}
