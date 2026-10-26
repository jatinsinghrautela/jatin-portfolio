'use client';
import Link from 'next/link';
import {Radar,Boxes,ArrowUpRight} from 'lucide-react';
import type {PortfolioProject} from './project-data';

export default function ProjectCard({project: p}: {project: PortfolioProject}) {
  return (
    <article className={`card project-case project-${p.id}`}>
      <div className="art"><div className="project-orbits" aria-hidden="true"><i/><i/><i/></div><div className="project-glyph" aria-hidden="true">{p.id==='opsradar'?<Radar size={22}/>:<Boxes size={22}/>}</div>
        {p.image ? <img className="project-cover" src={p.image} alt={p.imageAlt} width="1536" height="1024" loading="lazy"/> : <><span className="node">COMMIT</span><span className="connector"/><span className="node">BUILD</span><span className="connector"/><span className="node">DEPLOY</span></>}
        {p.image && <span className="art-caption">CONCEPT ART / {p.title.toUpperCase()}</span>}
      </div>
      <div className="cardbody">
        <div className="tags">{p.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        <h3>{p.title}</h3>
        <p className="muted">{p.description}</p>
        <div className="cardfoot">
          <span>PERSONAL PROJECT</span>
          <Link className="button" href={`/projects/${p.id}`} aria-label={`Explore ${p.title} case study`}>Explore details <ArrowUpRight size={17} aria-hidden="true"/></Link>
        </div>

      </div>
    </article>
  );
}
