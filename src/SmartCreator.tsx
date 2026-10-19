import {FormEvent,useEffect,useMemo,useState} from "react";

type DemoProject={id:string;name:string;objective:string;areas:string[];base:number;target:number;unit:string;start:string;end:string;progress:number;owner:string;priority:"Alta"|"Media"|"Baja"};
type AiSuggestion={specific:string;indicator:string;unit:string;headline:string;notes:string[]};

const AREAS=["Operaciones","Finanzas","Recursos Humanos","Ventas","Marketing","Nóminas","Inteligencia de Negocios","Tecnología"];

const normalize=(s:string)=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();

function inferIndicator(title:string){
 const t=normalize(title);
 if(t.includes("rotacion"))return {indicator:"% de rotación",unit:"%"};
 if(t.includes("venta")||t.includes("comercial"))return {indicator:"Cumplimiento de ventas vs meta",unit:"%"};
 if(t.includes("cobertura"))return {indicator:"% de cobertura operativa",unit:"%"};
 if(t.includes("nomina")||t.includes("incidencia"))return {indicator:"% de incidencias de nómina",unit:"%"};
 if(t.includes("tiempo extra"))return {indicator:"Índice de tiempo extra no facturable",unit:"%"};
 if(t.includes("rentabilidad")||t.includes("margen"))return {indicator:"Margen de contribución",unit:"%"};
 if(t.includes("mantenimiento"))return {indicator:"% de cumplimiento de mantenimiento preventivo",unit:"%"};
 if(t.includes("seguridad")||t.includes("higiene"))return {indicator:"% de cumplimiento del programa de Seguridad e Higiene",unit:"%"};
 if(t.includes("salud"))return {indicator:"% de cumplimiento del programa preventivo de salud",unit:"%"};
 if(t.includes("calidad")||t.includes("auditoria"))return {indicator:"% de cumplimiento de auditorías / plan de calidad",unit:"%"};
 if(t.includes("reclut")||t.includes("vacante"))return {indicator:"% de cobertura de vacantes objetivo",unit:"%"};
 return {indicator:"% de cumplimiento del resultado objetivo",unit:"%"};
}

function buildSuggestion(title:string,base:number,target:number,unit:string,deadline:string,areas:string[]):AiSuggestion{
 const inferred=inferIndicator(title);
 const finalUnit=unit||inferred.unit;
 const areaText=areas.length?areas.join(", "):"las áreas responsables";
 const hasMovement=base!==target;
 const metric=hasMovement?"pasando de "+base+" a "+target+" "+finalUnit:"alcanzando una meta cuantificable en el indicador";
 const dateText=deadline?new Intl.DateTimeFormat("es-MX",{day:"2-digit",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(deadline+"T00:00:00Z")):"el cierre del periodo";
 const cleanTitle=title.trim()||"el resultado estratégico";
 const specific=cleanTitle+", "+metric+", a más tardar el "+dateText+", con seguimiento mensual de "+inferred.indicator+" y responsabilidad compartida entre "+areaText+".";
 const notes:string[]=[];
 if(!title.trim())notes.push("Agrega un nombre ejecutivo para que la propuesta sea más específica.");
 if(!hasMovement)notes.push("Base y meta son iguales; define una variación o una meta cuantificable.");
 if(!areas.length)notes.push("Selecciona al menos un área responsable; el líder decidirá después a quién distribuir la responsabilidad.");
 if(!deadline)notes.push("Define una fecha límite para completar el criterio temporal.");
 if(!notes.length)notes.push("La estructura ya cubre los cinco criterios SMART y puede editarse antes de guardar.");
 return {specific,indicator:inferred.indicator,unit:finalUnit,headline:'Propuesta SMART para "'+cleanTitle+'"',notes};
}

export default function SmartCreator(){
 const [direction,setDirection]=useState(false);
 const [open,setOpen]=useState(false);
 const [title,setTitle]=useState("");
 const [specific,setSpecific]=useState("");
 const [indicator,setIndicator]=useState("");
 const [base,setBase]=useState(0);
 const [target,setTarget]=useState(0);
 const [unit,setUnit]=useState("%");
 const [deadline,setDeadline]=useState("2026-09-30");
 const [areas,setAreas]=useState<string[]>([]);
 const [priority,setPriority]=useState<"Alta"|"Media"|"Baja">("Alta");
 const [aiSuggestion,setAiSuggestion]=useState<AiSuggestion|null>(null);
 const [aiBusy,setAiBusy]=useState(false);

 useEffect(()=>{
  const check=()=>setDirection(localStorage.getItem("oc-session")==="u2");
  check();
  const id=setInterval(check,500);
  return()=>clearInterval(id)
 },[]);

 const score=useMemo(()=>[
  specific.trim().length>18,
  indicator.trim().length>2,
  base!==target,
  Boolean(deadline),
  areas.length>0
 ].filter(Boolean).length*20,[specific,indicator,base,target,deadline,areas]);

 if(!direction)return null;

 const toggle=(a:string)=>setAreas(xs=>xs.includes(a)?xs.filter(x=>x!==a):[...xs,a]);

 const improve=()=>{
  setAiBusy(true);
  window.setTimeout(()=>{
   setAiSuggestion(buildSuggestion(title,base,target,unit,deadline,areas));
   setAiBusy(false);
  },450);
 };

 const applySuggestion=()=>{
  if(!aiSuggestion)return;
  setSpecific(aiSuggestion.specific);
  setIndicator(aiSuggestion.indicator);
  setUnit(aiSuggestion.unit);
 };

 const save=(e:FormEvent)=>{
  e.preventDefault();
  if(score<80)return;
  const current:DemoProject[]=JSON.parse(localStorage.getItem("oc-projects")||"[]");
  const next=(current.reduce((m,p)=>Math.max(m,Number(p.id?.replace("OBJ-","")||0)),0)+1).toString().padStart(3,"0");
  const objective=specific+" Medido mediante "+indicator+".";
  const p:DemoProject={id:"OBJ-"+next,name:title||"Nuevo objetivo estratégico",objective,areas,base,target,unit,start:"2026-10-01",end:deadline,progress:0,owner:areas[0]||"Dirección",priority};
  localStorage.setItem("oc-projects",JSON.stringify([...current,p]));
  setOpen(false);
  location.reload()
 };

 return <>
  <button className="smartFloat" onClick={()=>setOpen(true)}>✦ Crear objetivo SMART</button>
  {open&&<div className="smartBackdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}>
   <form className="smartModal" onSubmit={save}>
    <div className="smartTop">
     <div><span>✦ ASISTENTE SMART</span><h2>Crear objetivo estratégico</h2><p>Define el resultado; el asistente ayuda a convertirlo en una formulación SMART.</p></div>
     <button type="button" onClick={()=>setOpen(false)}>×</button>
    </div>

    <div className="smartScore">
     <b>{score}/100</b>
     <div><i style={{width:score+"%"}}/></div>
     <span>{score>=80?"Listo para crear":"Completa los criterios SMART"}</span>
    </div>

    <div className="smartBadges"><b>S <span>Específico</span></b><b>M <span>Medible</span></b><b>A <span>Alcanzable</span></b><b>R <span>Relevante</span></b><b>T <span>Temporal</span></b></div>

    <label>Nombre ejecutivo del objetivo<input value={title} onChange={e=>{setTitle(e.target.value);setAiSuggestion(null)}} placeholder="Ej. Reducir rotación operativa" required/></label>

    <label>¿Qué se quiere lograr?<textarea value={specific} onChange={e=>setSpecific(e.target.value)} placeholder="Describe el resultado concreto"/></label>

    <div className="smartFields">
     <label>Indicador<input value={indicator} onChange={e=>setIndicator(e.target.value)} placeholder="Ej. % de rotación"/></label>
     <label>Prioridad<select value={priority} onChange={e=>setPriority(e.target.value as any)}><option>Alta</option><option>Media</option><option>Baja</option></select></label>
    </div>

    <div className="smartFields three">
     <label>Base<input type="number" value={base} onChange={e=>{setBase(+e.target.value);setAiSuggestion(null)}}/></label>
     <label>Meta<input type="number" value={target} onChange={e=>{setTarget(+e.target.value);setAiSuggestion(null)}}/></label>
     <label>Unidad<input value={unit} onChange={e=>{setUnit(e.target.value);setAiSuggestion(null)}}/></label>
    </div>

    <label>Fecha límite<input type="date" value={deadline} onChange={e=>{setDeadline(e.target.value);setAiSuggestion(null)}} required/></label>

    <section className="smartAreaSection">
     <div className="smartAreaHead">
      <div><span>ÁREAS RESPONSABLES</span><h3>¿Qué áreas participan directamente en este objetivo?</h3><p>Dirección asigna el área. Después, cada líder decide qué personas, equipos o subáreas asumirán la responsabilidad.</p></div>
      <b>{areas.length}<small>seleccionadas</small></b>
     </div>
     <div className="smartAreas">
      {AREAS.map(a=>{
       const selected=areas.includes(a);
       return <button type="button" aria-pressed={selected} className={selected?"on":""} onClick={()=>{toggle(a);setAiSuggestion(null)}} key={a}><i>{selected?"✓":"+"}</i><span>{a}</span></button>
      })}
     </div>
    </section>

    {aiSuggestion&&<section className="smartAiPanel">
     <div className="smartAiHead"><span>✦ MINI IA · DEMO</span><b>{aiSuggestion.headline}</b></div>
     <div className="smartAiProposal">
      <small>Redacción propuesta</small>
      <p>{aiSuggestion.specific}</p>
      <div><span><b>Indicador</b>{aiSuggestion.indicator}</span><span><b>Unidad</b>{aiSuggestion.unit}</span></div>
     </div>
     <ul>{aiSuggestion.notes.map((n,i)=><li key={i}>{n}</li>)}</ul>
     <button type="button" onClick={applySuggestion}>Aplicar propuesta</button>
    </section>}

    <div className="smartActions">
     <button type="button" onClick={()=>setOpen(false)}>Cancelar</button>
     <button type="button" className="smartAiBtn" onClick={improve} disabled={aiBusy}>{aiBusy?"✦ Analizando…":"✦ Mejorar con IA"}</button>
     <button className="primary" disabled={score<80}>Crear objetivo</button>
    </div>
   </form>
  </div>}
 </>
}
