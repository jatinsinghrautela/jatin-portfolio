'use client';
import {useEffect,useState} from 'react';
import {createPortal} from 'react-dom';
import {Check,Send} from 'lucide-react';

export function MailFlight({active}:{active:boolean}){
 const [mounted,setMounted]=useState(false);
 useEffect(()=>{setMounted(true)},[]);
 if(!mounted||!active)return null;
 // Portal keeps the fixed flight relative to the viewport, outside animated page containers.
 return createPortal(<div className="mail-flight-overlay" aria-hidden="true"><div className="mail-launch-ring"/><div className="mail-flight-plane"><Send size={48} strokeWidth={1.5}/></div></div>,document.body);
}

export function SentConfirmation({message}:{message:string}){
 const [chars,setChars]=useState(0);
 useEffect(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches){setChars(message.length);return}setChars(0);const timer=setInterval(()=>setChars(n=>{if(n>=message.length){clearInterval(timer);return n}return n+1}),22);return()=>clearInterval(timer)},[message]);
 return <span className="sent-confirmation"><Check size={19} aria-hidden="true"/><span className="sr-only">{message}</span><span aria-hidden="true">{message.slice(0,chars)}{chars<message.length&&<i className="confirmation-caret"/>}</span></span>;
}
