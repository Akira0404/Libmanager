
CREATE DATABASE IF NOT EXISTS libmanager;

USE libmanager;


CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,        
    nome VARCHAR(100) NOT NULL UNIQUE,        
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);


CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,        
    nome VARCHAR(100) NOT NULL,               
    email VARCHAR(150) NOT NULL UNIQUE,       
    senha VARCHAR(255) NOT NULL,              
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);


CREATE TABLE IF NOT EXISTS livros (
    id INT AUTO_INCREMENT PRIMARY KEY,        
    titulo VARCHAR(200) NOT NULL,             
    autor VARCHAR(150) NOT NULL,              
    isbn VARCHAR(20) UNIQUE,                  
    ano_publicacao YEAR,                     
    categoria_id INT NOT NULL,                
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  

   
    CONSTRAINT fk_livro_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
        ON DELETE RESTRICT  -- Impede deletar uma categoria que tenha livros
        ON UPDATE CASCADE   -- Se o ID da categoria mudar, atualiza aqui também
);
