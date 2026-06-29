/* ==========================
CARREGAR USUÁRIOS
========================== */

let usuarios =
JSON.parse(
localStorage.getItem(
"usuarios"
)
) || [];

/* ==========================
SALVAR
========================== */

function salvarUsuarios(){

localStorage.setItem(
"usuarios",
JSON.stringify(
usuarios
)
);

}

/* ==========================
RENDERIZAR TABELA
========================== */

function renderizarUsuarios(
lista = usuarios
){

const tabela =
document.getElementById(
"tabelaUsuarios"
);

if(!tabela) return;

tabela.innerHTML = "";

lista.forEach(usuario=>{

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

<button
class="btn-edit"
onclick="editarUsuario(${usuario.id})">

Editar

</button>

<button
class="btn-delete"
onclick="excluirUsuario(${usuario.id})">

Excluir

</button>

</td>

</tr>

`;

});

}

/* ==========================
ABRIR MODAL
========================== */

function abrirModal(){

document.getElementById(
"modal"
).style.display =
"flex";

document.getElementById(
"tituloModal"
).innerText =
"Novo Usuário";

limparFormulario();

}

/* ==========================
FECHAR MODAL
========================== */

function fecharModal(){

document.getElementById(
"modal"
).style.display =
"none";

}

/* ==========================
LIMPAR CAMPOS
========================== */

function limparFormulario(){

document.getElementById(
"usuarioId"
).value = "";

document.getElementById(
"nome"
).value = "";

document.getElementById(
"email"
).value = "";

document.getElementById(
"perfil"
).value = "Operador";

}

/* ==========================
SALVAR USUÁRIO
========================== */

function salvarUsuario(){

const id =
document.getElementById(
"usuarioId"
).value;

const nome =
document.getElementById(
"nome"
).value.trim();

const email =
document.getElementById(
"email"
).value.trim();

const perfil =
document.getElementById(
"perfil"
).value;

if(
nome === "" ||
email === ""
){

alert(
"Preencha todos os campos."
);

return;

}

/* EDITAR */

if(id){

const usuario =
usuarios.find(
u => u.id == id
);

usuario.nome =
nome;

usuario.email =
email;

usuario.perfil =
perfil;

mostrarToast(
"Usuário atualizado",
"sucesso"
);

}

/* NOVO */

else{

usuarios.push({

id:Date.now(),

nome,

email,

perfil

});

mostrarToast(
"Usuário cadastrado",
"sucesso"
);

}

salvarUsuarios();

renderizarUsuarios();

fecharModal();

}

/* ==========================
EDITAR
========================== */

function editarUsuario(id){

const usuario =
usuarios.find(
u => u.id === id
);

if(!usuario) return;

document.getElementById(
"tituloModal"
).innerText =
"Editar Usuário";

document.getElementById(
"usuarioId"
).value =
usuario.id;

document.getElementById(
"nome"
).value =
usuario.nome;

document.getElementById(
"email"
).value =
usuario.email;

document.getElementById(
"perfil"
).value =
usuario.perfil;

document.getElementById(
"modal"
).style.display =
"flex";

}

/* ==========================
EXCLUIR
========================== */

function excluirUsuario(id){

if(
!confirm(
"Deseja realmente excluir este usuário?"
)
){
return;
}

usuarios =
usuarios.filter(
u => u.id !== id
);

salvarUsuarios();

renderizarUsuarios();

mostrarToast(
"Usuário removido",
"sucesso"
);

}

/* ==========================
BUSCA
========================== */

function filtrarUsuarios(){

const texto =
document.getElementById(
"busca"
).value
.toLowerCase();

const perfil =
document.getElementById(
"perfilFiltro"
).value;

const resultado =
usuarios.filter(usuario=>{

const nomeMatch =

usuario.nome
.toLowerCase()
.includes(texto)

||

usuario.email
.toLowerCase()
.includes(texto);

const perfilMatch =

perfil === ""

||

usuario.perfil === perfil;

return (
nomeMatch &&
perfilMatch
);

});

renderizarUsuarios(
resultado
);

}

/* ==========================
ORDENAR
========================== */

function ordenarUsuarios(){

usuarios.sort(
(a,b)=>

a.nome.localeCompare(
b.nome
)

);

renderizarUsuarios();

}

/* ==========================
ESTATÍSTICAS
========================== */

function atualizarEstatisticas(){

const total =
document.getElementById(
"totalUsuarios"
);

const admins =
document.getElementById(
"totalAdmins"
);

const tecnicos =
document.getElementById(
"totalTecnicos"
);

const operadores =
document.getElementById(
"totalOperadores"
);

if(total){

total.innerText =
usuarios.length;

}

if(admins){

admins.innerText =
usuarios.filter(
u=>u.perfil==="Admin"
).length;

}

if(tecnicos){

tecnicos.innerText =
usuarios.filter(
u=>u.perfil==="Técnico"
).length;

}

if(operadores){

operadores.innerText =
usuarios.filter(
u=>u.perfil==="Operador"
).length;

}

}

/* ==========================
FECHAR MODAL CLICANDO FORA
========================== */

window.onclick = function(event){

const modal =
document.getElementById(
"modal"
);

if(
event.target === modal
){

fecharModal();

}

};

/* ==========================
INICIALIZAÇÃO
========================== */

document.addEventListener(
"DOMContentLoaded",
()=>{

renderizarUsuarios();

atualizarEstatisticas();

}
);