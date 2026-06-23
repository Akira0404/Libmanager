const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
    const headerAuth = req.headers.authorization;
    if (!headerAuth) {
        return res.status(401).json({ erro: 'Token não fornecido. Faça login primeiro.' });
    }
    const token = headerAuth.split(' ')[1];
    if (!token) {
        return res.status(401).json({ erro: 'Token mal formatado.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ erro: 'Token expirado. Faça login novamente.' });
        }
        return res.status(401).json({ erro: 'Token inválido.' });
    }
}

module.exports = autenticar;