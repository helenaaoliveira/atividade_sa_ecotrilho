let usuarios = [];

async function carregarUsuarios() {
    try {
        usuarios = await requisicaoAPI("usuarios.php");
        renderizarUsuarios();
        atualizarEstatisticas();
    } catch (erro) {
        mostrarToast(erro.message);
    }
}

function renderizarUsuarios(lista = usuarios) {
    const tabela = document.getElementById("tabelaUsuarios");
    if (!tabela) return;

    tabela.innerHTML = "";

    lista.forEach(usuario => {
        const linha = document.createElement("tr");

        const celulaNome = document.createElement("td");

        celulaNome.style.display = "flex";
        celulaNome.style.alignItems = "center";
        celulaNome.style.gap = "10px";

        const foto = document.createElement("div");

        foto.style.width = "40px";
        foto.style.height = "40px";
        foto.style.minWidth = "40px";
        foto.style.borderRadius = "50%";
        foto.style.backgroundColor = "#e5e7eb";
        foto.style.backgroundPosition = "center";
        foto.style.backgroundSize = "cover";
        foto.style.backgroundRepeat = "no-repeat";

        foto.setAttribute("role", "img");
        foto.setAttribute("aria-label", "Foto de " + usuario.nome);

        if (usuario.foto_perfil) {
            foto.style.backgroundImage =
                `url("../${usuario.foto_perfil.replace(/^\/+/, "")}")`;
        } else {
            foto.style.display = "flex";
            foto.style.alignItems = "center";
            foto.style.justifyContent = "center";
            foto.textContent = usuario.nome.charAt(0).toUpperCase();
            foto.style.fontWeight = "bold";
            foto.style.color = "#555";
        }

        const nome = document.createElement("span");
        nome.textContent = usuario.nome;

        celulaNome.appendChild(foto);
        celulaNome.appendChild(nome);

        const celulaEmail = document.createElement("td");
        celulaEmail.textContent = usuario.email;

        const celulaPerfil = document.createElement("td");
        celulaPerfil.textContent = usuario.perfil;

        const celulaAcoes = document.createElement("td");

        const botaoEditar = document.createElement("button");
        botaoEditar.className = "btn-edit";
        botaoEditar.textContent = "Editar";
        botaoEditar.addEventListener("click", () => {
            editarUsuario(usuario.id);
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.className = "btn-delete";
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.addEventListener("click", () => {
            excluirUsuario(usuario.id);
        });

        celulaAcoes.appendChild(botaoEditar);
        celulaAcoes.appendChild(botaoExcluir);

        linha.appendChild(celulaNome);
        linha.appendChild(celulaEmail);
        linha.appendChild(celulaPerfil);
        linha.appendChild(celulaAcoes);

        tabela.appendChild(linha);
    });
}

function abrirModal() {
    document.getElementById("modal").style.display = "flex";
    document.getElementById("tituloModal").innerText = "Novo Usuário";
    limparFormulario();
}

function fecharModal() {
    document.getElementById("modal").style.display = "none";
}

function limparFormulario() {
    document.getElementById("usuarioId").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("usuario").value = "";
    document.getElementById("email").value = "";
    document.getElementById("senha").value = "";
    document.getElementById("perfil").value = "Operador";
}

async function salvarUsuario() {
    const id = document.getElementById("usuarioId").value;

    const usuario = {
        id: id ? Number(id) : undefined,
        nome: document.getElementById("nome").value.trim(),
        usuario: document.getElementById("usuario").value.trim(),
        email: document.getElementById("email").value.trim(),
        senha: document.getElementById("senha").value,
        perfil: document.getElementById("perfil").value
    };

    if (!usuario.nome || !usuario.usuario || !usuario.email) {
        alert("Preencha nome, usuário e e-mail.");
        return;
    }

    if (!id && !usuario.senha) {
        alert("Informe uma senha para o novo usuário.");
        return;
    }

    try {
        const dados = await requisicaoAPI("usuarios.php", {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(usuario)
        });

        mostrarToast(dados.mensagem, "sucesso");
        fecharModal();
        await carregarUsuarios();
    } catch (erro) {
        mostrarToast(erro.message);
    }
}

function editarUsuario(id) {
    const usuario = usuarios.find(u => Number(u.id) === Number(id));
    if (!usuario) return;

    document.getElementById("tituloModal").innerText = "Editar Usuário";
    document.getElementById("usuarioId").value = usuario.id;
    document.getElementById("nome").value = usuario.nome;
    document.getElementById("usuario").value = usuario.usuario;
    document.getElementById("email").value = usuario.email;
    document.getElementById("senha").value = "";
    document.getElementById("perfil").value = usuario.perfil;
    document.getElementById("modal").style.display = "flex";
}

async function excluirUsuario(id) {
    const usuarioAtual = usuarioAtualLocal();

    if (usuarioAtual && Number(usuarioAtual.id) === Number(id)) {
        alert("Você não pode excluir o usuário que está conectado.");
        return;
    }

    if (!confirm("Deseja realmente excluir este usuário?")) return;

    try {
        const dados = await requisicaoAPI("usuarios.php", {
            method: "DELETE",
            body: JSON.stringify({ id: Number(id) })
        });
        mostrarToast(dados.mensagem, "sucesso");
        await carregarUsuarios();
    } catch (erro) {
        mostrarToast(erro.message);
    }
}

function usuarioAtualLocal() {
    try { return JSON.parse(localStorage.getItem("usuarioLogado")); }
    catch (erro) { return null; }
}

function filtrarUsuarios() {
    const texto = document.getElementById("busca").value.toLowerCase();
    const perfil = document.getElementById("perfilFiltro").value;

    const resultado = usuarios.filter(usuario => {
        const nomeMatch = usuario.nome.toLowerCase().includes(texto) || usuario.email.toLowerCase().includes(texto);
        return nomeMatch && (perfil === "" || usuario.perfil === perfil);
    });

    renderizarUsuarios(resultado);
}

function ordenarUsuarios() {
    usuarios.sort((a, b) => a.nome.localeCompare(b.nome));
    renderizarUsuarios();
}

function atualizarEstatisticas() {
    const total = document.getElementById("totalUsuarios");
    const admins = document.getElementById("totalAdmins");
    const tecnicos = document.getElementById("totalTecnicos");
    const operadores = document.getElementById("totalOperadores");

    if (total) total.innerText = usuarios.length;
    if (admins) admins.innerText = usuarios.filter(u => u.perfil === "Admin").length;
    if (tecnicos) tecnicos.innerText = usuarios.filter(u => u.perfil === "Técnico").length;
    if (operadores) operadores.innerText = usuarios.filter(u => u.perfil === "Operador").length;
}

window.onclick = function(event) {
    const modal = document.getElementById("modal");
    if (event.target === modal) fecharModal();
};

document.addEventListener("DOMContentLoaded", carregarUsuarios);
