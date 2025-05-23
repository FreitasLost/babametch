<?php
// Configurações básicas
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Se for uma requisição OPTIONS, apenas retornar os cabeçalhos
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Verificar se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "message" => "Método não permitido. Use POST."
    ]);
    exit;
}

// Obter dados do corpo da requisição
$data = json_decode(file_get_contents('php://input'), true);

// Verificar se email e senha foram fornecidos
if (!isset($data['email']) || !isset($data['senha'])) {
    echo json_encode([
        "success" => false,
        "message" => "Email e senha são obrigatórios"
    ]);
    exit;
}

// Usuário de teste para login sem banco de dados
$test_user = [
    'id' => 1,
    'nome' => 'Usuário de Teste',
    'email' => 'teste@exemplo.com',
    'tipo' => 'parent',
    'telefone' => '(11) 99999-9999',
    'endereco' => 'São Paulo, SP',
    'foto' => 'https://randomuser.me/api/portraits/men/1.jpg'
];

// Verificar credenciais (simplificado para teste)
if ($data['email'] === 'teste@exemplo.com' && $data['senha'] === '123456') {
    echo json_encode([
        "success" => true,
        "message" => "Login realizado com sucesso!",
        "user" => $test_user
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Email ou senha incorretos",
        "debug_info" => [
            "email_recebido" => $data['email'],
            "senha_recebida" => "***" . substr($data['senha'], -3),
            "metodo" => $_SERVER['REQUEST_METHOD'],
            "content_type" => $_SERVER['CONTENT_TYPE'] ?? 'Não definido'
        ]
    ]);
}
?>
