 "use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, Beaker, BookOpen, ChevronRight, Coffee, Heart,
  Menu, Minus, Plus, RotateCcw, Scale, Sparkles, Timer, X
} from "lucide-react";

type Step = { title: string; text: string; from: number; to: number; };
type Recipe = {
  id: string; title: string; tag: string; subtitle: string;
  coffee: number; water: number; temp: number; seconds: number; grind: string; steps: Step[];
};
type Method = { id: string; name: string; short: string; description: string; recipes: Recipe[]; };

const methods: Method[] = [
  {
    id:"v60", name:"V60", short:"V", description:"Clareza, doçura e uma xícara que deixa o café falar.",
    recipes:[
      {id:"v60-equilibrado",title:"V60 equilibrado",tag:"CLÁSSICA",subtitle:"Uma receita simples para repetir todos os dias",coffee:18,water:300,temp:93,seconds:180,grind:"Média-fina",
        steps:[
          {title:"Florescimento",text:"Despeje 50 g de água. Mexa suavemente e aguarde.",from:0,to:45},
          {title:"Primeiro despejo",text:"Vá em círculos até chegar a 180 g.",from:45,to:95},
          {title:"Segundo despejo",text:"Complete lentamente até 300 g.",from:95,to:135},
          {title:"Final",text:"Deixe a água terminar de passar. Busque uma drenagem próxima de 3 minutos.",from:135,to:180}
        ]},
      {id:"v60-doce",title:"V60 mais doce",tag:"DOCE",subtitle:"Para cafés frutados e florais",coffee:20,water:320,temp:92,seconds:195,grind:"Média",
        steps:[
          {title:"Florescimento",text:"Molhe todo o café com 60 g e aguarde.",from:0,to:50},
          {title:"Primeiro despejo",text:"Suba até 200 g com movimentos lentos.",from:50,to:100},
          {title:"Finalização",text:"Complete até 320 g e deixe drenar sem agitar.",from:100,to:195}
        ]}
    ]
  },
  {
    id:"aeropress", name:"AeroPress", short:"A", description:"Rápida, versátil e perfeita para testar novas ideias.",
    recipes:[
      {id:"aeropress-classica",title:"AeroPress clássica",tag:"CLÁSSICA",subtitle:"Equilibrada e fácil de repetir",coffee:15,water:230,temp:90,seconds:120,grind:"Média",
        steps:[
          {title:"Preparar",text:"Coloque o filtro e aqueça a AeroPress.",from:0,to:15},
          {title:"Infusão",text:"Adicione 230 g de água e mexa por 10 segundos.",from:15,to:75},
          {title:"Prensar",text:"Pressione devagar até ouvir o primeiro chiado.",from:75,to:120}
        ]}
    ]
  },
  {
    id:"chemex", name:"Chemex", short:"C", description:"Uma xícara limpa e delicada, com muito espaço para aroma.",
    recipes:[
      {id:"chemex-limpa",title:"Chemex limpa",tag:"CLAREZA",subtitle:"Leve e aromática",coffee:30,water:500,temp:94,seconds:240,grind:"Média-grossa",
        steps:[
          {title:"Florescimento",text:"Sature o café com 60 g e aguarde.",from:0,to:45},
          {title:"Segundo despejo",text:"Vá até 300 g mantendo um fluxo constante.",from:45,to:120},
          {title:"Finalização",text:"Complete até 500 g sem ultrapassar a borda do filtro.",from:120,to:240}
        ]}
    ]
  },
  {
    id:"prensa", name:"Prensa Francesa", short:"P", description:"Corpo, textura e simplicidade — sem pressa.",
    recipes:[
      {id:"prensa-dia",title:"Prensa do dia a dia",tag:"FÁCIL",subtitle:"Corpo alto e preparo sem complicação",coffee:30,water:500,temp:93,seconds:270,grind:"Grossa",
        steps:[
          {title:"Adicionar",text:"Coloque o café e toda a água de uma vez.",from:0,to:30},
          {title:"Infusão",text:"Mexa uma vez e deixe em repouso.",from:30,to:240},
          {title:"Prensar",text:"Pressione devagar e sirva imediatamente.",from:240,to:270}
        ]}
    ]
  },
  {
    id:"moka", name:"Moka", short:"M", description:"Intensa e aromática, feita para beber sem pressa.",
    recipes:[
      {id:"moka-equilibrada",title:"Moka equilibrada",tag:"CLÁSSICA",subtitle:"Intensa sem amargor excessivo",coffee:18,water:180,temp:95,seconds:300,grind:"Média-fina",
        steps:[
          {title:"Preparar",text:"Encha a base com água quente até a válvula.",from:0,to:30},
          {title:"Montar",text:"Adicione o café sem compactar e feche.",from:30,to:60},
          {title:"Extrair",text:"Leve ao fogo baixo e retire ao primeiro sinal de borbulha.",from:60,to:300}
        ]}
    ]
  }
];

const fmt = (seconds:number) => `${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
const ratio = (r:Recipe) => (r.water/r.coffee).toFixed(1).replace(".", ",");

export default function BrewApp(){
  const [methodId,setMethodId] = useState("v60");
  const [recipeId,setRecipeId] = useState("v60-equilibrado");
  const [dose,setDose] = useState(18);
  const [favorite,setFavorite] = useState(false);
  const [menu,setMenu] = useState(false);
  const [timerOpen,setTimerOpen] = useState(false);
  const [running,setRunning] = useState(false);
  const [elapsed,setElapsed] = useState(0);

  const method = methods.find(m=>m.id===methodId)!;
  const recipe = method.recipes.find(r=>r.id===recipeId) ?? method.recipes[0];
  const calculatedWater = Math.round(dose * recipe.water / recipe.coffee);

  useEffect(()=> {
    setDose(recipe.coffee); setFavorite(false); setElapsed(0); setRunning(false);
  },[recipe.id]);

  useEffect(()=>{
    if(!running) return;
    const id = window.setInterval(()=>setElapsed(v=>{
      if(v >= recipe.seconds){ setRunning(false); return recipe.seconds; }
      return v+1;
    }),1000);
    return ()=>window.clearInterval(id);
  },[running,recipe.seconds]);

  const activeStep = useMemo(()=>{
    let idx=0;
    recipe.steps.forEach((s,i)=>{if(elapsed>=s.from) idx=i});
    return Math.min(idx,recipe.steps.length-1);
  },[elapsed,recipe.steps]);

  function chooseMethod(id:string){
    const m=methods.find(x=>x.id===id)!;
    setMethodId(id); setRecipeId(m.recipes[0].id); setMenu(false);
  }
  function surprise(){
    const m=methods[Math.floor(Math.random()*methods.length)];
    const r=m.recipes[Math.floor(Math.random()*m.recipes.length)];
    setMethodId(m.id); setRecipeId(r.id);
  }
  function openTimer(){setElapsed(0);setRunning(false);setTimerOpen(true)}
  function closeTimer(){setRunning(false);setTimerOpen(false)}
  function resetTimer(){setElapsed(0);setRunning(false)}
  function toggleTimer(){
    if(elapsed>=recipe.seconds){resetTimer();return}
    setRunning(v=>!v);
  }

  return <div className="app">
    <aside className={`sidebar ${menu?"open":""}`}>
      <div className="brand">
        <div className="brand-symbol"><Coffee size={19}/></div>
        <div><div className="brand-name">barista</div><div className="brand-sub">em casa</div></div>
      </div>
      <div className="nav-group">
        <div className="nav-label">Métodos</div>
        {methods.map(m=><button key={m.id} className={`method-nav ${m.id===methodId?"selected":""}`} onClick={()=>chooseMethod(m.id)}>
          <span className="method-bullet">{m.short}</span><span>{m.name}</span>
        </button>)}
      </div>
      <div className="nav-group explore">
        <div className="nav-label">Explorar</div>
        <button className="simple-nav active"><BookOpen size={16}/> Receitas</button>
        <button className="simple-nav"><Scale size={16}/> Calculadora</button>
        <button className="simple-nav"><Timer size={16}/> Timers</button>
      </div>
      <div className="side-footer">
        <div className="footer-rule"/>
        <p>Feito para quem gosta de<br/><strong>preparar o próprio café.</strong></p>
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="mobile-menu" onClick={()=>setMenu(v=>!v)} aria-label="Menu"><Menu size={21}/></button>
        <div className="crumb">Receitas <ChevronRight size={13}/><strong>{method.name}</strong></div>
        <button className="surprise" onClick={surprise}><Sparkles size={15}/> Surpreenda-me</button>
      </header>

      <div className="page">
        <section className="hero">
          <div>
            <div className="kicker">ESCOLHA UM MÉTODO</div>
            <h1>{method.name}</h1>
            <p>{method.description}</p>
          </div>
          <div className="recipe-count">{method.recipes.length} {method.recipes.length===1?"receita":"receitas"}</div>
        </section>

        <div className="workspace">
          <section className="recipe-picker">
            <div className="picker-title">Receitas</div>
            {method.recipes.map(r=><button key={r.id} className={`recipe-choice ${r.id===recipe.id?"selected":""}`} onClick={()=>setRecipeId(r.id)}>
              <span className="choice-tag">{r.tag}</span>
              <strong>{r.title}</strong>
              <small>{r.coffee} g · {r.water} g · {r.temp}°C</small>
            </button>)}
          </section>

          <article className="recipe-card">
            <div className="recipe-head">
              <div><span className="pill">{recipe.tag}</span><h2>{recipe.title}</h2><p>{recipe.subtitle}</p></div>
              <button className={`heart ${favorite?"liked":""}`} onClick={()=>setFavorite(v=>!v)} aria-label="Favoritar"><Heart size={19} fill={favorite?"currentColor":"none"}/></button>
            </div>

            <div className="stats">
              <div><span>Café</span><b>{recipe.coffee} <i>g</i></b></div>
              <div><span>Água</span><b>{recipe.water} <i>g</i></b></div>
              <div><span>Temperatura</span><b>{recipe.temp} <i>°C</i></b></div>
              <div><span>Tempo</span><b>{fmt(recipe.seconds)}</b></div>
            </div>

            <div className="details">
              <div><span>Moagem</span><strong>{recipe.grind}</strong></div>
              <div><span>Proporção</span><strong>1 : {ratio(recipe)}</strong></div>
            </div>

            <div className="rule"/>

            <div className="steps-head"><div><span>Preparo</span><h3>Passo a passo</h3></div><button onClick={openTimer}>Iniciar timer <ArrowRight size={15}/></button></div>

            <div className="steps">
              {recipe.steps.map((s,i)=><div className="step" key={s.title}>
                <div className="step-index">{String(i+1).padStart(2,"0")}</div>
                <div><strong>{s.title}</strong><p>{s.text}</p></div>
                <time>{fmt(s.from)} — {fmt(s.to)}</time>
              </div>)}
            </div>

            <div className="adjuster">
              <div><span>Ajuste a receita</span><strong>Quanto café você tem?</strong></div>
              <div className="dose-input"><button onClick={()=>setDose(v=>Math.max(8,v-1))}><Minus size={14}/></button><b>{dose}</b><span>g</span><button onClick={()=>setDose(v=>Math.min(60,v+1))}><Plus size={14}/></button></div>
              <div className="water-output"><span>água</span><strong>{calculatedWater} g</strong></div>
            </div>

            <button className="start-button" onClick={openTimer}>Começar preparo <ArrowRight size={17}/></button>
          </article>
        </div>
      </div>
    </main>

    {timerOpen && <div className="overlay">
      <section className="timer-modal" role="dialog" aria-modal="true">
        <button className="close" onClick={closeTimer} aria-label="Fechar"><X size={20}/></button>
        <div className="kicker">PREPARO GUIADO</div>
        <h2>{recipe.title}</h2>
        <div className="clock">{fmt(elapsed)}</div>
        <div className="current-step"><span>{String(activeStep+1).padStart(2,"0")}</span><div><b>{recipe.steps[activeStep].title}</b><p>{recipe.steps[activeStep].text}</p></div></div>
        <div className="timer-buttons"><button className="reset" onClick={resetTimer}><RotateCcw size={14}/> Recomeçar</button><button className="start-button" onClick={toggleTimer}>{elapsed>=recipe.seconds?"Recomeçar":running?"Pausar":"Começar"} <ArrowRight size={16}/></button></div>
        <div className="progress"><span style={{width:`${Math.min(100,elapsed/recipe.seconds*100)}%`}}/></div>
      </section>
    </div>}
  </div>
}