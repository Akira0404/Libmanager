// =============================================
// Controller: Leitores
// =============================================
// Gerencia as operações de leitores: listar,
// cadastrar novo e deletar.
// =============================================

const Leitor = require('../models/Leitor');
const { z } = require('zod');

// Schema de validação com Zod
const leitorSchema = z.object({
    nome_completo: z.string()
        .min(3, 'O nome deve ter pelo menos 3 caracteres')
        .max(150, 'O nome deve ter no máximo 150 caracteres'),
    cpf: z.string()
        .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido. Use o formato: 000.000.000-00'),
    email: z.string()
        .email('Email inválido'),
    telefone: z.string()
        .max(20, 'Telefone muito longo')
        .optional()
        .nullable()
});

const leitorController = {

    // =============================================
    // GET /api/leitores
    // Lista todos os leitores
    // =============================================
    async listar(req, res) {
        try {
            const leitores = await Leitor.findAll();
            return res.status(200).json(leitores);
        } catch (error) {
            console.error('Erro ao listar leitores:', error);
            return res.status(500).json({ erro: 'Erro interno do servidor' });
        }
    },

    // =============================================
    // POST /api/leitores
    // Cadastra um novo leitor
    // =============================================
    async criar(req, res) {
        try {
            // Valida os dados com Zod
            const dados = leitorSchema.parse(req.body);

            // Verifica se já existe alguém com esse CPF
            const leitorExistente = await Leitor.findByCpf(dados.cpf);
            if (leitorExistente) {
                return res.status(409).json({
                    erro: 'Já existe um leitor cadastrado com este CPF'
                });
            }

            const novoLeitor = await Leitor.create(dados);

            return res.status(201).json({
                mensagem: 'Leitor cadastrado com sucesso!',
                leitor: novoLeitor
            });
        } catch (error) {
            if (error.name === 'ZodError') {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: error.issues.map(i => i.message)
                });
            }
            console.error('Erro ao cadastrar leitor:', error);
            return res.status(500).json({ erro: 'Erro interno do servidor' });
        }
    },

    // =============================================
    // DELETE /api/leitores/:id
    // Deleta um leitor
    // =============================================
    async deletar(req, res) {
        try {
            const deletado = await Leitor.delete(req.params.id);
            if (!deletado) {
                return res.status(404).json({ erro: 'Leitor não encontrado' });
            }
            return res.status(200).json({ mensagem: 'Leitor deletado com sucesso!' });
        } catch (error) {
            console.error('Erro ao deletar leitor:', error);
            return res.status(500).json({ erro: 'Erro interno do servidor' });
        }
    }
};

module.exports = leitorController;