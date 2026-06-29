/* ==========================
USUÁRIOS
========================== */

function obterUsuarios(){

return JSON.parse(
localStorage.getItem(
"usuarios"
)
) || [];

}

function salvarUsuarios(lista){

localStorage.setItem(
"usuarios",
JSON.stringify(lista)
);

}

/* ==========================
MENSAGENS
========================== */

function mostrarMensagem(
texto,
erro = false
){

const box =
document.getElementById(
"mensagem"
);

if(!box) return;

box.style.display =
"block";

box.innerText =
texto;

if(erro){

box.classList.add(
"error"
);

}else{

box.classList.remove(
"error"
);

}

}

/* ==========================
CADASTRO
========================== */

function cadastrar(){

try{

const nome =
document.getElementById("nome").value.trim();

const usuario =
document.getElementById("usuario").value.trim();

const email =
document.getElementById("email").value.trim();

const senha =
document.getElementById("senha").value;

const confirmar =
document.getElementById("confirmar").value;

if(
!nome ||
!usuario ||
!email ||
!senha ||
!confirmar
){

mostrarMensagem(
"Preencha todos os campos",
true
);

return;

}

if(
senha !== confirmar
){

mostrarMensagem(
"As senhas não coincidem",
true
);

return;

}

let usuarios =
JSON.parse(
localStorage.getItem("usuarios")
) || [];

const usuarioExistente =
usuarios.find(
u =>
u.usuario.toLowerCase() ===
usuario.toLowerCase()
);

if(usuarioExistente){

mostrarMensagem(
"Este usuário já existe",
true
);

return;

}

const emailExistente =
usuarios.find(
u =>
u.email.toLowerCase() ===
email.toLowerCase()
);

if(emailExistente){

mostrarMensagem(
"Este e-mail já está cadastrado",
true
);

return;

}

const novoUsuario = {

id: Date.now(),

nome: nome,

usuario: usuario,

email: email,

senha: senha,

perfil: "Operador"

};

usuarios.push(
novoUsuario
);

localStorage.setItem(
"usuarios",
JSON.stringify(
usuarios
)
);

mostrarMensagem(
"Cadastro realizado com sucesso!"
);

setTimeout(()=>{

window.location.href =
"index.html";

},1500);

}catch(erro){

console.error(erro);

alert(
"Erro ao cadastrar usuário. Verifique o console."
);

}

}

/* ==========================
LOGIN
========================== */

function login(){

const usuario =
document.getElementById(
"usuario"
).value.trim();

const senha =
document.getElementById(
"senha"
).value;

if(
usuario === "" ||
senha === ""
){

mostrarMensagem(
"Informe usuário e senha",
true
);

return;

}

const usuarios =
obterUsuarios();

const encontrado =
usuarios.find(

u =>

u.usuario === usuario &&
u.senha === senha

);

if(!encontrado){

mostrarMensagem(
"Usuário ou senha inválidos",
true
);

return;

}

localStorage.setItem(

"usuarioLogado",

JSON.stringify(
encontrado
)

);

localStorage.setItem(

"perfilUsuario",

encontrado.perfil

);

mostrarMensagem(
"Login realizado!"
);

setTimeout(()=>{

window.location.href =
"pages/dashboard.html";

},1000);

}

/* ==========================
RECUPERAR SENHA
========================== */

function recuperarSenha(){

const email =
document.getElementById(
"email"
).value.trim();

if(email === ""){

mostrarMensagem(
"Informe um e-mail",
true
);

return;

}

const usuarios =
obterUsuarios();

const usuario =
usuarios.find(
u =>
u.email === email
);

if(!usuario){

mostrarMensagem(
"E-mail não encontrado",
true
);

return;

}

mostrarMensagem(

`Senha cadastrada: ${usuario.senha}`

);

}

/* ==========================
CRIAR ADMIN PADRÃO
========================== */

if(
!localStorage.getItem(
"usuarios"
)
){

const admin = [

{
id:1,
nome:"Administrador",
usuario:"admin",
email:"admin@ferro.com",
senha:"123456",
perfil:"Admin"
},

{
id:2,
nome:"Carlos Silva",
usuario:"carlos",
email:"carlos@ferro.com",
senha:"123456",
perfil:"Operador"
},

{
id:3,
nome:"Ana Souza",
usuario:"ana",
email:"ana@ferro.com",
senha:"123456",
perfil:"Técnico"
}

];

localStorage.setItem(

"usuarios",

JSON.stringify(admin)

);

}