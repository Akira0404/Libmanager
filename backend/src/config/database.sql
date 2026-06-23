-- =============================================
-- LibManager - Script completo do banco de dados
-- =============================================

-- Cria o banco
CREATE DATABASE IF NOT EXISTS libmanager;
USE libmanager;

-- =============================================
-- Tabela de CATEGORIAS
-- =============================================
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Tabela de USUÁRIOS (bibliotecários)
-- =============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Tabela de LIVROS
-- Relacionamento 1:N com categorias
-- =============================================
CREATE TABLE IF NOT EXISTS livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(150) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    ano_publicacao SMALLINT DEFAULT NULL,
    categoria_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_livro_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- =============================================
-- Tabela de LEITORES
-- =============================================
CREATE TABLE IF NOT EXISTS leitores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL,
    telefone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Tabela de EMPRÉSTIMOS
-- Relacionamento N:1 com leitores e livros
-- =============================================
CREATE TABLE IF NOT EXISTS emprestimos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    leitor_id INT NOT NULL,
    livro_id INT NOT NULL,
    data_emprestimo DATE NOT NULL,
    data_devolucao_prevista DATE NOT NULL,
    data_devolucao_real DATE DEFAULT NULL,
    status ENUM('emprestado', 'devolvido') DEFAULT 'emprestado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_emprestimo_leitor
        FOREIGN KEY (leitor_id) REFERENCES leitores(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_emprestimo_livro
        FOREIGN KEY (livro_id) REFERENCES livros(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- =============================================
-- DADOS DE TESTE
-- =============================================

-- Categorias
INSERT INTO categorias (nome) VALUES
('Programação'),('Ficção'),('História'),('Romance'),('Ciência'),
('Tecnologia'),('Biografia'),('Fantasia'),('Filosofia'),('Educação');

-- Livros
INSERT INTO livros (titulo, autor, isbn, ano_publicacao, categoria_id) VALUES
('Clean Code', 'Robert C. Martin', '978-0132350884', 2008, 1),
('Refactoring', 'Martin Fowler', '978-0134757599', 1999, 1),
('The Pragmatic Programmer', 'David Thomas', '978-0135957059', 1999, 1),
('Design Patterns', 'Gang of Four', '978-0201633610', 1994, 1),
('JavaScript: The Good Parts', 'Douglas Crockford', '978-0596517748', 2008, 1),
('1984', 'George Orwell', '978-0451524935', 1949, 2),
('Fahrenheit 451', 'Ray Bradbury', '978-1451673319', 1953, 2),
('Brave New World', 'Aldous Huxley', '978-0060850524', 1932, 2),
('Dom Casmurro', 'Machado de Assis', '978-8525407900', 1899, 4),
('O Cortiço', 'Aluísio Azevedo', '978-8525407917', 1890, 4),
('O Príncipe', 'Maquiavel', '978-8573263749', 1532, 3),
('Sapiens', 'Yuval Noah Harari', '978-0062316097', 2011, 3),
('Harry Potter e a Pedra Filosofal', 'J.K. Rowling', '978-0747532699', 1997, 8),
('O Senhor dos Anéis', 'J.R.R. Tolkien', '978-0618640157', 1954, 8),
('As Crônicas de Nárnia', 'C.S. Lewis', '978-0060234812', 1950, 8),
('Uma Breve História do Tempo', 'Stephen Hawking', '978-0553380163', 1988, 5),
('O Gene Egoísta', 'Richard Dawkins', '978-0198788607', 1976, 5),
('Steve Jobs', 'Walter Isaacson', '978-1451648539', 2011, 7),
('Elon Musk', 'Walter Isaacson', '978-1982181284', 2023, 7),
('Inteligência Artificial', 'Stuart Russell', '978-0136042594', 2020, 6),
('O Mundo de Sofia', 'Jostein Gaarder', '978-8532507204', 1991, 9),
('Meditações', 'Marco Aurélio', '978-8525432605', 180, 9),
('Pedagogia do Oprimido', 'Paulo Freire', '978-8577531646', 1968, 10),
('A Arte da Guerra', 'Sun Tzu', '978-8543100296', 500, 3),
('Orgulho e Preconceito', 'Jane Austen', '978-0141439518', 1813, 4);

-- Leitores
INSERT INTO leitores (nome_completo, cpf, email, telefone) VALUES
('Maria Silva', '123.456.789-00', 'maria.silva@email.com', '(11) 99999-1111'),
('João Santos', '234.567.890-11', 'joao.santos@email.com', '(11) 99999-2222'),
('Ana Oliveira', '345.678.901-22', 'ana.oliveira@email.com', '(11) 99999-3333'),
('Pedro Costa', '456.789.012-33', 'pedro.costa@email.com', '(21) 98888-4444'),
('Juliana Souza', '567.890.123-44', 'juliana.souza@email.com', '(21) 98888-5555'),
('Lucas Pereira', '678.901.234-55', 'lucas.pereira@email.com', '(31) 97777-6666'),
('Carla Mendes', '789.012.345-66', 'carla.mendes@email.com', '(31) 97777-7777'),
('Rafael Lima', '890.123.456-77', 'rafael.lima@email.com', '(41) 96666-8888'),
('Fernanda Alves', '901.234.567-88', 'fernanda.alves@email.com', '(41) 96666-9999'),
('Bruno Rocha', '012.345.678-99', 'bruno.rocha@email.com', '(51) 95555-0000'),
('Camila Ferreira', '111.222.333-44', 'camila.ferreira@email.com', '(51) 95555-1111'),
('Thiago Barbosa', '222.333.444-55', 'thiago.barbosa@email.com', '(61) 94444-2222');

-- Empréstimos
INSERT INTO emprestimos (leitor_id, livro_id, data_emprestimo, data_devolucao_prevista, status) VALUES
(1, 1, '2025-06-01', '2025-07-01', 'emprestado'),
(1, 13, '2025-06-05', '2025-07-05', 'emprestado'),
(2, 6, '2025-05-15', '2025-06-15', 'emprestado'),
(2, 16, '2025-05-20', '2025-06-20', 'emprestado'),
(3, 9, '2025-06-10', '2025-07-10', 'emprestado'),
(4, 3, '2025-05-01', '2025-06-01', 'devolvido'),
(4, 12, '2025-06-12', '2025-07-12', 'emprestado'),
(5, 18, '2025-06-15', '2025-07-15', 'emprestado'),
(6, 4, '2025-04-20', '2025-05-20', 'devolvido'),
(6, 20, '2025-06-18', '2025-07-18', 'emprestado'),
(7, 14, '2025-06-01', '2025-07-01', 'emprestado'),
(8, 21, '2025-05-10', '2025-06-10', 'devolvido'),
(9, 10, '2025-06-20', '2025-07-20', 'emprestado'),
(10, 24, '2025-06-22', '2025-07-22', 'emprestado'),
(11, 7, '2025-05-05', '2025-06-05', 'devolvido'),
(12, 2, '2025-06-23', '2025-07-23', 'emprestado');