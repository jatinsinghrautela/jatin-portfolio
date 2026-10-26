import {env} from 'cloudflare:workers';
import {contentSchema,defaultContent,type SiteContent} from './content-model';
export async function loadPublicContent():Promise<SiteContent>{try{const row=await env.DB?.prepare('SELECT body FROM published_content WHERE id=1').first<{body:string}>();return row?contentSchema.parse(JSON.parse(row.body)) as SiteContent:defaultContent}catch{return defaultContent}}
