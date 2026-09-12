const methods = {
  v60: {
    name: "V60",
    icon: "V",
    description: "Um preparo limpo, doce e equilibrado para começar bem.",
    recipes: [
      {title:"V60 equilibrado", tag:"CLÁSSICA", author:"Uma receita simples para o dia a dia", coffee:18, water:300, temp:93, time:"3:00", grind:"Média-fina",
       steps:[
        ["Florescimento","Despeje 50 g de água, mexa suavemente e aguarde.","00:00–00:45"],
        ["Primeiro despejo","Vá em círculos até chegar a 180 g.","00:45–01:35"],
        ["Segundo despejo","Complete lentamente até 300 g.","01:35–02:15"],
        ["Final","Deixe a água terminar de passar. A extração deve fechar perto de 3 minutos.","02:15–03:00"]]},
      {title:"V60 mais doce", tag:"DOCE", author:"Para cafés com perfil frutado", coffee:20, water:320, temp:92, time:"3:15", grind:"Média",
       steps:[
        ["Florescimento","Molhe todo o café com 60 g e aguarde.","00:00–00:50"],
        ["Primeiro despejo","Suba até 200 g com movimentos lentos.","00:50–01:40"],
        ["Finalização","Complete até 320 g e deixe drenar sem agitar.","01:40–03:15"]]},
      {title:"V60 intenso", tag:"INTENSO", author:"Mais corpo para torra média", coffee:20, water:280, temp:94, time:"2:45", grind:"Média-fina",
       steps:[
        ["Florescimento","Despeje 50 g e aguarde 40 segundos.","00:00–00:40"],
        ["Despejo contínuo","Complete até 280 g mantendo o fluxo constante.","00:40–02:05"],
        ["Final","Aguarde a drenagem.","02:05–02:45"]]}
    ]
  },
  aeropress: {
    name:"AeroPress", icon:"A", description:"Rápida, versátil e ótima para experimentar.",
    recipes:[
      {title:"AeroPress clássica",tag:"CLÁSSICA",author:"Equilibrada e fácil de repetir",coffee:15,water:230,temp:90,time:"2:00",grind:"Média",
       steps:[
        ["Preparar","Coloque o filtro e aqueça a AeroPress.","00:00–00:15"],
        ["Infusão","Adicione 230 g de água e mexa por 10 segundos.","00:15–01:15"],
        ["Prensar","Pressione devagar até ouvir o chiado.","01:15–02:00"]]},
      {title:"AeroPress encorpada",tag:"ENCORPADA",author:"Para uma xícara mais intensa",coffee:17,water:220,temp:88,time:"1:45",grind:"Média-fina",
       steps:[
        ["Infusão","Adicione a água e mexa vigorosamente.","00:00–01:00"],
        ["Aguardar","Tampe e aguarde mais 15 segundos.","01:00–01:15"],
        ["Prensar","Pressione de forma contínua.","01:15–01:45"]]}
    ]
  },
  chemex: {
    name:"Chemex", icon:"C", description:"Clareza, delicadeza e uma xícara que brilha.",
    recipes:[
      {title:"Chemex limpa",tag:"CLAREZA",author:"Leve e aromática",coffee:30,water:500,temp:94,time:"4:00",grind:"Média-grossa",
       steps:[
        ["Florescimento","Sature o café com 60 g e aguarde 45 segundos.","00:00–00:45"],
        ["Segundo despejo","Vá até 300 g em fluxo constante.","00:45–02:00"],
        ["Finalização","Complete até 500 g sem ultrapassar a borda do filtro.","02:00–04:00"]]}
    ]
  },
  "prensa": {
    name:"Prensa Francesa", icon:"P", description:"Corpo, textura e simplicidade — sem pressa.",
    recipes:[
      {title:"Prensa do dia a dia",tag:"FÁCIL",author:"Corpo alto e preparo sem complicação",coffee:30,water:500,temp:93,time:"4:30",grind:"Grossa",
       steps:[
        ["Adicionar","Coloque o café e toda a água de uma vez.","00:00–00:30"],
        ["Infusão","Mexa uma vez e deixe em repouso.","00:30–04:00"],
        ["Prensar","Pressione devagar e sirva imediatamente.","04:00–04:30"]]}
    ]
  },
  moka: {
    name:"Moka", icon:"M", description:"Intensa, aromática e feita para beber sem pressa.",
    recipes:[
      {title:"Moka equilibrada",tag:"CLÁSSICA",author:"Intensa sem amargor excessivo",coffee:18,water:180,temp:95,time:"5:00",grind:"Média-fina",
       steps:[
        ["Preparar","Encha a base com água quente até a válvula.","00:00–00:30"],
        ["Montar","Adicione o café sem compactar e feche.","00:30–01:00"],
        ["Extrair","Leve ao fogo baixo e retire ao primeiro sinal de borbulha.","01:00–05:00"]]}
    ]
  }
};

let currentMethod = "v60";
let currentRecipe = 0;
let timer = {running:false, elapsed:0, interval:null, stepIndex:0};

const $ = id => document.getElementById(id);
const methodNav = $("methodNav");

function renderMethods(){
  methodNav.innerHTML = Object.entries(methods).map(([key,m]) =>
    `<button class="method-button ${key===currentMethod?"active":""}" data-method="${key}">
      <span class="method-icon">${m.icon}</span>${m.name}
    </button>`).join("");
  methodNav.querySelectorAll(".method-button").forEach(btn => btn.onclick = () => {
    currentMethod = btn.dataset.method; currentRecipe = 0; render();
    if(window.innerWidth <= 900) $("sidebar").classList.remove("open");
  });
}

function renderRecipeList(){
  const list = methods[currentMethod].recipes;
  $("recipeList").innerHTML = list.map((r,i) =>
    `<button class="recipe-item ${i===currentRecipe?"active":""}" data-index="${i}">
      <span class="small">${r.tag}</span>
      <strong>${r.title}</strong>
      <span>${r.coffee} g · ${r.water} g</span>
    </button>`).join("");
  $("recipeList").querySelectorAll(".recipe-item").forEach(btn => btn.onclick = () => {
    currentRecipe = Number(btn.dataset.index); render();
  });
}

function renderCard(){
  const r = methods[currentMethod].recipes[currentRecipe];
  const ratio = (r.water/r.coffee).toFixed(1).replace(".",",");
  $("breadcrumbMethod").textContent = methods[currentMethod].name;
  $("pageTitle").textContent = methods[currentMethod].name;
  $("pageDescription").textContent = methods[currentMethod].description;
  $("recipeCount").textContent = `${methods[currentMethod].recipes.length} ${methods[currentMethod].recipes.length===1?"receita":"receitas"}`;
  $("recipeTag").textContent = r.tag;
  $("recipeTitle").textContent = r.title;
  $("recipeAuthor").textContent = r.author;
  $("coffeeValue").textContent = `${r.coffee} g`;
  $("waterValue").textContent = `${r.water} g`;
  $("tempValue").textContent = `${r.temp} °C`;
  $("timeValue").textContent = r.time;
  $("grindValue").textContent = r.grind;
  $("ratioValue").textContent = `1 : ${ratio}`;
  $("doseInput").value = r.coffee;
  updateCalculator();

  $("steps").innerHTML = r.steps.map((s,i) =>
    `<div class="step"><span class="step-num">${String(i+1).padStart(2,"0")}</span>
      <div><strong>${s[0]}</strong><p>${s[1]}</p></div><time>${s[2]}</time></div>`).join("");
}

function updateCalculator(){
  const r = methods[currentMethod].recipes[currentRecipe];
  const dose = Math.max(8, Math.min(60, Number($("doseInput").value)||r.coffee));
  $("doseInput").value = dose;
  $("calculatedWater").textContent = `${Math.round(dose * r.water / r.coffee)} g`;
}

function render(){ renderMethods(); renderRecipeList(); renderCard(); }

function openTimer(){
  const r = methods[currentMethod].recipes[currentRecipe];
  timer.running=false; timer.elapsed=0; timer.stepIndex=0; clearInterval(timer.interval);
  $("timerRecipeTitle").textContent = r.title;
  $("timerOverlay").classList.add("open");
  $("timerOverlay").setAttribute("aria-hidden","false");
  updateTimerUI();
}
function closeTimer(){
  clearInterval(timer.interval); timer.running=false;
  $("timerOverlay").classList.remove("open");
  $("timerOverlay").setAttribute("aria-hidden","true");
}
function parseTime(t){ const [m,s]=t.split(":").map(Number); return m*60+s; }
function updateTimerUI(){
  const r = methods[currentMethod].recipes[currentRecipe];
  const total = parseTime(r.time);
  const elapsed = timer.elapsed;
  $("timerClock").textContent = `${String(Math.floor(elapsed/60)).padStart(2,"0")}:${String(elapsed%60).padStart(2,"0")}`;
  let idx=0;
  r.steps.forEach((s,i)=>{ const start=parseTime(s[2].split("–")[0]); if(elapsed>=start) idx=i; });
  timer.stepIndex=idx;
  const s=r.steps[idx];
  $("timerStepNumber").textContent=String(idx+1).padStart(2,"0");
  $("timerStepTitle").textContent=s[0];
  $("timerStepText").textContent=s[1];
  $("timerProgress").style.width=`${Math.min(100,elapsed/total*100)}%`;
  $("nextStep").innerHTML = elapsed >= total ? `Finalizar <span>✓</span>` : (timer.running ? `Pausar <span>Ⅱ</span>` : `Começar <span>→</span>`);
}
function toggleTimer(){
  const r=methods[currentMethod].recipes[currentRecipe], total=parseTime(r.time);
  if(timer.elapsed>=total){ closeTimer(); return; }
  if(timer.running){ clearInterval(timer.interval); timer.running=false; }
  else{
    timer.running=true;
    timer.interval=setInterval(()=>{timer.elapsed++; updateTimerUI(); if(timer.elapsed>=total){clearInterval(timer.interval);timer.running=false;updateTimerUI()}},1000);
  }
  updateTimerUI();
}

$("doseInput").addEventListener("input", updateCalculator);
$("minusDose").onclick=()=>{$("doseInput").value=Number($("doseInput").value)-1;updateCalculator()};
$("plusDose").onclick=()=>{$("doseInput").value=Number($("doseInput").value)+1;updateCalculator()};
$("startTimer").onclick=openTimer;
$("startFromTop").onclick=openTimer;
$("nextStep").onclick=toggleTimer;
$("resetTimer").onclick=()=>{clearInterval(timer.interval);timer.running=false;timer.elapsed=0;updateTimerUI()};
$("closeTimer").onclick=closeTimer;
$("favoriteBtn").onclick=()=>$("favoriteBtn").classList.toggle("saved");
$("mobileMenu").onclick=()=>$("sidebar").classList.toggle("open");
$("randomRecipe").onclick=()=>{
  const keys=Object.keys(methods), k=keys[Math.floor(Math.random()*keys.length)];
  currentMethod=k; currentRecipe=Math.floor(Math.random()*methods[k].recipes.length); render();
};
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeTimer()});
render();
