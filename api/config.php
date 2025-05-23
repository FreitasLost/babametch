<?php
// Habilitar CORS para permitir requisições do frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Configuração do banco de dados usando variáveis de ambiente
$db_host = getenv('DB_HOST') ?: 'localhost';
$db_usuario = getenv('DB_USUARIO') ?: 'root';
$db_senha = getenv('DB_SENHA') ?: '';
$db_nome = getenv('DB_NOME') ?: 'babamatch';

// Conexão com o banco de dados
try {
    $conn = new PDO("mysql:host=$db_host;dbname=$db_nome", $db_usuario, $db_senha);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => "Erro de conexão: " . $e->getMessage()]);
    exit;
}

// Função para criar as tabelas se não existirem
function criarTabelas($conn) {
    try {
        // Atualizar tabela de usuários para incluir campos de perfil
        $conn->exec("CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            senha VARCHAR(255) NOT NULL,
            tipo ENUM('parent', 'babysitter') NOT NULL,
            foto VARCHAR(255) COMMENT 'URL da foto de perfil',
            telefone VARCHAR(20),
            endereco TEXT,
            data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Atualizar tabela de perfis de babás para incluir validação
        $conn->exec("CREATE TABLE IF NOT EXISTS perfis_babas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario_id INT NOT NULL,
            idade INT,
            experiencia VARCHAR(50),
            localizacao VARCHAR(100),
            bio TEXT,
            valor_hora DECIMAL(10,2),
            validado BOOLEAN DEFAULT FALSE,
            data_validacao TIMESTAMP NULL,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )");

        // Tabela para informações dos pais
        $conn->exec("CREATE TABLE IF NOT EXISTS perfis_pais (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario_id INT NOT NULL,
            num_criancas INT,
            idades_criancas VARCHAR(100),
            necessidades_especiais TEXT,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )");

        // Tabela de habilidades
        $conn->exec("CREATE TABLE IF NOT EXISTS habilidades (
            id INT AUTO_INCREMENT PRIMARY KEY,
            perfil_id INT NOT NULL,
            habilidade VARCHAR(100) NOT NULL,
            FOREIGN KEY (perfil_id) REFERENCES perfis_babas(id)
        )");

        // Tabela de matches
        $conn->exec("CREATE TABLE IF NOT EXISTS matches (
            id INT AUTO_INCREMENT PRIMARY KEY,
            pai_id INT NOT NULL,
            baba_id INT NOT NULL,
            data_match TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (pai_id) REFERENCES usuarios(id),
            FOREIGN KEY (baba_id) REFERENCES usuarios(id)
        )");

        // Tabela de mensagens
        $conn->exec("CREATE TABLE IF NOT EXISTS mensagens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            remetente_id INT NOT NULL,
            destinatario_id INT NOT NULL,
            mensagem TEXT NOT NULL,
            lida BOOLEAN DEFAULT FALSE,
            data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (remetente_id) REFERENCES usuarios(id),
            FOREIGN KEY (destinatario_id) REFERENCES usuarios(id)
        )");

        return true;
    } catch(PDOException $e) {
        return false;
    }
}

// Criar tabelas automaticamente
criarTabelas($conn);
