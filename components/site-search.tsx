'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import {Search,X} from 'lucide-react';
import {useSiteContent} from './content-provider';
type Entry={title:string;text:string;url:string;element?:HTMLElement};
export default function SiteSearch({page,onOpen}:{page:string;onOpen?:()=>void}){
 const {content,copy}=useSiteContent(),router=useRouter();
 const selecting=useRef(false);
 const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement>(null),input=useRef<HTMLInputElement>(null);
 const [open,setOpen]=useState(false),[query,setQuery]=useState(''),[scope,setScope]=useState(page==='home'?'all':'page'),[local,setLocal]=useState<Entry[]>([]),[active,setActive]=useState(0);
 const index=useMemo(()=>{
  const entries:Entry[]=content.navigation.map(([,url,title])=>({title,text:title,url}));
  const add=(title:string,text:string,url:string)=>entries.push({title,text,url});
  content.projects.forEach(p=>add(p.title,[p.description,p.story,...p.tags,...p.features,JSON.stringify(content.caseStudies[p.id]),JSON.stringify(content.workflows[p.id])].join(' '),`/projects/${p.id}`));
  content.experience.forEach(r=>add(`${r.title} · ${r.company}`,[r.date,r.detail,...r.points,...r.tools].join(' '),'/experience'));
  content.skills.forEach(([,title,tools])=>add(String(title),(tools as string[]).join(' '),'/skills'));
  content.certifications.forEach(c=>add(c.title,[c.issuer,c.level,c.description].join(' '),'/certifications'));
  content.practices.forEach(c=>add(c.title,c.detail+' '+c.tools,'/skills'));
  const groups:Record<string,string[]>={};
  Object.entries(content.copy).forEach(([key,value])=>{if(/\.(src|href|alt|aria-label|placeholder)$/.test(key))return;const route=key.startsWith('portfolio.')?(Number(key.split('.')[1])<=27?'/':Number(key.split('.')[1])<=31?'/projects':'/contact'):key.startsWith('profile-pages.')?(Number(key.split('.')[1])<=12?'/about':Number(key.split('.')[1])<=21?'/experience':'/skills'):key.startsWith('certifications.')?'/certifications':key.startsWith('contact')?'/contact':null;if(route)(groups[route]??=[]).push(copy(key,value))});
  Object.entries(groups).forEach(([url,words])=>{const pageEntry=entries.find(e=>e.url===url);if(pageEntry)pageEntry.text+=' '+words.join(' ');else add(url==='/'?'Home':url.slice(1),words.join(' '),url)});
  const home=entries.find(e=>e.url==='/');if(home)home.text+=' '+content.toolbox.join(' ');
  const about=entries.find(e=>e.url==='/about');if(about)about.text+=' '+Object.values(content.identity).join(' ')+' '+JSON.stringify(content.terminals.about);
  const skills=entries.find(e=>e.url==='/skills');if(skills)skills.text+=' '+JSON.stringify(content.terminals.services);
  return entries;
 },[content,copy]);
 const results=useMemo(()=>{const normalized=query.toLocaleLowerCase().trim();if(!normalized)return [];const terms=normalized.split(/\s+/).filter(Boolean);const score=(e:Entry)=>!normalized?0:e.title.toLocaleLowerCase()===normalized?100:e.title.toLocaleLowerCase().startsWith(normalized)?60:terms.filter(t=>e.title.toLocaleLowerCase().includes(t)).length*10;return (scope==='all'?index:local).filter(e=>terms.every(t=>(e.title+' '+e.text).toLocaleLowerCase().includes(t))).sort((a,b)=>score(b)-score(a)).slice(0,40)},[query,scope,index,local]);
 const close=()=>{dialog.current?.close()};
 function show(){onOpen?.();setScope(page==='home'?'all':'page');setQuery('');setActive(0);const seen=new Set<string>();setLocal(Array.from(document.querySelectorAll<HTMLElement>('main h1,main h2,main h3,main p,main li,main .skill-pills>span,main .tags>span')).filter(el=>el.getClientRects().length>0&&!!el.textContent?.trim()).flatMap(element=>{const text=element.textContent!.trim();if(seen.has(text))return [];seen.add(text);return [{title:text.length>90?text.slice(0,87)+'…':text,text,url:location.pathname,element}]}));dialog.current?.showModal();setOpen(true);requestAnimationFrame(()=>input.current?.focus())}
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(dialog.current?.open)dialog.current.close();else trigger.current?.click()}};document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key)},[]);
 useEffect(()=>{if(open)dialog.current?.querySelector('.search-active')?.scrollIntoView({block:'nearest'})},[active,open,query,scope]);
 useEffect(()=>{if(!open)return;const before=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=before}},[open]);
 function select(entry:Entry){selecting.current=true;close();if(scope==='page'&&entry.element){entry.element.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});entry.element.setAttribute('tabindex','-1');entry.element.focus({preventScroll:true});if(!matchMedia('(prefers-reduced-motion: reduce)').matches)entry.element.animate([{backgroundColor:'var(--accent)',color:'var(--bg)'},{backgroundColor:'transparent',color:'var(--fg)'}],{duration:1200})}else router.push(entry.url)}
 return <><button ref={trigger} type="button" className="search-trigger" aria-label="Search website (Control or Command K)" aria-keyshortcuts="Control+k Meta+k" title="Search (Ctrl/⌘ K)" onClick={show}><Search size={16}/></button><dialog ref={dialog} className="search-dialog" aria-labelledby="search-title" onClose={()=>{setOpen(false);if(!selecting.current)trigger.current?.focus();selecting.current=false}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close()}}}>
 <div className="search-heading"><h2 id="search-title">Find your way</h2><button type="button" aria-label="Close search" onClick={close}><X size={20}/></button></div>
 <div className="search-scopes" role="group" aria-label="Search scope"><button aria-pressed={scope==='all'} onClick={()=>{setScope('all');setActive(0)}}>Entire portfolio</button><button aria-pressed={scope==='page'} onClick={()=>{setScope('page');setActive(0)}}>This page</button></div>
 <label className="search-input"><Search size={20}/><input ref={input} type="search" value={query} placeholder={scope==='all'?'Search projects, skills, experience…':'Search this page…'} aria-label="Search portfolio content" aria-controls="search-results" onChange={e=>{setQuery(e.target.value);setActive(0)}} onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();setActive(i=>Math.max(0,Math.min(i+1,results.length-1)))}if(e.key==='ArrowUp'){e.preventDefault();setActive(i=>Math.max(0,i-1))}if(e.key==='Enter'&&results[active]){e.preventDefault();select(results[active])}}}/></label>
 <span className="sr-only" aria-live="polite">{query&&results[active]?.title}</span><p className="search-help" role="status">{!query.trim()?'Type to search · Ctrl/⌘ K to open · Esc to close':results.length?`${results.length}${results.length===40?'+':''} results · ↑ ↓ to choose · Enter to open`:'No matches. Try another phrase or search the entire portfolio.'}</p>
 <div id="search-results" className="search-results">{results.map((entry,i)=><button type="button" className={i===active?'search-active':''} key={`${entry.url}-${i}`} onFocus={()=>setActive(i)} onClick={()=>select(entry)}><strong>{entry.title}</strong><span>{scope==='all'?entry.url:entry.text.slice(0,180)}</span><b aria-hidden="true">↗</b></button>)}</div>
 </dialog></>;
}
