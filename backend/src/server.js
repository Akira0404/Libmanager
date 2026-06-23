const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const emprestimoRoutes = require('./routes/emprestimoRoutes');
const livroRoutes = require('./routes/livroRoutes');
const leitorRoutes = require('./routes/leitorRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// =============================================
// Serve as fotos da pasta "uploads"
// Quando o frontend pedir /uploads/foto.jpg,
// o servidor retorna a imagem
// =============================================
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/emprestimos', emprestimoRoutes);
app.use('/api/livros', livroRoutes);
app.use('/api/leitores', leitorRoutes);

app.get('/', (req, res) => {
    res.json({ mensagem: 'LibManager API está rodando!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});