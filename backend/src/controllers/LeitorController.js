const Leitor = require('../models/Leitor');
const { z } = require('zod');

const leitorSchema = z.object({
    nome_completo: z.string()
        .min(3, 'O nome deve ter pelo menos 3 caracteres')
        .max(150),
    cpf: z.string()
        .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido. Use: 000.000.000-00'),
    email: z.string()
        .email('Email inválido'),
    telefone: z.string()
        .max(20)
        .optional()
        .nullable()
});

const leitorController = {

    // =============================================
    // GET /api/leitores
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
    // Recebe multipart/form-data (foto + dados)
    // =============================================
    async criar(req, res) {
        try {
            const dados = leitorSchema.parse({
                nome_completo: req.body.nome_completo,
                cpf: req.body.cpf,
                email: req.body.email,
                telefone: req.body.telefone || null
            });

            // Verifica CPF duplicado
            const leitorExistente = await Leitor.findByCpf(dados.cpf);
            if (leitorExistente) {
                return res.status(409).json({
                    erro: 'Já existe um leitor cadastrado com este CPF'
                });
            }

            // Se enviou foto, pega o caminho do arquivo
            // req.file é preenchido pelo multer
            const foto = req.file ? `/uploads/${req.file.filename}` : null;

            const novoLeitor = await Leitor.create({
                ...dados,
                foto
            });

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