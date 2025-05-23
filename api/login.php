<?php
require_once 'config.php';

// Verificar se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Método não permitido"]);
    exit;
}

// Obter dados do corpo da requisição
$data = json_decode(file_get_contents('php://input'), true);

// Verificar se email e senha foram fornecidos
if (!isset($data['email']) || !isset($data['senha'])) {
    echo json_encode(["success" => false, "message" => "Email e senha são obrigatórios"]);
    exit;
}

$email = $data['email'];
$senha = $data['senha'];

try {
    // Buscar usuário no banco de dados
    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $usuario = $stmt->fetch();
    
    if ($usuario && password_verify($senha, $usuario['senha'])) {
        // Login bem-sucedido
        $user_data = [
            'id' => $usuario['id'],
            'nome' => $usuario['nome'],
            'email' => $usuario['email'],
            'tipo' => $usuario['tipo'],
            'telefone' => $usuario['telefone'],
            'endereco' => $usuario['endereco'],
            'foto' => $usuario['foto']
        ];
        
        echo json_encode([
            "success" => true,
            "message" => "Login realizado com sucesso!",
            "user" => $user_data
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Email ou senha incorretos"
        ]);
    }
    
} catch(PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erro ao fazer login: " . $e->getMessage()
    ]);
}
?>
