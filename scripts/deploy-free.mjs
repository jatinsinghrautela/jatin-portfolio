import fs from 'node:fs';import {spawnSync} from 'node:child_process';import {config,verifyFreeAccount} from './cloudflare-account.mjs';
try{
 if(config.name!=='jatin-portfolio'||config.r2_buckets?.length||config.d1_databases?.length!==1||config.d1_databases[0].database_id.startsWith('00000000')||config.vars.REQUIRE_TURNSTILE!=='true'||config.vars.MEDIA_STORE!=='d1'||!config.vars.TURNSTILE_SITE_KEY||config.routes?.[0]?.pattern!=='jatinsinghrautela.com')throw Error('The free-only deployment configuration is incomplete or changed.');
 if(!fs.existsSync('dist/free/client/index.html'))throw Error('Run npm run build:free first.');
 await verifyFreeAccount();
 const checkOnly=process.argv.includes('--check');
 const list=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','secret','list','--config','wrangler.free.jsonc','--env',''],{encoding:'utf8',env:{...process.env,WRANGLER_SEND_METRICS:'false'},maxBuffer:1024*1024});if(list.status!==0)throw Error('Create the Worker and configure its production secrets first. See FREE_DEPLOYMENT.md.');
 let secrets;try{secrets=JSON.parse(list.stdout)}catch{throw Error('Could not verify production secrets. Deployment blocked.')}
 for(const name of ['CMS_PASSWORD_HASH','RESEND_API_KEY','TURNSTILE_SECRET_KEY'])if(!secrets.some(s=>s.name===name))throw Error(`Missing Worker secret ${name}. Deployment blocked.`);
 if(checkOnly){console.log('Free-only deployment configuration, account confirmation, and required secrets passed. Nothing deployed.');}else{const migration=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','d1','migrations','apply','DB','--config','wrangler.free.jsonc','--env','','--remote'],{stdio:'inherit',env:{...process.env,WRANGLER_SEND_METRICS:'false'}});if(migration.status!==0)throw Error('Database migration failed. Deployment stopped.');const result=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','deploy','--config','wrangler.free.jsonc','--env',''],{stdio:'inherit',env:{...process.env,WRANGLER_SEND_METRICS:'false'}});process.exitCode=result.status??1;}
}catch(e){console.error(e.message);process.exitCode=1}
