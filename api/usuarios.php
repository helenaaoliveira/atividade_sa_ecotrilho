<?php
require_once 'conexao.php';
require_once 'funcoes.php';

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $resultado = $conexao->query('SELECT id, nome, usuario, email, perfil FROM usuarios ORDER BY nome');
    responder($resultado->fetch_all(MYSQLI_ASSOC));
}

if ($metodo === 'POST') {
    $dados = receberJson();
    $nome = trim($dados['nome'] ?? '');
    $usuario = trim($dados['usuario'] ?? '');
    $email = trim($dados['email'] ?? '');
    $senha = $dados['senha'] ?? '';
    $perfil = $dados['perfil'] ?? 'Operador';

    if ($nome === '' || $usuario === '' || $email === '' || $senha === '') {
        responder(['erro' => 'Preencha nome, usuário, e-mail e senha.'], 400);
    }

    if (!in_array($perfil, ['Admin', 'Operador', 'Técnico'], true)) {
        responder(['erro' => 'Perfil inválido.'], 400);
    }

    $hash = password_hash($senha, PASSWORD_DEFAULT);

    try {
        $stmt = $conexao->prepare('INSERT INTO usuarios (nome, usuario, email, senha, perfil) VALUES (?, ?, ?, ?, ?)');
        $stmt->bind_param('sssss', $nome, $usuario, $email, $hash, $perfil);
        $stmt->execute();
    } catch (mysqli_sql_exception $erro) {
        if ($conexao->errno === 1062) responder(['erro' => 'Usuário ou e-mail já cadastrado.'], 409);
        responder(['erro' => 'Não foi possível cadastrar o usuário.'], 500);
    }

    responder(['sucesso' => true, 'mensagem' => 'Usuário cadastrado com sucesso.']);
}

if ($metodo === 'PUT') {
    $dados = receberJson();
    $id = (int)($dados['id'] ?? 0);
    $nome = trim($dados['nome'] ?? '');
    $usuario = trim($dados['usuario'] ?? '');
    $email = trim($dados['email'] ?? '');
    $perfil = $dados['perfil'] ?? 'Operador';
    $senha = $dados['senha'] ?? '';

    if ($id <= 0 || $nome === '' || $usuario === '' || $email === '') {
        responder(['erro' => 'Dados obrigatórios não informados.'], 400);
    }

    if (!in_array($perfil, ['Admin', 'Operador', 'Técnico'], true)) {
        responder(['erro' => 'Perfil inválido.'], 400);
    }

    try {
        if ($senha !== '') {
            $hash = password_hash($senha, PASSWORD_DEFAULT);
            $stmt = $conexao->prepare('UPDATE usuarios SET nome = ?, usuario = ?, email = ?, senha = ?, perfil = ? WHERE id = ?');
            $stmt->bind_param('sssssi', $nome, $usuario, $email, $hash, $perfil, $id);
        } else {
            $stmt = $conexao->prepare('UPDATE usuarios SET nome = ?, usuario = ?, email = ?, perfil = ? WHERE id = ?');
            $stmt->bind_param('ssssi', $nome, $usuario, $email, $perfil, $id);
        }
        $stmt->execute();
    } catch (mysqli_sql_exception $erro) {
        if ($conexao->errno === 1062) responder(['erro' => 'Usuário ou e-mail já cadastrado.'], 409);
        responder(['erro' => 'Não foi possível atualizar o usuário.'], 500);
    }

    responder(['sucesso' => true, 'mensagem' => 'Usuário atualizado com sucesso.']);
}

if ($metodo === 'DELETE') {
    $dados = receberJson();
    $id = (int)($dados['id'] ?? 0);
    if ($id <= 0) responder(['erro' => 'Usuário inválido.'], 400);

    $stmt = $conexao->prepare('DELETE FROM usuarios WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    responder(['sucesso' => true, 'mensagem' => 'Usuário removido com sucesso.']);
}

responder(['erro' => 'Método não permitido.'], 405);
