<?php
// Desativar buffer de saída
ini_set('output_buffering', 'off');
ini_set('zlib.output_compression', 'off');

// Configurar cabeçalhos
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: text/plain");

// Exibir informações básicas
echo "=== INFORMAÇÕES DO PHP ===\n";
echo "Versão do PHP: " . phpversion() . "\n";
echo "Servidor: " . $_SERVER['SERVER_SOFTWARE'] . "\n";
echo "Diretório atual: " . getcwd() . "\n\n";

// Verificar extensões necessárias
echo "=== EXTENSÕES PHP ===\n";
echo "PDO instalado: " . (extension_loaded('pdo') ? 'SIM' : 'NÃO') . "\n";
echo "PDO MySQL instalado: " . (extension_loaded('pdo_mysql') ? 'SIM' : 'NÃO') . "\n";
echo "JSON instalado: " . (extension_loaded('json') ? 'SIM' : 'NÃO') . "\n\n";

// Verificar variáveis de ambiente
echo "=== VARIÁVEIS DE AMBIENTE ===\n";
echo "DB_HOST: " . (getenv('DB_HOST') ?: 'não definido') . "\n";
echo "DB_USUARIO: " . (getenv('DB_USUARIO') ?: 'não definido') . "\n";
echo "DB_SENHA: " . (getenv('DB_SENHA') ? '[definido]' : 'não definido') . "\n";
echo "DB_NOME: " . (getenv('DB_NOME') ?: 'não definido') . "\n\n";

// Tentar conexão com o banco de dados
echo "=== TESTE DE CONEXÃO ===\n";
try {
    $db_host = getenv('DB_HOST') ?: '%';
    $db_usuario = getenv('DB_USUARIO') ?: 'root';
    $db_senha = getenv('DB_SENHA') ?: '';
    $db_nome = getenv('DB_NOME') ?: 'babamatch';
    
    echo "Tentando conectar a: mysql:host=$db_host;dbname=$db_nome\n";
    echo "Usuário: $db_usuario\n";
    
    $conn = new PDO("mysql:host=$db_host;dbname=$db_nome;charset=utf8", $db_usuario, $db_senha);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Conexão bem-sucedida!\n";
    
    // Testar consulta simples
    $stmt = $conn->query("SELECT 'Teste de consulta bem-sucedido!' AS message");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Resultado da consulta: " . $result['message'] . "\n";
    
} catch(PDOException $e) {
    echo "ERRO DE CONEXÃO: " . $e->getMessage() . "\n";
    echo "Código de erro: " . $e->getCode() . "\n";
}

echo "\n=== FIM DO TESTE ===\n";
?>
