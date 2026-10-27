import {useSyncExternalStore} from 'react';
const event='portfolio-navigation';
export function navigate(href:string){const url=new URL(href,location.href);if(url.origin!==location.origin){location.assign(url.href);return}history.pushState(null,'',url);window.dispatchEvent(new Event(event));if(url.hash)requestAnimationFrame(()=>document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView());else window.scrollTo(0,0)}
function subscribe(fn:()=>void){window.addEventListener('popstate',fn);window.addEventListener(event,fn);return()=>{window.removeEventListener('popstate',fn);window.removeEventListener(event,fn)}}
export function usePathname(){return useSyncExternalStore(subscribe,()=>location.pathname,()=>typeof document==='undefined'?'/':document.getElementById('portfolio-root')?.dataset.path||'/')}
export function useRouter(){return {push:navigate,replace:(url:string)=>{history.replaceState(null,'',url);window.dispatchEvent(new Event(event))},back:()=>history.back(),refresh:()=>location.reload()}}
