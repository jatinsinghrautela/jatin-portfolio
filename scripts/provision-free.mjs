import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';import {config,verifyFreeAccount,cloudflareGet} from './cloudflare-account.mjs';
try{
 await verifyFreeAccount();
 const existing=await cloudflareGet(`/accounts/${config.account_id}/workers/scripts`);
 if(existing.some(w=>w.id===config.name))throw Error('The portfolio Worker already exists. This bootstrap will not overwrite it. Use the normal guarded deployment after setting secrets.');
 const bootstrap={...config,main:path.resolve(config.main),routes:[],workers_dev:false,preview_urls:false,assets:{...config.assets,directory:path.resolve(config.assets.directory)},d1_databases:config.d1_databases.map(d=>({...d,migrations_dir:path.resolve(d.migrations_dir)}))};delete bootstrap.env;delete bootstrap.$schema;
 fs.mkdirSync('outputs',{recursive:true});fs.writeFileSync('outputs/wrangler.bootstrap.json',JSON.stringify(bootstrap,null,2));
 const args=['node_modules/wrangler/bin/wrangler.js','deploy','--config','outputs/wrangler.bootstrap.json'];if(process.argv.includes('--dry-run'))args.push('--dry-run');
 const result=spawnSync(process.execPath,args,{stdio:'inherit',env:{...process.env,WRANGLER_SEND_METRICS:'false',WRANGLER_WRITE_LOGS:'false'}});process.exitCode=result.status??1;
 if(!result.status&&!process.argv.includes('--dry-run'))console.log('Private Worker prepared without a custom domain, workers.dev address, or preview URLs. No public website route has been enabled.');
}catch(e){console.error(e.message);process.exitCode=1}
