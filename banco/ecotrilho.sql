CREATE DATABASE IF NOT EXISTS ecotrilho
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE ecotrilho;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('Admin','Operador','Técnico') NOT NULL DEFAULT 'Operador',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    status ENUM('Ativo','Manutenção','Parado') NOT NULL DEFAULT 'Ativo',
    velocidade VARCHAR(30) DEFAULT '0 km/h',
    localizacao VARCHAR(150) DEFAULT '',
    modelo VARCHAR(100) DEFAULT '',
    ano INT NULL,
    capacidade VARCHAR(50) DEFAULT '',
    comprimento VARCHAR(50) DEFAULT '',
    peso VARCHAR(50) DEFAULT '',
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sensores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    tipo VARCHAR(50) NOT NULL,
    trem VARCHAR(30) NOT NULL,
    leitura VARCHAR(100) DEFAULT '',
    status ENUM('Normal','Atenção','Crítico') NOT NULL DEFAULT 'Normal',
    faixa VARCHAR(100) DEFAULT 'Não definida',
    atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS configuracoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    notificacoes TINYINT(1) NOT NULL DEFAULT 1,
    dark_mode TINYINT(1) NOT NULL DEFAULT 0,
    CONSTRAINT fk_config_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE
);

-- Senha dos usuários iniciais: 123456
INSERT IGNORE INTO usuarios (nome, usuario, email, senha, perfil) VALUES
('Administrador', 'admin', 'admin@ferro.com', '$2y$12$FkUPHIDhEkPuV1mspZKGYeYqVd5Ozkx9uEEzKpQ24Mi5B29.HczE2', 'Admin'),
('Carlos Silva', 'carlos', 'carlos@ferro.com', '$2y$12$FkUPHIDhEkPuV1mspZKGYeYqVd5Ozkx9uEEzKpQ24Mi5B29.HczE2', 'Operador'),
('Ana Souza', 'ana', 'ana@ferro.com', '$2y$12$FkUPHIDhEkPuV1mspZKGYeYqVd5Ozkx9uEEzKpQ24Mi5B29.HczE2', 'Técnico');

INSERT IGNORE INTO trens (codigo, nome, status, velocidade, localizacao, modelo, ano, capacidade, comprimento, peso) VALUES
('TR-204', 'Expresso Norte', 'Ativo', '82 km/h', 'Joinville', 'Expresso', 2025, '100 vagões', '1000 m', '1200 t'),
('TR-118', 'Carga Sul', 'Ativo', '76 km/h', 'Curitiba', 'Carga', 2024, '120 vagões', '1100 m', '1500 t'),
('TR-405', 'Pampa Express', 'Ativo', '66 km/h', 'Itajaí', 'Express', 2025, '80 vagões', '900 m', '1000 t'),
('TR-330', 'Expresso Oeste', 'Manutenção', '0 km/h', 'Porto Alegre', 'Carga', 2023, '100 vagões', '1000 m', '1300 t');

INSERT IGNORE INTO sensores (codigo, tipo, trem, leitura, status, faixa) VALUES
('TEMP-88', 'Temperatura', 'TR-204', '92 °C', 'Crítico', '60 °C a 80 °C'),
('TEMP-56', 'Temperatura', 'TR-204', '85 °C', 'Crítico', '60 °C a 80 °C'),
('VIB-12', 'Vibração', 'TR-118', '7,2 mm/s', 'Atenção', '0 a 6 mm/s'),
('PRESS-07', 'Pressão', 'TR-330', '4,8 bar', 'Normal', '4 a 6 bar');

INSERT IGNORE INTO configuracoes (usuario_id, notificacoes, dark_mode)
SELECT id, 1, 0 FROM usuarios;
