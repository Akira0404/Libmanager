const express = require('express');
const router = express.Router();
const leitorController = require('../controllers/leitorController');
const autenticar = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// GET /api/leitores → Lista todos
router.get('/', autenticar, leitorController.listar);

// POST /api/leitores → Cadastra com foto
// upload.single('foto') processa UM arquivo chamado "foto"
router.post('/', autenticar, upload.single('foto'), leitorController.criar);

// DELETE /api/leitores/:id → Deleta
router.delete('/:id', autenticar, leitorController.deletar);

module.exports = router;