import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Jatin Singh Rautela | DevOps Engineer',description:'DevOps engineer at Comviva in Bengaluru. AWS, Azure, Kubernetes, GitOps, infrastructure automation, and observability.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body>{children}</body></html>}
