const MAX_FILE=1_000_000,MAX_LIBRARY=50_000_000,MAX_FILES=100;
const keyPattern=/^[a-f0-9-]{36}\.(png|jpg|webp|pdf)$/;
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export async function d1Media(request:Request,env:Cloudflare.Env){
 const db=env.DB;if(!db)return json({error:'Media storage is unavailable.'},503);const url=new URL(request.url);
 if(url.pathname.startsWith('/api/assets/')&&request.method==='GET'){
  const key=url.pathname.slice('/api/assets/'.length);if(!keyPattern.test(key))return json({error:'Not found.'},404);
  const row=await db.prepare('SELECT data,content_type FROM media_assets WHERE key=?').bind(key).first<{data:ArrayBuffer;content_type:string}>();
  if(!row)return json({error:'Not found.'},404);
  return new Response(new Uint8Array(row.data),{headers:{'Content-Type':row.content_type,'X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=31536000, immutable',...(key.endsWith('.pdf')?{'Content-Disposition':'attachment; filename="resume.pdf"'}:{})}});
 }
 if(request.method==='GET'){
  const cursor=url.searchParams.get('cursor')||'';if(cursor&&!keyPattern.test(cursor))return json({error:'Invalid cursor.'},400);
  const rows=(await db.prepare('SELECT key,size FROM media_assets WHERE key>? ORDER BY key LIMIT 51').bind(cursor).all<{key:string;size:number}>()).results;
  const page=rows.slice(0,50);return json({assets:page.map(r=>({url:`/api/assets/${r.key}`,size:r.size})),cursor:rows.length>50?page[page.length-1].key:undefined,limits:{fileBytes:MAX_FILE,libraryBytes:MAX_LIBRARY,files:MAX_FILES}});
 }
 if(request.method==='DELETE'){
  const key=url.searchParams.get('key')||'';if(!keyPattern.test(key))return json({error:'Invalid asset.'},400);
  const used=await db.prepare('SELECT id FROM published_content WHERE instr(body,?)>0 UNION ALL SELECT version FROM content_revisions WHERE instr(body,?)>0 LIMIT 1').bind(`/api/assets/${key}`,`/api/assets/${key}`).first();
  if(used)return json({error:'This asset is used by published content or a retained revision.'},409);
  await db.prepare('DELETE FROM media_assets WHERE key=?').bind(key).run();return json({deleted:true});
 }
 if(request.method==='POST'){
  if(Number(request.headers.get('Content-Length'))>MAX_FILE+10000)return json({error:'Choose a file no larger than 1 MB.'},413);
  const form=await request.formData(),file=form.get('file');if(!(file instanceof File)||file.size===0||file.size>MAX_FILE)return json({error:'Choose a nonempty image or PDF no larger than 1 MB.'},400);
  const data=await file.arrayBuffer(),bytes=new Uint8Array(data);let ext='',type='';
  if(bytes[0]===137&&bytes[1]===80&&bytes[2]===78&&bytes[3]===71){ext='png';type='image/png'}else if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255){ext='jpg';type='image/jpeg'}else if(new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP'){ext='webp';type='image/webp'}else if(new TextDecoder().decode(bytes.slice(0,5))==='%PDF-'){ext='pdf';type='application/pdf'}else return json({error:'Only PNG, JPEG, WebP, and PDF files are supported.'},400);
  const key=`${crypto.randomUUID()}.${ext}`;
  const result=await db.prepare('INSERT INTO media_assets (key,content_type,size,data,created_at) SELECT ?,?,?,?,? WHERE (SELECT COALESCE(SUM(size),0) FROM media_assets)+?<=? AND (SELECT COUNT(*) FROM media_assets)<?').bind(key,type,file.size,data,Date.now(),file.size,MAX_LIBRARY,MAX_FILES).run();
  if(!result.meta.changes)return json({error:'The free media library is full (50 MB or 100 files). Remove unused files before uploading.'},409);
  return json({url:`/api/assets/${key}`});
 }
 return json({error:'Method not allowed.'},405);
}
