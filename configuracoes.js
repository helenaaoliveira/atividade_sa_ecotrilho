/* ==========================
CARREGAR PERFIL
========================== */

function carregarPerfil(){

const usuario =
JSON.parse(
localStorage.getItem(
"usuarioLogado"
)
);

if(!usuario) return;

const nome =
document.getElementById(
"nomePerfil"
);

const email =
document.getElementById(
"emailPerfil"
);

if(nome){

nome.value =
usuario.nome || "";

}

if(email){

email.value =
usuario.email || "";

}

}

/* ==========================
SALVAR PERFIL
========================== */

function salvarPerfil(){

const usuario =
JSON.parse(
localStorage.getItem(
"usuarioLogado"
)
);

if(!usuario) return;

usuario.nome =

document.getElementById(
"nomePerfil"
).value;

usuario.email =

document.getElementById(
"emailPerfil"
).value;

localStorage.setItem(

"usuarioLogado",

JSON.stringify(
usuario
)

);

/* Atualizar também
na lista de usuários */

let usuarios =
JSON.parse(
localStorage.getItem(
"usuarios"
)
) || [];

const indice =
usuarios.findIndex(
u => u.id === usuario.id
);

if(indice !== -1){

usuarios[indice] =
usuario;

localStorage.setItem(

"usuarios",

JSON.stringify(
usuarios
)

);

}

if(
typeof mostrarToast ===
"function"
){

mostrarToast(
"Perfil atualizado",
"sucesso"
);

}else{

alert(
"Perfil atualizado"
);

}

}

/* ==========================
NOTIFICAÇÕES
========================== */

function salvarNotificacoes(){

const ativo =

document.getElementById(
"notificacoes"
).checked;

localStorage.setItem(

"notificacoes",

ativo

);

if(
typeof mostrarToast ===
"function"
){

mostrarToast(
"Preferências salvas",
"sucesso"
);

}

}

function carregarNotificacoes(){

const ativo =

localStorage.getItem(
"notificacoes"
);

const checkbox =
document.getElementById(
"notificacoes"
);

if(!checkbox) return;

checkbox.checked =
ativo === "true";

}

/* ==========================
DARK MODE
========================== */

function alterarTema(){

document.body.classList.toggle(
"dark-mode"
);

localStorage.setItem(

"darkMode",

document.body.classList.contains(
"dark-mode"
)

);

if(
typeof mostrarToast ===
"function"
){

mostrarToast(
"Tema atualizado",
"sucesso"
);

}

}

/* ==========================
RESTAURAR PADRÃO
========================== */

function restaurarPadrao(){

if(
!confirm(
"Deseja restaurar as configurações?"
)
){

return;

}

localStorage.removeItem(
"darkMode"
);

localStorage.removeItem(
"notificacoes"
);

location.reload();

}

/* ==========================
INFORMAÇÕES DO SISTEMA
========================== */

function carregarSistema(){

const versao =
document.getElementById(
"versaoSistema"
);

const banco =
document.getElementById(
"statusBanco"
);

if(versao){

versao.innerText =
"1.0.0";

}

if(banco){

banco.innerText =
"Online";

}

}

/* ==========================
INICIALIZAÇÃO
========================== */

document.addEventListener(
"DOMContentLoaded",
()=>{

carregarPerfil();

carregarNotificacoes();

carregarSistema();

}
);