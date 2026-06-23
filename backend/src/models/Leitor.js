// =============================================
// Model: Leitor
// =============================================
// Responsável por todas as operações na tabela
// "leitores". Leitores são as pessoas que
// alugam livros no sistema (diferente de usuarios
// que são os bibliotecários que fazem login).
// =============================================

const pool = require('../config/database');

const Leitor = {

    // Lista todos os leitores cadastrados
    async findAll() {
        const [rows] = await pool.query(
            'SELECT * FROM leitores ORDER BY created_at DESC'
        );
        return rows;
    },

    // Busca um leitor pelo CPF (pra verificar duplicata)
    async findByCpf(cpf) {
        const [rows] = await pool.query(
            'SELECT * FROM leitores WHERE cpf = ?',
            [cpf]
        );
        return rows[0] || null;
    },

    // Busca um leitor pelo ID
    async findById(id) {
        const [rows] = await pool.query(
            'SELECT * FROM leitores WHERE id = ?',
            [id]
        );
        return rows[0] || null;
    },

    // Cria um novo leitor
    async create({ nome_completo, cpf, email, telefone }) {
        const [result] = await pool.query(
            'INSERT INTO leitores (nome_completo, cpf, email, telefone) VALUES (?, ?, ?, ?)',
            [nome_completo, cpf, email, telefone || null]
        );
        return { id: result.insertId, nome_completo, cpf, email };
    },

    // Deleta um leitor
    async delete(id) {
        const [result] = await pool.query(
            'DELETE FROM leitores WHERE id = ?',
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Leitor;