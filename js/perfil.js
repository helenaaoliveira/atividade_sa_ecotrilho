const formularioPerfil = document.getElementById("formPerfil");
const fotoPerfil = document.getElementById("fotoPerfil");
const fotoPreview = document.getElementById("fotoPreview");
const mensagemPerfil = document.getElementById("mensagemPerfil");

const fotoPadrao = "../img/avatar-padrao.svg";

let fotoAtual = null;
let removerFotoSelecionada = false;
let urlFotoTemporaria = null;

function mostrarMensagemPerfil(texto, tipo) {
    mensagemPerfil.textContent = texto;
    mensagemPerfil.className = "perfil-mensagem " + tipo;
}

function atualizarResumo(usuario) {
    document.getElementById("nomeResumo").textContent =
        usuario.nome || "Meu perfil";

    document.getElementById("usuarioResumo").textContent =
        usuario.usuario ? "@" + usuario.usuario : "";

    document.getElementById("perfilTag").textContent =
        usuario.perfil || "Usuário";

    document.getElementById("nome").value = usuario.nome || "";
    document.getElementById("usuario").value = usuario.usuario || "";
    document.getElementById("email").value = usuario.email || "";
    document.getElementById("perfil").value = usuario.perfil || "Operador";

    fotoAtual = usuario.foto_perfil || null;

    fotoPreview.src = fotoAtual
        ? "../" + fotoAtual
        : fotoPadrao;

    fotoPreview.onerror = function () {
        fotoPreview.src = fotoPadrao;
    };

    localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
}

async function carregarPerfil() {
    try {
        const resposta = await fetch("../api/perfil.php", {
            credentials: "same-origin"
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || "Erro ao carregar perfil.");
        }

        atualizarResumo(dados.usuario);

    } catch (erro) {
        mostrarMensagemPerfil(
            erro.message + " Confira se você está conectado.",
            "erro"
        );
    }
}

// Mostrar a foto escolhida antes de salvar
fotoPerfil.addEventListener("change", function () {
    const arquivo = fotoPerfil.files[0];

    if (!arquivo) return;

    const formatosPermitidos = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif"
    ];

    if (!formatosPermitidos.includes(arquivo.type)) {
        mostrarMensagemPerfil(
            "Escolha uma imagem JPG, PNG, WEBP ou GIF.",
            "erro"
        );

        fotoPerfil.value = "";
        return;
    }

    if (arquivo.size > 3 * 1024 * 1024) {
        mostrarMensagemPerfil(
            "A foto deve ter no máximo 3 MB.",
            "erro"
        );

        fotoPerfil.value = "";
        return;
    }

    removerFotoSelecionada = false;

    if (urlFotoTemporaria) {
        URL.revokeObjectURL(urlFotoTemporaria);
    }

    urlFotoTemporaria = URL.createObjectURL(arquivo);
    fotoPreview.src = urlFotoTemporaria;

    mensagemPerfil.className = "perfil-mensagem";
});

// Remover a foto
document.getElementById("removerFoto").addEventListener("click", function () {
    fotoPerfil.value = "";
    removerFotoSelecionada = true;

    fotoPreview.src = fotoPadrao;

    mostrarMensagemPerfil(
        "A foto será removida quando você salvar as alterações.",
        "sucesso"
    );
});

// Salvar as alterações
formularioPerfil.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const botao = document.getElementById("salvarPerfil");
    const dados = new FormData();

    dados.append("nome", document.getElementById("nome").value.trim());
    dados.append("usuario", document.getElementById("usuario").value.trim());
    dados.append("email", document.getElementById("email").value.trim());

    dados.append(
        "senha_atual",
        document.getElementById("senhaAtual").value
    );

    dados.append(
        "nova_senha",
        document.getElementById("novaSenha").value
    );

    dados.append(
        "remover_foto",
        removerFotoSelecionada ? "1" : "0"
    );

    if (fotoPerfil.files[0]) {
        dados.append("foto_perfil", fotoPerfil.files[0]);
    }

    botao.disabled = true;
    botao.textContent = "Salvando...";

    try {
        const resposta = await fetch("../api/perfil.php", {
            method: "POST",
            body: dados,
            credentials: "same-origin"
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                resultado.erro || "Não foi possível salvar o perfil."
            );
        }

        atualizarResumo(resultado.usuario);

        fotoPerfil.value = "";
        document.getElementById("senhaAtual").value = "";
        document.getElementById("novaSenha").value = "";

        removerFotoSelecionada = false;

        mostrarMensagemPerfil(
            resultado.mensagem || "Perfil atualizado com sucesso!",
            "sucesso"
        );

    } catch (erro) {
        mostrarMensagemPerfil(erro.message, "erro");

    } finally {
        botao.disabled = false;
        botao.innerHTML =
            '<i class="fa-solid fa-floppy-disk"></i> Salvar alterações';
    }
});

document.addEventListener("DOMContentLoaded", carregarPerfil);