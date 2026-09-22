<?php
require_once 'conexao.php';
require_once 'funcoes.php';

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $resultado = $conexao->query('SELECT id, codigo, tipo, trem, leitura, status, faixa, DATE_FORMAT(atualizacao, "%d/%m/%Y %H:%i") AS atualizacao FROM sensores ORDER BY codigo');
    responder($resultado->fetch_all(MYSQLI_ASSOC));
}

if ($metodo === 'POST') {
    $dados = receberJson();
    $codigo = trim($dados['codigo'] ?? '');
    $tipo = trim($dados['tipo'] ?? '');
    $trem = trim($dados['trem'] ?? '');
    $leitura = trim($dados['leitura'] ?? '');
    $status = $dados['status'] ?? 'Normal';
    $faixa = trim($dados['faixa'] ?? 'Não definida');

    if ($codigo === '' || $tipo === '' || $trem === '') responder(['erro' => 'Código, tipo e trem são obrigatórios.'], 400);
    if (!in_array($status, ['Normal','Atenção','Crítico'], true)) responder(['erro' => 'Status inválido.'], 400);

    try {
        $stmt = $conexao->prepare('INSERT INTO sensores (codigo, tipo, trem, leitura, status, faixa) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->bind_param('ssssss', $codigo, $tipo, $trem, $leitura, $status, $faixa);
        $stmt->execute();
    } catch (mysqli_sql_exception $erro) {
        if ($conexao->errno === 1062) responder(['erro' => 'Este código de sensor já existe.'], 409);
        responder(['erro' => 'Não foi possível cadastrar o sensor.'], 500);
    }

    responder(['sucesso' => true, 'mensagem' => 'Sensor cadastrado com sucesso.']);
}

if ($metodo === 'PUT') {
    $dados = receberJson();
    $id = (int)($dados['id'] ?? 0);
    $codigo = trim($dados['codigo'] ?? '');
    $tipo = trim($dados['tipo'] ?? '');
    $trem = trim($dados['trem'] ?? '');
    $leitura = trim($dados['leitura'] ?? '');
    $status = $dados['status'] ?? 'Normal';
    $faixa = trim($dados['faixa'] ?? 'Não definida');

    if ($id <= 0 || $codigo === '' || $tipo === '' || $trem === '') responder(['erro' => 'Dados obrigatórios não informados.'], 400);
    if (!in_array($status, ['Normal','Atenção','Crítico'], true)) responder(['erro' => 'Status inválido.'], 400);

    try {
        $stmt = $conexao->prepare('UPDATE sensores SET codigo=?, tipo=?, trem=?, leitura=?, status=?, faixa=? WHERE id=?');
        $stmt->bind_param('ssssssi', $codigo, $tipo, $trem, $leitura, $status, $faixa, $id);
        $stmt->execute();
    } catch (mysqli_sql_exception $erro) {
        if ($conexao->errno === 1062) responder(['erro' => 'Este código de sensor já existe.'], 409);
        responder(['erro' => 'Não foi possível atualizar o sensor.'], 500);
    }

    responder(['sucesso' => true, 'mensagem' => 'Sensor atualizado com sucesso.']);
}

if ($metodo === 'DELETE') {
    $dados = receberJson();
    $id = (int)($dados['id'] ?? 0);
    if ($id <= 0) responder(['erro' => 'Sensor inválido.'], 400);
    $stmt = $conexao->prepare('DELETE FROM sensores WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    responder(['sucesso' => true, 'mensagem' => 'Sensor removido com sucesso.']);
}

responder(['erro' => 'Método não permitido.'], 405);
