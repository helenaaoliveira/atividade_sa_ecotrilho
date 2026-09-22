let configuracoes = { notificacoes: true, dark_mode: false };

async function carregarConfiguracoes() {
    try {
        const usuario = usuarioAtual();
        if (!usuario) return;

        document.getElementById("nomePerfil").value = usuario.nome || "";
        document.getElementById("emailPerfil").value = usuario.email || "";

        configuracoes = await requisicaoAPI("configuracoes.php");
        document.getElementById("notificacoes").checked = configuracoes.notificacoes;
        aplicarTema();
        carregarSistema();
    } catch (erro) {
        mostrarToast(erro.message);
    }
}

async function salvarPerfil() {
    const nome = document.getElementById("nomePerfil").value.trim();
    const email = document.getElementById("emailPerfil").value.trim();

    if (!nome || !email) {
        alert("Preencha nome e e-mail.");
        return;
    }

    try {
        const dados = await requisicaoAPI("perfil.php", {
            method: "PUT",
            body: JSON.stringify({ nome, email })
        });

        localStorage.setItem("usuarioLogado", JSON.stringify(dados.usuario));
        localStorage.setItem("perfilUsuario", dados.usuario.perfil);
        mostrarToast("Perfil atualizado", "sucesso");
    } catch (erro) {
        mostrarToast(erro.message);
    }
}

async function salvarNotificacoes() {
    configuracoes.notificacoes = document.getElementById("notificacoes").checked;
    await salvarConfiguracoesBanco();
}

async function alterarTema() {
    configuracoes.dark_mode = !configuracoes.dark_mode;
    aplicarTema();
    await salvarConfiguracoesBanco();
}

function aplicarTema() {
    document.body.classList.toggle("dark-mode", !!configuracoes.dark_mode);
    localStorage.setItem("darkMode", configuracoes.dark_mode ? "true" : "false");
}

async function salvarConfiguracoesBanco() {
    try {
        await requisicaoAPI("configuracoes.php", {
            method: "PUT",
            body: JSON.stringify(configuracoes)
        });
        localStorage.setItem("notificacoes", configuracoes.notificacoes ? "true" : "false");
        mostrarToast("Preferências salvas", "sucesso");
    } catch (erro) {
        mostrarToast(erro.message);
    }
}

async function restaurarPadrao() {
    if (!confirm("Deseja restaurar as configurações?")) return;

    configuracoes = { notificacoes: true, dark_mode: false };

    try {
        await salvarConfiguracoesBanco();
        location.reload();
    } catch (erro) {
        mostrarToast(erro.message);
    }
}

function carregarSistema() {
    const versao = document.getElementById("versaoSistema");
    const banco = document.getElementById("statusBanco");
    if (versao) versao.innerText = "1.0.0";
    if (banco) banco.innerText = "Online";
}

document.addEventListener("DOMContentLoaded", carregarConfiguracoes);
