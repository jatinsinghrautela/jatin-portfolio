'use client';
import {useSiteContent} from './content-provider';
import Link from 'next/link';
import {useEffect,useRef,useState} from 'react';
import {Controls} from './studio';
export default function SiteHeader({page}:{page:string}){const {content,copy}=useSiteContent();
 const[open,setOpen]=useState(false);const button=useRef<HTMLButtonElement>(null);const root=useRef<HTMLElement>(null);
 useEffect(()=>{function key(e:KeyboardEvent){if(e.key==='Escape'&&open){setOpen(false);button.current?.focus()}}function outside(e:PointerEvent){if(root.current&&!root.current.contains(e.target as Node))setOpen(false)}document.addEventListener('keydown',key);document.addEventListener('pointerdown',outside);return()=>{document.removeEventListener('keydown',key);document.removeEventListener('pointerdown',outside)}},[open]);
 return <nav className="site-nav" ref={root} aria-label={copy("site-header.001.aria-label","Main navigation")}><Link className="brand" href={copy("site-header.002.href","/")} onClick={()=>setOpen(false)}><span className="brand-orbit" aria-hidden="true"><i/><b>{copy("site-header.003","JR")}</b></span><span className="brand-caption">{content.identity.name}<span>{content.identity.role}</span></span></Link><div className="header-controls"><Controls/><button className={`menu-toggle ${open?'is-open':''}`} ref={button} type="button" onClick={()=>setOpen(!open)} aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="main-navigation"><span/><span/><span/></button></div><div id="main-navigation" className={`navlinks ${open?'menu-open':''}`}>{content.navigation.map(([id,url,label],i)=><Link className={id===page?'active':''} aria-current={id===page?'page':undefined} key={id} href={url} onClick={()=>setOpen(false)}><span className="menu-number">0{i+1}</span>{label}<span className="menu-arrow" aria-hidden="true">↗</span></Link>)}</div></nav>
}
