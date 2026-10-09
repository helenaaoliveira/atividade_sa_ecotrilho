let trens = [];

async function carregarTrens() {
    try {
        trens = await requisicaoAPI("trens.php");
        renderizarTrens();
        atualizarEstatisticasTrens();

        if (trens.length) mostrarDetalhes(trens[0].id);
    } catch (erro) {
        mostrarToast(erro.message);
    }
}

function renderizarTrens(lista = trens) {
    const tabela = document.getElementById("listaTrens");
    if (!tabela) return;

    tabela.innerHTML = "";

    lista.forEach(trem => {
        tabela.innerHTML += `
            <tr onclick="mostrarDetalhes(${trem.id})">
                <td>${trem.codigo}</td>
                <td>${trem.nome}</td>
                <td>${trem.status}</td>
                <td>${trem.velocidade}</td>
                <td>
                    <button class="btn-edit" onclick="event.stopPropagation();editarTrem(${trem.id})">Editar</button>
                    <button class="btn-delete" onclick="event.stopPropagation();excluirTrem(${trem.id})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function mostrarDetalhes(id) {
    const trem = trens.find(t => Number(t.id) === Number(id));
    if (!trem) return;

    const campos = {
        nomeTrem: `${trem.codigo} - ${trem.nome}`,
        velocidadeAtual: trem.velocidade || "-",
        ultimaAtualizacao: trem.atualizacao || "Agora",
        modelo: trem.modelo || "Não informado",
        ano: trem.ano || "Não informado",
        capacidade: trem.capacidade || "Não informado",
        comprimento: trem.comprimento || "Não informado",
        peso: trem.peso || "Não informado"
    };

    Object.keys(campos).forEach(idCampo => {
        const elemento = document.getElementById(idCampo);
        if (elemento) elemento.innerText = campos[idCampo];
    });
}

function filtrarTrens() {
    const texto = document.getElementById("buscarTrem").value.toLowerCase();
    const status = document.getElementById("statusFiltro").value;

    const resultado = trens.filter(trem => {
        const busca = trem.codigo.toLowerCase().includes(texto) || trem.nome.toLowerCase().includes(texto);
        return busca && (status === "" || trem.status === status);
    });

    renderizarTrens(resultado);
}

function abrirModalTrem() {
    document.getElementById("modalTrem").style.display = "flex";
    document.getElementById("tituloModalTrem").innerText = "Novo Trem";
    limparFormularioTrem();
}

function fecharModalTrem() {
    document.getElementById("modalTrem").style.display = "none";
}

function limparFormularioTrem() {
    document.getElementById("tremId").value = "";
    document.getElementById("codigoTrem").value = "";
    document.getElementById("nomeTremInput").value = "";
    document.getElementById("statusTrem").value = "Ativo";
    document.getElementById("velocidadeTrem").value = "";
    document.getElementById("localizacaoTrem").value = "";
    document.getElementById("modeloTrem").value = "";
    document.getElementById("anoTrem").value = "";
    document.getElementById("capacidadeTrem").value = "";
    document.getElementById("comprimentoTrem").value = "";
    document.getElementById("pesoTrem").value = "";
}

async function salvarTrem() {
    const id = document.getElementById("tremId").value;

    const trem = {
        id: id ? Number(id) : undefined,
        codigo: document.getElementById("codigoTrem").value.trim(),
        nome: document.getElementById("nomeTremInput").value.trim(),
        status: document.getElementById("statusTrem").value,
        velocidade: document.getElementById("velocidadeTrem").value.trim(),
        localizacao: document.getElementById("localizacaoTrem").value.trim(),
        modelo: document.getElementById("modeloTrem").value.trim(),
        ano: document.getElementById("anoTrem").value,
        capacidade: document.getElementById("capacidadeTrem").value.trim(),
        comprimento: document.getElementById("comprimentoTrem").value.trim(),
        peso: document.getElementById("pesoTrem").value.trim()
    };

    if (!trem.codigo || !trem.nome) {
        alert("Preencha o código e o nome do trem.");
        return;
    }

    try {
        const arquivo = "trens.php";
        const metodo = id ? "PUT" : "POST";
        const dados = await requisicaoAPI(arquivo, {
            method: metodo,
            body: JSON.stringify(trem)
        });

        mostrarToast(dados.mensagem, "sucesso");
        fecharModalTrem();
        await carregarTrens();
    } catch (erro) {
        mostrarToast(erro.message);
    }
}

function editarTrem(id) {
    const trem = trens.find(t => Number(t.id) === Number(id));
    if (!trem) return;

    document.getElementById("tituloModalTrem").innerText = "Editar Trem";
    document.getElementById("tremId").value = trem.id;
    document.getElementById("codigoTrem").value = trem.codigo;
    document.getElementById("nomeTremInput").value = trem.nome;
    document.getElementById("statusTrem").value = trem.status;
    document.getElementById("velocidadeTrem").value = trem.velocidade || "";
    document.getElementById("localizacaoTrem").value = trem.localizacao || "";
    document.getElementById("modeloTrem").value = trem.modelo || "";
    document.getElementById("anoTrem").value = trem.ano || "";
    document.getElementById("capacidadeTrem").value = trem.capacidade || "";
    document.getElementById("comprimentoTrem").value = trem.comprimento || "";
    document.getElementById("pesoTrem").value = trem.peso || "";
    document.getElementById("modalTrem").style.display = "flex";
}

async function excluirTrem(id) {
    if (!confirm("Excluir este trem?")) return;

    try {
        const dados = await requisicaoAPI("trens.php", {
            method: "DELETE",
            body: JSON.stringify({ id: Number(id) })
        });
        mostrarToast(dados.mensagem, "sucesso");
        await carregarTrens();
    } catch (erro) {
        mostrarToast(erro.message);
    }
}

function atualizarEstatisticasTrens() {
    const total = document.getElementById("totalTrens");
    const ativos = document.getElementById("trensAtivos");
    const manutencao = document.getElementById("trensManutencao");

    if (total) total.innerText = trens.length;
    if (ativos) ativos.innerText = trens.filter(t => t.status === "Ativo").length;
    if (manutencao) manutencao.innerText = trens.filter(t => t.status === "Manutenção").length;
}

function ordenarTrens() {
    trens.sort((a, b) => a.nome.localeCompare(b.nome));
    renderizarTrens();
}

document.addEventListener("DOMContentLoaded", carregarTrens);
