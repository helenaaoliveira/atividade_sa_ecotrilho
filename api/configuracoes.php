<?php
session_start();
require_once 'conexao.php';
require_once 'funcoes.php';

if (empty($_SESSION['usuario_id'])) responder(['erro' => 'Não autenticado.'], 401);

$usuarioId = (int)$_SESSION['usuario_id'];
$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $stmt = $conexao->prepare('SELECT notificacoes, dark_mode FROM configuracoes WHERE usuario_id = ? LIMIT 1');
    $stmt->bind_param('i', $usuarioId);
    $stmt->execute();
    $config = $stmt->get_result()->fetch_assoc();

    if (!$config) {
        $stmt = $conexao->prepare('INSERT INTO configuracoes (usuario_id, notificacoes, dark_mode) VALUES (?, 1, 0)');
        $stmt->bind_param('i', $usuarioId);
        $stmt->execute();
        $config = ['notificacoes' => 1, 'dark_mode' => 0];
    }

    $config['notificacoes'] = (bool)$config['notificacoes'];
    $config['dark_mode'] = (bool)$config['dark_mode'];
    responder($config);
}

if ($metodo === 'PUT') {
    $dados = receberJson();
    $notificacoes = !empty($dados['notificacoes']) ? 1 : 0;
    $darkMode = !empty($dados['dark_mode']) ? 1 : 0;

    $stmt = $conexao->prepare('INSERT INTO configuracoes (usuario_id, notificacoes, dark_mode) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE notificacoes = VALUES(notificacoes), dark_mode = VALUES(dark_mode)');
    $stmt->bind_param('iii', $usuarioId, $notificacoes, $darkMode);
    $stmt->execute();

    responder(['sucesso' => true, 'mensagem' => 'Configurações salvas.']);
}

responder(['erro' => 'Método não permitido.'], 405);
