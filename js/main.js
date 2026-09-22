/* ==========================
VERIFICAÇÃO DE LOGIN
========================== */

const paginaAtual = window.location.pathname;
const paginasPublicas = ["index.html", "cadastro.html", "recuperar-senha.html"];
const paginaLivre = paginasPublicas.some(pagina => paginaAtual.includes(pagina));

function usuarioAtual() {
    try {
        return JSON.parse(localStorage.getItem("usuarioLogado"));
    } catch (erro) {
        return null;
    }
}

if (!paginaLivre && !usuarioAtual()) {
    window.location.href = "../index.html";
}

/* ==========================
LOGOUT
========================== */

async function logout() {
    if (!confirm("Deseja sair do sistema?")) return;

    try {
        await requisicaoAPI("auth.php?acao=logout", { method: "POST", body: JSON.stringify({}) });
    } catch (erro) {
        console.error(erro);
    }

    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("perfilUsuario");
    window.location.href = "../index.html";
}

/* ==========================
DARK MODE
========================== */

async function carregarConfiguracoesGlobais() {
    if (paginaLivre) return;

    try {
        const config = await requisicaoAPI("configuracoes.php");
        localStorage.setItem("darkMode", config.dark_mode ? "true" : "false");
        localStorage.setItem("notificacoes", config.notificacoes ? "true" : "false");
        aplicarTema();
    } catch (erro) {
        console.error(erro);
        aplicarTema();
    }
}

function aplicarTema() {
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }
}

/* ==========================
PERMISSÕES
========================== */

function verificarPermissoes() {
    const usuario = usuarioAtual();
    if (!usuario) return;

    const perfil = usuario.perfil;

    if (perfil === "Operador") {
        const menuUsuarios = document.getElementById("menuUsuarios");
        const menuConfig = document.getElementById("menuConfiguracoes");
        if (menuUsuarios) menuUsuarios.style.display = "none";
        if (menuConfig) menuConfig.style.display = "none";
    }

    if (perfil === "Técnico") {
        const menuUsuarios = document.getElementById("menuUsuarios");
        const menuRelatorios = document.getElementById("menuRelatorios");
        const menuConfig = document.getElementById("menuConfiguracoes");
        if (menuUsuarios) menuUsuarios.style.display = "none";
        if (menuRelatorios) menuRelatorios.style.display = "none";
        if (menuConfig) menuConfig.style.display = "none";
    }
}

/* ==========================
TOAST
========================== */

function criarToast() {
    if (document.getElementById("toast")) return;
    const toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
}

function mostrarToast(mensagem, tipo = "erro") {
    criarToast();
    const toast = document.getElementById("toast");
    toast.innerText = mensagem;
    toast.style.background = tipo === "sucesso" ? "#16a34a" : "#ef4444";
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
    verificarPermissoes();
    carregarConfiguracoesGlobais();
});
