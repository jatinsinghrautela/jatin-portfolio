import {createRoot,hydrateRoot} from 'react-dom/client';
import {ContentProvider} from '../../components/content-provider';
import {contentSchema,defaultContent} from '../../lib/content-model';
import {RouteView} from '../app';
import {usePathname} from '../navigation';
import '../../app/globals.css';
function savedContent(){try{const value=JSON.parse(localStorage.getItem('portfolio-public-content')||'null');const parsed=contentSchema.safeParse(value);return parsed.success?parsed.data as typeof defaultContent:defaultContent}catch{return defaultContent}}
function App(){const path=usePathname();return <ContentProvider initial={defaultContent} staticMode fallback={savedContent}><RouteView path={path}/></ContentProvider>}
const root=document.getElementById('portfolio-root')!;
// Hydrate only the path used for the generated HTML. Unknown project URLs use the static home shell and render afresh.
if(root.dataset.path===location.pathname)hydrateRoot(root,<App/>);else createRoot(root).render(<App/>);
