// Model: Categoria
// Busca as categorias do banco para popular
// o select (dropdown) do formulário de livros.

const pool = require('../config/database');

const Categoria = {

    // Lista todas as categorias cadastradas
    async findAll() {
        const [rows] = await pool.query('SELECT * FROM categorias ORDER BY nome');
        return rows;
    },

    // Busca uma categoria pelo ID
    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM categorias WHERE id = ?', [id]);
        return rows[0] || null;
    },

    // Cria uma nova categoria
    async create({ nome }) {
        const [result] = await pool.query('INSERT INTO categorias (nome) VALUES (?)', [nome]);
        return { id: result.insertId, nome };
    }
};

module.exports = Categoria;