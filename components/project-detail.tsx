'use client';
import {useEffect,useRef,useState} from 'react';
import SiteHeader from './site-header';
import {projects} from './project-data';
import {caseStudies,type CaseStudyId} from './case-study-data';
import TypingTerminal from './typing-terminal';

const sections=[['overview','Overview'],['architecture','Architecture'],['snapshots','Visual tour'],['technologies','Technologies'],['learnings','Learnings']] as const;

function Architecture({id}:{id:CaseStudyId}) {
  const data=caseStudies[id];
  const positions=[[25,35],[420,35],[420,235],[25,235]];
  return <figure className="architecture-figure"><div className="diagram-scroll"><svg viewBox="0 0 760 385" role="img" aria-labelledby={`${id}-diagram-title ${id}-diagram-description`}>
    <title id={`${id}-diagram-title`}>{id === 'opsradar' ? 'Agents and console connect to the API; the API connects to PostgreSQL' : id === 'roach' ? 'Browser to Nginx to Express to MongoDB' : 'Conceptual delivery and operations workflow'}</title>
    <desc id={`${id}-diagram-description`}>{data.flow}</desc>
    <defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/></marker></defs>
    {data.connections.map(([from,to])=>{const a=positions[from],b=positions[to];const horizontal=a[1]===b[1];const x1=horizontal?(a[0]<b[0]?a[0]+290:a[0]):a[0]+145;const y1=horizontal?a[1]+52:a[1]+105;const x2=horizontal?(a[0]<b[0]?b[0]:b[0]+290):b[0]+145;const y2=horizontal?b[1]+52:b[1];return <path key={`${from}-${to}`} className="diagram-wire" d={from===3&&to===1?"M315,287 H365 V185 H565 V140":`M${x1},${y1} L${x2},${y2}`} markerEnd={`url(#${id}-arrow)`}/>})}
    {data.nodes.map(([label,title,detail],i)=><g key={label} transform={`translate(${positions[i][0]},${positions[i][1]})`}><rect className="diagram-node" width="290" height="105" rx="14"/><circle cx="23" cy="24" r="3" className="diagram-dot"/><text x="36" y="28" className="diagram-label">{label}</text><text x="20" y="58" className="diagram-title">{title}</text><text x="20" y="82" className="diagram-caption">{detail}</text></g>)}
  </svg></div><figcaption>{data.flow}</figcaption></figure>;
}

function VisualTour({id}:{id:CaseStudyId}) {
  const[view,setView]=useState(0);
  const labels=caseStudies[id].previews;
  const rows=id==='opsradar'?[
    [['Disk capacity warning','Major','Open'],['Service heartbeat','Info','Received'],['Application recovered','Clear','Resolved']],
    [['host-01','Linux','Reporting'],['host-02','Windows','Reporting'],['host-03','Linux','No heartbeat']],
    [['New alert received','Application group','Unread'],['Host status changed','Operations','Unread'],['Alert resolved','Application group','Read']]
  ]:id==='roach'?[
    [['Desk lamp','SKU DEMO-01','12 on hand'],['Notebook','SKU DEMO-02','4 on hand'],['Storage box','SKU DEMO-03','18 on hand']],
    [['Find product','QR scan / SKU','Identify'],['Review quantity','Current stock','Inspect'],['Record restock','Add units','Update']],
    [['Review basket','Product + quantity','Confirm'],['Record invoice','Price / cost snapshot','Save'],['Update stock','Checkout movement','Trace']]
  ]:[
    [['Versioned change','Source','Review'],['CI/CD workflow','Azure DevOps','Build'],['GitOps sync','ArgoCD','Deploy']],
    [['Configuration','Illustrative','Inspect'],['Workload status','Illustrative','Check'],['Release outcome','Illustrative','Review']],
    [['Service health','Monitoring','Observe'],['Actionable signal','Alerting','Investigate'],['Operational feedback','Team','Improve']]
  ];
  return <div className="visual-tour"><div className="preview-selector" role="group" aria-label="Select illustrative workflow">{labels.map((label,i)=><button key={label} aria-pressed={view===i} onClick={()=>setView(i)}>{String(i+1).padStart(2,'0')} / {label}</button>)}</div><div className="interface-study" key={view}><div className="windowbar"><span><b className="windowdots">● ● ●</b> &nbsp; {id==='pipeline'?'Delivery study':projects.find(p=>p.id===id)?.title}</span><span>ILLUSTRATIVE / SAMPLE DATA</span></div><div className="study-content"><div className="eyebrow">{id==='opsradar'?'OPERATIONS CONSOLE':id==='roach'?'SHOP WORKSPACE':'DELIVERY WORKFLOW'}</div><h3>{labels[view]}</h3><div className="study-summary">{['Identify','Review','Act'].map((s,i)=><div key={s}><span>0{i+1}</span><strong>{s}</strong></div>)}</div><div className="study-rows">{rows[view].map(([name,context,status])=><div key={name}><span>{name}<small>{context}</small></span><span className="study-status">{status}</span></div>)}</div></div></div><p className="notice">Interface study with sample data, based on documented workflows. This is not a screenshot of the application.</p></div>;
}

export default function ProjectDetail({id}:{id:CaseStudyId}) {
  const p=projects.find(project=>project.id===id)!;
  const data=caseStudies[id];
  const[active,setActive]=useState('overview');
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
    <header className="case-hero" id="case-top"><a className="back-link" href="/projects">← All projects</a><div className="eyebrow">{id==='pipeline'?'PROFESSIONAL EXPERIENCE / CASE STUDY':'PROJECT / CASE STUDY'}</div><h1>{p.title}</h1><p className="case-subtitle">{data.subtitle}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>{p.image&&<div className="case-cover"><img src={p.image} alt={p.imageAlt} width="1536" height="1024"/><span className="art-caption">ORIGINAL CONCEPT ART</span></div>}</header>
    <div className="case-layout"><aside className="case-index"><div className="eyebrow">INSIDE THE PROJECT</div><div className="case-index-links" aria-label="Case study sections" role="navigation">{sections.map(([anchor,label],i)=><a key={anchor} href={`#${anchor}`} className={active===anchor?'current':''} aria-current={active===anchor?'location':undefined}><span>{String(i+1).padStart(2,'0')}</span>{label}<i aria-hidden="true"/></a>)}</div><a className="case-backtop" href="#case-top">Back to top ↑</a></aside>
    <div className="case-body">
      <section id="overview" data-case-section><div className="eyebrow">01 / OVERVIEW</div><h2>The idea, in context.</h2><p className="case-intro">{p.description}</p><p className="muted">{p.story}</p><div className="challenge-panel"><span className="eyebrow">THE PROBLEM</span><p>{data.challenge}</p></div>{p.features.length>0&&<><h3>What it does</h3><ul className="feature-list">{p.features.map((f,i)=><li key={f}><span>{String(i+1).padStart(2,'0')}</span>{f}</li>)}</ul></>}<p className="notice scope-note">{data.scope}</p></section>
      <section id="architecture" data-case-section><div className="eyebrow">02 / ARCHITECTURE</div><h2>Follow the signal.</h2><p className="muted">A view of the main components and their connections.</p><Architecture id={id}/></section>
      <section id="snapshots" data-case-section><div className="eyebrow">03 / VISUAL TOUR</div><h2>A closer look at the workflow.</h2><p className="muted">Explore the main application journeys through these illustrative interface studies. Actual application screenshots will replace them when available.</p><VisualTour id={id}/>{id==='pipeline'&&<TypingTerminal mode="delivery"/>}</section>
      <section id="technologies" data-case-section><div className="eyebrow">04 / TECHNOLOGIES</div><h2>Every tool has a role.</h2><div className="case-tech-grid">{data.technologies.map(([tool,role],i)=><article key={tool}><span className="eyebrow">{String(i+1).padStart(2,'0')}</span><h3>{tool}</h3><p className="muted">{role}</p></article>)}</div></section>
      <section id="learnings" data-case-section><div className="eyebrow">05 / LEARNINGS</div><h2>Engineering takeaways.</h2><p className="muted">Design lessons illustrated by this project’s architecture and workflows.</p><div className="takeaways">{data.takeaways.map(([title,detail],i)=><article key={title}><span>0{i+1}</span><div><h3>{title}</h3><p className="muted">{detail}</p></div></article>)}</div>{p.plannedRepository&&<div className="repository-placeholder"><span className="eyebrow">GITHUB / COMING SOON</span><p className="muted">Planned repository for {p.title}:</p><code>{p.plannedRepository}</code><p className="notice">Placeholder — repository not published yet.</p></div>}</section>
    </div></div><section className="case-next"><span className="eyebrow">KEEP EXPLORING</span><a href={`/projects/${next.id}`}><h2>{next.title} <span>↗</span></h2><p className="muted">{next.description}</p></a></section>
  </main></div><footer><span>JATIN SINGH RAUTELA / DevOps & Development</span><a href="/projects">All projects ↗</a></footer></>;
}
