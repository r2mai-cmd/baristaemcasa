const recipes={
v60:{tag:"CAFÉ COADO",title:"V60 — Hoffmann",subtitle:"Receita base para uma xícara limpa, doce e equilibrada.",icon:"◒",meta:[["Dose","15 g"],["Água","250 g"],["Ratio","1:16,7"],["Temp.","93 °C"],["Moagem","média / média-fina"]],taste:"No paladar: busque <b>doçura e clareza</b>. Se ficou amargo e pesado, pense em uma moagem mais grossa; se ficou ácido e ralo, pode precisar de uma moagem mais fina.",time:195,steps:[
["Blooming","Faça a pré-infusão com cerca de 50 g de água, molhando todo o pó. Dê uma leve agitada no porta-filtro e aguarde 45 s.","A pré-infusão ajuda a liberar os gases do café."],
["First Pour","Comece o primeiro despejo em círculos, de forma controlada, até chegar a 150 g.","Evite jogar água diretamente nas paredes do filtro."],
["Final Pour","Faça o segundo despejo e complete até 250 g. Mantenha um fluxo constante, sem encharcar o leito de uma vez.","A ideia é manter uma extração uniforme."],
["Drawdown","Deixe a água terminar de passar pelo leito. Tempo total de referência: 2:45–3:15.","O tempo é uma referência, não uma meta isolada."]
]},
aeropress:{tag:"IMERSÃO + PRESSÃO",title:"AeroPress — Clássica",subtitle:"Corpo sedoso, doçura alta e preparo rápido.",icon:"◉",meta:[["Dose","15 g"],["Água","220 g"],["Ratio","1:14,7"],["Temp.","90 °C"],["Moagem","média-fina"]],taste:"No paladar: uma xícara <b>doce e encorpada</b>, com pouca adstringência.",time:90,steps:[
["Blooming","Adicione 40 g de água, mexa para incorporar todo o pó e aguarde 30 s.","Aqui o objetivo é garantir que todo o café fique molhado."],
["Steep","Complete até 220 g e faça uma mexida leve. Coloque o filtro e a tampa.","Deixe o café em infusão pelo tempo indicado."],
["Press","Vire a AeroPress com cuidado e pressione de maneira contínua e suave.","Não precisa fazer força nem correr."],
["Serve","Pare quando ouvir o primeiro sinal de ar e sirva imediatamente.","A extração continua se o café ficar sobre a borra."]
]},
chemex:{tag:"CAFÉ COADO",title:"Chemex — Clareza",subtitle:"Uma xícara limpa, aromática e delicada.",icon:"♢",meta:[["Dose","30 g"],["Água","500 g"],["Ratio","1:16,7"],["Temp.","94 °C"],["Moagem","média-grossa"]],taste:"No paladar: bastante <b>clareza e definição</b>, com corpo mais leve por causa do filtro.",time:240,steps:[
["Blooming","Faça a pré-infusão com 60 g de água e aguarde cerca de 45 s.","Molhe todo o pó antes de iniciar os despejos."],
["First Pour","Despeje em movimentos circulares até chegar a 300 g, mantendo o nível de água controlado.","Evite acertar diretamente o papel do filtro."],
["Final Pour","Complete até 500 g com um fluxo contínuo e controlado.","Mantenha o leito sem grandes oscilações."],
["Drawdown","Aguarde a filtragem terminar e retire o filtro antes de servir.","O tempo total pode ficar por volta de 4 minutos."]
]},
french:{tag:"IMERSÃO",title:"Prensa Francesa — Clássica",subtitle:"Corpo alto, textura marcante e preparo sem complicação.",icon:"▥",meta:[["Dose","30 g"],["Água","500 g"],["Ratio","1:16,7"],["Temp.","94 °C"],["Moagem","grossa"]],taste:"No paladar: mais <b>corpo e textura</b>, com maior presença de óleos e partículas finas.",time:240,steps:[
["Blooming","Adicione cerca de 100 g de água e mexa para incorporar todo o café.","Não deixe bolsões de pó seco."],
["Steep","Complete até 500 g, tampe e deixe em infusão por 4 minutos.","A prensa francesa trabalha por imersão, então o tempo pesa bastante."],
["Break","Quebre a crosta da superfície suavemente e retire a espuma, se quiser uma xícara mais limpa.","Mexa sem agitar demais a bebida."],
["Press","Pressione o êmbolo lentamente e sirva logo em seguida.","Evite deixar o café em contato com a borra depois do preparo."]
]},
moka:{tag:"PRESSÃO",title:"Moka — Cafeteira Italiana",subtitle:"Preparo concentrado e intenso, com bastante presença na xícara.",icon:"♜",meta:[["Dose","18 g"],["Água","180 g"],["Ratio","1:10"],["Temp.","quente"],["Moagem","média-fina"]],taste:"No paladar: mais <b>intensidade e corpo</b>. Se estiver muito amargo, reduza a temperatura e evite manter a cafeteira no fogo depois que o fluxo clarear.",time:180,steps:[
["Fill","Coloque água quente na base, sem ultrapassar a válvula de segurança.","A água quente reduz o tempo em que o café fica exposto ao calor."],
["Dose","Preencha o funil com 18 g de café. Nivele o pó, mas não compacte.","Na Moka, não faça uma cama de café pressionada."],
["Brew","Monte a cafeteira e leve ao fogo baixo ou médio, mantendo a tampa aberta para observar o fluxo.","Quando começar a sair café, reduza o fogo se necessário."],
["Finish","Retire do fogo quando o fluxo ficar mais claro e interrompa a extração. Sirva imediatamente.","Evite o 'borbulhamento' final: ele tende a trazer amargor."]
]}
};

let current="v60",timer=null,remaining=0,paused=false,calcMode="yield";
const $=s=>document.querySelector(s);

function renderRecipe(key){
 current=key; const r=recipes[key];
 $("#recipeTag").textContent=r.tag;$("#recipeTitle").textContent=r.title;$("#recipeSubtitle").textContent=r.subtitle;$("#bigIcon").textContent=r.icon;
 $("#recipeMeta").innerHTML=r.meta.map(x=>`<span class="meta-item"><b>${x[0]}:</b> ${x[1]}</span>`).join(" · ");
 $("#tasteNote").innerHTML="💡 "+r.taste;
 $("#steps").innerHTML=r.steps.map((s,i)=>`<div class="step"><div class="step-num">${i+1}</div><div><h3>${s[0]}</h3><p>${s[1]}</p>${s[2]?`<div class="hint">${s[2]}</div>`:""}</div></div>`).join("");
 document.querySelectorAll(".method").forEach(b=>b.classList.toggle("active",b.dataset.method===key));
 document.querySelectorAll(".recipe-choice").forEach(b=>b.classList.toggle("active",b.dataset.recipe===key));
}
document.querySelectorAll(".method").forEach(b=>b.onclick=()=>{renderRecipe(b.dataset.method);setTimeout(()=>$("#recipeCard").scrollIntoView({behavior:"smooth",block:"start"}),40)});
document.querySelectorAll(".recipe-choice").forEach(b=>b.onclick=()=>{renderRecipe(b.dataset.recipe);$("#recipeCard").scrollIntoView({behavior:"smooth",block:"start"})});

function formatTime(s){return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")}
function startTimer(){if(timer)return;remaining=recipes[current].time;paused=false;$("#timerLabel").textContent=recipes[current].title;$("#timerBar").hidden=false;$("#timerValue").textContent=formatTime(remaining);$("#pauseTimer").textContent="Pausar";timer=setInterval(()=>{if(paused)return;if(--remaining<=0){clearInterval(timer);timer=null;$("#timerLabel").textContent="Pronto!";$("#timerValue").textContent="00:00";return}$("#timerValue").textContent=formatTime(remaining)},1000)}
$("#timerBtn").onclick=startTimer;$("#pauseTimer").onclick=()=>{paused=!paused;$("#pauseTimer").textContent=paused?"Continuar":"Pausar"};$("#stopTimer").onclick=()=>{clearInterval(timer);timer=null;$("#timerBar").hidden=true};

function ratioValue(){return $("#ratioSelect").value==="custom"?Number($("#customRatio").value)||16:Number($("#ratioSelect").value)}
function updateCalc(){const r=ratioValue();let coffee,water;if(calcMode==="yield"){const ready=Number($("#yieldInput").value)||0;coffee=ready/Math.max(1,r-2);water=coffee*r}else{coffee=Number($("#coffeeInput").value)||0;water=coffee*r}$("#calcCoffee").textContent=coffee.toFixed(1).replace(".",",")+" g";$("#calcWater").textContent=Math.round(water)+" ml";$("#calcProfile").textContent=r<=14?"Forte":r<=16?"Equilibrado":"Leve"}
function openCalc(){$("#calcModal").hidden=false;updateCalc()}function closeCalc(){$("#calcModal").hidden=true}
$("#openCalc").onclick=openCalc;$("#openCalc2").onclick=openCalc;$("#closeCalc").onclick=closeCalc;$("#calcModal").onclick=e=>{if(e.target.id==="calcModal")closeCalc()};
document.querySelectorAll(".mode").forEach(b=>b.onclick=()=>{calcMode=b.dataset.mode;document.querySelectorAll(".mode").forEach(x=>x.classList.toggle("active",x===b));$("#yieldField").hidden=calcMode!=="yield";$("#coffeeField").hidden=calcMode!=="coffee";updateCalc()});
["yieldInput","coffeeInput","customRatio"].forEach(id=>$("#"+id).oninput=updateCalc);$("#ratioSelect").onchange=()=>{$("#customRatioField").hidden=$("#ratioSelect").value!=="custom";updateCalc()};
renderRecipe("v60");
