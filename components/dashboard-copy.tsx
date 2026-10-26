'use client';
import {useEffect,useRef,useState} from 'react';

export default function DashboardCopy({heading,emphasis,introduction}:{heading:string;emphasis:string;introduction:string}){
 const root=useRef<HTMLDivElement>(null),[count,setCount]=useState(0);
 const total=heading.length+emphasis.length+introduction.length;
 useEffect(()=>{
  const motion=matchMedia('(prefers-reduced-motion: reduce)');let typed=0,timer:ReturnType<typeof setInterval>|undefined,visible=false;
  setCount(0);
  const stop=()=>{clearInterval(timer);timer=undefined};
  const sync=()=>{stop();if(motion.matches){typed=total;setCount(total);return}if(!visible||document.hidden||typed>=total)return;timer=setInterval(()=>{typed++;setCount(typed);if(typed>=total)stop()},24)};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()},{threshold:.1});
  if(root.current)observer.observe(root.current);motion.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);sync();
  return()=>{stop();observer.disconnect();motion.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync)};
 },[heading,emphasis,introduction,total]);
 function line(text:string,start:number){const chars=Math.max(0,Math.min(text.length,count-start));const active=count>=start&&count<start+text.length;return <span className="dashboard-type-line"><span className="sr-only">{text}</span><span className="dashboard-type-reserve" aria-hidden="true">{text}</span><span className="dashboard-type-ink" aria-hidden="true">{text.slice(0,chars)}{active&&<i className="dashboard-type-caret"/>}</span></span>}
 return <div className="dashboard-copy" ref={root}><h1 data-search-text={`${heading} ${emphasis}`}>{line(heading,0)}<em>{line(emphasis,heading.length)}</em></h1><p className="lead" data-search-text={introduction}>{line(introduction,heading.length+emphasis.length)}</p></div>;
}
