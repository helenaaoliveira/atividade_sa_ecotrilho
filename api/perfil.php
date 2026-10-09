<?php
session_start();
require_once 'conexao.php';
require_once 'funcoes.php';

if (empty($_SESSION['usuario_id'])) responder(['erro' => 'Não autenticado.'], 401);

$id = (int)$_SESSION['usuario_id'];
$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'PUT') {
    $dados = receberJson();
    $nome = trim($dados['nome'] ?? '');
    $email = trim($dados['email'] ?? '');

    if ($nome === '' || $email === '') responder(['erro' => 'Nome e e-mail são obrigatórios.'], 400);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) responder(['erro' => 'E-mail inválido.'], 400);

    try {
        $stmt = $conexao->prepare('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?');
        $stmt->bind_param('ssi', $nome, $email, $id);
        $stmt->execute();
    } catch (mysqli_sql_exception $erro) {
        if ($conexao->errno === 1062) responder(['erro' => 'Este e-mail já está cadastrado.'], 409);
        responder(['erro' => 'Não foi possível atualizar o perfil.'], 500);
    }

    $stmt = $conexao->prepare('SELECT id, nome, usuario, email, perfil FROM usuarios WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    responder(['sucesso' => true, 'usuario' => $stmt->get_result()->fetch_assoc()]);
}

responder(['erro' => 'Método não permitido.'], 405);
