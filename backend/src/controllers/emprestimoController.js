// Controller: Empréstimos

// Gerencia as operações de empréstimo de livros:
// listar todos, criar novo e registrar devolução.

const Emprestimo = require('../models/Emprestimo');
const { z } = require('zod');

// Schema de validação para criar empréstimo
const emprestimoSchema = z.object({
    usuario_id: z.number().int().positive('ID do usuário é obrigatório'),
    livro_id: z.number().int().positive('ID do livro é obrigatório'),
    data_emprestimo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (use AAAA-MM-DD)'),
    data_devolucao_prevista: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (use AAAA-MM-DD)')
});

const emprestimoController = {

    // GET /api/emprestimos
    // Lista todos os empréstimos com dados do
    // usuário e livro (via INNER JOIN)
    async listar(req, res) {
        try {
            const emprestimos = await Emprestimo.findAll();
            return res.status(200).json(emprestimos);
        } catch (error) {
            console.error('Erro ao listar empréstimos:', error);
            return res.status(500).json({ erro: 'Erro interno do servidor' });
        }
    },

    // POST /api/emprestimos
    // Cria um novo empréstimo
    async criar(req, res) {
        try {
            const dados = emprestimoSchema.parse({
                ...req.body,
                usuario_id: Number(req.body.usuario_id),
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

    // PUT /api/emprestimos/:id/devolver
    // Registra a devolução de um livro
    async devolver(req, res) {
        try {
            const { id } = req.params;
            const devolvido = await Emprestimo.devolver(id);

            if (!devolvido) {
                return res.status(404).json({
                    erro: 'Empréstimo não encontrado ou já devolvido'
                });
            }

            return res.status(200).json({
                mensagem: 'Livro devolvido com sucesso!'
            });
        } catch (error) {
            console.error('Erro ao devolver livro:', error);
            return res.status(500).json({ erro: 'Erro interno do servidor' });
        }
    }
};

module.exports = emprestimoController;