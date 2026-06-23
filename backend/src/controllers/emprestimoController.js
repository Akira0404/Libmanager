// =============================================
// Controller: Empréstimos
// =============================================

const Emprestimo = require('../models/Emprestimo');
const { z } = require('zod');

// Schema de validação
const emprestimoSchema = z.object({
    leitor_id: z.number().int().positive('Selecione um leitor'),
    livro_id: z.number().int().positive('Selecione um livro'),
    data_emprestimo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de empréstimo inválida'),
    data_devolucao_prevista: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de devolução inválida')
});

const emprestimoController = {

    // =============================================
    // GET /api/emprestimos
    // =============================================
    async listar(req, res) {
        try {
            const emprestimos = await Emprestimo.findAll();
            return res.status(200).json(emprestimos);
        } catch (error) {
            console.error('Erro ao listar empréstimos:', error);
            return res.status(500).json({ erro: 'Erro interno do servidor' });
        }
    },

    // =============================================
    // POST /api/emprestimos
    // =============================================
    async criar(req, res) {
        try {
            const dados = emprestimoSchema.parse({
                ...req.body,
                leitor_id: Number(req.body.leitor_id),
                livro_id: Number(req.body.livro_id)
            });

            const novoEmprestimo = await Emprestimo.create(dados);

            return res.status(201).json({
                mensagem: 'Empréstimo registrado com sucesso!',
                emprestimo: novoEmprestimo
            });
        } catch (error) {
            if (error.name === 'ZodError') {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: error.issues.map(i => i.message)
                });
            }
            console.error('Erro ao criar empréstimo:', error);
            return res.status(500).json({ erro: 'Erro interno do servidor' });
        }
    },

    // =============================================
    // PUT /api/emprestimos/:id/devolver
    // =============================================
    async devolver(req, res) {
        try {
            const devolvido = await Emprestimo.devolver(req.params.id);

            if (!devolvido) {
                return res.status(404).json({
                    erro: 'Empréstimo não encontrado ou já devolvido'
                });
            }

            return res.status(200).json({
                mensagem: 'Livro devolvido com sucesso!'
            });
        } catch (error) {
            console.error('Erro ao devolver:', error);
            return res.status(500).json({ erro: 'Erro interno do servidor' });
        }
    }
};

module.exports = emprestimoController;