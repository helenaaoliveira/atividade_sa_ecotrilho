let sensores = [];

async function carregarSensores() {
    try {
        sensores = await requisicaoAPI("sensores.php");
        renderizarSensores();
        atualizarEstatisticasSensores();
        if (sensores.length) mostrarSensor(sensores[0].id);
    } catch (erro) {
        mostrarToast(erro.message);
    }
}

function renderizarSensores(lista = sensores) {
    const tabela = document.getElementById("listaSensores");
    if (!tabela) return;

    tabela.innerHTML = "";

    lista.forEach(sensor => {
        let classeStatus = "status-normal";
        if (sensor.status === "Crítico") classeStatus = "status-critico";
        if (sensor.status === "Atenção") classeStatus = "status-atencao";

        tabela.innerHTML += `
            <tr onclick="mostrarSensor(${sensor.id})">
                <td>${sensor.codigo}</td>
                <td>${sensor.tipo}</td>
                <td>${sensor.trem}</td>
                <td>${sensor.leitura}</td>
                <td class="${classeStatus}">${sensor.status}</td>
                <td>
                    <button class="btn-edit" onclick="event.stopPropagation();editarSensor(${sensor.id})">Editar</button>
                    <button class="btn-delete" onclick="event.stopPropagation();excluirSensor(${sensor.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function mostrarSensor(id) {
    const sensor = sensores.find(s => Number(s.id) === Number(id));
    if (!sensor) return;

    document.getElementById("sensorTitulo").innerText = `${sensor.codigo} - ${sensor.tipo}`;
    document.getElementById("ultimaLeitura").innerText = sensor.leitura || "-";
    document.getElementById("faixaEsperada").innerText = sensor.faixa || "Não definida";
    document.getElementById("statusAtual").innerText = sensor.status;
    document.getElementById("tremVinculado").innerText = sensor.trem;
    document.getElementById("ultimaAtualizacaoSensor").innerText = sensor.atualizacao || "Agora";
}

function filtrarSensores() {
    const busca = document.getElementById("buscarSensor").value.toLowerCase();
    const status = document.getElementById("statusSensor").value;

    const resultado = sensores.filter(sensor => {
        const buscaMatch = sensor.codigo.toLowerCase().includes(busca) || sensor.tipo.toLowerCase().includes(busca);
        return buscaMatch && (status === "" || sensor.status === status);
    });

    renderizarSensores(resultado);
}

function abrirModalSensor() {
    document.getElementById("modalSensor").style.display = "flex";
    document.getElementById("tituloModalSensor").innerText = "Novo Sensor";
    limparFormularioSensor();
}

function fecharModalSensor() {
    document.getElementById("modalSensor").style.display = "none";
}

function limparFormularioSensor() {
    document.getElementById("sensorId").value = "";
    document.getElementById("codigoSensor").value = "";
    document.getElementById("tipoSensor").value = "Temperatura";
    document.getElementById("tremSensor").value = "";
    document.getElementById("leituraSensor").value = "";
    document.getElementById("statusSensorInput").value = "Normal";
    document.getElementById("faixaSensor").value = "";
}

async function salvarSensor() {
    const id = document.getElementById("sensorId").value;

    const sensor = {
        id: id ? Number(id) : undefined,
        codigo: document.getElementById("codigoSensor").value.trim(),
        tipo: document.getElementById("tipoSensor").value,
        trem: document.getElementById("tremSensor").value.trim(),
        leitura: document.getElementById("leituraSensor").value.trim(),
        status: document.getElementById("statusSensorInput").value,
        faixa: document.getElementById("faixaSensor").value.trim() || "Não definida"
    };

    if (!sensor.codigo || !sensor.trem) {
        alert("Preencha o código e o trem vinculado.");
        return;
    }

    try {
        const dados = await requisicaoAPI("sensores.php", {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(sensor)
        });

        mostrarToast(dados.mensagem, "sucesso");
        fecharModalSensor();
        await carregarSensores();
    } catch (erro) {
        mostrarToast(erro.message);
    }
}

function editarSensor(id) {
    const sensor = sensores.find(s => Number(s.id) === Number(id));
    if (!sensor) return;

    document.getElementById("tituloModalSensor").innerText = "Editar Sensor";
    document.getElementById("sensorId").value = sensor.id;
    document.getElementById("codigoSensor").value = sensor.codigo;
    document.getElementById("tipoSensor").value = sensor.tipo;
    document.getElementById("tremSensor").value = sensor.trem;
    document.getElementById("leituraSensor").value = sensor.leitura || "";
    document.getElementById("statusSensorInput").value = sensor.status;
    document.getElementById("faixaSensor").value = sensor.faixa || "";
    document.getElementById("modalSensor").style.display = "flex";
}

async function excluirSensor(id) {
    if (!confirm("Excluir este sensor?")) return;

    try {
        const dados = await requisicaoAPI("sensores.php", {
            method: "DELETE",
            body: JSON.stringify({ id: Number(id) })
        });
        mostrarToast(dados.mensagem, "sucesso");
        await carregarSensores();
    } catch (erro) {
        mostrarToast(erro.message);
    }
}

function atualizarEstatisticasSensores() {
    const total = document.getElementById("totalSensores");
    const criticos = document.getElementById("sensoresCriticos");
    const atencao = document.getElementById("sensoresAtencao");

    if (total) total.innerText = sensores.length;
    if (criticos) criticos.innerText = sensores.filter(s => s.status === "Crítico").length;
    if (atencao) atencao.innerText = sensores.filter(s => s.status === "Atenção").length;
}

function ordenarSensores() {
    sensores.sort((a, b) => a.codigo.localeCompare(b.codigo));
    renderizarSensores();
}

document.addEventListener("DOMContentLoaded", carregarSensores);
