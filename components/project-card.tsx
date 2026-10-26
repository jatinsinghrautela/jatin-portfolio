'use client';
import type {PortfolioProject} from './project-data';

export default function ProjectCard({project: p}: {project: PortfolioProject}) {
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
          <a className="button" href={`/projects/${p.id}`} aria-label={`Explore ${p.title} case study`}>Explore details ↗</a>
        </div>

      </div>
    </article>
  );
}
