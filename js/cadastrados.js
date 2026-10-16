let cadastrados = [];
let paginaAtual = 1;
const cadastradosPorPagina = 7;

async function carregarCadastrados() {
    try {
        cadastrados = await requisicaoAPI("usuarios.php");

        renderizarCadastrados();

    } catch (erro) {
        mostrarToast(erro.message);
    }
}

function renderizarCadastrados(lista = cadastrados) {
    const tabela =
        document.getElementById("tabelaCadastrados");

    if (!tabela) return;

    tabela.innerHTML = "";

    const inicio =
        (paginaAtual - 1) * cadastradosPorPagina;

    const fim =
        inicio + cadastradosPorPagina;

    const listaPagina =
        lista.slice(inicio, fim);

    listaPagina.forEach(usuario => {
        tabela.innerHTML += `

            <tr>
                <td>
                    ${usuario.nome}
                </td>

                <td>
                    ${usuario.email}
                </td>

                <td>
                    ${usuario.perfil}
                </td>

                <td>
                    <span class="status-cadastrado">
                        Ativo
                    </span>
                </td>

                <td>
                    <div class="acoes-cadastrado">
                        <button
                            class="btn-acao btn-editar-cadastrado"
                            onclick="editarCadastrado(${usuario.id})"
                            title="Editar"
                        >
                            <i class="fa-solid fa-pencil"></i>
                        </button>

                        <button
                            class="btn-acao btn-excluir-cadastrado"
                            onclick="excluirCadastrado(${usuario.id})"
                            title="Excluir"
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    atualizarPaginacaoCadastrados(lista);

function filtrarCadastrados() {
    paginaAtual = 1;

    const texto =
        document.getElementById("busca")
            .value
            .toLowerCase();

    const perfil =
        document.getElementById("perfilFiltro")
            .value;

    const resultado = cadastrados.filter(usuario => {
        const nomeOuEmail =
            usuario.nome
                .toLowerCase()
                .includes(texto)

            ||

            usuario.email
                .toLowerCase()
                .includes(texto);

        const perfilCorreto =
            perfil === "" ||
            usuario.perfil === perfil;

        return nomeOuEmail && perfilCorreto;

    });

    renderizarCadastrados(resultado);
}

function atualizarPaginacaoCadastrados(lista) {
    const totalPaginas =
        Math.ceil(
            lista.length / cadastradosPorPagina
        );

    const pagina2 =
        document.getElementById("pagina2");

    if (pagina2) {
        pagina2.style.display =
            totalPaginas >= 2
                ? "block"
                : "none";
    }
}

function irParaPaginaCadastrados(numero) {
    paginaAtual = numero;

    filtrarCadastrados();

}

function paginaAnteriorCadastrados() {
    if (paginaAtual > 1) {

        paginaAtual--;

        renderizarCadastrados();
    }
}

function proximaPaginaCadastrados() {
    const totalPaginas =
        Math.ceil(
            cadastrados.length / cadastradosPorPagina
        );

    if (paginaAtual < totalPaginas) {

        paginaAtual++;

        renderizarCadastrados();
    }
}

function abrirModal() {
    document.getElementById("modal").style.display =
        "flex";

    document.getElementById("tituloModal").innerText =
        "Novo Usuário";

    limparFormulario();
}

function fecharModal() {
    document.getElementById("modal").style.display =
        "none";
}

function limparFormulario() {
    document.getElementById("usuarioId").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("usuario").value = "";
    document.getElementById("email").value = "";
    document.getElementById("senha").value = "";
    document.getElementById("perfil").value =
        "Operador";
}

async function salvarCadastrado() {
    const id =
        document.getElementById("usuarioId").value;

    const usuario = {

        id: id
            ? Number(id)
            : undefined,

        nome:
            document.getElementById("nome")
                .value
                .trim(),

        usuario:
            document.getElementById("usuario")
                .value
                .trim(),

        email:
            document.getElementById("email")
                .value
                .trim(),

        senha:
            document.getElementById("senha")
                .value,

        perfil:
            document.getElementById("perfil")
                .value
    };

    if (
        !usuario.nome ||
        !usuario.usuario ||
        !usuario.email
    ) {
        alert(
            "Preencha nome, usuário e e-mail."
        );
        return;
    }

    if (!id && !usuario.senha) {
        alert(
            "Informe uma senha para o novo usuário."
        );
        return;
    }

    try {
        const dados =
            await requisicaoAPI(
                "usuarios.php",
                {
                    method: id
                        ? "PUT"
                        : "POST",

                    body:
                        JSON.stringify(usuario)
                }
            );

        mostrarToast(
            dados.mensagem,
            "sucesso"
        );

        fecharModal();
        await carregarCadastrados();

    } catch (erro) {

        mostrarToast(erro.message);
    }
}

function editarCadastrado(id) {
    const usuario =
        cadastrados.find(
            u =>
                Number(u.id) ===
                Number(id)
        );

    if (!usuario) return;

    document.getElementById(
        "tituloModal"
    ).innerText = "Editar Usuário";

    document.getElementById(
        "usuarioId"
    ).value = usuario.id;

    document.getElementById(
        "nome"
    ).value = usuario.nome;

    document.getElementById(
        "usuario"
    ).value = usuario.usuario;

    document.getElementById(
        "email"
    ).value = usuario.email;

    document.getElementById(
        "senha"
    ).value = "";

    document.getElementById(
        "perfil"
    ).value = usuario.perfil;

    document.getElementById(
        "modal"
    ).style.display = "flex";

}

async function excluirCadastrado(id) {
    const usuarioAtual =
        usuarioAtualLocal();

    if (
        usuarioAtual &&
        Number(usuarioAtual.id) ===
        Number(id)
    ) {
        alert(
            "Você não pode excluir o usuário que está conectado."
        );
        return;
    }

    if (
        !confirm(
            "Deseja realmente excluir este usuário?"
        )
    ) {
        return;
    }

    try {
        const dados =
            await requisicaoAPI(
                "usuarios.php",
                {
                    method: "DELETE",

                    body:
                        JSON.stringify({
                            id: Number(id)
                        })
                }
            );

        mostrarToast(
            dados.mensagem,
            "sucesso"
        );

        await carregarCadastrados();

    } catch (erro) {
        mostrarToast(erro.message);
    }
}

function usuarioAtualLocal() {
    try {
        return JSON.parse(
            localStorage.getItem(
                "usuarioLogado"
            )
        );

    } catch (erro) {
        return null;
    }
}

window.onclick = function (event) {

    const modal =
        document.getElementById("modal");

    if (event.target === modal) {
        fecharModal();
    }
};

document.addEventListener(
    "DOMContentLoaded",
    carregarCadastrados
)};