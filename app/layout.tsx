import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
const geist=Geist({variable:"--font",subsets:["latin"]});
export const metadata:Metadata={title:"Portal de Objetivos en Cascada",description:"Gestión estratégica y preparación EDD"};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="es"><body className={geist.variable}>{children}</body></html>}
