/* ==========================
VERIFICAÇÃO DE LOGIN
========================== */

const paginaAtual =
window.location.pathname;

const paginasPublicas = [
"index.html",
"cadastro.html",
"recuperar-senha.html"
];

const paginaLivre =
paginasPublicas.some(
pagina => paginaAtual.includes(pagina)
);

if(!paginaLivre){

const usuarioLogado =
JSON.parse(
localStorage.getItem(
"usuarioLogado"
)
);

if(!usuarioLogado){

window.location.href =
"../index.html";

}

}

/* ==========================
LOGOUT
========================== */

function logout(){

if(
confirm(
"Deseja sair do sistema?"
)
){

localStorage.removeItem(
"usuarioLogado"
);

localStorage.removeItem(
"perfilUsuario"
);

window.location.href =
"../index.html";

}

}

/* ==========================
DARK MODE
========================== */

function aplicarTema(){

const darkMode =
localStorage.getItem(
"darkMode"
);

if(darkMode === "true"){

document.body.classList.add(
"dark-mode"
);

}

}

function alternarDarkMode(){

document.body.classList.toggle(
"dark-mode"
);

localStorage.setItem(
"darkMode",
document.body.classList.contains(
"dark-mode"
)
);

}

document.addEventListener(
"DOMContentLoaded",
aplicarTema
);

/* ==========================
PERMISSÕES
========================== */

function verificarPermissoes(){

const perfil =
localStorage.getItem(
"perfilUsuario"
);

if(!perfil) return;

/* Admin */

if(perfil === "Admin"){

return;

}

/* Operador */

if(perfil === "Operador"){

const menuUsuarios =
document.getElementById(
"menuUsuarios"
);

if(menuUsuarios){

menuUsuarios.style.display =
"none";

}

const menuConfig =
document.getElementById(
"menuConfiguracoes"
);

if(menuConfig){

menuConfig.style.display =
"none";

}

}

/* Técnico */

if(perfil === "Técnico"){

const menuUsuarios =
document.getElementById(
"menuUsuarios"
);

if(menuUsuarios){

menuUsuarios.style.display =
"none";

}

const menuRelatorios =
document.getElementById(
"menuRelatorios"
);

if(menuRelatorios){

menuRelatorios.style.display =
"none";

}

const menuConfig =
document.getElementById(
"menuConfiguracoes"
);

if(menuConfig){

menuConfig.style.display =
"none";

}

}

}

document.addEventListener(
"DOMContentLoaded",
verificarPermissoes
);

/* ==========================
DADOS INICIAIS - TRENS
========================== */

if(
!localStorage.getItem(
"trens"
)
){

const trens = [

{
id:"TR-204",
nome:"Expresso Norte",
status:"Ativo",
velocidade:"82 km/h",
localizacao:"Joinville"
},

{
id:"TR-118",
nome:"Carga Sul",
status:"Ativo",
velocidade:"76 km/h",
localizacao:"Curitiba"
},

{
id:"TR-405",
nome:"Pampa Express",
status:"Ativo",
velocidade:"66 km/h",
localizacao:"Itajaí"
},

{
id:"TR-330",
nome:"Expresso Oeste",
status:"Manutenção",
velocidade:"0 km/h",
localizacao:"Porto Alegre"
}

];

localStorage.setItem(
"trens",
JSON.stringify(trens)
);

}

/* ==========================
DADOS INICIAIS - SENSORES
========================== */

if(
!localStorage.getItem(
"sensores"
)
){

const sensores = [

{
id:"TEMP-88",
tipo:"Temperatura",
status:"Crítico",
trem:"TR-204"
},

{
id:"TEMP-56",
tipo:"Temperatura",
status:"Crítico",
trem:"TR-204"
},

{
id:"VIB-12",
tipo:"Vibração",
status:"Atenção",
trem:"TR-118"
},

{
id:"PRESS-07",
tipo:"Pressão",
status:"Normal",
trem:"TR-330"
}

];

localStorage.setItem(
"sensores",
JSON.stringify(
sensores
)
);

}

/* ==========================
DADOS INICIAIS - USUÁRIOS
========================== */

if(
!localStorage.getItem(
"usuariosSistema"
)
){

const usuarios = [

{
id:1,
nome:"Administrador",
email:"admin@ferro.com",
perfil:"Admin"
},

{
id:2,
nome:"Carlos Silva",
email:"carlos@ferro.com",
perfil:"Operador"
},

{
id:3,
nome:"Ana Souza",
email:"ana@ferro.com",
perfil:"Técnico"
}

];

localStorage.setItem(
"usuariosSistema",
JSON.stringify(
usuarios
)
);

}

/* ==========================
NOTIFICAÇÕES GLOBAIS
========================== */

function criarToast(){

if(
document.getElementById(
"toast"
)
) return;

const toast =
document.createElement("div");

toast.id = "toast";

document.body.appendChild(
toast
);

}

function mostrarToast(
mensagem,
tipo="erro"
){

criarToast();

const toast =
document.getElementById(
"toast"
);

toast.innerText =
mensagem;

if(tipo === "sucesso"){

toast.style.background =
"#16a34a";

}else{

toast.style.background =
"#ef4444";

}

toast.style.display =
"block";

setTimeout(()=>{

toast.style.display =
"none";

},4000);

}

/* ==========================
ALERTAS AUTOMÁTICOS
========================== */

function iniciarAlertas(){

const alertas = [

"Temperatura alta detectada",

"Vibração fora do padrão",

"Pressão abaixo do esperado",

"Falha de comunicação com sensor",

"Velocidade acima do limite"

];

setInterval(()=>{

const alerta =

alertas[
Math.floor(
Math.random() *
alertas.length
)
];

mostrarToast(
alerta
);

},30000);

}

document.addEventListener(
"DOMContentLoaded",
iniciarAlertas
);