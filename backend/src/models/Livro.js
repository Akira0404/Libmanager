// Model: Livro
// Responsável por todas as operações na tabela
// "livros". Usa INNER JOIN para trazer o nome
// da categoria junto com os dados do livro.

const pool = require('../config/database');

const Livro = {

    // Lista todos os livros com o nome da categoria
    async findAll() {
        const [rows] = await pool.query(`
            SELECT
                l.id,
                l.titulo,
                l.autor,
                l.isbn,
                l.ano_publicacao,
                l.categoria_id,
                c.nome AS categoria_nome,
                l.created_at
            FROM livros l
            INNER JOIN categorias c ON l.categoria_id = c.id
            ORDER BY l.created_at DESC
        `);
        return rows;
    },

    // Busca um livro pelo ID
    async findById(id) {
        const [rows] = await pool.query(`
            SELECT
                l.id,
                l.titulo,
                l.autor,
                l.isbn,
                l.ano_publicacao,
                l.categoria_id,
                c.nome AS categoria_nome,
                l.created_at
            FROM livros l
            INNER JOIN categorias c ON l.categoria_id = c.id
            WHERE l.id = ?
        `, [id]);
        return rows[0] || null;
    },

    // Cria um novo livro
    async create({ titulo, autor, isbn, ano_publicacao, categoria_id }) {
        const [result] = await pool.query(
            'INSERT INTO livros (titulo, autor, isbn, ano_publicacao, categoria_id) VALUES (?, ?, ?, ?, ?)',
            [titulo, autor, isbn || null, ano_publicacao || null, categoria_id]
        );
        return { id: result.insertId, titulo, autor };
    },

    // Deleta um livro
    async delete(id) {
        const [result] = await pool.query('DELETE FROM livros WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Livro;