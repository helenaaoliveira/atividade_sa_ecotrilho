/* ==========================
CARREGAR DADOS
========================== */

const trens =
JSON.parse(
localStorage.getItem(
"trens"
)
) || [];

const sensores =
JSON.parse(
localStorage.getItem(
"sensores"
)
) || [];

/* ==========================
ATUALIZAR CARDS
========================== */

function atualizarCards(){

const ativos =
trens.filter(
t => t.status === "Ativo"
).length;

const manutencao =
trens.filter(
t => t.status === "Manutenção"
).length;

const parados =
trens.filter(
t => t.status === "Parado"
).length;

const sensoresCriticos =
sensores.filter(
s => s.status === "Crítico"
).length;

const totalAlertas =
sensores.filter(
s =>
s.status === "Crítico"
||
s.status === "Atenção"
).length;

if(
document.getElementById(
"ativos"
)
){
document.getElementById(
"ativos"
).innerText =
ativos;
}

if(
document.getElementById(
"manutencao"
)
){
document.getElementById(
"manutencao"
).innerText =
manutencao;
}

if(
document.getElementById(
"parados"
)
){
document.getElementById(
"parados"
).innerText =
parados;
}

if(
document.getElementById(
"sensoresCriticos"
)
){
document.getElementById(
"sensoresCriticos"
).innerText =
sensoresCriticos;
}

if(
document.getElementById(
"alertasAtivos"
)
){
document.getElementById(
"alertasAtivos"
).innerText =
totalAlertas;
}

}

/* ==========================
ALERTAS RECENTES
========================== */

function carregarAlertas(){

const container =
document.getElementById(
"listaAlertas"
);

if(!container) return;

container.innerHTML = "";

const alertas = [

{
titulo:
"Temperatura Alta",
descricao:
"TR-204 • Sensor TEMP-56",
classe:
"alert-danger"
},

{
titulo:
"Vibração Fora do Padrão",
descricao:
"TR-118 • Sensor VIB-12",
classe:
"alert-warning"
},

{
titulo:
"Pressão Baixa",
descricao:
"TR-330 • Sensor PRESS-07",
classe:
"alert-danger"
},

{
titulo:
"Operação Normal",
descricao:
"TR-405 • Todos sensores OK",
classe:
"alert-success"
}

];

alertas.forEach(alerta => {

container.innerHTML += `

<div class="alert ${alerta.classe}">

<h3>
${alerta.titulo}
</h3>

<p>
${alerta.descricao}
</p>

</div>

`;

});

}

/* ==========================
VELOCIDADE MÉDIA
========================== */

function calcularVelocidadeMedia(){

const velocidades =
trens.map(t => {

const valor =
parseInt(
t.velocidade
);

return isNaN(valor)
? 0
: valor;

});

const soma =
velocidades.reduce(
(total, valor)=>
total + valor,
0
);

const media =
velocidades.length > 0
?
Math.round(
soma /
velocidades.length
)
:
0;

const campo =
document.getElementById(
"velocidadeMedia"
);

if(campo){

campo.innerText =
media + " km/h";

}

}

/* ==========================
BOAS-VINDAS
========================== */

function carregarUsuario(){

const usuario =
JSON.parse(
localStorage.getItem(
"usuarioLogado"
)
);

if(!usuario) return;

const nomeUsuario =
document.getElementById(
"nomeUsuario"
);

if(nomeUsuario){

nomeUsuario.innerText =
usuario.nome;

}

}

/* ==========================
ALERTAS AUTOMÁTICOS
========================== */

function iniciarAlertasAutomaticos(){

const alertas = [

"Temperatura alta detectada",

"Falha de comunicação",

"Sensor desconectado",

"Velocidade acima do limite",

"Vibração fora do padrão",

"Pressão abaixo do esperado"

];

setInterval(()=>{

const alerta =

alertas[
Math.floor(
Math.random() *
alertas.length
)
];

if(
typeof mostrarToast
=== "function"
){

mostrarToast(
alerta
);

}

},30000);

}

/* ==========================
ATUALIZAÇÃO AUTOMÁTICA
========================== */

function atualizarDashboard(){

atualizarCards();

calcularVelocidadeMedia();

carregarAlertas();

carregarUsuario();

}

/* ==========================
INICIALIZAÇÃO
========================== */

document.addEventListener(
"DOMContentLoaded",
()=>{

atualizarDashboard();

iniciarAlertasAutomaticos();

}
);