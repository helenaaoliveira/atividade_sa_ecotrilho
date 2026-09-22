<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

$servidor = "localhost";
$usuario = "root";
$senha = "";
$banco = "ecotrilho";

$conexao = new mysqli($servidor, $usuario, $senha, $banco);

if ($conexao->connect_error) {
    http_response_code(500);
    die("Erro ao conectar ao banco de dados.");
}

$conexao->set_charset("utf8mb4");
