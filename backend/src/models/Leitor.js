const pool = require('../config/database');

const Leitor = {

    async findAll() {
        const [rows] = await pool.query('SELECT * FROM leitores ORDER BY created_at DESC');
        return rows;
    },

    async findByCpf(cpf) {
        const [rows] = await pool.query('SELECT * FROM leitores WHERE cpf = ?', [cpf]);
        return rows[0] || null;
    },

    async findById(id) {
        const [rows] = await pool.query('SELECT * FROM leitores WHERE id = ?', [id]);
        return rows[0] || null;
    },

    async create({ nome_completo, cpf, email, telefone, foto }) {
        const [result] = await pool.query(
            'INSERT INTO leitores (nome_completo, cpf, email, telefone, foto) VALUES (?, ?, ?, ?, ?)',
            [nome_completo, cpf, email, telefone || null, foto || null]
        );
        return { id: result.insertId, nome_completo, cpf, email, foto };
    },

    async delete(id) {
        const [result] = await pool.query('DELETE FROM leitores WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = Leitor;