import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
const absolute=(path:string)=>fileURLToPath(new URL(path,import.meta.url));
export default defineConfig({root:absolute('./deployment/site'),publicDir:absolute('./public'),plugins:[react()],resolve:{alias:{'next/link':absolute('./deployment/link.tsx'),'next/navigation':absolute('./deployment/navigation.ts')}},build:{outDir:absolute('./dist/free/client'),emptyOutDir:true,sourcemap:false}});
