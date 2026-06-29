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
GERAR RELATÓRIO
========================== */

function gerarRelatorio(){

const tipo =
document.getElementById(
"tipoRelatorio"
).value;

const resultado =
document.getElementById(
"resultadoRelatorio"
);

if(!resultado) return;

resultado.innerHTML = "";

if(tipo === "trens"){

gerarRelatorioTrens();

}

else if(tipo === "sensores"){

gerarRelatorioSensores();

}

}

/* ==========================
RELATÓRIO TRENS
========================== */

function gerarRelatorioTrens(){

const resultado =
document.getElementById(
"resultadoRelatorio"
);

let html = `

<table>

<thead>

<tr>

<th>ID</th>
<th>Nome</th>
<th>Status</th>
<th>Velocidade</th>
<th>Localização</th>

</tr>

</thead>

<tbody>

`;

trens.forEach(trem=>{

html += `

<tr>

<td>${trem.id}</td>

<td>${trem.nome}</td>

<td>${trem.status}</td>

<td>${trem.velocidade}</td>

<td>${trem.localizacao}</td>

</tr>

`;

});

html += `

</tbody>

</table>

`;

resultado.innerHTML =
html;

}

/* ==========================
RELATÓRIO SENSORES
========================== */

function gerarRelatorioSensores(){

const resultado =
document.getElementById(
"resultadoRelatorio"
);

let html = `

<table>

<thead>

<tr>

<th>ID</th>
<th>Tipo</th>
<th>Trem</th>
<th>Leitura</th>
<th>Status</th>

</tr>

</thead>

<tbody>

`;

sensores.forEach(sensor=>{

html += `

<tr>

<td>${sensor.id}</td>

<td>${sensor.tipo}</td>

<td>${sensor.trem}</td>

<td>${sensor.leitura}</td>

<td>${sensor.status}</td>

</tr>

`;

});

html += `

</tbody>

</table>

`;

resultado.innerHTML =
html;

}

/* ==========================
EXPORTAR PDF
========================== */

function exportarPDF(){

window.print();

}

/* ==========================
EXPORTAR CSV
========================== */

function exportarCSV(){

const tipo =
document.getElementById(
"tipoRelatorio"
).value;

let csv = "";

if(tipo === "trens"){

csv +=
"ID,Nome,Status,Velocidade,Localizacao\n";

trens.forEach(trem=>{

csv +=

`${trem.id},
${trem.nome},
${trem.status},
${trem.velocidade},
${trem.localizacao}\n`;

});

}

else{

csv +=
"ID,Tipo,Trem,Leitura,Status\n";

sensores.forEach(sensor=>{

csv +=

`${sensor.id},
${sensor.tipo},
${sensor.trem},
${sensor.leitura},
${sensor.status}\n`;

});

}

const blob =
new Blob(
[csv],
{
type:"text/csv"
}
);

const link =
document.createElement(
"a"
);

link.href =
URL.createObjectURL(
blob
);

link.download =
"relatorio.csv";

link.click();

}

/* ==========================
ESTATÍSTICAS
========================== */

function atualizarResumo(){

const totalTrens =
document.getElementById(
"resumoTrens"
);

const totalSensores =
document.getElementById(
"resumoSensores"
);

if(totalTrens){

totalTrens.innerText =
trens.length;

}

if(totalSensores){

totalSensores.innerText =
sensores.length;

}

}

/* ==========================
INICIALIZAÇÃO
========================== */

document.addEventListener(
"DOMContentLoaded",
()=>{

atualizarResumo();

gerarRelatorio();

}
);