// =============================================
// Rotas: Empréstimos
// =============================================
// Define os endpoints da API para operações
// de empréstimo. Todas as rotas são protegidas
// pelo middleware de autenticação JWT.
// =============================================

const express = require('express');
const router = express.Router();
const emprestimoController = require('../controllers/emprestimoController');
const autenticar = require('../middlewares/authMiddleware');

// GET /api/emprestimos → Lista todos (protegido)
router.get('/', autenticar, emprestimoController.listar);

// POST /api/emprestimos → Cria novo empréstimo (protegido)
router.post('/', autenticar, emprestimoController.criar);

// PUT /api/emprestimos/:id/devolver → Devolve livro (protegido)
router.put('/:id/devolver', autenticar, emprestimoController.devolver);

module.exports = router;