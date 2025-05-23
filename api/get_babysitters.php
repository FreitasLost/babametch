<?php
require_once 'config.php';

try {
    // Buscar babás validadas com seus perfis e habilidades
    $stmt = $conn->query("
        SELECT 
            u.id,
            u.nome,
            u.foto,
            pb.idade,
            pb.experiencia,
            pb.localizacao,
            pb.bio,
            pb.valor_hora,
            GROUP_CONCAT(h.habilidade SEPARATOR ',') as habilidades
        FROM usuarios u
        INNER JOIN perfis_babas pb ON u.id = pb.usuario_id
        LEFT JOIN habilidades h ON pb.id = h.perfil_id
        WHERE u.tipo = 'babysitter' AND pb.validado = TRUE
        GROUP BY u.id, u.nome, u.foto, pb.idade, pb.experiencia, pb.localizacao, pb.bio, pb.valor_hora
        ORDER BY u.id
    ");
    
    $babysitters = [];
    while ($row = $stmt->fetch()) {
        $babysitters[] = [
            'id' => $row['id'],
            'nome' => $row['nome'],
            'idade' => $row['idade'],
            'experiencia' => $row['experiencia'],
            'localizacao' => $row['localizacao'],
            'bio' => $row['bio'],
            'foto' => $row['foto'],
            'hourlyRate' => $row['valor_hora'] ? 'R$ ' . number_format($row['valor_hora'], 2, ',', '.') . '/hora' : 'Valor não informado',
            'skills' => $row['habilidades'] ? explode(',', $row['habilidades']) : []
        ];
    }
    
    echo json_encode([
        "success" => true,
        "babysitters" => $babysitters,
        "total" => count($babysitters)
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Erro ao buscar babás: " . $e->getMessage()
    ]);
}
?>
