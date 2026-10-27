import {build} from 'vite';import fs from 'node:fs/promises';import path from 'node:path';import {pathToFileURL} from 'node:url';
await build({configFile:'vite.free.config.ts'});
await build({configFile:'vite.free.config.ts',publicDir:false,build:{ssr:path.resolve('deployment/render.tsx'),outDir:path.resolve('dist/free/render'),emptyOutDir:true,rollupOptions:{output:{entryFileNames:'render.mjs'}}}});
const {paths,render}=await import(pathToFileURL(path.resolve('dist/free/render/render.mjs')).href);
const template=await fs.readFile('dist/free/client/index.html','utf8');if(!template.includes('<div id="portfolio-root"></div>'))throw Error('Static template root was not found.');
for(const route of paths){const html=template.replace('<div id="portfolio-root"></div>',`<div id="portfolio-root" data-path="${route}">${render(route)}</div>`);const target=route==='/'?'dist/free/client/index.html':`dist/free/client${route}/index.html`;await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,html)}
await fs.writeFile('dist/free/client/robots.txt','User-agent: *\nDisallow: /\n');
console.log(`Built ${paths.length} static routes. Public page navigation does not invoke the Worker; CMS/contact/content/media use the free-tier API.`);

await fs.writeFile('dist/free/client/_headers','/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  X-Robots-Tag: noindex, nofollow\n');
