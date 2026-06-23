const pool = require('../config/database');

const Emprestimo = {

    async findAll() {
        const [rows] = await pool.query(`
            SELECT
                e.id,
                le.id AS leitor_id,
                le.nome_completo AS leitor_nome,
                le.cpf AS leitor_cpf,
                le.email AS leitor_email,
                le.foto AS leitor_foto,
                lv.id AS livro_id,
                lv.titulo AS livro_titulo,
                lv.autor AS livro_autor,
                lv.capa_url AS livro_capa,
                e.data_emprestimo,
                e.data_devolucao_prevista,
                e.data_devolucao_real,
                e.status
            FROM emprestimos e
            INNER JOIN leitores le ON e.leitor_id = le.id
            INNER JOIN livros lv ON e.livro_id = lv.id
            ORDER BY e.created_at DESC
        `);
        return rows;
    },

    async create({ leitor_id, livro_id, data_emprestimo, data_devolucao_prevista }) {
        const [result] = await pool.query(
            `INSERT INTO emprestimos (leitor_id, livro_id, data_emprestimo, data_devolucao_prevista) VALUES (?, ?, ?, ?)`,
            [leitor_id, livro_id, data_emprestimo, data_devolucao_prevista]
        );
        return { id: result.insertId };
    },

    async devolver(id) {
        const [result] = await pool.query(
            `UPDATE emprestimos SET status = 'devolvido', data_devolucao_real = CURDATE() WHERE id = ? AND status = 'emprestado'`,
            [id]
        );
        return result.affectedRows > 0;
    }
};

module.exports = Emprestimo;