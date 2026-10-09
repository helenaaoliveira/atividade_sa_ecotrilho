<?php

header("Content-Type: application/json; charset=UTF-8");

require_once "conexao.php";

$metodo = $_SERVER["REQUEST_METHOD"];

try {
    if ($metodo === "GET") {
        $sql = "SELECT * FROM rotas ORDER BY id DESC";
        $resultado = $conexao->query($sql);
        $rotas = [];
        while ($rota = $resultado->fetch_assoc()) {
            $rotas[] = $rota;
        }

        echo json_encode($rotas);
        exit;
    }

    $dados = json_decode(file_get_contents("php://input"), true);

    if ($metodo === "POST") {
        if (
            empty($dados["nome"]) ||
            empty($dados["origem"]) ||
            empty($dados["destino"])
        ) {
            http_response_code(400);
            echo json_encode([
                "mensagem" => "Preencha o nome, a origem e o destino."
            ]);
            exit;
        }

        $nome = $dados["nome"];
        $origem = $dados["origem"];
        $destino = $dados["destino"];
        $distancia = $dados["distancia"] ?? "";
        $trem = $dados["trem"] ?? "";
        $status = $dados["status"] ?? "Ativa";

        $sql = "INSERT INTO rotas
                (nome, origem, destino, distancia, trem, status)
                VALUES (?, ?, ?, ?, ?, ?)";

        $stmt = $conexao->prepare($sql);

        $stmt->bind_param(
            "ssssss",
            $nome,
            $origem,
            $destino,
            $distancia,
            $trem,
            $status
        );

        $stmt->execute();
        echo json_encode([
            "mensagem" => "Rota cadastrada com sucesso."
        ]);
        exit;
    }

    if ($metodo === "PUT") {

        if (empty($dados["id"])) {
            http_response_code(400);
            echo json_encode([
                "mensagem" => "ID da rota não informado."
            ]);
            exit;
        }

        $id = $dados["id"];
        $nome = $dados["nome"];
        $origem = $dados["origem"];
        $destino = $dados["destino"];
        $distancia = $dados["distancia"] ?? "";
        $trem = $dados["trem"] ?? "";
        $status = $dados["status"] ?? "Ativa";

        $sql = "UPDATE rotas SET
                    nome = ?,
                    origem = ?,
                    destino = ?,
                    distancia = ?,
                    trem = ?,
                    status = ?
                WHERE id = ?";

        $stmt = $conexao->prepare($sql);

        $stmt->bind_param(
            "ssssssi",
            $nome,
            $origem,
            $destino,
            $distancia,
            $trem,
            $status,
            $id
        );

        $stmt->execute();

        echo json_encode([
            "mensagem" => "Rota atualizada com sucesso."
        ]);

        exit;
    }

    if ($metodo === "DELETE") {

        if (empty($dados["id"])) {

            http_response_code(400);

            echo json_encode([
                "mensagem" => "ID da rota não informado."
            ]);

            exit;
        }

        $id = $dados["id"];

        $sql = "DELETE FROM rotas WHERE id = ?";

        $stmt = $conexao->prepare($sql);

        $stmt->bind_param("i", $id);

        $stmt->execute();

        echo json_encode([
            "mensagem" => "Rota excluída com sucesso."
        ]);

        exit;
    }

    http_response_code(405);

    echo json_encode([
        "mensagem" => "Método não permitido."
    ]);

} catch (Exception $erro) {

    http_response_code(500);

    echo json_encode([
        "mensagem" => "Erro ao processar a solicitação.",
        "erro" => $erro->getMessage()
    ]);
}