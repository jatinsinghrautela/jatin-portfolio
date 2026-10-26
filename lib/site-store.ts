import {env} from 'cloudflare:workers';
import {defaultContent,type SiteContent} from './content-model';
export async function loadPublicContent():Promise<SiteContent>{try{const row=await env.DB?.prepare('SELECT body FROM published_content WHERE id=1').first<{body:string}>();return row?JSON.parse(row.body):defaultContent}catch{return defaultContent}}
