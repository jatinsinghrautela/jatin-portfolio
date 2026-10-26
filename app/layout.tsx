import {loadPublicContent} from '../lib/site-store';
import {ContentProvider} from '../components/content-provider';
import type { Metadata } from 'next';
import './globals.css';
export async function generateMetadata():Promise<Metadata>{const content=await loadPublicContent();return {title:content.identity.siteTitle,description:content.identity.description,icons:{icon:content.identity.favicon}}}
export default async function Layout({children}:{children:React.ReactNode}){const content=await loadPublicContent();return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:`(function(){try{var t=localStorage.getItem('studio-theme');if(t!=='dark'&&t!=='light')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}})();`}}/></head><body><ContentProvider initial={content}>{children}</ContentProvider></body></html>}
