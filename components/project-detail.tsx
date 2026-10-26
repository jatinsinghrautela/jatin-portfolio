'use client';
import {useEffect,useRef,useState} from 'react';
import SiteHeader from './site-header';
import {projects} from './project-data';
import {caseStudies,type CaseStudyId} from './case-study-data';
import SiteFooter from './site-footer';
import Link from 'next/link';

const sections=[['overview','Overview'],['architecture','Architecture'],['snapshots','Workflows'],['technologies','Technologies'],['learnings','Learnings']] as const;

function Architecture({id}:{id:CaseStudyId}) {
  const data=caseStudies[id];
  const positions=[[25,35],[420,35],[420,235],[25,235]];
  return <figure className="architecture-figure"><div className="diagram-scroll"><svg viewBox="0 0 760 385" role="img" aria-labelledby={`${id}-diagram-title ${id}-diagram-description`}>
    <title id={`${id}-diagram-title`}>{id === 'opsradar' ? 'Agents and console connect to the API; the API connects to PostgreSQL' : 'Browser to Nginx to Express to MongoDB'}</title>
    <desc id={`${id}-diagram-description`}>{data.flow}</desc>
    <defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/></marker></defs>
    {data.connections.map(([from,to])=>{const a=positions[from],b=positions[to];const horizontal=a[1]===b[1];const x1=horizontal?(a[0]<b[0]?a[0]+290:a[0]):a[0]+145;const y1=horizontal?a[1]+52:a[1]+105;const x2=horizontal?(a[0]<b[0]?b[0]:b[0]+290):b[0]+145;const y2=horizontal?b[1]+52:b[1];return <path key={`${from}-${to}`} className="diagram-wire" d={from===3&&to===1?"M315,287 H365 V185 H565 V140":`M${x1},${y1} L${x2},${y2}`} markerEnd={`url(#${id}-arrow)`}/>})}
    {data.nodes.map(([label,title,detail],i)=><g key={label} transform={`translate(${positions[i][0]},${positions[i][1]})`}><rect className="diagram-node" width="290" height="105" rx="14"/><circle cx="23" cy="24" r="3" className="diagram-dot"/><text x="36" y="28" className="diagram-label">{label}</text><text x="20" y="58" className="diagram-title">{title}</text><text x="20" y="82" className="diagram-caption">{detail}</text></g>)}
  </svg></div><figcaption>{data.flow}</figcaption></figure>;
}

function VisualTour({id}:{id:CaseStudyId}) {
  const[view,setView]=useState(0);
  const journeys=id==='opsradar'?[
    {name:'Alert lifecycle',title:'From host signal to an actionable alert.',steps:[['Detect','An engineer or host process reports an operational issue.'],['Authenticate','The agent submits the alert with its per-server API key.'],['Review','The API stores the record and the console presents scoped alerts.'],['Resolve','A resolution updates the alert lifecycle.']]},
    {name:'Host liveness',title:'Know when a host stops checking in.',steps:[['Run','A Node agent runs on Windows or Linux.'],['Heartbeat','Periodic heartbeats reach the control plane.'],['Evaluate','The service checks the elapsed time since the last beat.'],['Surface','The console exposes host availability to operators.']]},
    {name:'Operator workflow',title:'Give operational signals the right context.',steps:[['Organize','Arrange inventory by country, application, group, and server.'],['Scope','User access determines which alerts are visible.'],['Review','Use the alert inbox and notification feed.'],['Retain','Apply configured retention to stored alerts.']]}
  ]:[
    {name:'Product to shelf',title:'Create a product record that is ready to use.',steps:[['Record','Add the product, image, price, cost, and starting quantity.'],['Identify','Generate a product QR label.'],['Find','Scan the label or search by name or SKU.'],['Restock','Add units and retain a stock movement record.']]},
    {name:'Checkout to invoice',title:'Connect each sale with its stock movement.',steps:[['Select','Collect products and quantities in checkout.'],['Validate','Check available stock before recording the sale.'],['Invoice','Store product and price snapshots for each invoice line.'],['Update','Reduce stock and record checkout movements.']]},
    {name:'Stock to insight',title:'Make the inventory record useful after the sale.',steps:[['Track','Keep restock, adjustment, and checkout movements.'],['Notify','Surface low-stock and out-of-stock notifications.'],['Report','Review units sold, revenue, cost, and profit.'],['Act','Use the records to plan replenishment.']]}
  ];
  const current=journeys[view];
  return <div className="workflow-tour"><div className="preview-selector" role="group" aria-label="Choose project workflow">{journeys.map((j,i)=><button key={j.name} aria-pressed={view===i} onClick={()=>setView(i)}>{String(i+1).padStart(2,'0')} / {j.name}</button>)}</div><div className="workflow-canvas" key={view}><span className="eyebrow">{id==='opsradar'?'OPSRADAR / OPERATIONS':'ROACH / INVENTORY'}</span><h3>{current.title}</h3><ol>{current.steps.map(([name,detail],i)=><li key={name}><span className="workflow-dot">0{i+1}</span><div><h4>{name}</h4><p>{detail}</p></div><i aria-hidden="true"/></li>)}</ol></div></div>;
}

export default function ProjectDetail({id}:{id:CaseStudyId}) {
  const p=projects.find(project=>project.id===id)!;
  const data=caseStudies[id];
  const[active,setActive]=useState('overview');
  const[sectionsOpen,setSectionsOpen]=useState(false);
  const root=useRef<HTMLDivElement>(null);
  const progress=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const element=root.current!;
    const targets=Array.from(element.querySelectorAll<HTMLElement>('[data-case-section]'));
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    let previous=window.scrollY,frame=0;
    const update=()=>{
      frame=0;const y=window.scrollY;const movingDown=y>=previous;previous=y;element.dataset.direction=movingDown?'down':'up';
      let current=targets[0]?.id||'overview';
      for(const section of targets){if(section.getBoundingClientRect().top<=window.innerHeight*.38)current=section.id;}
      if(window.innerHeight+y>=document.documentElement.scrollHeight-3)current='learnings';
      setActive(current);
      const range=document.documentElement.scrollHeight-window.innerHeight;
      if(progress.current)progress.current.style.transform=`scaleX(${range>0?Math.min(1,Math.max(0,y/range)):1})`;
    };
    const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update)};
    const observer=new IntersectionObserver(entries=>{for(const entry of entries){const target=entry.target as HTMLElement;if(entry.isIntersecting){target.classList.remove('reveal-ready');target.classList.add('revealed')}else{target.classList.remove('revealed');target.classList.add('reveal-ready')}}},{threshold:0,rootMargin:'40px 0px'});
    if(!reduced.matches)targets.forEach(target=>observer.observe(target));
    const onMotion=()=>{observer.disconnect();targets.forEach(t=>t.classList.remove('reveal-ready','revealed'));if(!reduced.matches)targets.forEach(t=>observer.observe(t))};
    reduced.addEventListener('change',onMotion);
    window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);update();
    return()=>{observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);reduced.removeEventListener('change',onMotion)};
  },[]);
  const next=projects[(projects.findIndex(project=>project.id===id)+1)%projects.length];
  return <><SiteHeader page="projects"/><div className="case-page" ref={root} data-direction="down"><div className="reading-track" aria-hidden="true"><div ref={progress}/></div><main>
    <header className="case-hero" id="case-top"><Link className="back-link" href="/projects">← All projects</Link><div className="eyebrow">PERSONAL PROJECT / CASE STUDY</div><h1>{p.title}</h1><p className="case-subtitle">{data.subtitle}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>{p.image&&<div className="case-cover"><img src={p.image} alt={p.imageAlt} width="1536" height="1024"/><span className="art-caption">ORIGINAL CONCEPT ART</span></div>}</header>
    <div className="case-layout"><aside className="case-index" onKeyDown={e=>{if(e.key==='Escape')setSectionsOpen(false)}}><button type="button" className="section-menu-toggle" aria-controls="case-section-links" aria-expanded={sectionsOpen} onClick={()=>setSectionsOpen(!sectionsOpen)}>On this page <span>{sections.find(([key])=>key===active)?.[1]}</span><b aria-hidden="true">{sectionsOpen?'−':'+'}</b></button><div className="eyebrow">INSIDE THE PROJECT</div><div id="case-section-links" className={`case-index-links ${sectionsOpen?'sections-open':''}`} aria-label="Case study sections" role="navigation">{sections.map(([anchor,label],i)=><a key={anchor} href={`#${anchor}`} onClick={()=>setSectionsOpen(false)} className={active===anchor?'current':''} aria-current={active===anchor?'location':undefined}><span>{String(i+1).padStart(2,'0')}</span>{label}<i aria-hidden="true"/></a>)}</div><a className="case-backtop" href="#case-top">Back to top ↑</a></aside>
    <div className="case-body">
      <section id="overview" data-case-section><div className="eyebrow">01 / OVERVIEW</div><h2>The idea, in context.</h2><p className="case-intro">{p.description}</p><p className="muted">{p.story}</p><div className="challenge-panel"><span className="eyebrow">THE PROBLEM</span><p>{data.challenge}</p></div>{p.features.length>0&&<><h3>What it does</h3><ul className="feature-list">{p.features.map((f,i)=><li key={f}><span>{String(i+1).padStart(2,'0')}</span>{f}</li>)}</ul></>}<p className="notice scope-note">{data.scope}</p></section>
      <section id="architecture" data-case-section><div className="eyebrow">02 / ARCHITECTURE</div><h2>Follow the signal.</h2><p className="muted">A view of the main components and their connections.</p><Architecture id={id}/></section>
      <section id="snapshots" data-case-section><div className="eyebrow">03 / WORKFLOWS</div><h2>A closer look at the workflow.</h2><p className="muted">Follow the product journeys, from the first action to the recorded outcome.</p><VisualTour id={id}/></section>
      <section id="technologies" data-case-section><div className="eyebrow">04 / TECHNOLOGIES</div><h2>Every tool has a role.</h2><div className="case-tech-grid">{data.technologies.map(([tool,role],i)=><article key={tool}><span className="eyebrow">{String(i+1).padStart(2,'0')}</span><h3>{tool}</h3><p className="muted">{role}</p></article>)}</div></section>
      <section id="learnings" data-case-section><div className="eyebrow">05 / LEARNINGS</div><h2>Engineering takeaways.</h2><p className="muted">Design lessons illustrated by this project’s architecture and workflows.</p><div className="takeaways">{data.takeaways.map(([title,detail],i)=><article key={title}><span>0{i+1}</span><div><h3>{title}</h3><p className="muted">{detail}</p></div></article>)}</div>{p.plannedRepository&&<div className="repository-placeholder"><span className="eyebrow">GITHUB / COMING SOON</span><p className="muted">Planned repository for {p.title}:</p><code>{p.plannedRepository}</code><p className="notice">Placeholder — repository not published yet.</p></div>}</section>
    </div></div><section className="case-next"><span className="eyebrow">KEEP EXPLORING</span><Link href={`/projects/${next.id}`}><h2>{next.title} <span>↗</span></h2><p className="muted">{next.description}</p></Link></section>
  </main></div><SiteFooter/></>;
}
