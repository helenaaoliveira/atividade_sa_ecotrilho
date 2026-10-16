<?php
require_once 'conexao.php';
require_once 'funcoes.php';

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    $resultado = $conexao->query('SELECT id, codigo, nome, status, velocidade, localizacao, modelo, ano, capacidade, comprimento, peso, DATE_FORMAT(atualizacao, "%d/%m/%Y %H:%i") AS atualizacao FROM trens ORDER BY nome');
    responder($resultado->fetch_all(MYSQLI_ASSOC));
}

if ($metodo === 'POST') {
    $dados = receberJson();
    $codigo = trim($dados['codigo'] ?? '');
    $nome = trim($dados['nome'] ?? '');
    $status = $dados['status'] ?? 'Ativo';
    $velocidade = trim($dados['velocidade'] ?? '0 km/h');
    $localizacao = trim($dados['localizacao'] ?? '');
    $modelo = trim($dados['modelo'] ?? '');
    $ano = ($dados['ano'] ?? '') === '' ? null : (int)$dados['ano'];
    $capacidade = trim($dados['capacidade'] ?? '');
    $comprimento = trim($dados['comprimento'] ?? '');
    $peso = trim($dados['peso'] ?? '');

    if ($codigo === '' || $nome === '') responder(['erro' => 'Código e nome são obrigatórios.'], 400);
    if (!in_array($status, ['Ativo','Manutenção','Parado'], true)) responder(['erro' => 'Status inválido.'], 400);

    try {
        $stmt = $conexao->prepare('INSERT INTO trens (codigo, nome, status, velocidade, localizacao, modelo, ano, capacidade, comprimento, peso) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->bind_param('ssssssisss', $codigo, $nome, $status, $velocidade, $localizacao, $modelo, $ano, $capacidade, $comprimento, $peso);
        $stmt->execute();
    } catch (mysqli_sql_exception $erro) {
        if ($conexao->errno === 1062) responder(['erro' => 'Este código de trem já existe.'], 409);
        responder(['erro' => 'Não foi possível cadastrar o trem.'], 500);
    }

    responder(['sucesso' => true, 'mensagem' => 'Trem cadastrado com sucesso.']);
}

if ($metodo === 'PUT') {
    $dados = receberJson();
    $id = (int)($dados['id'] ?? 0);
    $codigo = trim($dados['codigo'] ?? '');
    $nome = trim($dados['nome'] ?? '');
    $status = $dados['status'] ?? 'Ativo';
    $velocidade = trim($dados['velocidade'] ?? '0 km/h');
    $localizacao = trim($dados['localizacao'] ?? '');
    $modelo = trim($dados['modelo'] ?? '');
    $ano = ($dados['ano'] ?? '') === '' ? null : (int)$dados['ano'];
    $capacidade = trim($dados['capacidade'] ?? '');
    $comprimento = trim($dados['comprimento'] ?? '');
    $peso = trim($dados['peso'] ?? '');

    if ($id <= 0 || $codigo === '' || $nome === '') responder(['erro' => 'Dados obrigatórios não informados.'], 400);
    if (!in_array($status, ['Ativo','Manutenção','Parado'], true)) responder(['erro' => 'Status inválido.'], 400);

    try {
        $stmt = $conexao->prepare('UPDATE trens SET codigo=?, nome=?, status=?, velocidade=?, localizacao=?, modelo=?, ano=?, capacidade=?, comprimento=?, peso=? WHERE id=?');
        $stmt->bind_param('ssssssisssi', $codigo, $nome, $status, $velocidade, $localizacao, $modelo, $ano, $capacidade, $comprimento, $peso, $id);
        $stmt->execute();
    } catch (mysqli_sql_exception $erro) {
        if ($conexao->errno === 1062) responder(['erro' => 'Este código de trem já existe.'], 409);
        responder(['erro' => 'Não foi possível atualizar o trem.'], 500);
    }

    responder(['sucesso' => true, 'mensagem' => 'Trem atualizado com sucesso.']);
}

if ($metodo === 'DELETE') {
    $dados = receberJson();
    $id = (int)($dados['id'] ?? 0);
    if ($id <= 0) responder(['erro' => 'Trem inválido.'], 400);
    $stmt = $conexao->prepare('DELETE FROM trens WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    responder(['sucesso' => true, 'mensagem' => 'Trem removido com sucesso.']);
}

responder(['erro' => 'Método não permitido.'], 405);
