let trensRelatorio = [];
let sensoresRelatorio = [];

async function carregarRelatorios() {
    try {
        [trensRelatorio, sensoresRelatorio] = await Promise.all([
            requisicaoAPI("trens.php"),
            requisicaoAPI("sensores.php")
        ]);
        atualizarResumo();
        gerarRelatorio();
    } catch (erro) {
        mostrarToast(erro.message);
    }
}

function gerarRelatorio() {
    const tipo = document.getElementById("tipoRelatorio").value;
    if (tipo === "trens") gerarRelatorioTrens();
    else gerarRelatorioSensores();
}

function gerarRelatorioTrens() {
    const resultado = document.getElementById("resultadoRelatorio");
    let html = `
        <table>
            <thead><tr><th>ID</th><th>Nome</th><th>Status</th><th>Velocidade</th><th>Localização</th></tr></thead>
            <tbody>
    `;

    trensRelatorio.forEach(trem => {
        html += `<tr><td>${trem.codigo}</td><td>${trem.nome}</td><td>${trem.status}</td><td>${trem.velocidade}</td><td>${trem.localizacao}</td></tr>`;
    });

    html += `</tbody></table>`;
    resultado.innerHTML = html;
}

function gerarRelatorioSensores() {
    const resultado = document.getElementById("resultadoRelatorio");
    let html = `
        <table>
            <thead><tr><th>ID</th><th>Tipo</th><th>Trem</th><th>Leitura</th><th>Status</th></tr></thead>
            <tbody>
    `;

    sensoresRelatorio.forEach(sensor => {
        html += `<tr><td>${sensor.codigo}</td><td>${sensor.tipo}</td><td>${sensor.trem}</td><td>${sensor.leitura}</td><td>${sensor.status}</td></tr>`;
    });

    html += `</tbody></table>`;
    resultado.innerHTML = html;
}

function exportarPDF() {
    window.print();
}

function exportarCSV() {
    const tipo = document.getElementById("tipoRelatorio").value;
    let linhas = [];

    if (tipo === "trens") {
        linhas.push(["ID", "Nome", "Status", "Velocidade", "Localização"]);
        trensRelatorio.forEach(t => linhas.push([t.codigo, t.nome, t.status, t.velocidade, t.localizacao]));
    } else {
        linhas.push(["ID", "Tipo", "Trem", "Leitura", "Status"]);
        sensoresRelatorio.forEach(s => linhas.push([s.codigo, s.tipo, s.trem, s.leitura, s.status]));
    }

    const csv = linhas.map(linha => linha.map(valor => `"${String(valor ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "relatorio.csv";
    link.click();
    URL.revokeObjectURL(link.href);
}

function atualizarResumo() {
    if (document.getElementById("resumoTrens")) document.getElementById("resumoTrens").innerText = trensRelatorio.length;
    if (document.getElementById("resumoSensores")) document.getElementById("resumoSensores").innerText = sensoresRelatorio.length;
}

document.addEventListener("DOMContentLoaded", carregarRelatorios);
