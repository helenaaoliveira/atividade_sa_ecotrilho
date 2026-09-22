<?php
session_start();
require_once 'conexao.php';
require_once 'funcoes.php';

$acao = $_GET['acao'] ?? '';

if ($acao === 'login') {
    metodoPermitido(['POST']);
    $dados = receberJson();

    $usuario = trim($dados['usuario'] ?? '');
    $senha = $dados['senha'] ?? '';

    if ($usuario === '' || $senha === '') {
        responder(['erro' => 'Informe usuário e senha.'], 400);
    }

    $stmt = $conexao->prepare('SELECT id, nome, usuario, email, senha, perfil FROM usuarios WHERE usuario = ? LIMIT 1');
    $stmt->bind_param('s', $usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $usuarioBanco = $resultado->fetch_assoc();

    if (!$usuarioBanco || !password_verify($senha, $usuarioBanco['senha'])) {
        responder(['erro' => 'Usuário ou senha inválidos.'], 401);
    }

    $_SESSION['usuario_id'] = (int)$usuarioBanco['id'];

    unset($usuarioBanco['senha']);
    responder(['sucesso' => true, 'usuario' => $usuarioBanco]);
}

if ($acao === 'logout') {
    metodoPermitido(['POST']);
    session_unset();
    session_destroy();
    responder(['sucesso' => true]);
}

if ($acao === 'sessao') {
    metodoPermitido(['GET']);

    if (empty($_SESSION['usuario_id'])) {
        responder(['logado' => false]);
    }

    $id = (int)$_SESSION['usuario_id'];
    $stmt = $conexao->prepare('SELECT id, nome, usuario, email, perfil FROM usuarios WHERE id = ? LIMIT 1');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $usuarioBanco = $stmt->get_result()->fetch_assoc();

    if (!$usuarioBanco) {
        session_unset();
        session_destroy();
        responder(['logado' => false]);
    }

    responder(['logado' => true, 'usuario' => $usuarioBanco]);
}

if ($acao === 'cadastro') {
    metodoPermitido(['POST']);
    $dados = receberJson();

    $nome = trim($dados['nome'] ?? '');
    $usuario = trim($dados['usuario'] ?? '');
    $email = trim($dados['email'] ?? '');
    $senha = $dados['senha'] ?? '';

    if ($nome === '' || $usuario === '' || $email === '' || $senha === '') {
        responder(['erro' => 'Preencha todos os campos.'], 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        responder(['erro' => 'Informe um e-mail válido.'], 400);
    }

    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

    try {
        $stmt = $conexao->prepare('INSERT INTO usuarios (nome, usuario, email, senha, perfil) VALUES (?, ?, ?, ?, "Operador")');
        $stmt->bind_param('ssss', $nome, $usuario, $email, $senhaHash);
        $stmt->execute();
    } catch (mysqli_sql_exception $erro) {
        if ($conexao->errno === 1062) {
            responder(['erro' => 'Usuário ou e-mail já cadastrado.'], 409);
        }
        responder(['erro' => 'Não foi possível realizar o cadastro.'], 500);
    }

    responder(['sucesso' => true, 'mensagem' => 'Cadastro realizado com sucesso!']);
}

if ($acao === 'recuperar') {
    metodoPermitido(['POST']);
    $dados = receberJson();
    $email = trim($dados['email'] ?? '');

    if ($email === '') {
        responder(['erro' => 'Informe um e-mail.'], 400);
    }

    $stmt = $conexao->prepare('SELECT id FROM usuarios WHERE email = ? LIMIT 1');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $usuario = $stmt->get_result()->fetch_assoc();

    // Não devolvemos a senha do banco. A senha fica protegida por hash.
    if (!$usuario) {
        responder(['erro' => 'E-mail não encontrado.'], 404);
    }

    responder(['sucesso' => true, 'mensagem' => 'E-mail encontrado. Solicite a redefinição de senha ao administrador do sistema.']);
}

responder(['erro' => 'Ação inválida.'], 400);
