<?php
// Habilitar CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Configuração do banco de dados com as credenciais corretas
$db_host = getenv('DB_HOST') ?: '%';
$db_usuario = getenv('DB_USUARIO') ?: '1';  // Usuário: 1
$db_senha = getenv('DB_SENHA') ?: '1';      // Senha: 1
$db_nome = getenv('DB_NOME') ?: 'babametch'; // Nome do banco: babametch

// Informações do ambiente
$env_vars = [
    'DB_HOST' => $db_host,
    'DB_USUARIO' => $db_usuario,
    'DB_SENHA' => '[DEFINIDO]',
    'DB_NOME' => $db_nome,
    'SERVER_SOFTWARE' => $_SERVER['SERVER_SOFTWARE'] ?? 'Desconhecido',
    'PHP_VERSION' => phpversion()
];

// Tentar conexão com o banco de dados
try {
    $conn = new PDO("mysql:host=$db_host;dbname=$db_nome;charset=utf8", $db_usuario, $db_senha, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
    
    // Testar consulta simples
    $stmt = $conn->query("SELECT 'Conexão bem-sucedida com babametch!' AS message, NOW() AS timestamp");
    $result = $stmt->fetch();
    
    // Verificar tabelas existentes
    $stmt = $conn->query("SHOW TABLES");
    $tables = $stmt->fetchAll();
    
    echo json_encode([
        "success" => true,
        "message" => $result['message'],
        "timestamp" => $result['timestamp'],
        "environment" => $env_vars,
        "tables_count" => count($tables),
        "tables" => array_map(function($table) { return reset($table); }, $tables),
        "server_info" => [
            "remote_addr" => $_SERVER['REMOTE_ADDR'] ?? 'Desconhecido',
            "http_host" => $_SERVER['HTTP_HOST'] ?? 'Desconhecido',
            "request_uri" => $_SERVER['REQUEST_URI'] ?? 'Desconhecido'
        ]
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erro de conexão ao banco de dados",
        "error" => $e->getMessage(),
        "error_code" => $e->getCode(),
        "environment" => $env_vars,
        "connection_string" => "mysql:host=$db_host;dbname=$db_nome"
    ]);
}
?>
