import {useMemo,useState} from "react";

type Health="En tiempo"|"En riesgo"|"Crítico"|"Sin dato";
type Class="Estratégico"|"Secundario";
type Objective={
  id:string;
  title:string;
  description:string;
  class:Class;
  owner:string;
  branch:string;
  progress:number;
  expected:number;
  areas:string[];
  hasData?:boolean;
  indicator?:string;
  formula?:string;
  source?:string;
  frequency?:string;
  targetText?:string;
  trafficLight?:string;
  supportIndicators?:string;
  actionRule?:string;
  notes?:string;
  children?:string[];
  secondaryReason?:string;
  assignees?:string[];
};
type Person={name:string;role:string;branch:string;objectiveIds:string[];children?:Person[]};

const STRATEGIC:Objective[]=[
 {
  id:"FY27-01",
  title:"Cumplimiento del presupuesto de ventas",
  description:"Alcanzar el 95% del presupuesto de ventas en todas las unidades de negocio, en cada periodo y en el acumulado al cierre del FY2027.",
  class:"Estratégico",
  owner:"Director de cada UN · FP&A valida",
  branch:"Ventas / Unidades de negocio",
  progress:0,expected:0,hasData:false,
  areas:["Ventas","Finanzas"],
  indicator:"Cumplimiento de ventas",
  formula:"Venta neta real ÷ Venta presupuestada × 100",
  source:"SAP: facturación neta de notas de crédito y cancelaciones",
  frequency:"Mensual, al cierre contable",
  targetText:"≥95%",
  trafficLight:"Verde ≥95% · Amarillo 90–94.9% · Rojo <90%",
  actionRule:"2 meses consecutivos en amarillo o rojo activan un plan de recuperación por la UN."
 },
 {
  id:"FY27-02",
  title:"Flujo de caja y remesa al corporativo",
  description:"Lograr el 90% del flujo de caja presupuestado y remitir 2 MM USD al corporativo durante el FY2027.",
  class:"Estratégico",
  owner:"CFO · Tesorería",
  branch:"Finanzas / Tesorería",
  progress:0,expected:0,hasData:false,
  areas:["Finanzas"],
  indicator:"Cumplimiento de flujo de caja + avance de remesa",
  formula:"Flujo real acumulado ÷ Flujo presupuestado acumulado × 100 · USD remitidos acumulados ÷ USD programados a la fecha × 100",
  source:"Reporte de tesorería / estado de flujo de efectivo · comprobantes de transferencia",
  frequency:"Mensual",
  targetText:"Flujo ≥90% · 2 MM USD al cierre FY2027",
  trafficLight:"Flujo: Verde ≥90% · Amarillo 85–89.9% · Rojo <85%. Remesa: Verde ≥100% del calendario · Amarillo 80–99% · Rojo <80%",
  supportIndicators:"DSO · cartera vencida >90 días como % del total · saldo mínimo de caja antes de cada remesa",
  notes:"La remesa se mide en USD efectivamente enviados para evitar distorsión por variación cambiaria."
 },
 {
  id:"FY27-03",
  title:"Cumplimiento de Operating Income",
  description:"Alcanzar el 100% del Operating Income presupuestado al cierre del FY2027.",
  class:"Estratégico",
  owner:"Director General · Directores de UN · FP&A valida",
  branch:"Dirección / Finanzas / Unidades de negocio",
  progress:0,expected:0,hasData:false,
  areas:["Finanzas","Operaciones","Ventas"],
  indicator:"Cumplimiento de Operating Income",
  formula:"OI real acumulado ÷ OI presupuestado acumulado × 100",
  source:"P&L de cierre mensual, misma base contable del presupuesto",
  frequency:"Mensual",
  targetText:"100%",
  trafficLight:"Verde ≥100% · Amarillo 95–99.9% · Rojo <95%",
  supportIndicators:"Margen OI (pb vs. presupuesto) · tiempo extra como % de la nómina operativa · G&A como % de la venta",
  notes:"Debe fijarse una sola base de medición: NIF local o reporting US GAAP corporativo, consistente con el presupuesto."
 },
 {
  id:"FY27-04",
  title:"Publicación de procesos críticos",
  description:"Publicar el 100% de los procesos críticos de todas las áreas de la compañía al cierre del primer trimestre del FY2027.",
  class:"Estratégico",
  owner:"Director de cada área · Coordinación central de Procesos",
  branch:"Todas las áreas",
  progress:0,expected:0,hasData:false,
  areas:["Todas las áreas"],
  indicator:"Avance de publicación de procesos críticos",
  formula:"Procesos críticos publicados ÷ Procesos críticos inventariados × 100",
  source:"Inventario aprobado + repositorio oficial",
  frequency:"Quincenal",
  targetText:"100% al 31-mar-2027",
  trafficLight:"Verde: en hito o adelante · Amarillo: hasta 10 pp atrás · Rojo: más de 10 pp atrás",
  supportIndicators:"Hitos: inventario cerrado 31-ene · 50% al 28-feb · 100% al 31-mar",
  notes:"El inventario se congela al 31-ene. Los procesos agregados después entran en segunda ola y no modifican el denominador."
 },
 {
  id:"FY27-05",
  title:"Reducción de rotación temprana",
  description:"Reducir en 20 pp la rotación temprana (menor a 30 días) del personal directo e indirecto del área comercial al cierre del FY2027, respecto al cierre del FY2026.",
  class:"Estratégico",
  owner:"RR.HH. + Operaciones · Finanzas valida",
  branch:"Recursos Humanos / Operaciones",
  progress:0,expected:0,hasData:false,
  areas:["Recursos Humanos","Operaciones","Finanzas"],
  indicator:"Rotación temprana (menor a 30 días)",
  formula:"Bajas con antigüedad <30 días ÷ Altas de la cohorte del periodo × 100",
  source:"ICWEB: base de altas y bajas",
  frequency:"Mensual, con un mes de desfase",
  targetText:"Base FY2026 − 20 pp al cierre FY2027",
  trafficLight:"Verde: en trayectoria · Amarillo: hasta 3 pp atrás · Rojo: más de 3 pp atrás",
  supportIndicators:"Trayectoria: −5 pp Q1 · −10 pp Q2 · −15 pp Q3 · −20 pp Q4",
  notes:"Excluye bajas por Servicios Cancelados y USE Capacitación. La cohorte de cada mes sólo puede evaluarse 30 días después."
 }
];

const DERIVED:Objective[]=[];
const SECONDARY:Objective[]=[];

const PEOPLE:Person[]=[
 {name:"Juan Carlos Pérez",role:"Director Nacional de Operaciones",branch:"Operaciones",objectiveIds:["FY27-03","FY27-04","FY27-05"]},
 {name:"Diana López",role:"Líder de Calidad, Seguridad y Medio Ambiente",branch:"Calidad",objectiveIds:["FY27-04"]},
 {name:"Armando Acosta",role:"CFO México & Latam",branch:"Finanzas",objectiveIds:["FY27-01","FY27-02","FY27-03","FY27-04","FY27-05"]}
];

const ALL=[...STRATEGIC,...DERIVED,...SECONDARY];

const health=(o:Objective):Health=>{
 if(o.hasData===false)return "Sin dato";
 const d=o.progress-o.expected;
 return d>=-5?"En tiempo":d>=-15?"En riesgo":"Crítico"
};
const tone=(h:Health)=>h==="En tiempo"?"ok":h==="En riesgo"?"warn":h==="Crítico"?"bad":"neutral";

function ObjCard({o,onOpen}:{o:Objective;onOpen:(id:string)=>void}){
 const h=health(o);
 const hasData=o.hasData!==false;
 const d=o.progress-o.expected;
 return <article className={"cmObjective "+tone(h)}>
  <div className="cmObjectiveMain"><span>{o.id}</span><h3>{o.title}</h3><p>{o.description}</p><small>{o.owner} · {o.branch}</small></div>
  <div className="cmMetric"><small>Meta FY2027</small><b className={!hasData?"cmTextMetric":""}>{o.targetText||"—"}</b><span>{o.indicator||"Indicador pendiente"}</span></div>
  <div className={"cmState "+tone(h)}><small>Estado actual</small><b>{hasData?h:"Pendiente de carga"}</b><span>{hasData?((d>=0?"+":"")+d+" pts vs esperado"):"Sin avance real capturado"}</span><i><em style={{width:hasData?o.progress+"%":"0%"}}/></i></div>
  <button type="button" onClick={()=>onOpen(o.id)}>Ver ficha KPI →</button>
 </article>
}

export function DirectionCascadeDemo({page}:{page:string}){
 const [filter,setFilter]=useState<"Todos"|Health>("Todos");
 const [detail,setDetail]=useState<string|null>(null);
 const [showSecondary,setShowSecondary]=useState(false);
 const [person,setPerson]=useState<Person|null>(null);
 const counts={
  Todos:STRATEGIC.length,
  "En tiempo":STRATEGIC.filter(x=>health(x)==="En tiempo").length,
  "En riesgo":STRATEGIC.filter(x=>health(x)==="En riesgo").length,
  "Crítico":STRATEGIC.filter(x=>health(x)==="Crítico").length,
  "Sin dato":STRATEGIC.filter(x=>health(x)==="Sin dato").length
 };
 const shown=filter==="Todos"?STRATEGIC:STRATEGIC.filter(x=>health(x)===filter);
 const coveragePeople=useMemo(()=>flatten(PEOPLE),[]);
 const covered=coveragePeople.filter(x=>x.objectiveIds.length>0).length;
 const coverage=coveragePeople.length?Math.round((covered/coveragePeople.length)*100):0;

 if(page==="Organigrama") return <OrgExplorer selected={person} select={setPerson}/>;
 if(page==="Alertas") return <div className="cmPage"><Hero eyebrow="ALERTAS" title="Objetivos que requieren intervención" text="Las alertas se activarán cuando existan datos reales y una desviación contra la meta o trayectoria."/><div className="cmEmptyGoals"><b>Sin alertas calculadas</b><span>Los objetivos FY2027 están cargados; falta conectar sus fuentes de datos.</span></div></div>;
 if(page==="Objetivos estratégicos") return <div className="cmPage"><Hero eyebrow="OBJETIVOS ESTRATÉGICOS FY2027" title="Prioridades definidas por Dirección" text="Portafolio oficial FY2027. Cada objetivo conserva su KPI, fórmula, meta, frecuencia y semáforo."/><div className="cmCards">{STRATEGIC.map(o=><button type="button" className="cmTile" key={o.id} onClick={()=>setDetail(o.id)}><span>{o.id}</span><em className={tone(health(o))}>{health(o)}</em><h3>{o.title}</h3><p>{o.targetText}</p><b className="cmTileText">Ver KPI</b></button>)}</div></div>;
 if(detail){const o=ALL.find(x=>x.id===detail)!;return <ObjectiveDetail o={o} back={()=>setDetail(null)}/>}

 return <div className="cmPage">
  <div className="cmFilters"><label>Ciclo<select defaultValue="FY2027"><option>FY2027</option></select></label><label>Periodo<select defaultValue="Actual"><option>Actual</option></select></label><label>Vista<select defaultValue="Estratégicos"><option>Estratégicos</option></select></label></div>

  <div className="cmStatus">
   <button type="button" className={filter==="Todos"?"active":""} onClick={()=>setFilter("Todos")}><b>{counts.Todos}</b><span>Objetivos FY2027</span></button>
   <button type="button" className="neutral active" onClick={()=>setFilter("Sin dato")}><b>{counts["Sin dato"]}</b><span>Pendientes de datos</span></button>
  </div>

  <Hero eyebrow="PORTAFOLIO ESTRATÉGICO FY2027" title="Objetivos oficiales de Dirección" text="La estructura ya refleja las fichas KPI aprobadas. Los avances se mostrarán cuando conectemos las fuentes reales." aside={<><strong>5</strong><small>objetivos cargados</small></>}/>

  <div className="cmObjectiveList">{shown.map(o=><ObjCard key={o.id} o={o} onOpen={setDetail}/>)}</div>

  <section className="cmComplement">
   <div><span>GESTIÓN COMPLEMENTARIA</span><h3>Objetivos propios de áreas y líderes</h3><p>Se cargarán conforme los líderes definan objetivos internos o derivados. No alterarán el avance de Dirección salvo que estén vinculados explícitamente a un objetivo estratégico.</p></div>
   <div className="cmComplementStats"><b>{SECONDARY.length}<small>objetivos de área</small></b><b>{coverage}%<small>cobertura demo de líderes</small></b><button type="button" onClick={()=>setShowSecondary(v=>!v)} disabled={SECONDARY.length===0}>{showSecondary?"Ocultar":"Ver objetivos de área"} →</button></div>
  </section>

  {showSecondary&&SECONDARY.length>0&&<section className="cmSecondary"><div className="cmSectionHead"><div><span>SEGUNDO NIVEL DE VISIBILIDAD</span><h3>Objetivos de área activos</h3></div></div>{SECONDARY.map(o=><ObjCard key={o.id} o={o} onOpen={setDetail}/>)}</section>}
 </div>
}

export function LeaderCascadeDemo({userName}:{userName:string}){
 const isDiana=userName==="Diana López";
 const areaName=isDiana?"Calidad, Seguridad y Medio Ambiente":userName==="Juan Carlos Pérez"?"Operaciones":"Finanzas";
 const contributes=STRATEGIC.filter(o=>o.areas.includes(areaName)||o.areas.includes("Todas las áreas")||(areaName==="Calidad, Seguridad y Medio Ambiente"&&o.areas.includes("Todas las áreas")));
 const [areaGoals,setAreaGoals]=useState<Objective[]>([]);
 const [openCreator,setOpenCreator]=useState(false);
 const [newTitle,setNewTitle]=useState("");
 const [newDescription,setNewDescription]=useState("");
 const [newIndicator,setNewIndicator]=useState("");
 const [newBase,setNewBase]=useState(0);
 const [newTarget,setNewTarget]=useState(100);
 const [newUnit,setNewUnit]=useState("%");
 const [newDeadline,setNewDeadline]=useState("2027-09-30");
 const [newExpected,setNewExpected]=useState(0);
 const [assignees,setAssignees]=useState<string[]>([]);
 const [aiText,setAiText]=useState("");
 const [aiBusy,setAiBusy]=useState(false);

 const companyCounts={pending:STRATEGIC.filter(x=>health(x)==="Sin dato").length};

 const fallbackReports:Record<string,string[]>={
  "Diana López":["Benjamín Gudiño","Andrea Gutiérrez","Mayra Martínez","Omar Cortés"],
  "Juan Carlos Pérez":["Yuseff Mora","Concepción Luna","Karla Vibriezca","Víctor Sánchez","Manuel Nolasco"],
  "Armando Acosta":["Fernando Aviña","Jorge Martínez","Maricela Fragoso","Frances Fernández","Roberto Vega","Jorge Mejía"]
 };
 const orgRows=useMemo(()=>{try{return JSON.parse(localStorage.getItem("oc-org")||"[]")}catch{return []}},[openCreator]);
 const directReports:string[]=useMemo(()=>{
  const fromOrg=Array.isArray(orgRows)?orgRows.filter((x:any)=>x.manager===userName&&!x.vacant).map((x:any)=>x.name):[];
  return fromOrg.length?fromOrg:(fallbackReports[userName]||[]);
 },[orgRows,userName]);

 const smartScore=useMemo(()=>[
  newTitle.trim().length>3,
  newDescription.trim().length>15,
  newIndicator.trim().length>2,
  newBase!==newTarget,
  Boolean(newDeadline),
  assignees.length>0
 ].filter(Boolean).length*100/6,[newTitle,newDescription,newIndicator,newBase,newTarget,newDeadline,assignees]);

 const improveAreaGoal=()=>{
  setAiBusy(true);
  window.setTimeout(()=>{
   const title=newTitle.trim()||"Mejorar el resultado del área";
   const indicator=newIndicator.trim()||("% de cumplimiento de "+title.toLowerCase());
   const people=assignees.length?assignees.join(", "):"el equipo responsable";
   const text=title+", pasando de "+newBase+" a "+newTarget+" "+newUnit+", medido mediante "+indicator+", con fecha límite "+newDeadline+" y responsabilidad de "+people+".";
   setAiText(text);
   if(!newIndicator.trim())setNewIndicator(indicator);
   setAiBusy(false);
  },420);
 };

 const applyAi=()=>{if(aiText)setNewDescription(aiText)};
 const toggleAssignee=(name:string)=>setAssignees(xs=>xs.includes(name)?xs.filter(x=>x!==name):[...xs,name]);

 const createAreaGoal=(e:any)=>{
  e.preventDefault();
  if(smartScore<80)return;
  const id="AREA-"+String(areaGoals.length+1).padStart(2,"0");
  const goal:Objective={
   id,title:newTitle.trim(),description:newDescription.trim(),class:"Secundario",owner:userName,branch:areaName,
   progress:0,expected:newExpected,areas:[areaName],assignees,
   secondaryReason:"Objetivo propio del área; no impacta directamente un objetivo estratégico de Dirección.",
   targetText:newTarget+" "+newUnit,indicator:newIndicator,frequency:"Seguimiento definido por el líder",hasData:true
  };
  setAreaGoals(xs=>[...xs,goal]);
  setNewTitle("");setNewDescription("");setNewIndicator("");setNewBase(0);setNewTarget(100);setNewUnit("%");setNewDeadline("2027-09-30");setNewExpected(0);setAssignees([]);setAiText("");setOpenCreator(false);
 };

 return <div className="cmPage">
  <Hero eyebrow="MI ÁREA" title={areaName} text="Gestiona la contribución del área a los objetivos FY2027 y crea objetivos internos cuando la operación lo requiera."/>

  <section className="cmCompanyPulse">
   <div className="cmCompanyPulseHead">
    <div><span>VISIÓN GLOBAL DE LA EMPRESA</span><h3>Objetivos FY2027 de Dirección</h3><p>Resumen ejecutivo para líderes. Sin detalle de otras áreas ni acceso a su cascada.</p></div>
    <b>5<small>objetivos Dirección</small></b>
   </div>
   <div className="cmCompanyPulseStats">
    <article><strong>{STRATEGIC.length}</strong><span>objetivos Dirección</span></article>
    <article className="neutral"><strong>{companyCounts.pending}</strong><span>pendientes de datos</span></article>
   </div>
   <div className="cmCompanyMiniList">
    {STRATEGIC.map(o=><div key={o.id}><span>{o.title}</span><i><em className="neutral" style={{width:"0%"}}/></i><b>—</b><small className="neutral">Sin dato</small></div>)}
   </div>
  </section>

  <div className="cmLeaderSummary">
   <b>{contributes.length}<span>objetivos de Dirección que impactan mi área</span></b>
   <b>{areaGoals.length}<span>objetivos propios del área</span></b>
   <b>{STRATEGIC.length}<span>visión global empresa</span></b>
  </div>

  <section className="cmLeaderGroup">
   <div className="cmSectionHead">
    <div><span>CONTRIBUCIÓN A DIRECCIÓN</span><h3>Objetivos que afectan los resultados estratégicos</h3></div>
    <small>El líder decide cómo distribuir la responsabilidad dentro de su equipo.</small>
   </div>
   {contributes.length?contributes.map(o=><ObjCard key={o.id} o={o} onOpen={()=>{}}/>):<div className="cmEmptyGoals"><b>Sin objetivos estratégicos asignados</b><span>El área puede continuar trabajando con sus propios objetivos.</span></div>}
  </section>

  <section className="cmLeaderGroup">
   <div className="cmSectionHead">
    <div><span>GESTIÓN DEL ÁREA</span><h3>Objetivos propios del área</h3><p>Necesidades internas, continuidad, cumplimiento o mejora. No alteran el avance de Dirección.</p></div>
    <button type="button" className="cmAddAreaGoal" onClick={()=>setOpenCreator(true)}>＋ Nuevo objetivo del área</button>
   </div>
   {areaGoals.length?areaGoals.map(o=><ObjCard key={o.id} o={o} onOpen={()=>{}}/>):<div className="cmEmptyGoals"><b>Sin objetivos propios todavía</b><span>El líder puede agregar los necesarios para su operación.</span></div>}
  </section>

  {openCreator&&<div className="cmLeaderModalBackdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setOpenCreator(false)}}>
   <form className="cmLeaderModal smartLeaderModal" onSubmit={createAreaGoal}>
    <div className="cmLeaderModalHead"><div><span>OBJETIVO DEL ÁREA · SMART</span><h3>Crear y asignar objetivo</h3><p>Define el resultado, valida la redacción SMART y selecciona responsables de tu estructura.</p></div><button type="button" onClick={()=>setOpenCreator(false)}>×</button></div>

    <div className="leaderSmartScore"><b>{Math.round(smartScore)}/100</b><div><i style={{width:Math.min(100,smartScore)+"%"}}/></div><span>{smartScore>=80?"Listo para crear":"Completa los criterios SMART"}</span></div>

    <label>Nombre ejecutivo del objetivo<input value={newTitle} onChange={e=>{setNewTitle(e.target.value);setAiText("")}} placeholder="Ej. Mejorar cumplimiento de auditorías" required/></label>
    <label>¿Qué se quiere lograr?<textarea value={newDescription} onChange={e=>setNewDescription(e.target.value)} placeholder="Describe el resultado concreto que el área debe alcanzar" required/></label>

    <div className="cmLeaderModalGrid">
     <label>Indicador<input value={newIndicator} onChange={e=>setNewIndicator(e.target.value)} placeholder="Ej. % de auditorías cumplidas"/></label>
     <label>Unidad<input value={newUnit} onChange={e=>setNewUnit(e.target.value)} placeholder="%"/></label>
    </div>
    <div className="cmLeaderModalGrid three">
     <label>Base<input type="number" value={newBase} onChange={e=>setNewBase(+e.target.value)}/></label>
     <label>Meta<input type="number" value={newTarget} onChange={e=>setNewTarget(+e.target.value)}/></label>
     <label>Fecha límite<input type="date" value={newDeadline} onChange={e=>setNewDeadline(e.target.value)}/></label>
    </div>

    <section className="leaderPeopleSection">
     <div className="leaderPeopleHead"><div><span>RESPONSABLES DEL OBJETIVO</span><h4>Selecciona personal de tu estructura</h4><p>Se muestran únicamente tus reportes directos conforme al organigrama. Ellos podrán distribuirlo hacia abajo si tienen equipo.</p></div><b>{assignees.length}<small>seleccionados</small></b></div>
     <div className="leaderPeopleGrid">{directReports.map(name=>{const on=assignees.includes(name);return <button type="button" key={name} className={on?"on":""} onClick={()=>toggleAssignee(name)}><i>{on?"✓":"+"}</i><span>{name}</span></button>})}</div>
     {!directReports.length&&<div className="cmEmptyGoals"><b>Sin reportes directos configurados</b><span>El administrador debe completar la relación de jefe directo en la estructura.</span></div>}
    </section>

    {aiText&&<section className="leaderAiBox"><span>✦ MINI IA SMART</span><h4>Propuesta de redacción</h4><p>{aiText}</p><button type="button" onClick={applyAi}>Aplicar propuesta</button></section>}

    <div className="cmLeaderModalActions">
     <button type="button" onClick={()=>setOpenCreator(false)}>Cancelar</button>
     <button type="button" className="leaderAiBtn" onClick={improveAreaGoal} disabled={aiBusy}>{aiBusy?"✦ Analizando…":"✦ Mejorar con IA"}</button>
     <button type="submit" disabled={smartScore<80}>Crear y asignar objetivo</button>
    </div>
   </form>
  </div>}
 </div>
}

function ObjectiveDetail({o,back}:{o:Objective;back:()=>void}){
 const h=health(o);
 return <div className="cmPage">
  <button type="button" className="cmBack" onClick={back}>← Volver</button>
  <section className="cmDetailHero"><div><span>{o.class.toUpperCase()} · {o.id}</span><h2>{o.title}</h2><p>{o.description}</p></div><em className={tone(h)}>{h==="Sin dato"?"Pendiente de datos":h}</em></section>

  <div className="cmDetailKpis">
   <b className="cmDetailText">{o.targetText||"—"}<span>meta</span></b>
   <b className="cmDetailText">{o.frequency||"—"}<span>frecuencia</span></b>
   <b>{o.areas.length}<span>áreas involucradas</span></b>
   <b className="cmDetailText">{o.hasData===false?"Pendiente":"Disponible"}<span>estado de datos</span></b>
  </div>

  <section className="cmKpiSheet">
   <div><span>INDICADOR</span><b>{o.indicator||"—"}</b></div>
   <div><span>FÓRMULA</span><b>{o.formula||"—"}</b></div>
   <div><span>FUENTE</span><b>{o.source||"—"}</b></div>
   <div><span>RESPONSABLE</span><b>{o.owner}</b></div>
   <div><span>SEMÁFORO</span><b>{o.trafficLight||"—"}</b></div>
   {o.supportIndicators&&<div><span>INDICADORES / HITOS DE SOPORTE</span><b>{o.supportIndicators}</b></div>}
   {o.actionRule&&<div><span>REGLA DE ACCIÓN</span><b>{o.actionRule}</b></div>}
   {o.notes&&<div><span>NOTA</span><b>{o.notes}</b></div>}
  </section>
 </div>
}

function OrgExplorer({selected,select}:{selected:Person|null;select:(p:Person|null)=>void}){
 return <div className="cmPage">
  <Hero eyebrow="ORGANIGRAMA" title="Objetivos por persona y rama" text="Esta vista se reemplazará con el organigrama definitivo para controlar usuarios, líderes y permisos desde el panel administrativo."/>
  <div className="cmOrgLayout">
   <section className="cmOrgTree">{PEOPLE.map(root=><OrgNode key={root.name} p={root} select={select} level={0}/>)}</section>
   <aside className="cmPersonPanel">{selected?<><button type="button" onClick={()=>select(null)}>×</button><span>{selected.branch}</span><h3>{selected.name}</h3><p>{selected.role}</p><div>{selected.objectiveIds.map(id=>{const o=ALL.find(x=>x.id===id);return o?<article key={id}><em className="primary">{o.class}</em><b>{o.title}</b><small>{health(o)==="Sin dato"?"Pendiente de datos":health(o)}</small></article>:null})}</div></>:<><span>VISTA TEMPORAL</span><h3>Organigrama pendiente</h3><p>Cuando carguemos el nuevo organigrama, esta sección alimentará el control de usuarios del panel admin.</p></>}</aside>
  </div>
 </div>
}

function OrgNode({p,select,level}:{p:Person;select:(p:Person)=>void;level:number}){
 return <div className="cmOrgNodeWrap"><button type="button" className="cmOrgNode" style={{marginLeft:level*22}} onClick={()=>select(p)}><span>{p.branch}</span><b>{p.name}</b><small>{p.role}</small><em>{p.objectiveIds.length} obj.</em></button>{p.children?.map(c=><OrgNode key={c.name} p={c} select={select} level={level+1}/>)}</div>
}

function flatten(xs:Person[]):Person[]{return xs.flatMap(x=>[x,...flatten(x.children||[])])}
function Hero({eyebrow,title,text,aside}:{eyebrow:string;title:string;text:string;aside?:any}){return <section className="cmHero"><div><span>{eyebrow}</span><h2>{title}</h2><p>{text}</p></div>{aside&&<div className="cmHeroAside">{aside}</div>}</section>}
