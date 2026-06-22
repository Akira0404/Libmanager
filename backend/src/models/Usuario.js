// Aqui é onde iremos colocar todas as operações que estão
// ligadas com a tabela "usuarios" no banco de dados

const pool = require('../config/database');

const Usuario = {

    // Busca um usuário pelo email
    async findByEmail(email) {
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );
        // Retorna o primeiro resultado ou null se não encontrar
        return rows[0] || null;
    },

    // Busca um usuário pelo ID (usado no middleware de autenticação)
    async findById(id) {
        const [rows] = await pool.query(
            'SELECT id, nome, email, created_at FROM usuarios WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    },

    // Cria um novo usuário no banco (usado no cadastro)
    async create({ nome, email, senha }) {
        const [result] = await pool.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senha]
        );
        // result.insertId é o ID que o MySQL gerou para o novo usuário
        return { id: result.insertId, nome, email };
    }
};

module.exports = Usuario;