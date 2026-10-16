<?php
session_start();

require_once 'conexao.php';
require_once 'funcoes.php';

if (empty($_SESSION['usuario_id'])) {
    responder(['erro' => 'Não autenticado.'], 401);
}

$id = (int) $_SESSION['usuario_id'];
$metodo = $_SERVER['REQUEST_METHOD'];

// Garantir que a tabela tenha a coluna da foto
$conexao->query(
    "ALTER TABLE usuarios
     ADD COLUMN IF NOT EXISTS foto_perfil VARCHAR(255) DEFAULT NULL"
);

if ($metodo === 'GET') {

    $stmt = $conexao->prepare(
        'SELECT id, nome, usuario, email, perfil, foto_perfil
         FROM usuarios WHERE id = ?'
    );

    $stmt->bind_param('i', $id);
    $stmt->execute();

    $usuario = $stmt->get_result()->fetch_assoc();

    if (!$usuario) {
        responder(['erro' => 'Usuário não encontrado.'], 404);
    }

    responder([
        'sucesso' => true,
        'usuario' => $usuario
    ]);
}

if ($metodo === 'PUT') {

    // Receber dados JSON ou formulário com foto
    if (!empty($_FILES)) {
        $dados = $_POST;
    } else {
        $dados = receberJson();
    }

    $nome = trim($dados['nome'] ?? '');
    $usuario = trim($dados['usuario'] ?? '');
    $email = trim($dados['email'] ?? '');

    $senhaAtual = $dados['senha_atual'] ?? '';
    $novaSenha = $dados['nova_senha'] ?? '';
    $removerFoto = ($dados['remover_foto'] ?? '0') === '1';

    if ($nome === '' || $usuario === '' || $email === '') {
        responder([
            'erro' => 'Nome, usuário e e-mail são obrigatórios.'
        ], 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        responder(['erro' => 'E-mail inválido.'], 400);
    }

    if ($novaSenha !== '' && strlen($novaSenha) < 6) {
        responder([
            'erro' => 'A nova senha precisa ter pelo menos 6 caracteres.'
        ], 400);
    }

    $stmt = $conexao->prepare(
        'SELECT senha, foto_perfil FROM usuarios WHERE id = ?'
    );

    $stmt->bind_param('i', $id);
    $stmt->execute();

    $atual = $stmt->get_result()->fetch_assoc();

    if (!$atual) {
        responder(['erro' => 'Usuário não encontrado.'], 404);
    }

    if ($novaSenha !== '') {
        if (
            $senhaAtual === '' ||
            !password_verify($senhaAtual, $atual['senha'])
        ) {
            responder([
                'erro' => 'A senha atual está incorreta.'
            ], 400);
        }
    }

    $fotoAtual = $atual['foto_perfil'];
    $fotoNova = null;

    if (
        isset($_FILES['foto_perfil']) &&
        $_FILES['foto_perfil']['error'] !== UPLOAD_ERR_NO_FILE
    ) {
        $arquivo = $_FILES['foto_perfil'];

        if ($arquivo['error'] !== UPLOAD_ERR_OK) {
            responder(['erro' => 'Erro ao enviar a foto.'], 400);
        }

        if ($arquivo['size'] > 3 * 1024 * 1024) {
            responder([
                'erro' => 'A foto deve ter no máximo 3 MB.'
            ], 400);
        }

        $info = new finfo(FILEINFO_MIME_TYPE);
        $tipo = $info->file($arquivo['tmp_name']);

        $formatos = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif'
        ];

        if (!isset($formatos[$tipo])) {
            responder([
                'erro' => 'Formato inválido. Use JPG, PNG, WEBP ou GIF.'
            ], 400);
        }

        $pasta = dirname(__DIR__) . '/uploads/perfil';

        if (!is_dir($pasta) && !mkdir($pasta, 0755, true)) {
            responder([
                'erro' => 'Não foi possível criar a pasta das fotos.'
            ], 500);
        }

        $nomeArquivo = 'perfil_' . $id . '_' .
            bin2hex(random_bytes(8)) . '.' . $formatos[$tipo];

        if (!move_uploaded_file(
            $arquivo['tmp_name'],
            $pasta . '/' . $nomeArquivo
        )) {
            responder([
                'erro' => 'Não foi possível salvar a foto.'
            ], 500);
        }

        $fotoNova = 'uploads/perfil/' . $nomeArquivo;
    }

    $fotoSalvar = $fotoNova ?? (
        $removerFoto ? null : $fotoAtual
    );

    try {
        if ($novaSenha !== '') {
            $hash = password_hash($novaSenha, PASSWORD_DEFAULT);

            $stmt = $conexao->prepare(
                'UPDATE usuarios
                 SET nome = ?, usuario = ?, email = ?,
                     senha = ?, foto_perfil = ?
                 WHERE id = ?'
            );

            $stmt->bind_param(
                'sssssi',
                $nome, $usuario, $email, $hash, $fotoSalvar, $id
            );

        } else {
            $stmt = $conexao->prepare(
                'UPDATE usuarios
                 SET nome = ?, usuario = ?, email = ?, foto_perfil = ?
                 WHERE id = ?'
            );

            $stmt->bind_param(
                'ssssi',
                $nome, $usuario, $email, $fotoSalvar, $id
            );
        }

        $stmt->execute();

    } catch (mysqli_sql_exception $erro) {
        if ($fotoNova) {
            @unlink(dirname(__DIR__) . '/' . $fotoNova);
        }

        if ($erro->getCode() === 1062) {
            responder([
                'erro' => 'Este usuário ou e-mail já está cadastrado.'
            ], 409);
        }

        responder([
            'erro' => 'Não foi possível atualizar o perfil.'
        ], 500);
    }

    if (
        ($fotoNova || $removerFoto) &&
        $fotoAtual &&
        $fotoAtual !== $fotoSalvar
    ) {
        $caminho = dirname(__DIR__) . '/' . $fotoAtual;

        if (is_file($caminho)) {
            @unlink($caminho);
        }
    }

    $stmt = $conexao->prepare(
        'SELECT id, nome, usuario, email, perfil, foto_perfil
         FROM usuarios WHERE id = ?'
    );

    $stmt->bind_param('i', $id);
    $stmt->execute();

    responder([
        'sucesso' => true,
        'mensagem' => 'Perfil atualizado com sucesso!',
        'usuario' => $stmt->get_result()->fetch_assoc()
    ]);
}

responder(['erro' => 'Método não permitido.'], 405);