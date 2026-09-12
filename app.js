const data={
v60:{name:"V60",icon:"V",cls:"v60",desc:"Clareza, doçura e uma xícara que deixa o café falar.",recipes:[
{id:"v60-equilibrado",title:"V60 equilibrado",tag:"CLÁSSICA",sub:"Uma receita simples para repetir todos os dias.",coffee:18,water:300,temp:93,sec:180,grind:"Média-fina",steps:[["Blooming","Despeje 50 g de água e aguarde a pré-infusão.",0,45],["First Pour","Faça um despejo em círculos até chegar a 180 g.",45,95],["Second Pour","Complete até 300 g com um fluxo constante.",95,135],["Final Pour","Deixe a água terminar de passar. Busque uma drenagem próxima de 3 minutos.",135,180]]},
{id:"v60-doce",title:"V60 mais doce",tag:"DOCE",sub:"Para cafés frutados e florais.",coffee:20,water:320,temp:92,sec:195,grind:"Média",steps:[["Blooming","Molhe todo o café com 60 g e aguarde.",0,50],["First Pour","Faça um despejo lento até 200 g.",50,100],["Final Pour","Complete até 320 g e deixe drenar sem agitar.",100,195]]},
{id:"v60-intenso",title:"V60 mais intenso",tag:"INTENSO",sub:"Mais corpo para começar o dia.",coffee:20,water:280,temp:94,sec:175,grind:"Média-fina",steps:[["Blooming","Despeje 50 g de água e aguarde.",0,40],["First Pour","Faça um despejo até 170 g.",40,95],["Final Pour","Complete até 280 g e deixe drenar.",95,175]]}]},
aero:{name:"AeroPress",icon:"A",cls:"aero",desc:"Rápida, versátil e perfeita para testar novas ideias.",recipes:[{id:"aero-classica",title:"AeroPress clássica",tag:"CLÁSSICA",sub:"Equilibrada e fácil de repetir.",coffee:15,water:230,temp:90,sec:120,grind:"Média",steps:[["Setup","Coloque o filtro e aqueça a AeroPress.",0,15],["Steep","Adicione 230 g de água e mexa por 10 segundos.",15,75],["Press","Pressione devagar até ouvir o primeiro chiado.",75,120]]},{id:"aero-intensa",title:"AeroPress intensa",tag:"INTENSA",sub:"Mais concentrada para diluir ou beber pura.",coffee:18,water:210,temp:91,sec:105,grind:"Média-fina",steps:[["Blooming","Adicione 40 g de água e aguarde.",0,30],["Steep","Complete com 210 g e mexa.",30,75],["Press","Pressione lentamente.",75,105]]}]},
chemex:{name:"Chemex",icon:"C",cls:"chemex",desc:"Uma xícara limpa e delicada, com muito espaço para aroma.",recipes:[{id:"chemex-limpa",title:"Chemex limpa",tag:"CLAREZA",sub:"Leve e aromática.",coffee:30,water:500,temp:94,sec:240,grind:"Média-grossa",steps:[["Blooming","Sature o café com 60 g e aguarde.",0,45],["Second Pour","Faça um segundo despejo até 300 g mantendo um fluxo constante.",45,120],["Final Pour","Complete até 500 g sem ultrapassar a borda do filtro.",120,240]]}]},
prensa:{name:"Prensa Francesa",icon:"P",cls:"prensa",desc:"Corpo, textura e simplicidade — sem pressa.",recipes:[{id:"prensa-dia",title:"Prensa do dia a dia",tag:"FÁCIL",sub:"Corpo alto e preparo sem complicação.",coffee:30,water:500,temp:93,sec:270,grind:"Grossa",steps:[["Add Coffee","Coloque o café e toda a água de uma vez.",0,30],["Steep","Mexa uma vez e deixe em repouso.",30,240],["Press","Pressione devagar e sirva imediatamente.",240,270]]}]},
moka:{name:"Moka",icon:"M",cls:"moka",desc:"Intensa e aromática, feita para beber sem pressa.",recipes:[{id:"moka-equilibrada",title:"Moka equilibrada",tag:"CLÁSSICA",sub:"Intensa sem amargor excessivo.",coffee:18,water:180,temp:95,sec:300,grind:"Média-fina",steps:[["Fill","Encha a base com água quente até a válvula.",0,30],["Assemble","Adicione o café sem compactar e feche.",30,60],["Brew","Leve ao fogo baixo e retire ao primeiro sinal de borbulha.",60,300]]}]}
};
let method="v60",ri=0,fav=false,mode="beverage",ratio=16,elapsed=0,running=false,timer=null;
const $=id=>document.getElementById(id), fmt=s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

function renderMethods(){
 $("methodButtons").innerHTML=Object.entries(data).map(([id,m])=>`<button class="method-btn ${id===method?"active":""}" data-method="${id}" aria-label="${m.name}"><span class="method-icon">${m.icon}</span><strong>${m.name}</strong><small>${m.recipes.length} ${m.recipes.length===1?"receita":"receitas"}</small></button>`).join("");
 document.querySelectorAll("[data-method]").forEach(b=>b.onclick=()=>selectMethod(b.dataset.method));
}
function selectMethod(id){method=id;ri=0;fav=false;render();$("recipeCard").scrollIntoView({behavior:"smooth",block:"start"})}
function renderRecipeButtons(){
 const m=data[method];
 $("recipeButtons").innerHTML=m.recipes.map((r,i)=>`<button class="recipe-button ${i===ri?"active":""}" data-recipe="${i}"><span class="brew-img ${m.cls}">${m.icon}</span><span class="rtext"><em>${r.tag}</em><strong>${r.title}</strong><small>${r.coffee} g · ${r.water} g · ${r.temp}°C</small></span></button>`).join("");
 document.querySelectorAll("[data-recipe]").forEach(b=>b.onclick=()=>{ri=+b.dataset.recipe;renderRecipeButtons();renderCard()});
 $("recipeTotal").textContent=String(m.recipes.length).padStart(2,"0");
}
function renderCard(){
 const m=data[method],r=m.recipes[ri], strength=r.water/r.coffee<=15?"Forte":r.water/r.coffee>=17.5?"Suave":"Equilibrado";
 $("crumb").textContent=m.name;$("methodListName").textContent=m.name;$("methodEyebrow").textContent=`MÉTODO ${m.name.toUpperCase()}`;$("methodTitle").textContent=m.name;$("methodDesc").textContent=m.desc;
 $("heroIcon").className=`method-illustration ${m.cls}`;$("heroIcon").innerHTML=`<span>${m.icon}</span><i></i>`;$("cardAccent").style.background=getComputedStyle(document.documentElement).getPropertyValue("--"+m.cls);
 $("tag").textContent=r.tag;$("title").textContent=r.title;$("subtitle").textContent=r.sub;$("grind").textContent=r.grind;$("ratio").textContent=`1 : ${(r.water/r.coffee).toFixed(1).replace(".",",")}`;$("intensity").textContent=strength;
 $("stats").innerHTML=[["Café",`${r.coffee} <i>g</i>`],["Água",`${r.water} <i>g</i>`],["Temperatura",`${r.temp} <i>°C</i>`],["Tempo",fmt(r.sec)]].map(x=>`<div class="stat"><small>${x[0]}</small><strong>${x[1]}</strong></div>`).join("");
 $("steps").innerHTML=r.steps.map((s,i)=>`<div class="step"><span class="step-no">${String(i+1).padStart(2,"0")}</span><div><strong>${s[0]}</strong><p>${s[1]}</p></div><time>${fmt(s[2])} — ${fmt(s[3])}</time></div>`).join("");
 $("favorite").classList.toggle("liked",fav);$("favorite").textContent=fav?"♥":"♡";
 $("recipeCard").style.animation="none";void $("recipeCard").offsetWidth;$("recipeCard").style.animation="cardIn .35s ease";
}
function render(){renderMethods();renderRecipeButtons();renderCard()}
$("favorite").onclick=()=>{fav=!fav;$("favorite").classList.toggle("liked",fav);$("favorite").textContent=fav?"♥":"♡"};
$("surprise").onclick=()=>{const keys=Object.keys(data);method=keys[Math.floor(Math.random()*keys.length)];ri=Math.floor(Math.random()*data[method].recipes.length);render()};
$("mobileMenu").onclick=()=>{$("methodRail").classList.toggle("open")};

$("openCalc").onclick=()=>{$("calcModal").hidden=false};$("openCalc2").onclick=()=>{$("calcModal").hidden=false};$("closeCalc").onclick=()=>{$("calcModal").hidden=true};
document.querySelectorAll(".calc-tab").forEach(b=>b.onclick=()=>{mode=b.dataset.mode;document.querySelectorAll(".calc-tab").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("amountLabel").textContent=mode==="beverage"?"CAFÉ PRONTO DESEJADO":"CAFÉ QUE VOCÊ TEM";$("amount").value=mode==="beverage"?300:18;$("amountUnit").textContent=mode==="beverage"?"mL":"g";calc()});
document.querySelectorAll(".ratios button").forEach(b=>b.onclick=()=>{ratio=+b.dataset.ratio;$("ratioInput").value=ratio;document.querySelectorAll(".ratios button").forEach(x=>x.classList.toggle("selected",x===b));calc()});
$("ratioInput").oninput=()=>{ratio=Number($("ratioInput").value)||16;document.querySelectorAll(".ratios button").forEach(x=>x.classList.toggle("selected",+x.dataset.ratio===ratio));calc()};
$("amount").oninput=calc;
function calc(){const a=Number($("amount").value)||0;let c,w;if(mode==="beverage"){c=a/Math.max(1,ratio-2);w=c*ratio}else{c=a;w=c*ratio}$("answerCoffee").textContent=`${Math.round(c)} g`;$("answerWater").textContent=`${Math.round(w)} g`;let t,d;if(ratio<=14){t="Forte";d="Mais intenso e concentrado."}else if(ratio<=15){t="Forte / equilibrado";d="Mais intensidade mantendo boa definição."}else if(ratio<=16.5){t="Equilibrado";d="Uma proporção versátil para o dia a dia."}else if(ratio<=17.5){t="Suave / equilibrado";d="Mais leve, com destaque para clareza e aroma."}else{t="Suave";d="Mais diluído e delicado."}$("strength").querySelector("b").textContent=t;$("strength").querySelector("p").textContent=d}

$("start").onclick=openTimer;$("timerBtn").onclick=openTimer;$("closeTimer").onclick=closeTimer;$("reset").onclick=()=>{elapsed=0;running=false;clearInterval(timer);updateTimer()};$("timerStart").onclick=()=>{if(elapsed>=data[method].recipes[ri].sec)elapsed=0;running=!running;clearInterval(timer);if(running)timer=setInterval(()=>{elapsed++;updateTimer();if(elapsed>=data[method].recipes[ri].sec){running=false;clearInterval(timer)}},1000);updateTimer()};
function openTimer(){elapsed=0;running=false;clearInterval(timer);$("timerTitle").textContent=data[method].recipes[ri].title;$("timerModal").hidden=false;updateTimer()}
function closeTimer(){clearInterval(timer);running=false;$("timerModal").hidden=true}
function updateTimer(){const r=data[method].recipes[ri],idx=Math.min(r.steps.length-1,r.steps.reduce((a,s,i)=>elapsed>=s[2]?i:a,0));$("clock").textContent=fmt(elapsed);$("stepNo").textContent=String(idx+1).padStart(2,"0");$("stepTitle").textContent=r.steps[idx][0];$("stepText").textContent=r.steps[idx][1];$("progress").style.width=`${Math.min(100,elapsed/r.sec*100)}%`;$("timerStart").innerHTML=elapsed>=r.sec?"Recomeçar <span>↻</span>":running?"Pausar <span>Ⅱ</span>":"Começar <span>→</span>"}
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeTimer();$("calcModal").hidden=true}});
render();calc();
