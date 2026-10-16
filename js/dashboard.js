let trensDashboard = [];
let sensoresDashboard = [];

async function carregarDashboard() {
    try {
        const [trens, sensores] = await Promise.all([
            requisicaoAPI("trens.php"),
            requisicaoAPI("sensores.php")
        ]);

        trensDashboard = trens;
        sensoresDashboard = sensores;

        atualizarCards();
        calcularVelocidadeMedia();
        carregarAlertas();
        carregarUsuario();
    } catch (erro) {
        mostrarToast(erro.message);
    }
}

function atualizarCards() {
    const ativos = trensDashboard.filter(t => t.status === "Ativo").length;
    const manutencao = trensDashboard.filter(t => t.status === "Manutenção").length;
    const parados = trensDashboard.filter(t => t.status === "Parado").length;
    const sensoresCriticos = sensoresDashboard.filter(s => s.status === "Crítico").length;
    const totalAlertas = sensoresDashboard.filter(s => s.status === "Crítico" || s.status === "Atenção").length;

    if (document.getElementById("ativos")) document.getElementById("ativos").innerText = ativos;
    if (document.getElementById("manutencao")) document.getElementById("manutencao").innerText = manutencao;
    if (document.getElementById("parados")) document.getElementById("parados").innerText = parados;
    if (document.getElementById("sensoresCriticos")) document.getElementById("sensoresCriticos").innerText = sensoresCriticos;
    if (document.getElementById("alertasAtivos")) document.getElementById("alertasAtivos").innerText = totalAlertas;
}

function carregarAlertas() {
    const container = document.getElementById("listaAlertas");
    if (!container) return;

    const alertas = sensoresDashboard.filter(s => s.status !== "Normal");
    container.innerHTML = "";

    if (!alertas.length) {
        container.innerHTML = `<div class="alert alert-success"><h3>Operação Normal</h3><p>Nenhum sensor apresenta alerta no momento.</p></div>`;
        return;
    }

    alertas.forEach(sensor => {
        const classe = sensor.status === "Crítico" ? "alert-danger" : "alert-warning";
        container.innerHTML += `
            <div class="alert ${classe}">
                <h3>${sensor.tipo} - ${sensor.status}</h3>
                <p>${sensor.trem} • Sensor ${sensor.codigo}</p>
            </div>
        `;
    });
}

function calcularVelocidadeMedia() {
    const valores = trensDashboard.map(t => parseFloat(String(t.velocidade).replace(",", "."))).filter(v => !isNaN(v));
    const soma = valores.reduce((total, valor) => total + valor, 0);
    const media = valores.length ? Math.round(soma / valores.length) : 0;
    const campo = document.getElementById("velocidadeMedia");
    if (campo) campo.innerText = media + " km/h";
}

function carregarUsuario() {
    const usuario = usuarioAtual();
    const nomeUsuario = document.getElementById("nomeUsuario");
    if (usuario && nomeUsuario) nomeUsuario.innerText = usuario.nome;
}

document.addEventListener("DOMContentLoaded", carregarDashboard);
