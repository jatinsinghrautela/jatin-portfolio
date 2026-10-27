import Portfolio from '../components/portfolio';
import Cms from '../components/cms';
import ProjectDetail from '../components/project-detail';
import SiteHeader from '../components/site-header';
import SiteFooter from '../components/site-footer';
import {useSiteContent} from '../components/content-provider';
const pages:Record<string,string>={'/':'home','/projects':'projects','/experience':'experience','/skills':'skills','/certifications':'certifications','/about':'about','/contact':'contact'};
export function RouteView({path}:{path:string}){const {content,ready}=useSiteContent();const clean=path==='/'?path:path.replace(/\/$/,'');if(clean==='/cockpit')return <Cms/>;if(pages[clean])return <Portfolio key={clean} page={pages[clean]}/>;const slug=clean.match(/^\/projects\/([a-z0-9-]+)$/)?.[1];if(slug&&content.projects.some(p=>p.id===slug)&&content.caseStudies[slug])return <ProjectDetail key={slug} id={slug}/>;if(slug&&!ready)return <><SiteHeader page="projects"/><main className="innerhero"><p role="status">Opening project…</p></main><SiteFooter/></>;return <><SiteHeader page=""/><main className="innerhero"><h1>Page not found.</h1><a className="button" href="/">Return home ↗</a></main><SiteFooter/></>}
