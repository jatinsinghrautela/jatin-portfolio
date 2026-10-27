'use client';
import {useEffect,useRef,useState} from 'react';
type Turnstile={render:(element:HTMLElement,options:Record<string,unknown>)=>string;remove:(id:string)=>void};
declare global{interface Window{turnstile?:Turnstile}}
let settings:Promise<{required:boolean;siteKey?:string}>|undefined;
let script:Promise<void>|undefined;
function loadScript(){return script??=new Promise<void>((resolve,reject)=>{const node=document.createElement('script');node.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';node.async=true;node.onload=()=>resolve();node.onerror=()=>{script=undefined;node.remove();reject(Error('Verification could not load. Please refresh and try again.'))};document.head.appendChild(node)})}
export default function HumanCheck({action,reset,onToken}:{action:'contact'|'login';reset:number;onToken:(token:string)=>void}){
 const root=useRef<HTMLDivElement>(null),callback=useRef(onToken),[error,setError]=useState('');callback.current=onToken;
 useEffect(()=>{let cancelled=false,id:string|undefined;setError('');callback.current('');
  const config=settings??=fetch('/api/public-config').then(r=>{if(!r.ok)throw Error('Verification is unavailable. Please try again later.');return r.json() as Promise<{required:boolean;siteKey?:string}>}).catch(e=>{settings=undefined;throw e});
  config.then(async value=>{if(!value.required)return;if(!value.siteKey)throw Error('Form verification is not configured yet.');await loadScript();if(cancelled||!root.current)return;id=window.turnstile!.render(root.current,{sitekey:value.siteKey,action,theme:'auto',size:'flexible',callback:(token:string)=>callback.current(token),'expired-callback':()=>callback.current(''),'error-callback':()=>{callback.current('');setError('Verification failed. Please refresh and try again.')}})}).catch(e=>{if(!cancelled)setError(e.message)});
  return()=>{cancelled=true;if(id)window.turnstile?.remove(id)};
 },[action,reset]);
 return <div className="human-check"><div ref={root}/>{error&&<p className="notice" role="status">{error}</p>}</div>;
}
