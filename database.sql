-- Create database
CREATE DATABASE IF NOT EXISTS babamatch;
USE babamatch;

-- Users table
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('parent', 'babysitter') NOT NULL,
  foto VARCHAR(255),
  telefone VARCHAR(20),
  endereco TEXT,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Babysitters profiles table
CREATE TABLE IF NOT EXISTS perfis_babas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  idade INT,
  experiencia VARCHAR(50),
  localizacao VARCHAR(100),
  bio TEXT,
  valor_hora DECIMAL(10,2),
  validado BOOLEAN DEFAULT FALSE,
  data_validacao TIMESTAMP NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Parents profiles table
CREATE TABLE IF NOT EXISTS perfis_pais (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  num_criancas INT,
  idades_criancas VARCHAR(100),
  necessidades_especiais TEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Skills table
CREATE TABLE IF NOT EXISTS habilidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  perfil_id INT NOT NULL,
  habilidade VARCHAR(100) NOT NULL,
  FOREIGN KEY (perfil_id) REFERENCES perfis_babas(id) ON DELETE CASCADE
);

-- Messages table
CREATE TABLE IF NOT EXISTS mensagens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  remetente_id INT NOT NULL,
  destinatario_id INT NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (remetente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (destinatario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Matches table (when a parent likes a babysitter)
CREATE TABLE IF NOT EXISTS matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pai_id INT NOT NULL,
  baba_id INT NOT NULL,
  data_match TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pai_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (baba_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Reviews table
CREATE TABLE IF NOT EXISTS avaliacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pai_id INT NOT NULL,
  baba_id INT NOT NULL,
  nota INT NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario TEXT,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pai_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (baba_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Sample data for testing
INSERT INTO usuarios (nome, email, senha, tipo, telefone, endereco) VALUES
('João Santos', 'joao@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'parent', '(11) 99999-1111', 'São Paulo, SP'),
('Ana Silva', 'ana@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'babysitter', '(11) 98888-1111', 'São Paulo, SP'),
('Carla Oliveira', 'carla@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'babysitter', '(21) 98888-2222', 'Rio de Janeiro, RJ'),
('Mariana Costa', 'mariana@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'babysitter', '(31) 98888-3333', 'Belo Horizonte, MG');

INSERT INTO perfis_pais (usuario_id, num_criancas, idades_criancas, necessidades_especiais) VALUES
(1, 2, '3 anos, 5 anos', 'Criança de 3 anos tem alergia a amendoim');

INSERT INTO perfis_babas (usuario_id, idade, experiencia, localizacao, bio, valor_hora, validado) VALUES
(2, 28, '5 anos', 'São Paulo, SP', 'Sou uma babá experiente e carinhosa. Adoro crianças e tenho muita paciência.', 50.00, TRUE),
(3, 32, '8 anos', 'Rio de Janeiro, RJ', 'Professora de educação infantil com experiência em cuidar de crianças de todas as idades.', 60.00, TRUE),
(4, 25, '3 anos', 'Belo Horizonte, MG', 'Estudante de pedagogia, amo trabalhar com crianças e ajudá-las em seu desenvolvimento.', 45.00, FALSE);

INSERT INTO habilidades (perfil_id, habilidade) VALUES
(1, 'Primeiros socorros'),
(1, 'Atividades educativas'),
(1, 'Cozinha'),
(2, 'Educação infantil'),
(2, 'Recreação'),
(2, 'Música'),
(3, 'Auxílio escolar'),
(3, 'Jogos educativos'),
(3, 'Artes');

INSERT INTO mensagens (remetente_id, destinatario_id, mensagem, lida) VALUES
(2, 1, 'Olá! Vi que você está procurando uma babá. Estou disponível para conversarmos.', TRUE),
(1, 2, 'Oi Ana! Sim, estou procurando alguém para cuidar do meu filho de 5 anos. Você tem experiência com crianças dessa idade?', TRUE),
(2, 1, 'Sim, tenho bastante experiência com crianças dessa idade. Trabalho com atividades educativas e recreativas.', TRUE);
