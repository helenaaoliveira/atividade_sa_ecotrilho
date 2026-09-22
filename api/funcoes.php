<?php

function responder($dados, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

function receberJson() {
    $conteudo = file_get_contents('php://input');
    $dados = json_decode($conteudo, true);
    return is_array($dados) ? $dados : [];
}

function metodoPermitido($metodos) {
    if (!in_array($_SERVER['REQUEST_METHOD'], $metodos, true)) {
        responder(['erro' => 'Método não permitido.'], 405);
    }
}
