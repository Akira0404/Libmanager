const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const emprestimoRoutes = require('./routes/emprestimoRoutes');
const livroRoutes = require('./routes/livroRoutes'); // ← NOVA LINHA

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/emprestimos', emprestimoRoutes);
app.use('/api/livros', livroRoutes); // ← NOVA LINHA

app.get('/', (req, res) => {
    res.json({ mensagem: 'LibManager API está rodando!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});