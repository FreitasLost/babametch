<?php
require_once 'config.php';

// Verificar se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Método não permitido"]);
    exit;
}

// Obter dados do corpo da requisição
$data = json_decode(file_get_contents('php://input'), true);

// Verificar se o user_id e photo_url foram fornecidos
if (!isset($data['user_id']) || !isset($data['photo_url'])) {
    echo json_encode(["success" => false, "message" => "ID do usuário e URL da foto são obrigatórios"]);
    exit;
}

$user_id = $data['user_id'];
$photo_url = $data['photo_url'];

// Validar URL (verificação básica)
if (!filter_var($photo_url, FILTER_VALIDATE_URL)) {
    echo json_encode(["success" => false, "message" => "URL da imagem inválida"]);
    exit;
}

try {
    // Atualizar banco de dados com a URL da foto
    $stmt = $conn->prepare("UPDATE usuarios SET foto = ? WHERE id = ?");
    $stmt->execute([$photo_url, $user_id]);
    
    echo json_encode([
        "success" => true,
        "message" => "URL da foto atualizada com sucesso",
        "photo_url" => $photo_url
    ]);
    
} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => "Erro ao atualizar foto: " . $e->getMessage()]);
}
