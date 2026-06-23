// =============================================
// Model: Empréstimo
// =============================================
// Usa INNER JOIN para trazer dados do leitor
// (nome, CPF, email) e do livro (título) junto
// com os dados do empréstimo.
// =============================================

const pool = require('../config/database');

const Emprestimo = {

    // Lista todos os empréstimos com dados do leitor e livro
    async findAll() {
        const [rows] = await pool.query(`
            SELECT
                e.id,
                l.id AS leitor_id,
                l.nome_completo AS leitor_nome,
                l.cpf AS leitor_cpf,
                l.email AS leitor_email,
                lv.id AS livro_id,
                lv.titulo AS livro_titulo,
                lv.autor AS livro_autor,
                e.data_emprestimo,
                e.data_devolucao_prevista,
                e.data_devolucao_real,
                e.status
            FROM emprestimos e
            INNER JOIN leitores l ON e.leitor_id = l.id
            INNER JOIN livros lv ON e.livro_id = lv.id
            ORDER BY e.created_at DESC
        `);
        return rows;
    },

    // Cria um novo empréstimo
    async create({ leitor_id, livro_id, data_emprestimo, data_devolucao_prevista }) {
        const [result] = await pool.query(
            `INSERT INTO emprestimos
                (leitor_id, livro_id, data_emprestimo, data_devolucao_prevista)
             VALUES (?, ?, ?, ?)`,
            [leitor_id, livro_id, data_emprestimo, data_devolucao_prevista]
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