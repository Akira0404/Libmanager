// =============================================
// Middleware: Upload de Fotos
// =============================================
// Usa o Multer para processar upload de imagens.
// Salva os arquivos na pasta "uploads" com um
// nome único (timestamp + extensão original).
// =============================================

const multer = require('multer');
const path = require('path');

// Configuração de onde e como salvar o arquivo
const storage = multer.diskStorage({
    // Pasta onde o arquivo será salvo
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads'));
    },

    // Nome do arquivo: timestamp + extensão original
    // Exemplo: 1719182400000.jpg
    filename: function (req, file, cb) {
        const extensao = path.extname(file.originalname);
        const nomeArquivo = `${Date.now()}${extensao}`;
        cb(null, nomeArquivo);
    }
});

// Filtro: aceita apenas imagens
const fileFilter = function (req, file, cb) {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

    if (tiposPermitidos.includes(file.mimetype)) {
        cb(null, true); // Aceita o arquivo
    } else {
        cb(new Error('Tipo de arquivo não permitido. Envie uma imagem (JPG, PNG ou WEBP).'), false);
    }
};

// Cria o middleware com as configurações
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Máximo 5MB
    }
});

module.exports = upload;