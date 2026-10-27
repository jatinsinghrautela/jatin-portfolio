import type {AnchorHTMLAttributes} from 'react';
import {navigate} from './navigation';
export default function Link({href,onClick,...props}:AnchorHTMLAttributes<HTMLAnchorElement>&{href:string}){return <a {...props} href={href} onClick={e=>{onClick?.(e);if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||props.target||props.download!==undefined)return;const url=new URL(href,location.href);if(url.origin===location.origin&&!url.pathname.startsWith('/api/')){e.preventDefault();navigate(href)}}}/>}
