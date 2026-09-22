/* ==========================
MENSAGENS
========================== */

function mostrarMensagem(texto, erro = false) {
    const box = document.getElementById("mensagem");
    if (!box) return;

    box.style.display = "block";
    box.innerText = texto;

    if (erro) box.classList.add("error");
    else box.classList.remove("error");
}

/* ==========================
CADASTRO
========================== */

async function cadastrar() {
    try {
        const nome = document.getElementById("nome").value.trim();
        const usuario = document.getElementById("usuario").value.trim();
        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;
        const confirmar = document.getElementById("confirmar").value;

        if (!nome || !usuario || !email || !senha || !confirmar) {
            mostrarMensagem("Preencha todos os campos", true);
            return;
        }

        if (senha !== confirmar) {
            mostrarMensagem("As senhas não coincidem", true);
            return;
        }

        const dados = await requisicaoAPI("auth.php?acao=cadastro", {
            method: "POST",
            body: JSON.stringify({ nome, usuario, email, senha })
        });

        mostrarMensagem(dados.mensagem || "Cadastro realizado com sucesso!");

        setTimeout(() => {
            window.location.href = "../index.html";
        }, 1200);
    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}

/* ==========================
LOGIN
========================== */

async function login() {
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;

    if (usuario === "" || senha === "") {
        mostrarMensagem("Informe usuário e senha", true);
        return;
    }

    try {
        const dados = await requisicaoAPI("auth.php?acao=login", {
            method: "POST",
            body: JSON.stringify({ usuario, senha })
        });

        localStorage.setItem("usuarioLogado", JSON.stringify(dados.usuario));
        localStorage.setItem("perfilUsuario", dados.usuario.perfil);

        mostrarMensagem("Login realizado!");

        setTimeout(() => {
            window.location.href = "pages/dashboard.html";
        }, 700);
    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}

/* ==========================
RECUPERAR SENHA
========================== */

async function recuperarSenha() {
    const email = document.getElementById("email").value.trim();

    if (email === "") {
        mostrarMensagem("Informe um e-mail", true);
        return;
    }

    try {
        const dados = await requisicaoAPI("../api/auth.php?acao=recuperar", {
            method: "POST",
            body: JSON.stringify({ email })
        });

        mostrarMensagem(dados.mensagem);
    } catch (erro) {
        mostrarMensagem(erro.message, true);
    }
}
