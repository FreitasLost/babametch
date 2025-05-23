<?php
require_once 'config.php';

// Verificar se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Método não permitido"]);
    exit;
}

// Obter dados do corpo da requisição
$data = json_decode(file_get_contents('php://input'), true);

// Verificar campos obrigatórios
if (!isset($data['nome']) || !isset($data['email']) || !isset($data['senha']) || !isset($data['tipo'])) {
    echo json_encode(["success" => false, "message" => "Campos obrigatórios: nome, email, senha, tipo"]);
    exit;
}

$nome = $data['nome'];
$email = $data['email'];
$senha = password_hash($data['senha'], PASSWORD_DEFAULT);
$tipo = $data['tipo'];
$telefone = $data['telefone'] ?? null;

try {
    // Verificar se o email já existe
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        echo json_encode(["success" => false, "message" => "Este email já está cadastrado"]);
        exit;
    }
    
    // Inserir novo usuário
    $stmt = $conn->prepare("INSERT INTO usuarios (nome, email, senha, tipo, telefone) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$nome, $email, $senha, $tipo, $telefone]);
    
    $usuario_id = $conn->lastInsertId();
    
    // Se for babysitter, criar perfil
    if ($tipo === 'babysitter') {
        $stmt = $conn->prepare("INSERT INTO perfis_babas (usuario_id, idade, experiencia, localizacao, bio, valor_hora) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $usuario_id,
            $data['idade'] ?? null,
            $data['experiencia'] ?? null,
            $data['localizacao'] ?? null,
            $data['bio'] ?? null,
            $data['valor_hora'] ?? null
        ]);
        
        $perfil_id = $conn->lastInsertId();
        
        // Inserir habilidades se fornecidas
        if (isset($data['habilidades']) && is_array($data['habilidades'])) {
            $stmt = $conn->prepare("INSERT INTO habilidades (perfil_id, habilidade) VALUES (?, ?)");
            foreach ($data['habilidades'] as $habilidade) {
                if (!empty(trim($habilidade))) {
                    $stmt->execute([$perfil_id, trim($habilidade)]);
                }
            }
        }
    } else {
        // Se for pai/mãe, criar perfil
        $stmt = $conn->prepare("INSERT INTO perfis_pais (usuario_id, num_criancas, idades_criancas) VALUES (?, ?, ?)");
        $stmt->execute([
            $usuario_id,
            $data['num_criancas'] ?? null,
            $data['idades_criancas'] ?? null
        ]);
    }
    
    // Retornar dados do usuário criado
    $user_data = [
        'id' => $usuario_id,
        'nome' => $nome,
        'email' => $email,
        'tipo' => $tipo,
        'telefone' => $telefone
    ];
    
    echo json_encode([
        "success" => true,
        "message" => "Usuário cadastrado com sucesso!",
        "user" => $user_data
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erro ao cadastrar usuário: " . $e->getMessage()
    ]);
}
?>
