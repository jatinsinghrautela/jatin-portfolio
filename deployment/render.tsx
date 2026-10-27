import {renderToString} from 'react-dom/server';
import {ContentProvider} from '../components/content-provider';
import {defaultContent} from '../lib/content-model';
import {RouteView} from './app';
export const paths=['/','/projects','/experience','/skills','/about','/certifications','/contact','/cockpit',...defaultContent.projects.map(p=>`/projects/${p.id}`)];
export function render(path:string){return renderToString(<ContentProvider initial={defaultContent}><RouteView path={path}/></ContentProvider>)}
