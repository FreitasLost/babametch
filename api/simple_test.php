<?php
// Configurações básicas
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Informações básicas do servidor
$server_info = [
    'php_version' => phpversion(),
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Desconhecido',
    'remote_addr' => $_SERVER['REMOTE_ADDR'] ?? 'Desconhecido',
    'request_time' => date('Y-m-d H:i:s'),
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Desconhecido',
    'http_host' => $_SERVER['HTTP_HOST'] ?? 'Desconhecido'
];

// Resposta simples sem tentar conectar ao banco de dados
echo json_encode([
    'success' => true,
    'message' => 'API PHP está funcionando!',
    'server_info' => $server_info
]);
?>
