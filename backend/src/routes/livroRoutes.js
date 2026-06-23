
// Rotas: Livros
// Define os endpoints da API para operações
// com livros. Rotas de leitura são públicas,
// rotas de escrita são protegidas pelo JWT.

const express = require('express');
const router = express.Router();
const livroController = require('../controllers/livroController');
const autenticar = require('../middlewares/authMiddleware');

// GET /api/livros → Lista todos (protegido)
router.get('/', autenticar, livroController.listar);

// GET /api/livros/categorias → Lista categorias (protegido)
router.get('/categorias', autenticar, livroController.listarCategorias);

// POST /api/livros → Cadastra novo livro (protegido)
router.post('/', autenticar, livroController.criar);

// DELETE /api/livros/:id → Deleta livro (protegido)
router.delete('/:id', autenticar, livroController.deletar);

module.exports = router;