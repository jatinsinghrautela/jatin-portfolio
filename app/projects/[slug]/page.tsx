import {notFound} from 'next/navigation';
import ProjectDetail from '../../../components/project-detail';
import {loadPublicContent} from '../../../lib/site-store';
export default async function Page({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const content=await loadPublicContent();if(!content.projects.some(p=>p.id===slug))notFound();return <ProjectDetail id={slug}/>}
