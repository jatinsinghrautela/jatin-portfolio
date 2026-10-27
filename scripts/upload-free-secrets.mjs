import fs from 'node:fs';import {spawnSync} from 'node:child_process';import {verifyFreeAccount} from './cloudflare-account.mjs';
try{
 await verifyFreeAccount();
 const target='outputs/production-owner-credentials.txt';
 if(!fs.existsSync(target)){const generated=spawnSync(process.execPath,['scripts/generate-owner-credentials.mjs'],{stdio:'inherit'});if(generated.status)throw Error('Production credential generation failed.')}
 const production=fs.readFileSync(target,'utf8'),local=fs.readFileSync('.dev.vars','utf8');
 const hash=production.match(/^CMS_PASSWORD_HASH=(.+)$/m)?.[1]?.trim();const key=local.match(/^RESEND_API_KEY=(.+)$/m)?.[1]?.trim().replace(/^["']|["']$/g,'');
 if(!hash?.startsWith('pbkdf2$100000$')||!key?.startsWith('re_'))throw Error('Production password hash or local Resend key is missing. No secrets uploaded.');
 const file='outputs/free-runtime-secrets.json';fs.writeFileSync(file,JSON.stringify({CMS_PASSWORD_HASH:hash,RESEND_API_KEY:key}),{mode:0o600});
 try{const result=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','secret','bulk',file,'--config','wrangler.free.jsonc','--env',''],{stdio:'inherit',env:{...process.env,WRANGLER_SEND_METRICS:'false'}});process.exitCode=result.status??1}finally{fs.unlinkSync(file)}
 console.log('The Turnstile secret must still be entered by the owner using wrangler secret put. Credentials were not printed.');
}catch(e){console.error(e.message);process.exitCode=1}
