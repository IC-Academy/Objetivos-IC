import {useMemo,useState} from "react";

type Health="En tiempo"|"En riesgo"|"Crítico";
type Class="Estratégico"|"Secundario";
type Objective={
  id:string; title:string; description:string; class:Class; owner:string; branch:string;
  progress:number; expected:number; areas:string[]; children?:string[]; secondaryReason?:string;
};
type Person={name:string;role:string;branch:string;objectiveIds:string[];children?:Person[]};

const STRATEGIC:Objective[]=[
 {id:"EST-01",title:"Rotación Zona Norte",description:"Reducir 20% la rotación operativa de las regiones Norte durante FY2027.",class:"Estratégico",owner:"Juan Carlos Pérez",branch:"Operaciones · Nor-Este / Nor-Oeste",progress:72,expected:78,areas:["Operaciones","Recursos Humanos","Reclutamiento"],children:["DER-01","DER-02"]},
 {id:"EST-02",title:"Crecimiento comercial",description:"Cumplir el objetivo anual de ventas nuevas priorizando oportunidades de mayor margen.",class:"Estratégico",owner:"Dirección Comercial",branch:"Ventas / Marketing / Pricing",progress:84,expected:80,areas:["Ventas","Marketing","Pricing"]},
 {id:"EST-03",title:"Rentabilidad",description:"Elevar la rentabilidad de clientes estratégicos mediante control de costos y acciones correctivas.",class:"Estratégico",owner:"Armando Acosta",branch:"Finanzas / Operaciones / BI",progress:58,expected:70,areas:["Finanzas","Operaciones","Inteligencia de Negocios"]},
 {id:"EST-04",title:"Cobertura operativa",description:"Mantener cobertura superior al 98% en servicios prioritarios y reducir posiciones descubiertas.",class:"Estratégico",owner:"Operaciones",branch:"Operaciones / Reclutamiento",progress:91,expected:88,areas:["Operaciones","Reclutamiento"]},
 {id:"EST-05",title:"Continuidad de instalaciones críticas",description:"Elevar el cumplimiento del mantenimiento preventivo y disminuir correctivos de instalaciones críticas.",class:"Estratégico",owner:"Diana López",branch:"Calidad · Mantenimiento",progress:49,expected:68,areas:["Calidad, Seguridad y Medio Ambiente"],children:["DER-03"]}
];

const DERIVED:Objective[]=[
 {id:"DER-01",title:"Rotación Nor-Este",description:"Reducir la rotación de Nor-Este mediante acciones diferenciadas por plaza.",class:"Estratégico",owner:"Yuseff Mora",branch:"Operaciones · Nor-Este",progress:76,expected:78,areas:["Operaciones"]},
 {id:"DER-02",title:"Rotación Nor-Oeste",description:"Reducir la rotación de Nor-Oeste priorizando plazas de mayor desviación.",class:"Estratégico",owner:"Karla Vibriezca",branch:"Operaciones · Nor-Oeste",progress:67,expected:76,areas:["Operaciones"]},
 {id:"DER-03",title:"Mantenimiento preventivo",description:"Cumplir el programa preventivo de instalaciones críticas y reducir correctivos.",class:"Estratégico",owner:"Omar Cortés",branch:"Calidad · Mantenimiento",progress:49,expected:68,areas:["Mantenimiento"]}
];

const SECONDARY:Objective[]=[
 {id:"SEC-01",title:"Cobertura Metro",description:"Mantener cobertura operativa de Región Metro por arriba de 98%.",class:"Secundario",owner:"Concepción Luna",branch:"Operaciones · Metro",progress:88,expected:84,areas:["Operaciones"],secondaryReason:"La rama Metro no participa en EST-01 Rotación Zona Norte."},
 {id:"SEC-02",title:"Control de tiempo extra",description:"Reducir 10% el tiempo extra no facturable en Bajío-Centro-Sur.",class:"Secundario",owner:"Víctor Sánchez",branch:"Operaciones · Bajío-Centro-Sur",progress:63,expected:72,areas:["Operaciones"],secondaryReason:"La rama Bajío-Centro-Sur no participa en EST-01."},
 {id:"SEC-03",title:"SLA del CCO",description:"Alcanzar 95% de cumplimiento del SLA operativo del CCO.",class:"Secundario",owner:"Manuel Nolasco",branch:"Operaciones · CCO",progress:82,expected:80,areas:["CCO"],secondaryReason:"CCO no participa directamente en los objetivos estratégicos mostrados."},
 {id:"SEC-04",title:"Auditorías de calidad",description:"Lograr 95% de cumplimiento del programa de auditorías internas.",class:"Secundario",owner:"Benjamín Gudiño",branch:"Calidad · Calidad",progress:78,expected:75,areas:["Calidad"],secondaryReason:"Calidad no participa en EST-05, que baja únicamente a Mantenimiento."},
 {id:"SEC-05",title:"Programa de Seguridad e Higiene",description:"Cumplir 100% del programa anual de seguridad, higiene y medio ambiente.",class:"Secundario",owner:"Andrea Gutiérrez",branch:"Calidad · Seguridad, Higiene y Medio Ambiente",progress:69,expected:72,areas:["Seguridad e Higiene"],secondaryReason:"Esta rama conserva objetivos propios de cumplimiento."},
 {id:"SEC-06",title:"Programa preventivo de salud",description:"Alcanzar 90% de cumplimiento de acciones preventivas de salud laboral.",class:"Secundario",owner:"Mayra Martínez",branch:"Calidad · Salud",progress:92,expected:85,areas:["Salud"],secondaryReason:"Salud mantiene un objetivo de gestión propio."}
];

const PEOPLE:Person[]=[
 {name:"Juan Carlos Pérez",role:"Director Nacional de Operaciones",branch:"Operaciones",objectiveIds:["EST-01","EST-04"],children:[
   {name:"Yuseff Mora",role:"Gerente de Operaciones Nor-Este",branch:"Nor-Este",objectiveIds:["DER-01"],children:[
     {name:"Jair Gutiérrez",role:"Coordinador Operaciones NLD",branch:"Nor-Este",objectiveIds:["DER-01"]},
     {name:"Brenda Macías",role:"Coordinador Operaciones MTY",branch:"Nor-Este",objectiveIds:["DER-01"]}
   ]},
   {name:"Concepción Luna",role:"Gerente de Operaciones Metro",branch:"Metro",objectiveIds:["SEC-01"]},
   {name:"Karla Vibriezca",role:"Gerente de Operaciones Nor-Oeste",branch:"Nor-Oeste",objectiveIds:["DER-02"]},
   {name:"Víctor Sánchez",role:"Gerente de Operaciones Bajío-Centro-Sur",branch:"Bajío-Centro-Sur",objectiveIds:["SEC-02"]},
   {name:"Manuel Nolasco",role:"Gerente CCO",branch:"CCO",objectiveIds:["SEC-03"]}
 ]},
 {name:"Diana López",role:"Líder de Calidad, Seguridad y Medio Ambiente",branch:"Calidad",objectiveIds:["EST-05"],children:[
   {name:"Benjamín Gudiño",role:"Analista de Calidad",branch:"Calidad",objectiveIds:["SEC-04"]},
   {name:"Andrea Gutiérrez",role:"Analista de Seguridad, Higiene y Medio Ambiente",branch:"Seguridad e Higiene",objectiveIds:["SEC-05"]},
   {name:"Mayra Martínez",role:"Médico laboral",branch:"Salud",objectiveIds:["SEC-06"]},
   {name:"Omar Cortés",role:"Coordinador de Mantenimiento",branch:"Mantenimiento",objectiveIds:["DER-03"]}
 ]}
];

const ALL=[...STRATEGIC,...DERIVED,...SECONDARY];
const health=(o:Objective):Health=>{const d=o.progress-o.expected;return d>=-5?"En tiempo":d>=-15?"En riesgo":"Crítico"};
const tone=(h:Health)=>h==="En tiempo"?"ok":h==="En riesgo"?"warn":"bad";

function ObjCard({o,onOpen}:{o:Objective;onOpen:(id:string)=>void}){
 const h=health(o),d=o.progress-o.expected;
 return <article className={`cmObjective ${tone(h)}`}>
  <div className="cmObjectiveMain"><span>{o.id}</span><h3>{o.title}</h3><p>{o.description}</p><small>{o.owner} · {o.branch}</small></div>
  <div className="cmMetric"><small>Avance actual</small><b>{o.progress}%</b><span>Esperado {o.expected}%</span></div>
  <div className={`cmState ${tone(h)}`}><small>Estado</small><b>{h}</b><span>{d>=0?"+":""}{d} pts vs esperado</span><i><em style={{width:`${o.progress}%`}}/></i></div>
  <button type="button" onClick={()=>onOpen(o.id)}>Ver detalle →</button>
 </article>
}

export function DirectionCascadeDemo({page}:{page:string}){
 const [filter,setFilter]=useState<"Todos"|Health>("Todos");
 const [detail,setDetail]=useState<string|null>(null);
 const [showSecondary,setShowSecondary]=useState(false);
 const [person,setPerson]=useState<Person|null>(null);
 const counts={Todos:STRATEGIC.length,"En tiempo":STRATEGIC.filter(x=>health(x)==="En tiempo").length,"En riesgo":STRATEGIC.filter(x=>health(x)==="En riesgo").length,"Crítico":STRATEGIC.filter(x=>health(x)==="Crítico").length};
 const shown=filter==="Todos"?STRATEGIC:STRATEGIC.filter(x=>health(x)===filter);
 const coveragePeople=useMemo(()=>flatten(PEOPLE),[]);
 const covered=coveragePeople.filter(x=>x.objectiveIds.length>0).length;
 const coverage=Math.round((covered/coveragePeople.length)*100);

 if(page==="Organigrama") return <OrgExplorer selected={person} select={setPerson}/>;
 if(page==="Alertas") return <div className="cmPage"><Hero eyebrow="ALERTAS" title="Objetivos que requieren intervención" text="Sólo desviaciones materiales de objetivos estratégicos; los secundarios no contaminan esta lectura."/>{STRATEGIC.filter(x=>health(x)!=="En tiempo").sort((a,b)=>(a.progress-a.expected)-(b.progress-b.expected)).map(o=><ObjCard key={o.id} o={o} onOpen={setDetail}/>)}</div>;
 if(page==="Objetivos estratégicos") return <div className="cmPage"><Hero eyebrow="OBJETIVOS ESTRATÉGICOS" title="Prioridades definidas por Dirección" text="La cantidad es configurable por ciclo. Cada objetivo baja únicamente por las ramas responsables del organigrama."/><div className="cmCards">{STRATEGIC.map(o=><button type="button" className="cmTile" key={o.id} onClick={()=>setDetail(o.id)}><span>{o.id}</span><em className={tone(health(o))}>{health(o)}</em><h3>{o.title}</h3><p>{o.branch}</p><b>{o.progress}%</b></button>)}</div></div>;
 if(detail){const o=ALL.find(x=>x.id===detail)!;return <ObjectiveDetail o={o} back={()=>setDetail(null)}/>}

 return <div className="cmPage">
  <div className="cmFilters"><label>Ciclo<select defaultValue="FY2027"><option>FY2027</option></select></label><label>Periodo<select defaultValue="Actual"><option>Actual</option></select></label><label>Vista<select defaultValue="Estratégicos"><option>Estratégicos</option></select></label></div>
  <div className="cmStatus">{(["Todos","En tiempo","En riesgo","Crítico"] as const).map(x=><button type="button" key={x} className={`${filter===x?"active":""} ${x==="Todos"?"":tone(x)}`} onClick={()=>setFilter(x)}><b>{counts[x]}</b><span>{x}{x==="Todos"?" en este ciclo":""}</span></button>)}</div>
  <Hero eyebrow="PORTAFOLIO ESTRATÉGICO" title="Objetivos que mueven el negocio" text="Dirección mantiene el foco sólo en las prioridades estratégicas y su trayectoria." aside={<><strong>{Math.round(STRATEGIC.reduce((s,x)=>s+x.progress,0)/STRATEGIC.length)}%</strong><small>avance estratégico</small></>}/>
  <div className="cmObjectiveList">{shown.map(o=><ObjCard key={o.id} o={o} onOpen={setDetail}/>)}</div>

  <section className="cmComplement">
   <div><span>GESTIÓN COMPLEMENTARIA</span><h3>Objetivos secundarios de la organización</h3><p>Garantizan cobertura para ramas que no participan en un objetivo estratégico, sin afectar el avance de los principales.</p></div>
   <div className="cmComplementStats"><b>{SECONDARY.length}<small>secundarios demo</small></b><b>{coverage}%<small>cobertura organizacional</small></b><button type="button" onClick={()=>setShowSecondary(v=>!v)}>{showSecondary?"Ocultar":"Ver gestión complementaria"} →</button></div>
  </section>
  {showSecondary&&<section className="cmSecondary"><div className="cmSectionHead"><div><span>SEGUNDO NIVEL DE VISIBILIDAD</span><h3>Objetivos secundarios activos</h3></div><small>No suman ni restan al avance estratégico.</small></div>{SECONDARY.map(o=><ObjCard key={o.id} o={o} onOpen={setDetail}/>)}</section>}
 </div>
}

export function LeaderCascadeDemo({userName}:{userName:string}){
 const isDiana=userName==="Diana López";
 const principal=isDiana?[STRATEGIC[4]]:userName==="Juan Carlos Pérez"?[STRATEGIC[0],STRATEGIC[3]]:STRATEGIC.filter(x=>x.areas.includes("Finanzas"));
 const secondary=isDiana?SECONDARY.filter(x=>x.branch.startsWith("Calidad")):userName==="Juan Carlos Pérez"?SECONDARY.filter(x=>x.branch.startsWith("Operaciones")):SECONDARY.slice(0,2);
 return <div className="cmPage">
  <Hero eyebrow="MI ÁREA" title={isDiana?"Calidad, Seguridad y Medio Ambiente":userName==="Juan Carlos Pérez"?"Operaciones":"Gestión del líder"} text="El líder recibe objetivos estratégicos sólo cuando su rama participa y crea secundarios para cubrir el resto de su estructura."/>
  <div className="cmLeaderSummary"><b>{principal.length}<span>estratégicos / derivados</span></b><b>{secondary.length}<span>secundarios</span></b><b>100%<span>ramas con objetivo</span></b></div>
  <section className="cmLeaderGroup"><div className="cmSectionHead"><div><span>PRIORIDAD ESTRATÉGICA</span><h3>Objetivos que vienen de Dirección</h3></div></div>{principal.map(o=><ObjCard key={o.id} o={o} onOpen={()=>{}}/>)}</section>
  <section className="cmLeaderGroup"><div className="cmSectionHead"><div><span>GESTIÓN DEL ÁREA</span><h3>Objetivos secundarios</h3></div><small>Se asignan a las ramas que no participan en los principales.</small></div>{secondary.map(o=><ObjCard key={o.id} o={o} onOpen={()=>{}}/>)}</section>
 </div>
}

function ObjectiveDetail({o,back}:{o:Objective;back:()=>void}){
 const h=health(o),d=o.progress-o.expected;
 const branchObjectives=o.id==="EST-01"?[DERIVED[0],DERIVED[1],SECONDARY[0],SECONDARY[1],SECONDARY[2]]:o.id==="EST-05"?[DERIVED[2],SECONDARY[3],SECONDARY[4],SECONDARY[5]]:[];
 return <div className="cmPage"><button type="button" className="cmBack" onClick={back}>← Volver</button>
  <section className="cmDetailHero"><div><span>{o.class.toUpperCase()} · {o.id}</span><h2>{o.title}</h2><p>{o.description}</p></div><em className={tone(h)}>{h}</em></section>
  <div className="cmDetailKpis"><b>{o.progress}%<span>avance actual</span></b><b>{o.expected}%<span>avance esperado</span></b><b className={d<-5?"negative":""}>{d>=0?"+":""}{d} pts<span>desviación</span></b><b>{o.areas.length}<span>áreas involucradas</span></b></div>
  {o.secondaryReason&&<div className="cmReason"><b>Por qué es secundario</b><p>{o.secondaryReason}</p></div>}
  {branchObjectives.length>0&&<section className="cmTree"><div className="cmSectionHead"><div><span>CASCADA Y COBERTURA</span><h3>Cómo baja este objetivo por el organigrama</h3></div></div><div className="cmRoot"><b>{o.title}</b><span>{o.owner}</span></div><div className="cmConnector">↓</div><div className="cmBranchGrid">{branchObjectives.map(x=><article key={x.id} className={x.class==="Secundario"?"secondary":""}><span>{x.class}</span><b>{x.owner}</b><p>{x.title}</p><small>{x.branch}</small></article>)}</div></section>}
 </div>
}

function OrgExplorer({selected,select}:{selected:Person|null;select:(p:Person|null)=>void}){
 return <div className="cmPage"><Hero eyebrow="ORGANIGRAMA" title="Objetivos por persona y rama" text="Dirección puede consultar toda la organización sin mezclar esa información con su dashboard estratégico."/>
 <div className="cmOrgLayout"><section className="cmOrgTree">{PEOPLE.map(root=><OrgNode key={root.name} p={root} select={select} level={0}/>)}</section>
 <aside className="cmPersonPanel">{selected?<><button type="button" onClick={()=>select(null)}>×</button><span>{selected.branch}</span><h3>{selected.name}</h3><p>{selected.role}</p><div>{selected.objectiveIds.map(id=>{const o=ALL.find(x=>x.id===id);return o?<article key={id}><em className={o.class==="Estratégico"?"primary":"secondary"}>{o.class}</em><b>{o.title}</b><small>{o.progress}% · {health(o)}</small></article>:null})}</div></>:<><span>SELECCIONA UNA PERSONA</span><h3>Consulta contextual</h3><p>Haz clic en cualquier nodo para ver sus objetivos estratégicos, derivados o secundarios.</p></>}</aside></div></div>
}

function OrgNode({p,select,level}:{p:Person;select:(p:Person)=>void;level:number}){
 return <div className="cmOrgNodeWrap"><button type="button" className="cmOrgNode" style={{marginLeft:level*22}} onClick={()=>select(p)}><span>{p.branch}</span><b>{p.name}</b><small>{p.role}</small><em>{p.objectiveIds.length} obj.</em></button>{p.children?.map(c=><OrgNode key={c.name} p={c} select={select} level={level+1}/>)}</div>
}
function flatten(xs:Person[]):Person[]{return xs.flatMap(x=>[x,...flatten(x.children||[])])}
function Hero({eyebrow,title,text,aside}:{eyebrow:string;title:string;text:string;aside?:any}){return <section className="cmHero"><div><span>{eyebrow}</span><h2>{title}</h2><p>{text}</p></div>{aside&&<div className="cmHeroAside">{aside}</div>}</section>}
