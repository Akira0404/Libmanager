const Livro = require('../models/Livro');
const Categoria = require('../models/Categoria');
const { z } = require('zod');

const livroSchema = z.object({
    titulo: z.string().min(1, 'O título é obrigatório').max(200),
    autor: z.string().min(1, 'O autor é obrigatório').max(150),
    isbn: z.string().max(20).optional().nullable(),
    ano_publicacao: z.number().int().optional().nullable(),
    categoria_id: z.number().int().positive('Selecione uma categoria'),
    quantidade: z.number().int().min(1, 'Mínimo 1 cópia').optional(),
    capa_url: z.string().url().optional().nullable()
});

const livroController = {

    async listar(req, res) {
        try {
            const livros = await Livro.findAll();
            return res.status(200).json(livros);
        } catch (error) {
            console.error('Erro ao listar livros:', error);
            return res.status(500).json({ erro: 'Erro interno do servidor' });
        }
    },

    async listarCategorias(req, res) {
        try {
            const categorias = await Categoria.findAll();
            return res.status(200).json(categorias);
        } catch (error) {
            console.error('Erro ao listar categorias:', error);
            return res.status(500).json({ erro: 'Erro interno do servidor' });
        }
    },

    async criar(req, res) {
        try {
            const dados = livroSchema.parse({
                ...req.body,
                categoria_id: Number(req.body.categoria_id),
                quantidade: req.body.quantidade ? Number(req.body.quantidade) : 1,
                ano_publicacao: req.body.ano_publicacao ? Number(req.body.ano_publicacao) : null
            });

            const novoLivro = await Livro.create(dados);
            return res.status(201).json({
                mensagem: 'Livro cadastrado com sucesso!',
                livro: novoLivro
            });
        } catch (error) {
            if (error.name === 'ZodError') {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: error.issues.map(i => i.message)
                });
            }
            console.error('Erro ao cadastrar livro:', error);
            return res.status(500).json({ erro: 'Erro interno do servidor' });
        }
    },

    async deletar(req, res) {
        try {
            const deletado = await Livro.delete(req.params.id);
            if (!deletado) {
                return res.status(404).json({ erro: 'Livro não encontrado' });
            }
            return res.status(200).json({ mensagem: 'Livro deletado com sucesso!' });
        } catch (error) {
            console.error('Erro ao deletar livro:', error);
            return res.status(500).json({ erro: 'Erro interno do servidor' });
        }
    }
};

module.exports = livroController;