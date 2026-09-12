const data = {
  v60:{name:"V60",icon:"V",description:"Clareza, doçura e uma xícara que deixa o café falar.",recipes:[
    {id:"v60-equilibrado",title:"V60 equilibrado",tag:"CLÁSSICA",subtitle:"Uma receita simples para repetir todos os dias",coffee:18,water:300,temp:93,seconds:180,grind:"Média-fina",steps:[
      ["Blooming","Despeje 50 g de água. Mexa suavemente e aguarde.",0,45],
      ["First Pour","Faça um despejo em círculos até chegar a 180 g.",45,95],
      ["Second Pour","Faça um segundo despejo lentamente até 300 g.",95,135],
      ["Final Pour","Deixe a água terminar de passar. Busque uma drenagem próxima de 3 minutos.",135,180]]},
    {id:"v60-doce",title:"V60 mais doce",tag:"DOCE",subtitle:"Para cafés frutados e florais",coffee:20,water:320,temp:92,seconds:195,grind:"Média",steps:[
      ["Blooming","Molhe todo o café com 60 g e aguarde.",0,50],
      ["First Pour","Faça um despejo lento até chegar a 200 g.",50,100],
      ["Final Pour","Complete até 320 g e deixe drenar sem agitar.",100,195]]},
    {id:"v60-intenso",title:"V60 mais intenso",tag:"INTENSO",subtitle:"Mais corpo para começar o dia",coffee:20,water:280,temp:94,seconds:175,grind:"Média-fina",steps:[
      ["Blooming","Despeje 50 g de água e aguarde.",0,40],
      ["First Pour","Faça um despejo até chegar a 170 g.",40,95],
      ["Final Pour","Complete até 280 g e deixe drenar.",95,175]]},
    ]},
  aeropress:{name:"AeroPress",icon:"A",description:"Rápida, versátil e perfeita para testar novas ideias.",recipes:[
    {id:"aeropress-classica",title:"AeroPress clássica",tag:"CLÁSSICA",subtitle:"Equilibrada e fácil de repetir",coffee:15,water:230,temp:90,seconds:120,grind:"Média",steps:[
      ["Setup","Coloque o filtro e aqueça a AeroPress.",0,15],
      ["Steep","Adicione 230 g de água e mexa por 10 segundos.",15,75],
      ["Press","Pressione devagar até ouvir o primeiro chiado.",75,120]]}]},
  chemex:{name:"Chemex",icon:"C",description:"Uma xícara limpa e delicada, com muito espaço para aroma.",recipes:[
    {id:"chemex-limpa",title:"Chemex limpa",tag:"CLAREZA",subtitle:"Leve e aromática",coffee:30,water:500,temp:94,seconds:240,grind:"Média-grossa",steps:[
      ["Blooming","Sature o café com 60 g e aguarde.",0,45],
      ["Second Pour","Faça um segundo despejo até 300 g mantendo um fluxo constante.",45,120],
      ["Final Pour","Complete até 500 g sem ultrapassar a borda do filtro.",120,240]]}]},
  prensa:{name:"Prensa Francesa",icon:"P",description:"Corpo, textura e simplicidade — sem pressa.",recipes:[
    {id:"prensa-dia",title:"Prensa do dia a dia",tag:"FÁCIL",subtitle:"Corpo alto e preparo sem complicação",coffee:30,water:500,temp:93,seconds:270,grind:"Grossa",steps:[
      ["Add Coffee","Coloque o café e toda a água de uma vez.",0,30],
      ["Steep","Mexa uma vez e deixe em repouso.",30,240],
      ["Press","Pressione devagar e sirva imediatamente.",240,270]]}]},
  moka:{name:"Moka",icon:"M",description:"Intensa e aromática, feita para beber sem pressa.",recipes:[
    {id:"moka-equilibrada",title:"Moka equilibrada",tag:"CLÁSSICA",subtitle:"Intensa sem amargor excessivo",coffee:18,water:180,temp:95,seconds:300,grind:"Média-fina",steps:[
      ["Fill","Encha a base com água quente até a válvula.",0,30],
      ["Assemble","Adicione o café sem compactar e feche.",30,60],
      ["Brew","Leve ao fogo baixo e retire ao primeiro sinal de borbulha.",60,300]]}]}
};
let methodId="v60", recipeIndex=0, dose=18, favorite=false, timer=null, running=false, elapsed=0;

const $=id=>document.getElementById(id);
const methods=$("methods"), strip=$("methodStrip"), choices=$("recipeChoices");

function allMethodButtons(){
  methods.innerHTML=Object.entries(data).map(([id,m])=>`
    <button class="method ${id===methodId?"active":""}" data-id="${id}">
      <span class="method-icon">${m.icon}</span><span class="method-name">${m.name}</span><span class="method-arrow">→</span>
    </button>`).join("");
  strip.innerHTML=Object.entries(data).map(([id,m])=>`
    <button class="method-chip ${id===methodId?"active":""}" data-id="${id}">
      <span class="chip-icon">${m.icon}</span>${m.name}
    </button>`).join("");
  document.querySelectorAll("[data-id]").forEach(b=>b.onclick=()=>selectMethod(b.dataset.id));
}
function selectMethod(id){
  methodId=id; recipeIndex=0; favorite=false; render();
  $("recipeCard").animate([{opacity:.45,transform:"translateY(8px)"},{opacity:1,transform:"translateY(0)"}],{duration:280,easing:"ease-out"});
  if(innerWidth<=900) $("sidebar").classList.remove("open");
}
function renderRecipes(){
  const list=data[methodId].recipes;
  choices.innerHTML=list.map((r,i)=>`
    <button class="recipe-choice ${i===recipeIndex?"active":""}" data-index="${i}">
      <span class="choice-tag">${r.tag}</span><strong>${r.title}</strong><small>${r.coffee} g · ${r.water} g · ${r.temp}°C</small>
    </button>`).join("");
  choices.querySelectorAll("[data-index]").forEach(b=>b.onclick=()=>{recipeIndex=+b.dataset.index;renderCard()});
  $("recipeMenuCount").textContent=String(list.length).padStart(2,"0");
}
function renderCard(){
  const r=data[methodId].recipes[recipeIndex];
  dose=r.coffee;
  $("crumbMethod").textContent=data[methodId].name;$("methodName").textContent=data[methodId].name;
  $("methodDescription").textContent=data[methodId].description;
  $("count").textContent=`${data[methodId].recipes.length} ${data[methodId].recipes.length===1?"receita":"receitas"}`;
  $("tag").textContent=r.tag;$("title").textContent=r.title;$("subtitle").textContent=r.subtitle;
  $("grind").textContent=r.grind;$("ratio").textContent=`1 : ${(r.water/r.coffee).toFixed(1).replace(".",",")}`;
  $("dose").textContent=dose;$("water").textContent=`${r.water} g`;
  $("stats").innerHTML=[
    ["Café",`${r.coffee} <i>g</i>`],["Água",`${r.water} <i>g</i>`],["Temperatura",`${r.temp} <i>°C</i>`],["Tempo",fmt(r.seconds)]
  ].map(x=>`<div class="stat"><span>${x[0]}</span><b>${x[1]}</b></div>`).join("");
  $("steps").innerHTML=r.steps.map((s,i)=>`<div class="step"><div class="step-num">${String(i+1).padStart(2,"0")}</div><div><strong>${s[0]}</strong><p>${s[1]}</p></div><time>${fmt(s[2])} — ${fmt(s[3])}</time></div>`).join("");
  $("heart").classList.toggle("liked",favorite);$("heart").textContent=favorite?"♥":"♡";
  $("recipeCard").classList.remove("pulse");void $("recipeCard").offsetWidth;$("recipeCard").classList.add("pulse");
}
function render(){allMethodButtons();renderRecipes();renderCard()}
function fmt(s){return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`}
function updateWater(){const r=data[methodId].recipes[recipeIndex];$("water").textContent=`${Math.round(dose*r.water/r.coffee)} g`}

$("minus").onclick=()=>{dose=Math.max(8,dose-1);$("dose").textContent=dose;updateWater()};
$("plus").onclick=()=>{dose=Math.min(60,dose+1);$("dose").textContent=dose;updateWater()};
$("heart").onclick=()=>{favorite=!favorite;$("heart").classList.toggle("liked",favorite);$("heart").textContent=favorite?"♥":"♡"};
$("menuBtn").onclick=()=>$("sidebar").classList.toggle("open");
$("surprise").onclick=()=>{const keys=Object.keys(data);const k=keys[Math.floor(Math.random()*keys.length)];methodId=k;recipeIndex=Math.floor(Math.random()*data[k].recipes.length);render()};
$("start").onclick=openTimer;$("quickStart").onclick=openTimer;
$("close").onclick=()=>{$("overlay").hidden=true;stopTimer()};
$("reset").onclick=()=>{elapsed=0;running=false;clearInterval(timer);updateTimer()};
$("timerStart").onclick=()=>{
  if(elapsed>=data[methodId].recipes[recipeIndex].seconds){elapsed=0}
  running=!running;
  clearInterval(timer);
  if(running) timer=setInterval(()=>{elapsed++;updateTimer();if(elapsed>=data[methodId].recipes[recipeIndex].seconds){running=false;clearInterval(timer);}},1000);
  updateTimer();
};
function openTimer(){elapsed=0;running=false;clearInterval(timer);$("timerTitle").textContent=data[methodId].recipes[recipeIndex].title;$("overlay").hidden=false;updateTimer()}
function stopTimer(){clearInterval(timer);running=false}
function updateTimer(){
  const r=data[methodId].recipes[recipeIndex], idx=Math.min(r.steps.length-1,r.steps.reduce((a,s,i)=>elapsed>=s[2]?i:a,0));
  $("clock").textContent=fmt(elapsed);$("currentNum").textContent=String(idx+1).padStart(2,"0");$("currentTitle").textContent=r.steps[idx][0];$("currentText").textContent=r.steps[idx][1];$("progress").style.width=`${Math.min(100,elapsed/r.seconds*100)}%`;
  $("timerStart").innerHTML=elapsed>=r.seconds?"Recomeçar <span>↻</span>":running?"Pausar <span>Ⅱ</span>":"Começar <span>→</span>";
}
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("overlay").hidden){$("overlay").hidden=true;stopTimer()}});
render();
