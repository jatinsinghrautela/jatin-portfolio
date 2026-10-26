'use client';
import {useState} from 'react';
import type {PortfolioProject} from './project-data';

export default function ProjectCard({project: p}: {project: PortfolioProject}) {
  const [open, setOpen] = useState(false);
  const detailId = `project-${p.id}-details`;
  return (
    <article className="card project-case">
      <div className="art">
        {p.image ? <img className="project-cover" src={p.image} alt={p.imageAlt} width="1536" height="1024" loading="lazy"/> : <><span className="node">COMMIT</span><span className="connector"/><span className="node">BUILD</span><span className="connector"/><span className="node">DEPLOY</span></>}
        {p.image && <span className="art-caption">CONCEPT ART / {p.title.toUpperCase()}</span>}
      </div>
      <div className="cardbody">
        <div className="tags">{p.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
        <h3>{p.title}</h3>
        <p className="muted">{p.description}</p>
        <div className="cardfoot">
          <span>{p.id === 'pipeline' ? 'PROFESSIONAL EXPERIENCE' : 'PROJECT CASE STUDY'}</span>
          <button className="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls={detailId} aria-label={`${open ? 'Close' : 'Explore'} ${p.title} details`}>{open ? 'Close details' : 'Explore details'} ↗</button>
        </div>
        {open && <div className="case-detail" id={detailId}>
          <h4>The idea</h4><p className="muted">{p.story}</p>
          {p.features.length > 0 && <><h4>What it does</h4><ul>{p.features.map(feature => <li key={feature}>{feature}</li>)}</ul></>}
          <h4>Architecture</h4>
          <ol className="project-architecture">{p.architecture.map(part => <li key={part}>{part}</li>)}</ol>
          {p.id === 'opsradar' && <p className="notice">Focused on alerts and host liveness. Metrics storage, log indexing, and distributed tracing are outside this project’s scope.</p>}
          {p.repository && <a className="button repository-link" href={p.repository} target="_blank" rel="noopener noreferrer">View source on GitHub ↗</a>}
          {p.plannedRepository && <div className="repository-placeholder"><span className="eyebrow">GITHUB / COMING SOON</span><p className="muted">The OpsRadar repository will be published on my account. Planned URL:</p><code>{p.plannedRepository}</code><p className="notice">Placeholder — repository not published yet.</p></div>}
        </div>}
      </div>
    </article>
  );
}
