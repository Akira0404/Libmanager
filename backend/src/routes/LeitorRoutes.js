// =============================================
// Rotas: Leitores
// =============================================

const express = require('express');
const router = express.Router();
const leitorController = require('../controllers/leitorController');
const autenticar = require('../middlewares/authMiddleware');

// GET /api/leitores → Lista todos (protegido)
router.get('/', autenticar, leitorController.listar);

// POST /api/leitores → Cadastra novo leitor (protegido)
router.post('/', autenticar, leitorController.criar);

// DELETE /api/leitores/:id → Deleta leitor (protegido)
router.delete('/:id', autenticar, leitorController.deletar);

module.exports = router;