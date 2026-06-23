const pool = require('../config/database');

const Emprestimo = {

    // Lista todos os empréstimos com dados do
    // usuário e do livro (INNER JOIN)
    async findAll() {
        const [rows] = await pool.query(`
            SELECT
                e.id,
                u.nome AS usuario_nome,
                l.titulo AS livro_titulo,
                e.data_emprestimo,
                e.data_devolucao_prevista,
                e.data_devolucao_real,
                e.status
            FROM emprestimos e
            INNER JOIN usuarios u ON e.usuario_id = u.id
            INNER JOIN livros l ON e.livro_id = l.id
            ORDER BY e.created_at DESC
        `);
        return rows;
    },

    // Busca um empréstimo pelo ID
    async findById(id) {
        const [rows] = await pool.query(`
            SELECT
                e.id,
                u.nome AS usuario_nome,
                l.titulo AS livro_titulo,
                e.data_emprestimo,
                e.data_devolucao_prevista,
                e.data_devolucao_real,
                e.status
            FROM emprestimos e
            INNER JOIN usuarios u ON e.usuario_id = u.id
            INNER JOIN livros l ON e.livro_id = l.id
            WHERE e.id = ?
        `, [id]);
        return rows[0] || null;
    },

    // Cria um novo empréstimo
    async create({ usuario_id, livro_id, data_emprestimo, data_devolucao_prevista }) {
        const [result] = await pool.query(
            `INSERT INTO emprestimos
                (usuario_id, livro_id, data_emprestimo, data_devolucao_prevista)
             VALUES (?, ?, ?, ?)`,
            [usuario_id, livro_id, data_emprestimo, data_devolucao_prevista]
        );
        return { id: result.insertId };
    },

    // Registra a devolução de um livro
    async devolver(id) {
        const [result] = await pool.query(
            `UPDATE emprestimos
             SET status = 'devolvido', data_devolucao_real = CURDATE()
             WHERE id = ? AND status = 'emprestado'`,
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Emprestimo;