'use client';
import {useSiteContent} from './content-provider';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {Controls} from './studio';
import SiteSearch from './site-search';
export default function SiteHeader({page}:{page:string}){const {content,copy}=useSiteContent();
 const[open,setOpen]=useState(false);const[compact,setCompact]=useState(false);const measure=useRef<HTMLDivElement>(null);const button=useRef<HTMLButtonElement>(null);const root=useRef<HTMLElement>(null);
 useEffect(()=>{function key(e:KeyboardEvent){if(e.key==='Escape'&&open){setOpen(false);button.current?.focus()}}function outside(e:PointerEvent){if(root.current&&!root.current.contains(e.target as Node))setOpen(false)}document.addEventListener('keydown',key);document.addEventListener('pointerdown',outside);return()=>{document.removeEventListener('keydown',key);document.removeEventListener('pointerdown',outside)}},[open]);
 useEffect(()=>{const nav=root.current,probe=measure.current;if(!nav||!probe)return;let frame=0;
 const update=()=>{frame=0;const brand=nav.querySelector('.brand') as HTMLElement,controls=nav.querySelector('.header-controls') as HTMLElement;const style=getComputedStyle(nav);
 // Measure desktop controls only. The hamburger and stretched compact grid must never affect the fit decision.
 const items=Array.from(controls.children).filter(e=>!e.classList.contains('menu-toggle')) as HTMLElement[];
 const controlsWidth=items.reduce((sum,e)=>sum+e.getBoundingClientRect().width,0)+Math.max(0,items.length-1)*14;
 const required=brand.getBoundingClientRect().width+controlsWidth+probe.scrollWidth+parseFloat(style.paddingLeft)+parseFloat(style.paddingRight)+60;
 const next=nav.clientWidth<=1180||required>nav.clientWidth;setCompact(next);if(!next)setOpen(false)};
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};const observer=new ResizeObserver(schedule);observer.observe(nav);observer.observe(probe);const brand=nav.querySelector('.brand');if(brand)observer.observe(brand);window.addEventListener('resize',schedule);schedule();document.fonts?.ready.then(schedule);return()=>{observer.disconnect();window.removeEventListener('resize',schedule);cancelAnimationFrame(frame)}},[content.navigation,content.identity.name]);

 return <nav className={`site-nav ${compact?'nav-adaptive':''}`} ref={root} aria-label={copy("site-header.001.aria-label","Main navigation")}><Link className="brand" href={copy("site-header.002.href","/")} onClick={()=>setOpen(false)}><span className="brand-orbit" aria-hidden="true"><i/><b>{copy("site-header.003","JR")}</b></span><span className="brand-caption">{content.identity.name}<span>{content.identity.role}</span></span></Link><div className="header-controls"><SiteSearch page={page} onOpen={()=>setOpen(false)}/><Controls/><button className={`menu-toggle ${open?'is-open':''}`} ref={button} type="button" onClick={()=>setOpen(!open)} aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="main-navigation"><span/><span/><span/></button></div><div id="main-navigation" className={`navlinks ${open?'menu-open':''}`}>{content.navigation.map(([id,url,label],i)=><Link className={id===page?'active':''} aria-current={id===page?'page':undefined} key={id} href={url} onClick={()=>setOpen(false)}>{label}<span className="menu-arrow" aria-hidden="true">↗</span></Link>)}</div><div ref={measure} className="nav-measure" aria-hidden="true">{content.navigation.map(([id,,label])=><span key={id}>{label}</span>)}</div></nav>
}
