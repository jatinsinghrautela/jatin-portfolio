'use client';
import {useSiteContent} from './content-provider';
import {useEffect,useRef,useState} from 'react';
import SiteHeader from './site-header';
type CaseStudyId=string;
import SiteFooter from './site-footer';
import Link from 'next/link';

const sections=[['overview','Overview'],['architecture','Architecture'],['snapshots','Workflows'],['technologies','Technologies'],['learnings','Learnings']] as const;

function Architecture({id}:{id:CaseStudyId}) {const {content,copy}=useSiteContent();
  const data=content.caseStudies[id];
  const count=data.nodes.length;const columns=count===1?1:count>6?3:2;
  const positions=count===4?[[25,35],[420,35],[420,235],[25,235]]:data.nodes.map((_,i)=>[25+(i%columns)*350,35+Math.floor(i/columns)*190]);
  const diagramWidth=count===4?760:columns*350+15;const diagramHeight=count===4?385:Math.ceil(count/columns)*190+25;
  return <figure className="architecture-figure"><div className="diagram-scroll"><svg viewBox={`0 0 ${diagramWidth} ${diagramHeight}`} style={{minWidth:columns>2?850:500}} role="img" aria-labelledby={`${id}-diagram-title ${id}-diagram-description`}>
    <title id={`${id}-diagram-title`}>{`${content.projects.find(p=>p.id===id)?.title||'Project'} component architecture`}</title>
    <desc id={`${id}-diagram-description`}>{data.flow}</desc>
    <defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor"/></marker></defs>
    {data.connections.map(([from,to])=>{const a=positions[from],b=positions[to];const horizontal=a[1]===b[1];const x1=horizontal?(a[0]<b[0]?a[0]+290:a[0]):a[0]+145;const y1=horizontal?a[1]+52:a[1]+(b[1]>a[1]?105:0);const x2=horizontal?(a[0]<b[0]?b[0]:b[0]+290):b[0]+145;const y2=horizontal?b[1]+52:b[1]+(b[1]>a[1]?0:105);return <path key={`${from}-${to}`} className="diagram-wire" d={count===4&&from===3&&to===1?"M315,287 H365 V185 H565 V140":`M${x1},${y1} L${x2},${y2}`} markerEnd={`url(#${id}-arrow)`}/>})}
    {data.nodes.map(([label,title,detail],i)=><g key={i} transform={`translate(${positions[i][0]},${positions[i][1]})`}><rect className="diagram-node" width="290" height="105" rx="14"/><foreignObject x="16" y="12" width="258" height="82"><div className="diagram-node-copy"><span>{label}</span><strong>{title}</strong><p>{detail}</p></div></foreignObject></g>)}
  </svg></div><figcaption>{data.flow}</figcaption></figure>;
}

function VisualTour({id}:{id:CaseStudyId}) {const {content,copy}=useSiteContent();
  const[view,setView]=useState(0);
  const journeys=content.workflows[id];
  const current=journeys[view]||journeys[0];
  return <div className="workflow-tour"><div className="preview-selector" role="group" aria-label={copy("project-detail.001.aria-label","Choose project workflow")}>{journeys.map((j,i)=><button key={j.name} aria-pressed={view===i} onClick={()=>setView(i)}>{j.name}</button>)}</div><div className="workflow-canvas" key={view}><span className="eyebrow">{id==='opsradar'?'OPSRADAR / OPERATIONS':'ROACH / INVENTORY'}</span><h3>{current.title}</h3><ol>{current.steps.map(([name,detail],i)=><li key={name}><span className="workflow-dot" aria-hidden="true">✦</span><div><h4>{name}</h4><p>{detail}</p></div><i aria-hidden="true"/></li>)}</ol></div></div>;
}

export default function ProjectDetail({id}:{id:CaseStudyId}) {const {content,copy}=useSiteContent();
  const projects=content.projects;
  const p=projects.find(project=>project.id===id)!;
  const data=content.caseStudies[id];
  const[active,setActive]=useState('overview');
  const[sectionsOpen,setSectionsOpen]=useState(false);
  const root=useRef<HTMLDivElement>(null);
  const progress=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const element=root.current;
    if(!element)return;
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
  if(!p||!data)return <><SiteHeader page="projects"/><main className="innerhero"><h1>{copy("project-detail.002","Project not found.")}</h1><Link href={copy("project-detail.003.href","/projects")}>{copy("project-detail.004","All projects ↗")}</Link></main><SiteFooter/></>;
  const next=projects[(projects.findIndex(project=>project.id===id)+1)%projects.length];
  return <><SiteHeader page="projects"/><div className="case-page" ref={root} data-direction="down"><div className="reading-track" aria-hidden="true"><div ref={progress}/></div><main>
    <header className="case-hero" id="case-top"><Link className="back-link" href={copy("project-detail.005.href","/projects")}>{copy("project-detail.006","← All projects")}</Link><div className="eyebrow">{copy("project-detail.007","PERSONAL PROJECT / CASE STUDY")}</div><h1>{p.title}</h1><p className="case-subtitle">{data.subtitle}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>{p.image&&<div className="case-cover"><img src={p.image} alt={p.imageAlt} width="1536" height="1024"/></div>}</header>
    <div className="case-layout"><aside className="case-index" onKeyDown={e=>{if(e.key==='Escape')setSectionsOpen(false)}}><button type="button" className="section-menu-toggle" aria-controls="case-section-links" aria-expanded={sectionsOpen} onClick={()=>setSectionsOpen(!sectionsOpen)}>{copy("project-detail.009","On this page ")}<span>{sections.find(([key])=>key===active)?.[1]}</span><b aria-hidden="true">{sectionsOpen?'−':'+'}</b></button><div className="eyebrow">{copy("project-detail.010","INSIDE THE PROJECT")}</div><div id="case-section-links" className={`case-index-links ${sectionsOpen?'sections-open':''}`} aria-label={copy("project-detail.011.aria-label","Case study sections")} role="navigation">{sections.map(([anchor,label],i)=><a key={anchor} href={`#${anchor}`} onClick={()=>setSectionsOpen(false)} className={active===anchor?'current':''} aria-current={active===anchor?'location':undefined}>{label}<i aria-hidden="true"/></a>)}</div><a className="case-backtop" href="#case-top">{copy("project-detail.012","Back to top ↑")}</a></aside>
    <div className="case-body">
      <section id="overview" data-case-section><div className="eyebrow">{copy("project-detail.013","OVERVIEW")}</div><h2>{copy("project-detail.014","The idea, in context.")}</h2><p className="case-intro">{p.description}</p><p className="muted">{p.story}</p><div className="challenge-panel"><span className="eyebrow">{copy("project-detail.015","THE PROBLEM")}</span><p>{data.challenge}</p></div>{p.features.length>0&&<><h3>{copy("project-detail.016","What it does")}</h3><ul className="feature-list">{p.features.map((f,i)=><li key={f}>{f}</li>)}</ul></>}<p className="notice scope-note">{data.scope}</p></section>
      <section id="architecture" data-case-section><div className="eyebrow">{copy("project-detail.017","ARCHITECTURE")}</div><h2>{copy("project-detail.018","Follow the signal.")}</h2><p className="muted">{copy("project-detail.019","A view of the main components and their connections.")}</p><Architecture id={id}/></section>
      <section id="snapshots" data-case-section><div className="eyebrow">{copy("project-detail.020","WORKFLOWS")}</div><h2>{copy("project-detail.021","A closer look at the workflow.")}</h2><p className="muted">{copy("project-detail.022","Follow the product journeys, from the first action to the recorded outcome.")}</p><VisualTour id={id}/></section>
      <section id="technologies" data-case-section><div className="eyebrow">{copy("project-detail.023","TECHNOLOGIES")}</div><h2>{copy("project-detail.024","Every tool has a role.")}</h2><div className="case-tech-grid">{data.technologies.map(([tool,role],i)=><article key={tool}><h3>{tool}</h3><p className="muted">{role}</p></article>)}</div></section>
      <section id="learnings" data-case-section><div className="eyebrow">{copy("project-detail.025","LEARNINGS")}</div><h2>{copy("project-detail.026","Engineering takeaways.")}</h2><p className="muted">{copy("project-detail.027","Design lessons illustrated by this project’s architecture and workflows.")}</p><div className="takeaways">{data.takeaways.map(([title,detail],i)=><article key={title}><span aria-hidden="true">✦</span><div><h3>{title}</h3><p className="muted">{detail}</p></div></article>)}</div>{p.plannedRepository&&<div className="repository-panel"><span className="eyebrow">{copy("project-detail.repository.heading","SOURCE CODE")}</span><p className="muted">{copy("project-detail.repository.description","Explore the source code on GitHub.")}</p><a className="button repository-link" href={p.plannedRepository} target="_blank" rel="noopener noreferrer" aria-label={`${copy("project-detail.repository.action","View on GitHub")} — ${p.title}`}>{copy("project-detail.repository.action","View on GitHub")} <span aria-hidden="true">↗</span></a></div>}</section>
    </div></div><section className="case-next"><span className="eyebrow">{copy("project-detail.031","KEEP EXPLORING")}</span><Link href={`/projects/${next.id}`}><h2>{next.title} <span>↗</span></h2><p className="muted">{next.description}</p></Link></section>
  </main></div><SiteFooter/></>;
}
