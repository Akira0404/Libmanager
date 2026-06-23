const pool = require('../config/database');

const Livro = {

    // Lista todos os livros com quantidade disponível
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
                l.quantidade,
                l.capa_url,
                l.created_at,
                -- Calcula quantos estão emprestados no momento
                COALESCE(
                    (SELECT COUNT(*) FROM emprestimos e
                     WHERE e.livro_id = l.id AND e.status = 'emprestado'),
                    0
                ) AS emprestados,
                -- Quantidade disponível = total - emprestados
                (l.quantidade - COALESCE(
                    (SELECT COUNT(*) FROM emprestimos e
                     WHERE e.livro_id = l.id AND e.status = 'emprestado'),
                    0
                )) AS disponivel
            FROM livros l
            INNER JOIN categorias c ON l.categoria_id = c.id
            ORDER BY l.titulo ASC
        `);
        return rows;
    },

    async findById(id) {
        const [rows] = await pool.query(`
            SELECT l.*, c.nome AS categoria_nome,
                COALESCE(
                    (SELECT COUNT(*) FROM emprestimos e
                     WHERE e.livro_id = l.id AND e.status = 'emprestado'),
                    0
                ) AS emprestados,
                (l.quantidade - COALESCE(
                    (SELECT COUNT(*) FROM emprestimos e
                     WHERE e.livro_id = l.id AND e.status = 'emprestado'),
                    0
                )) AS disponivel
            FROM livros l
            INNER JOIN categorias c ON l.categoria_id = c.id
            WHERE l.id = ?
        `, [id]);
        return rows[0] || null;
    },

    async create({ titulo, autor, isbn, ano_publicacao, categoria_id, quantidade, capa_url }) {
        const [result] = await pool.query(
            `INSERT INTO livros (titulo, autor, isbn, ano_publicacao, categoria_id, quantidade, capa_url)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [titulo, autor, isbn || null, ano_publicacao || null, categoria_id, quantidade || 1, capa_url || null]
        );
        return { id: result.insertId, titulo, autor };
    },

    async delete(id) {
        const [result] = await pool.query('DELETE FROM livros WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Livro;