<?php
// Configurar cabeçalhos
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Resposta JSON simples
echo json_encode([
    "success" => true,
    "message" => "Teste de JSON bem-sucedido",
    "timestamp" => date("Y-m-d H:i:s"),
    "php_version" => phpversion()
]);
?>
