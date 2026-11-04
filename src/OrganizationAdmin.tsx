import {useMemo,useState} from "react";

type AccessRole="Dirección"|"Administrador"|"Líder"|"Colaborador";
type OrgRecord={
 id:string;name:string;title:string;area:string;manager:string;vacant?:boolean;headcount?:number;
 role:AccessRole;active:boolean;canAssign:boolean;canCreateAreaGoals:boolean;
};

const seed:OrgRecord[]=[
 {id:"p001",name:"Gabriel Sabogal",title:"Presidencia Regional Operaciones Latinoamérica",area:"Presidencia",manager:"—",role:"Dirección",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"p002",name:"Armando Acosta",title:"CFO México & LATAM",area:"Finanzas",manager:"Gabriel Sabogal",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"p003",name:"Juan Carlos Pérez",title:"Director Nacional de Operaciones",area:"Operaciones",manager:"Gabriel Sabogal",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"p004",name:"Daniela Juárez",title:"Gerente de Ventas",area:"Ventas",manager:"Gabriel Sabogal",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"p005",name:"Diana López",title:"Líder de Calidad, Seguridad y Medio Ambiente",area:"Calidad",manager:"Gabriel Sabogal",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"p006",name:"Alondra Casarrubias",title:"Líder de Reclutamiento",area:"Reclutamiento",manager:"Gabriel Sabogal",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"p007",name:"Aaron Merino",title:"Gerente Administración y Compensaciones",area:"ABM",manager:"Gabriel Sabogal",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"p008",name:"Jacqueline Cortés",title:"Gerente Cultura Organizacional",area:"Cultura Organizacional",manager:"Gabriel Sabogal",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"p009",name:"Ricardo Zamora",title:"Gerente Logística",area:"Logística",manager:"Gabriel Sabogal",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"p010",name:"Daniel Méndez",title:"Gerente de Relaciones Laborales",area:"Legal",manager:"Gabriel Sabogal",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"p011",name:"Jocelyn Buendía",title:"Gerente Control Gubernamental",area:"Legal",manager:"Gabriel Sabogal",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"p012",name:"Mónica Martínez",title:"Abogado Corporativo",area:"Legal",manager:"Gabriel Sabogal",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},

 {id:"f001",name:"Fernando Aviña",title:"Contralor LATAM",area:"Finanzas",manager:"Armando Acosta",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"f002",name:"Jorge Martínez",title:"Coordinador Administración de Contratos",area:"Finanzas",manager:"Armando Acosta",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"f003",name:"Maricela Fragoso",title:"Gerente Tesorería",area:"Finanzas",manager:"Armando Acosta",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"f004",name:"Frances Fernández",title:"Gerente Nóminas & IMSS",area:"Finanzas",manager:"Armando Acosta",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"f005",name:"Roberto Vega",title:"Coordinador Facturación",area:"Finanzas",manager:"Armando Acosta",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"f006",name:"Jorge Mejía",title:"Analista Inteligencia de Negocio",area:"Finanzas",manager:"Armando Acosta",role:"Administrador",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"f007",name:"Paulina Sánchez",title:"Gerente Contabilidad",area:"Finanzas",manager:"Fernando Aviña",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"f008",name:"Mariela Gómez",title:"Coordinador contable SSC LATAM",area:"Finanzas",manager:"Fernando Aviña",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"f009",name:"Imer Cabrales",title:"Especialista contable",area:"Finanzas",manager:"Paulina Sánchez",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"f010",name:"Mónica Wiechers",title:"Analista contable",area:"Finanzas",manager:"Paulina Sánchez",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"f011",name:"Nancy Hernández",title:"Analista contable",area:"Finanzas",manager:"Paulina Sánchez",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"f012",name:"Dulce Castro",title:"Analista contable",area:"Finanzas",manager:"Paulina Sánchez",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"f013",name:"Paola Lozano",title:"Analista contratos",area:"Finanzas",manager:"Jorge Martínez",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"f014",name:"Sandra Reyes",title:"Analista precios",area:"Finanzas",manager:"Jorge Martínez",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"f015",name:"Victoria García",title:"Especialista Tesorería",area:"Finanzas",manager:"Maricela Fragoso",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"f016",name:"Viridiana Martínez",title:"Coordinador IMSS",area:"Finanzas",manager:"Frances Fernández",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"f017",name:"Miriam Juárez",title:"Líder Nóminas",area:"Finanzas",manager:"Frances Fernández",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"f018",name:"Mónica Luna",title:"Analista IMSS",area:"Finanzas",manager:"Viridiana Martínez",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"f019",name:"Ismael Medina",title:"Analista nóminas",area:"Finanzas",manager:"Miriam Juárez",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"f020",name:"Araceli Guillaumin",title:"Analista nóminas",area:"Finanzas",manager:"Miriam Juárez",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"f021",name:"Lizbeth Vázquez",title:"Analista nóminas",area:"Finanzas",manager:"Miriam Juárez",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"f022",name:"Brenda Jiménez",title:"Analista nóminas",area:"Finanzas",manager:"Miriam Juárez",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"f023",name:"Claudia Díaz",title:"Especialista Facturación",area:"Finanzas",manager:"Roberto Vega",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"f024",name:"Juana Vázquez",title:"Especialista facturación",area:"Finanzas",manager:"Roberto Vega",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"f025",name:"Georgina Luna",title:"Especialista cobranza",area:"Finanzas",manager:"Roberto Vega",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"f026",name:"Susana Moyotl",title:"Especialista cobranza",area:"Finanzas",manager:"Roberto Vega",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"f027",name:"Jarumi Ramírez",title:"Analista cobranza",area:"Finanzas",manager:"Roberto Vega",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"f028",name:"Marco Mondragón",title:"Apoyo cobranza",area:"Finanzas",manager:"Roberto Vega",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},

 {id:"o001",name:"Yuseff Mora",title:"Gerente de Operaciones Nor-Este",area:"Operaciones",manager:"Juan Carlos Pérez",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"o002",name:"Concepción Luna",title:"Gerente de Operaciones Metro",area:"Operaciones",manager:"Juan Carlos Pérez",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"o003",name:"Karla Vibriezca",title:"Gerente de Operaciones Nor-Oeste",area:"Operaciones",manager:"Juan Carlos Pérez",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"o004",name:"Víctor Sánchez",title:"Gerente de Operaciones Bajío-Centro-Sur",area:"Operaciones",manager:"Juan Carlos Pérez",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"o005",name:"Manuel Nolasco",title:"Gerente CCO",area:"Operaciones",manager:"Juan Carlos Pérez",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"o006",name:"Jair Gutiérrez",title:"Coordinador Operaciones NLD",area:"Operaciones",manager:"Yuseff Mora",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"o007",name:"Brenda Macías",title:"Coordinador Operaciones MTY",area:"Operaciones",manager:"Yuseff Mora",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"o008",name:"Omar Badillo",title:"Coordinador Operaciones",area:"Operaciones",manager:"Concepción Luna",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"o009",name:"Ruth Flores",title:"Coordinador Operaciones",area:"Operaciones",manager:"Concepción Luna",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"o010",name:"José Gómez",title:"Coordinador Operaciones",area:"Operaciones",manager:"Concepción Luna",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"o011",name:"Víctor López",title:"Coordinador Operaciones Gdl",area:"Operaciones",manager:"Víctor Sánchez",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"o012",name:"Fidel Piedras",title:"Coordinador Operaciones PBL",area:"Operaciones",manager:"Víctor Sánchez",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"o013",name:"Vanessa Martínez",title:"Analista",area:"Operaciones",manager:"Manuel Nolasco",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"o014",name:"José Simón",title:"Analista CCO",area:"Operaciones",manager:"Manuel Nolasco",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"o015",name:"Humberto Rodríguez",title:"Analista",area:"Operaciones",manager:"Manuel Nolasco",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},

 {id:"v001",name:"Dante Carmona",title:"Ventas Guardias",area:"Ventas",manager:"Daniela Juárez",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"v002",name:"Ana Karen Velázquez",title:"KAM",area:"Ventas",manager:"Daniela Juárez",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"v003",name:"Mayra Luna",title:"KAM",area:"Ventas",manager:"Daniela Juárez",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"v004",name:"Nydia Borja",title:"Marketing Digital",area:"Ventas",manager:"Daniela Juárez",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"v005",name:"Verónica Téllez",title:"Community Manager",area:"Ventas",manager:"Nydia Borja",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"v006",name:"Alicia Pérez",title:"Líder Seguridad Electrónica",area:"Ventas",manager:"Daniela Juárez",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"v007",name:"Alfonso Jiménez",title:"Ingeniero de Proyectos",area:"Ventas",manager:"Alicia Pérez",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"v008",name:"Martín Sánchez",title:"Técnico",area:"Ventas",manager:"Alicia Pérez",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"v009",name:"Juventino Martínez",title:"Técnico",area:"Ventas",manager:"Alicia Pérez",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},

 {id:"q001",name:"Benjamín Gudiño",title:"Analista de Calidad",area:"Calidad",manager:"Diana López",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"q002",name:"Andrea Gutiérrez",title:"Analista de Seguridad, Higiene y Medio Ambiente",area:"Calidad",manager:"Diana López",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"q003",name:"Mayra Martínez",title:"Médico laboral",area:"Calidad",manager:"Diana López",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"q004",name:"Omar Cortés",title:"Coordinador de Mantenimiento",area:"Calidad",manager:"Diana López",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},

 {id:"r001",name:"Néstor Luna",title:"Coordinador Nacional de Reclutamiento",area:"Reclutamiento",manager:"Alondra Casarrubias",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"r002",name:"Elvira Duarte",title:"Coordinadora Metropolitana",area:"Reclutamiento",manager:"Alondra Casarrubias",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"r003",name:"Jessica Trejo",title:"Coordinador Metro Norte",area:"Reclutamiento",manager:"Alondra Casarrubias",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"r004",name:"Brenda Méndez",title:"Coordinador Bajío Centro Sur",area:"Reclutamiento",manager:"Alondra Casarrubias",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"r005",name:"Byron Sánchez",title:"Coordinador Nor Este",area:"Reclutamiento",manager:"Alondra Casarrubias",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"r006",name:"Ricardo Rebollar",title:"Coordinador Nor Oeste",area:"Reclutamiento",manager:"Alondra Casarrubias",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},

 {id:"c001",name:"Jessica Díaz",title:"Coordinador Capacitación",area:"Cultura Organizacional",manager:"Jacqueline Cortés",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"c002",name:"Israel Medina",title:"Coordinador Atención a personal",area:"Cultura Organizacional",manager:"Jacqueline Cortés",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},

 {id:"l001",name:"Francisco Torres",title:"Coordinador Almacén",area:"Logística",manager:"Ricardo Zamora",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"l002",name:"Karla Montiel",title:"Supervisor Compras",area:"Logística",manager:"Ricardo Zamora",role:"Líder",active:true,canAssign:true,canCreateAreaGoals:true},
 {id:"l003",name:"Ricardo Gutiérrez",title:"Analista Control Vehicular",area:"Logística",manager:"Ricardo Zamora",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},
 {id:"l004",name:"Jesús Flores",title:"Analista Control Vehicular",area:"Logística",manager:"Ricardo Zamora",role:"Colaborador",active:true,canAssign:false,canCreateAreaGoals:false},

 {id:"vac01",name:"Vacante",title:"Analista JR LATAM",area:"Finanzas",manager:"Mariela Gómez",vacant:true,role:"Colaborador",active:false,canAssign:false,canCreateAreaGoals:false},
 {id:"vac02",name:"Vacante",title:"Especialista contable",area:"Finanzas",manager:"Paulina Sánchez",vacant:true,role:"Colaborador",active:false,canAssign:false,canCreateAreaGoals:false},
 {id:"vac03",name:"Vacante",title:"Coordinador Operaciones Saltillo",area:"Operaciones",manager:"Yuseff Mora",vacant:true,role:"Líder",active:false,canAssign:false,canCreateAreaGoals:false},
 {id:"vac04",name:"Vacante",title:"Coordinador Monterrey",area:"Reclutamiento",manager:"Alondra Casarrubias",vacant:true,role:"Líder",active:false,canAssign:false,canCreateAreaGoals:false},
 {id:"vac05",name:"Vacante",title:"Coordinador Administración y Compensaciones",area:"ABM",manager:"Aaron Merino",vacant:true,role:"Líder",active:false,canAssign:false,canCreateAreaGoals:false},
 {id:"vac06",name:"Vacante",title:"Analista Compensaciones",area:"ABM",manager:"Aaron Merino",vacant:true,role:"Colaborador",active:false,canAssign:false,canCreateAreaGoals:false}
];

export default function OrganizationAdmin({page}:{page:string}){
 const [rows,setRows]=useState<OrgRecord[]>(()=>{try{return JSON.parse(localStorage.getItem("oc-org")||"null")||seed}catch{return seed}});
 const [q,setQ]=useState("");
 const [area,setArea]=useState("Todas");
 const [selected,setSelected]=useState<OrgRecord|null>(null);
 const areas=useMemo(()=>["Todas",...Array.from(new Set(rows.map(x=>x.area))).sort()], [rows]);
 const filtered=useMemo(()=>rows.filter(x=>(area==="Todas"||x.area===area)&&(!q||normalize(x.name+" "+x.title+" "+x.manager).includes(normalize(q)))),[rows,q,area]);
 const leaders=rows.filter(x=>x.role==="Líder"||x.role==="Dirección").length;
 const vacancies=rows.filter(x=>x.vacant).length;
 const active=rows.filter(x=>x.active&&!x.vacant).length;
 const save=(next:OrgRecord[])=>{setRows(next);localStorage.setItem("oc-org",JSON.stringify(next))};
 const update=(id:string,patch:Partial<OrgRecord>)=>{const next=rows.map(x=>x.id===id?{...x,...patch}:x);save(next);setSelected(s=>s?.id===id?{...s,...patch}:s)};
 const roots=rows.filter(x=>x.manager==="—");
 if(page==="Configuración")return <AdminConfig rows={rows}/>;
 if(page==="Estructura")return <AdminStructure rows={rows} roots={roots} onSelect={setSelected} selected={selected}/>;
 return <div className="oaPage">
  <section className="oaHero"><div><span>ADMINISTRACIÓN</span><h2>Usuarios y estructura organizacional</h2><p>La jerarquía controla quién puede recibir, desdoblar y asignar objetivos dentro de la plataforma.</p></div><button type="button">＋ Nuevo usuario</button></section>
  <div className="oaKpis"><article><b>{active}</b><span>usuarios activos</span></article><article><b>{leaders}</b><span>líderes con equipo</span></article><article><b>{areas.length-1}</b><span>áreas</span></article><article><b>{vacancies}</b><span>vacantes registradas</span></article></div>
  <section className="oaToolbar"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar persona, puesto o jefe…"/><select value={area} onChange={e=>setArea(e.target.value)}>{areas.map(a=><option key={a}>{a}</option>)}</select><span>{filtered.length} registros</span></section>
  <div className="oaGrid">
   <section className="oaTableWrap"><table className="oaTable"><thead><tr><th>Persona / posición</th><th>Área</th><th>Jefe directo</th><th>Rol</th><th>Acceso</th></tr></thead><tbody>{filtered.map(r=><tr key={r.id} className={selected?.id===r.id?"selected":""} onClick={()=>setSelected(r)}><td><b>{r.vacant?"Vacante":r.name}</b><span>{r.title}</span></td><td>{r.area}</td><td>{r.manager}</td><td><em className={"role "+r.role.toLowerCase()}>{r.role}</em></td><td><i className={r.active?"active":"inactive"}>{r.vacant?"Sin usuario":r.active?"Activo":"Inactivo"}</i></td></tr>)}</tbody></table></section>
   <aside className="oaEditor">{selected?<><div className="oaEditorHead"><div><span>{selected.area}</span><h3>{selected.vacant?"Posición vacante":selected.name}</h3><p>{selected.title}</p></div><button onClick={()=>setSelected(null)}>×</button></div>
    <label>Jefe directo<select value={selected.manager} onChange={e=>update(selected.id,{manager:e.target.value})}><option>—</option>{rows.filter(x=>!x.vacant&&x.id!==selected.id).map(x=><option key={x.id}>{x.name}</option>)}</select></label>
    <label>Rol en plataforma<select value={selected.role} onChange={e=>update(selected.id,{role:e.target.value as AccessRole})}><option>Dirección</option><option>Administrador</option><option>Líder</option><option>Colaborador</option></select></label>
    <div className="oaChecks"><label><input type="checkbox" checked={selected.active} disabled={selected.vacant} onChange={e=>update(selected.id,{active:e.target.checked})}/> Acceso activo</label><label><input type="checkbox" checked={selected.canAssign} disabled={selected.vacant} onChange={e=>update(selected.id,{canAssign:e.target.checked})}/> Puede asignar objetivos</label><label><input type="checkbox" checked={selected.canCreateAreaGoals} disabled={selected.vacant} onChange={e=>update(selected.id,{canCreateAreaGoals:e.target.checked})}/> Puede crear objetivos del área</label></div>
    <div className="oaRule"><b>Alcance de asignación</b><p>{selected.canAssign?"Puede asignar únicamente a personas que cuelguen de su estructura.":"No puede distribuir objetivos a subordinados."}</p></div>
   </>:<><span>SELECCIONA UN REGISTRO</span><h3>Administración contextual</h3><p>Selecciona una persona o posición para revisar jefe directo, rol y permisos.</p></>}</aside>
  </div>
 </div>
}

function AdminStructure({rows,roots,onSelect,selected}:{rows:OrgRecord[];roots:OrgRecord[];onSelect:(r:OrgRecord)=>void;selected:OrgRecord|null}){
 const [area,setArea]=useState("Todas");
 const areas=["Todas",...Array.from(new Set(rows.map(x=>x.area))).sort()];
 const rootsToShow=area==="Todas"?roots:rows.filter(x=>x.area===area&&(!rows.some(y=>y.name===x.manager&&y.area===area)));
 return <div className="oaPage"><section className="oaHero"><div><span>ESTRUCTURA</span><h2>Organigrama de asignación</h2><p>La jerarquía determina el alcance de cada líder. Las vacantes se conservan como posiciones y no generan usuarios.</p></div><select value={area} onChange={e=>setArea(e.target.value)}>{areas.map(a=><option key={a}>{a}</option>)}</select></section><section className="oaTree">{rootsToShow.map(r=><TreeNode key={r.id} node={r} rows={rows} onSelect={onSelect} selected={selected}/>)}</section></div>
}
function TreeNode({node,rows,onSelect,selected}:{node:OrgRecord;rows:OrgRecord[];onSelect:(r:OrgRecord)=>void;selected:OrgRecord|null}){
 const kids=rows.filter(x=>x.manager===node.name);
 return <div className="oaTreeBranch"><button className={"oaTreeNode "+(selected?.id===node.id?"selected":"")+" "+(node.vacant?"vacant":"")} onClick={()=>onSelect(node)}><span>{node.area}</span><b>{node.vacant?"Vacante":node.name}</b><small>{node.title}</small><em>{node.role}</em></button>{kids.length>0&&<div className="oaTreeChildren">{kids.map(k=><TreeNode key={k.id} node={k} rows={rows} onSelect={onSelect} selected={selected}/>)}</div>}</div>
}
function AdminConfig({rows}:{rows:OrgRecord[]}){
 return <div className="oaPage"><section className="oaHero"><div><span>CONFIGURACIÓN</span><h2>Reglas de estructura y permisos</h2><p>Controles operativos que gobernarán la cascada una vez conectemos el backend.</p></div></section><div className="oaConfigCards"><article><b>Asignación jerárquica</b><p>Un líder sólo puede asignar objetivos a personas bajo su rama organizacional.</p><em>Activa</em></article><article><b>Objetivos propios de área</b><p>Los líderes pueden crear objetivos internos sin afectar los KPIs de Dirección.</p><em>Activa</em></article><article><b>Vacantes</b><p>Las posiciones vacantes permanecen en el organigrama, pero no tienen cuenta ni acceso.</p><em>{rows.filter(x=>x.vacant).length} registradas</em></article><article><b>Movimientos</b><p>Reasignar jefe directo cambia el alcance futuro sin modificar el objetivo corporativo original.</p><em>Controlado</em></article></div></div>
}
const normalize=(s:string)=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
