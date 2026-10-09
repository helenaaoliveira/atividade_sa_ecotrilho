let rotas = [];

async function carregarRotas() {
    try {
        rotas = await requisicaoAPI("rotas.php");

        renderizarRotas();
        atualizarEstatisticasRotas();

    } catch (erro) {
        mostrarToast(erro.message);
    }
}

function renderizarRotas(lista = rotas) {
    const tabela = document.getElementById("tabelaRotas");

    if (!tabela) {
        return;
    }

    tabela.innerHTML = "";
    lista.forEach(function(rota) {

        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${rota.id}</td>
            <td>${rota.nome}</td>
            <td>${rota.origem}</td>
            <td>${rota.destino}</td>
            <td>${rota.distancia} km</td>
            <td>${rota.trem || "-"}</td>
            <td>${rota.status}</td>
            <td>
                <button class="btn-edit" onclick="editarRota(${rota.id})">
                    Editar
                </button>

                <button class="btn-delete" onclick="excluirRota(${rota.id})">
                    Excluir
                </button>
            </td>
        `;
        tabela.appendChild(linha);
    });
}

function atualizarEstatisticasRotas() {

    const total = document.getElementById("totalRotas");
    const ativas = document.getElementById("rotasAtivas");
    const manutencao = document.getElementById("rotasManutencao");

    if (total) {
        total.innerText = rotas.length;
    }

    if (ativas) {
        ativas.innerText = rotas.filter(
            rota => rota.status === "Ativa"
        ).length;
    }

    if (manutencao) {
        manutencao.innerText = rotas.filter(
            rota => rota.status === "Manutenção"
        ).length;
    }
}

function filtrarRotas() {

    const texto = document
        .getElementById("pesquisa")
        .value
        .toLowerCase();

    const status = document
        .getElementById("filtroStatus")
        .value;

    const resultado = rotas.filter(rota => {
        const pesquisa =
            rota.nome.toLowerCase().includes(texto) ||
            rota.origem.toLowerCase().includes(texto) ||
            rota.destino.toLowerCase().includes(texto);

        const filtroStatus =
            status === "" || rota.status === status;

        return pesquisa && filtroStatus;
    });

    renderizarRotas(resultado);
}

function abrirModalRota() {
    document.getElementById("modalRota").style.display = "flex";
    document.getElementById("tituloModal").innerText = "Nova Rota";
    limparFormularioRota();
}

function fecharModalRota() {
    document.getElementById("modalRota").style.display = "none";
}

function limparFormularioRota() {
    document.getElementById("idRota").value = "";
    document.getElementById("nomeRota").value = "";
    document.getElementById("origem").value = "";
    document.getElementById("destino").value = "";
    document.getElementById("distancia").value = "";
    document.getElementById("trem").value = "";
    document.getElementById("status").value = "Ativa";
}

async function salvarRota() {
    const id = document.getElementById("idRota").value;

    const rota = {
        id: id ? Number(id) : undefined,

        nome: document
            .getElementById("nomeRota")
            .value
            .trim(),

        origem: document
            .getElementById("origem")
            .value
            .trim(),

        destino: document
            .getElementById("destino")
            .value
            .trim(),

        distancia: document
            .getElementById("distancia")
            .value,

        trem: document
            .getElementById("trem")
            .value,

        status: document
            .getElementById("status")
            .value
    };


    if (!rota.nome || !rota.origem || !rota.destino) {
        alert("Preencha o nome, a origem e o destino.");
        return;
    }

    try {
        const dados = await requisicaoAPI("rotas.php", {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(rota)
        });

        mostrarToast(dados.mensagem, "sucesso");
        fecharModalRota();
        await carregarRotas();

    } catch (erro) {
        mostrarToast(erro.message);
    }
}

function editarRota(id) {
    const rota = rotas.find(
        r => Number(r.id) === Number(id)
    );


    if (!rota) return;

    document.getElementById("tituloModal").innerText =
        "Editar Rota";

    document.getElementById("idRota").value =
        rota.id;

    document.getElementById("nomeRota").value =
        rota.nome;

    document.getElementById("origem").value =
        rota.origem;

    document.getElementById("destino").value =
        rota.destino;

    document.getElementById("distancia").value =
        rota.distancia;

    document.getElementById("trem").value =
        rota.trem || "";

    document.getElementById("status").value =
        rota.status;

    document.getElementById("modalRota").style.display =
        "flex";
}

async function excluirRota(id) {
    if (!confirm("Deseja realmente excluir esta rota?")) {
        return;
    }

    try {
        const dados = await requisicaoAPI("rotas.php", {
            method: "DELETE",
            body: JSON.stringify({
                id: Number(id)
            })
        });

        mostrarToast(dados.mensagem, "sucesso");
        await carregarRotas();

    } catch (erro) {
        mostrarToast(erro.message);
    }
}

async function carregarTrensParaRotas() {
    try {
        const trens =
            await requisicaoAPI("trens.php");

        const select =
            document.getElementById("trem");

        if (!select) return;

        select.innerHTML =
            `< option value = "" > Selecione um trem</option > `;

        trens.forEach(trem => {

            select.innerHTML += `
    < option value = "${trem.codigo}" >
        ${ trem.codigo } - ${ trem.nome }
                </option >
    `;
        });

    } catch (erro) {
        mostrarToast(erro.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    carregarRotas();
    carregarTrensParaRotas();

});