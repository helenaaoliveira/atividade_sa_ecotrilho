/* ==========================
CARREGAR TRENS
========================== */

let trens =
JSON.parse(
localStorage.getItem(
"trens"
)
) || [];

/* ==========================
SALVAR
========================== */

function salvarTrens(){

localStorage.setItem(
"trens",
JSON.stringify(trens)
);

}

/* ==========================
RENDERIZAR TABELA
========================== */

function renderizarTrens(
lista = trens
){

const tabela =
document.getElementById(
"listaTrens"
);

if(!tabela) return;

tabela.innerHTML = "";

lista.forEach(trem=>{

tabela.innerHTML += `

<tr onclick="mostrarDetalhes('${trem.id}')">

<td>${trem.id}</td>

<td>${trem.nome}</td>

<td>${trem.status}</td>

<td>${trem.velocidade}</td>

<td>

<button
class="btn-edit"
onclick="event.stopPropagation();editarTrem('${trem.id}')">

Editar

</button>

<button
class="btn-delete"
onclick="event.stopPropagation();excluirTrem('${trem.id}')">

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

function mostrarDetalhes(id){

const trem =
trens.find(
t=>t.id === id
);

if(!trem) return;

const campos = {

nomeTrem:
`${trem.id} - ${trem.nome}`,

velocidadeAtual:
trem.velocidade,

ultimaAtualizacao:
trem.atualizacao ||

"Agora",

modelo:
trem.modelo ||

"Não informado",

ano:
trem.ano ||

"2025",

capacidade:
trem.capacidade ||

"100 vagões",

comprimento:
trem.comprimento ||

"1000 m"

};

Object.keys(campos)
.forEach(idCampo=>{

const elemento =
document.getElementById(
idCampo
);

if(elemento){

elemento.innerText =
campos[idCampo];

}

});

}

/* ==========================
BUSCA
========================== */

function filtrarTrens(){

const texto =
document.getElementById(
"buscarTrem"
).value
.toLowerCase();

const status =
document.getElementById(
"statusFiltro"
).value;

const resultado =
trens.filter(trem=>{

const busca =

trem.id
.toLowerCase()
.includes(texto)

||

trem.nome
.toLowerCase()
.includes(texto);

const filtro =

status === ""

||

trem.status === status;

return busca && filtro;

});

renderizarTrens(
resultado
);

}

/* ==========================
ABRIR MODAL
========================== */

function abrirModalTrem(){

document.getElementById(
"modalTrem"
).style.display =
"flex";

document.getElementById(
"tituloModalTrem"
).innerText =
"Novo Trem";

limparFormularioTrem();

}

/* ==========================
FECHAR MODAL
========================== */

function fecharModalTrem(){

document.getElementById(
"modalTrem"
).style.display =
"none";

}

/* ==========================
LIMPAR FORM
========================== */

function limparFormularioTrem(){

document.getElementById(
"tremId"
).value = "";

document.getElementById(
"codigoTrem"
).value = "";

document.getElementById(
"nomeTremInput"
).value = "";

document.getElementById(
"statusTrem"
).value = "Ativo";

document.getElementById(
"velocidadeTrem"
).value = "";

document.getElementById(
"localizacaoTrem"
).value = "";

}

/* ==========================
SALVAR TREM
========================== */

function salvarTrem(){

const idInterno =
document.getElementById(
"tremId"
).value;

const codigo =
document.getElementById(
"codigoTrem"
).value;

const nome =
document.getElementById(
"nomeTremInput"
).value;

const status =
document.getElementById(
"statusTrem"
).value;

const velocidade =
document.getElementById(
"velocidadeTrem"
).value;

const localizacao =
document.getElementById(
"localizacaoTrem"
).value;

if(

codigo === "" ||
nome === ""

){

alert(
"Preencha os campos obrigatórios"
);

return;

}

/* EDITAR */

if(idInterno){

const trem =
trens.find(
t=>t.id === idInterno
);

trem.nome =
nome;

trem.status =
status;

trem.velocidade =
velocidade;

trem.localizacao =
localizacao;

}

/* NOVO */

else{

trens.push({

id:codigo,

nome,

status,

velocidade,

localizacao,

atualizacao:"Agora"

});

}

salvarTrens();

renderizarTrens();

fecharModalTrem();

atualizarEstatisticasTrens();

}

/* ==========================
EDITAR
========================== */

function editarTrem(id){

const trem =
trens.find(
t=>t.id === id
);

if(!trem) return;

document.getElementById(
"tituloModalTrem"
).innerText =
"Editar Trem";

document.getElementById(
"tremId"
).value =
trem.id;

document.getElementById(
"codigoTrem"
).value =
trem.id;

document.getElementById(
"nomeTremInput"
).value =
trem.nome;

document.getElementById(
"statusTrem"
).value =
trem.status;

document.getElementById(
"velocidadeTrem"
).value =
trem.velocidade;

document.getElementById(
"localizacaoTrem"
).value =
trem.localizacao;

document.getElementById(
"modalTrem"
).style.display =
"flex";

}

/* ==========================
EXCLUIR
========================== */

function excluirTrem(id){

if(
!confirm(
"Excluir este trem?"
)
){

return;

}

trens =
trens.filter(
t=>t.id !== id
);

salvarTrens();

renderizarTrens();

atualizarEstatisticasTrens();

}

/* ==========================
ESTATÍSTICAS
========================== */

function atualizarEstatisticasTrens(){

const total =
document.getElementById(
"totalTrens"
);

const ativos =
document.getElementById(
"trensAtivos"
);

const manutencao =
document.getElementById(
"trensManutencao"
);

if(total){

total.innerText =
trens.length;

}

if(ativos){

ativos.innerText =
trens.filter(
t=>t.status==="Ativo"
).length;

}

if(manutencao){

manutencao.innerText =
trens.filter(
t=>t.status==="Manutenção"
).length;

}

}

/* ==========================
ORDENAR
========================== */

function ordenarTrens(){

trens.sort(
(a,b)=>

a.nome.localeCompare(
b.nome
)

);

renderizarTrens();

}

/* ==========================
INICIALIZAÇÃO
========================== */

document.addEventListener(
"DOMContentLoaded",
()=>{

renderizarTrens();

atualizarEstatisticasTrens();

if(trens.length){

mostrarDetalhes(
trens[0].id
);

}

}
);