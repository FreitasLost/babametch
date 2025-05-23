<?php
// Desativar buffer de saída
ini_set('output_buffering', 'off');
ini_set('zlib.output_compression', 'off');

// Configurar cabeçalhos para texto plano
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: text/plain");

echo "=== INICIANDO DIAGNÓSTICO DE CONFIGURAÇÃO ===\n\n";

// Configuração do banco de dados usando variáveis de ambiente
$db_host = getenv('DB_HOST') ?: '%';
$db_usuario = getenv('DB_USUARIO') ?: 'root';
$db_senha = getenv('DB_SENHA') ?: '';
$db_nome = getenv('DB_NOME') ?: 'babamatch';

echo "Configurações do banco de dados:\n";
echo "- Host: $db_host\n";
echo "- Usuário: $db_usuario\n";
echo "- Senha: " . (empty($db_senha) ? "[vazia]" : "[definida]") . "\n";
echo "- Banco: $db_nome\n\n";

// Conexão com o banco de dados
try {
    echo "Tentando conectar ao banco de dados...\n";
    
    $conn = new PDO("mysql:host=$db_host;dbname=$db_nome;charset=utf8", $db_usuario, $db_senha, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);
    
    echo "Conexão bem-sucedida!\n\n";
    
    // Testar consulta simples
    echo "Executando consulta de teste...\n";
    $stmt = $conn->query("SELECT 'Teste de consulta bem-sucedido!' AS message");
    $result = $stmt->fetch();
    echo "Resultado: " . $result['message'] . "\n\n";
    
    // Verificar tabelas existentes
    echo "Verificando tabelas existentes...\n";
    $stmt = $conn->query("SHOW TABLES");
    $tables = $stmt->fetchAll();
    
    if (count($tables) > 0) {
        echo "Tabelas encontradas:\n";
        foreach ($tables as $table) {
            echo "- " . reset($table) . "\n";
        }
    } else {
        echo "Nenhuma tabela encontrada no banco de dados.\n";
    }
    
} catch(PDOException $e) {
    echo "ERRO DE CONEXÃO: " . $e->getMessage() . "\n";
    echo "Código de erro: " . $e->getCode() . "\n\n";
    
    echo "Detalhes adicionais:\n";
    echo "- Classe de erro: " . get_class($e) . "\n";
    echo "- Arquivo: " . $e->getFile() . "\n";
    echo "- Linha: " . $e->getLine() . "\n";
    
    // Verificar se é um erro de conexão específico
    if ($e->getCode() == 1045) {
        echo "\nEste é um erro de acesso negado. Verifique se o usuário e senha estão corretos.\n";
    } elseif ($e->getCode() == 1049) {
        echo "\nEste é um erro de banco de dados desconhecido. Verifique se o banco '$db_nome' existe.\n";
    } elseif ($e->getCode() == 2002) {
        echo "\nEste é um erro de conexão. Verifique se o host '$db_host' está correto e acessível.\n";
    }
}

echo "\n=== FIM DO DIAGNÓSTICO ===\n";
?>
