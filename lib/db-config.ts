// Configuração do banco de dados MySQL
// Para usar com MySQL real, você precisará de um backend server

export const dbConfig = {
  host: process.env.NEXT_PUBLIC_DB_HOST || "%", // Alterado de "localhost" para "%" para permitir conexões de qualquer lugar
  user: process.env.NEXT_PUBLIC_DB_USER || "root",
  password: process.env.NEXT_PUBLIC_DB_PASSWORD || "",
  database: process.env.NEXT_PUBLIC_DB_NAME || "babamatch",
}

// Schema do banco de dados
export const dbSchema = `
-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_type ENUM('parent', 'babysitter') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de perfis de babás
CREATE TABLE IF NOT EXISTS babysitter_profiles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  age INT,
  experience VARCHAR(100),
  location VARCHAR(255),
  bio TEXT,
  hourly_rate DECIMAL(10, 2),
  image_url VARCHAR(500),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de habilidades
CREATE TABLE IF NOT EXISTS skills (
  id INT PRIMARY KEY AUTO_INCREMENT,
  babysitter_id INT NOT NULL,
  skill_name VARCHAR(100),
  FOREIGN KEY (babysitter_id) REFERENCES babysitter_profiles(id)
);

-- Tabela de matches
CREATE TABLE IF NOT EXISTS matches (
  id INT PRIMARY KEY AUTO_INCREMENT,
  parent_id INT NOT NULL,
  babysitter_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES users(id),
  FOREIGN KEY (babysitter_id) REFERENCES users(id)
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);
`
