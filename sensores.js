/* ==========================
CARREGAR SENSORES
========================== */

let sensores =
JSON.parse(
localStorage.getItem(
"sensores"
)
) || [];

/* ==========================
SALVAR
========================== */

function salvarSensores(){

localStorage.setItem(
"sensores",
JSON.stringify(
sensores
)
);

}

/* ==========================
RENDERIZAR TABELA
========================== */

function renderizarSensores(
lista = sensores
){

const tabela =
document.getElementById(
"listaSensores"
);

if(!tabela) return;

tabela.innerHTML = "";

lista.forEach(sensor=>{

let classeStatus =
"status-normal";

if(sensor.status === "Crítico"){
classeStatus =
"status-critico";
}

if(sensor.status === "Atenção"){
classeStatus =
"status-atencao";
}

tabela.innerHTML += `

<tr onclick="mostrarSensor('${sensor.id}')">

<td>${sensor.id}</td>

<td>${sensor.tipo}</td>

<td>${sensor.trem}</td>

<td>${sensor.leitura}</td>

<td class="${classeStatus}">
${sensor.status}
</td>

<td>

<button
class="btn-edit"
onclick="event.stopPropagation();editarSensor('${sensor.id}')">

Editar

</button>

<button
class="btn-delete"
onclick="event.stopPropagation();excluirSensor('${sensor.id}')">

Excluir

</button>

</td>

</tr>

`;

});

}

/* ==========================
DETALHES
========================== */

function mostrarSensor(id){

const sensor =
sensores.find(
s => s.id === id
);

if(!sensor) return;

document.getElementById(
"sensorTitulo"
).innerText =
`${sensor.id} - ${sensor.tipo}`;

document.getElementById(
"ultimaLeitura"
).innerText =
sensor.leitura;

document.getElementById(
"faixaEsperada"
).innerText =
sensor.faixa;

document.getElementById(
"statusAtual"
).innerText =
sensor.status;

document.getElementById(
"tremVinculado"
).innerText =
sensor.trem;

document.getElementById(
"ultimaAtualizacaoSensor"
).innerText =
sensor.atualizacao;

}

/* ==========================
FILTROS
========================== */

function filtrarSensores(){

const busca =
document.getElementById(
"buscarSensor"
).value
.toLowerCase();

const status =
document.getElementById(
"statusSensor"
).value;

const resultado =
sensores.filter(sensor=>{

const buscaMatch =

sensor.id
.toLowerCase()
.includes(busca)

||

sensor.tipo
.toLowerCase()
.includes(busca);

const statusMatch =

status === ""

||

sensor.status === status;

return (
buscaMatch &&
statusMatch
);

});

renderizarSensores(
resultado
);

}

/* ==========================
ABRIR MODAL
========================== */

function abrirModalSensor(){

document.getElementById(
"modalSensor"
).style.display =
"flex";

document.getElementById(
"tituloModalSensor"
).innerText =
"Novo Sensor";

limparFormularioSensor();

}

/* ==========================
FECHAR MODAL
========================== */

function fecharModalSensor(){

document.getElementById(
"modalSensor"
).style.display =
"none";

}

/* ==========================
LIMPAR FORMULÁRIO
========================== */

function limparFormularioSensor(){

document.getElementById(
"sensorId"
).value = "";

document.getElementById(
"codigoSensor"
).value = "";

document.getElementById(
"tipoSensor"
).value = "Temperatura";

document.getElementById(
"tremSensor"
).value = "";

document.getElementById(
"leituraSensor"
).value = "";

document.getElementById(
"statusSensorInput"
).value = "Normal";

}

/* ==========================
SALVAR SENSOR
========================== */

function salvarSensor(){

const idInterno =
document.getElementById(
"sensorId"
).value;

const codigo =
document.getElementById(
"codigoSensor"
).value;

const tipo =
document.getElementById(
"tipoSensor"
).value;

const trem =
document.getElementById(
"tremSensor"
).value;

const leitura =
document.getElementById(
"leituraSensor"
).value;

const status =
document.getElementById(
"statusSensorInput"
).value;

if(
codigo === "" ||
trem === ""
){

alert(
"Preencha todos os campos obrigatórios."
);

return;

}

if(idInterno){

const sensor =
sensores.find(
s => s.id === idInterno
);

sensor.tipo = tipo;
sensor.trem = trem;
sensor.leitura = leitura;
sensor.status = status;

}else{

sensores.push({

id:codigo,
tipo,
trem,
leitura,
status,

faixa:"Não definida",

atualizacao:"Agora"

});

}

salvarSensores();

renderizarSensores();

atualizarEstatisticasSensores();

fecharModalSensor();

}

/* ==========================
EDITAR
========================== */

function editarSensor(id){

const sensor =
sensores.find(
s => s.id === id
);

if(!sensor) return;

document.getElementById(
"tituloModalSensor"
).innerText =
"Editar Sensor";

document.getElementById(
"sensorId"
).value =
sensor.id;

document.getElementById(
"codigoSensor"
).value =
sensor.id;

document.getElementById(
"tipoSensor"
).value =
sensor.tipo;

document.getElementById(
"tremSensor"
).value =
sensor.trem;

document.getElementById(
"leituraSensor"
).value =
sensor.leitura;

document.getElementById(
"statusSensorInput"
).value =
sensor.status;

document.getElementById(
"modalSensor"
).style.display =
"flex";

}

/* ==========================
EXCLUIR
========================== */

function excluirSensor(id){

if(
!confirm(
"Excluir este sensor?"
)
){
return;
}

sensores =
sensores.filter(
s => s.id !== id
);

salvarSensores();

renderizarSensores();

atualizarEstatisticasSensores();

}

/* ==========================
ESTATÍSTICAS
========================== */

function atualizarEstatisticasSensores(){

const total =
document.getElementById(
"totalSensores"
);

const criticos =
document.getElementById(
"sensoresCriticos"
);

const atencao =
document.getElementById(
"sensoresAtencao"
);

if(total){

total.innerText =
sensores.length;

}

if(criticos){

criticos.innerText =
sensores.filter(
s => s.status === "Crítico"
).length;

}

if(atencao){

atencao.innerText =
sensores.filter(
s => s.status === "Atenção"
).length;

}

}

/* ==========================
ORDENAR
========================== */

function ordenarSensores(){

sensores.sort(
(a,b)=>

a.id.localeCompare(
b.id
)

);

renderizarSensores();

}

/* ==========================
INICIALIZAÇÃO
========================== */

document.addEventListener(
"DOMContentLoaded",
()=>{

renderizarSensores();

atualizarEstatisticasSensores();

if(
sensores.length
){

mostrarSensor(
sensores[0].id
);

}

}
);