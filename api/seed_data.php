<?php
require_once 'config.php';

try {
    // Limpar tabelas existentes
    $conn->exec("SET FOREIGN_KEY_CHECKS = 0");
    $conn->exec("TRUNCATE TABLE mensagens");
    $conn->exec("TRUNCATE TABLE matches");
    $conn->exec("TRUNCATE TABLE habilidades");
    $conn->exec("TRUNCATE TABLE perfis_pais");
    $conn->exec("TRUNCATE TABLE perfis_babas");
    $conn->exec("TRUNCATE TABLE usuarios");
    $conn->exec("SET FOREIGN_KEY_CHECKS = 1");
    
    $senhaHash = password_hash('123456', PASSWORD_DEFAULT);
    
    // Atualizar os inserts de usuários para incluir URLs de imagens:

    // Inserir pais/mães
    $stmt = $conn->prepare("INSERT INTO usuarios (nome, email, senha, tipo, telefone, endereco, foto) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        'João Silva', 
        'joao@example.com', 
        $senhaHash, 
        'parent', 
        '(11) 99999-1111', 
        'São Paulo, SP',
        'https://randomuser.me/api/portraits/men/32.jpg'
    ]);
    $pai1_id = $conn->lastInsertId();

    $stmt->execute([
        'Maria Oliveira', 
        'maria@example.com', 
        $senhaHash, 
        'parent', 
        '(11) 99999-2222', 
        'Rio de Janeiro, RJ',
        'https://randomuser.me/api/portraits/women/44.jpg'
    ]);
    $pai2_id = $conn->lastInsertId();

    // Inserir perfis de pais
    $stmt = $conn->prepare("INSERT INTO perfis_pais (usuario_id, num_criancas, idades_criancas, necessidades_especiais) VALUES (?, ?, ?, ?)");
    $stmt->execute([$pai1_id, 2, '3 anos, 5 anos', 'Criança de 3 anos tem alergia a amendoim']);
    $stmt->execute([$pai2_id, 1, '7 anos', 'Nenhuma necessidade especial']);
    
    // Inserir babás
    $stmt = $conn->prepare("INSERT INTO usuarios (nome, email, senha, tipo, telefone, endereco, foto) VALUES (?, ?, ?, ?, ?, ?, ?)");

    $stmt->execute([
        'Ana Santos', 
        'ana@example.com', 
        $senhaHash, 
        'babysitter', 
        '(11) 98888-1111', 
        'São Paulo, SP',
        'https://randomuser.me/api/portraits/women/68.jpg'
    ]);
    $baba1_id = $conn->lastInsertId();

    $stmt->execute([
        'Carla Pereira', 
        'carla@example.com', 
        $senhaHash, 
        'babysitter', 
        '(21) 98888-2222', 
        'Rio de Janeiro, RJ',
        'https://randomuser.me/api/portraits/women/65.jpg'
    ]);
    $baba2_id = $conn->lastInsertId();

    $stmt->execute([
        'Fernanda Lima', 
        'fernanda@example.com', 
        $senhaHash, 
        'babysitter', 
        '(31) 98888-3333', 
        'Belo Horizonte, MG',
        'https://randomuser.me/api/portraits/women/49.jpg'
    ]);
    $baba3_id = $conn->lastInsertId();

    $stmt->execute([
        'Juliana Costa', 
        'juliana@example.com', 
        $senhaHash, 
        'babysitter', 
        '(61) 98888-4444', 
        'Brasília, DF',
        'https://randomuser.me/api/portraits/women/33.jpg'
    ]);
    $baba4_id = $conn->lastInsertId();

    $stmt->execute([
        'Patricia Souza', 
        'patricia@example.com', 
        $senhaHash, 
        'babysitter', 
        '(71) 98888-5555', 
        'Salvador, BA',
        'https://randomuser.me/api/portraits/women/22.jpg'
    ]);
    $baba5_id = $conn->lastInsertId();
    
    // Inserir perfis de babás (algumas validadas, outras não)
    $stmt = $conn->prepare("INSERT INTO perfis_babas (usuario_id, idade, experiencia, localizacao, bio, valor_hora, validado) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->execute([
        $baba1_id, 28, '5 anos', 'São Paulo, SP', 
        'Adoro crianças e tenho experiência com bebês e crianças até 10 anos. Formada em pedagogia.',
        50.00, TRUE
    ]);
    $perfil1_id = $conn->lastInsertId();
    
    $stmt->execute([
        $baba2_id, 32, '8 anos', 'Rio de Janeiro, RJ', 
        'Formada em pedagogia, especializada em desenvolvimento infantil. Amo trabalhar com crianças.',
        60.00, TRUE
    ]);
    $perfil2_id = $conn->lastInsertId();
    
    $stmt->execute([
        $baba3_id, 25, '3 anos', 'Belo Horizonte, MG', 
        'Estudante de psicologia com paixão por cuidar de crianças. Muito paciente e carinhosa.',
        45.00, FALSE // Não validada
    ]);
    $perfil3_id = $conn->lastInsertId();
    
    $stmt->execute([
        $baba4_id, 30, '6 anos', 'Brasília, DF', 
        'Enfermeira especializada em pediatria. Experiência com cuidados especiais e primeiros socorros.',
        55.00, TRUE
    ]);
    $perfil4_id = $conn->lastInsertId();
    
    $stmt->execute([
        $baba5_id, 26, '4 anos', 'Salvador, BA', 
        'Professora de educação física, adora atividades ao ar livre e esportes com crianças.',
        48.00, FALSE // Não validada
    ]);
    $perfil5_id = $conn->lastInsertId();
    
    // Inserir habilidades
    $stmt = $conn->prepare("INSERT INTO habilidades (perfil_id, habilidade) VALUES (?, ?)");
    
    // Habilidades da Ana (validada)
    $stmt->execute([$perfil1_id, 'Primeiros socorros']);
    $stmt->execute([$perfil1_id, 'Pedagogia']);
    $stmt->execute([$perfil1_id, 'Recreação']);
    
    // Habilidades da Carla (validada)
    $stmt->execute([$perfil2_id, 'Pedagogia']);
    $stmt->execute([$perfil2_id, 'Música']);
    $stmt->execute([$perfil2_id, 'Inglês']);
    
    // Habilidades da Fernanda (não validada)
    $stmt->execute([$perfil3_id, 'Psicologia infantil']);
    $stmt->execute([$perfil3_id, 'Jogos educativos']);
    $stmt->execute([$perfil3_id, 'Culinária']);
    
    // Habilidades da Juliana (validada)
    $stmt->execute([$perfil4_id, 'Enfermagem']);
    $stmt->execute([$perfil4_id, 'Primeiros socorros']);
    $stmt->execute([$perfil4_id, 'Cuidados especiais']);
    
    // Habilidades da Patricia (não validada)
    $stmt->execute([$perfil5_id, 'Educação física']);
    $stmt->execute([$perfil5_id, 'Esportes']);
    $stmt->execute([$perfil5_id, 'Atividades ao ar livre']);
    
    echo json_encode([
        "success" => true, 
        "message" => "Dados de teste inseridos com sucesso! Apenas babás validadas aparecerão no feed."
    ]);
    
} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => "Erro ao inserir dados: " . $e->getMessage()]);
}
