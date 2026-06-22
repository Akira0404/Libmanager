// Validador: Autenticação (Cadastro e Login)

// O zod ele verifica os dados antes de envia-los para o banco.
// Se o usuário escrever alguma coisa com menos de 3 caracteres ele vai
// barrar antes de enviar esses dados para o banco.
// Ex: usuario escreveu: "Bi", zod responde: "O nome deve ter pelo menos 3 caracteres" e não
// envia esses dados para o banco.


const { z } = require('zod');

// Schema de CADASTRO: aqui ele está definindo as regras de cadastros
const cadastroSchema = z.object({
    nome: z.string()
        .min(3, 'O nome deve ter pelo menos 3 caracteres')
        .max(100, 'O nome deve ter no máximo 100 caracteres'),

    email: z.string()
        .email('Email inválido'),  // Valida formato automaticamente

    senha: z.string()
        .min(6, 'A senha deve ter pelo menos 6 caracteres')
        .max(50, 'A senha deve ter no máximo 50 caracteres')
});

// Schema de LOGIN: define as regras para fazer login
const loginSchema = z.object({
    email: z.string()
        .email('Email inválido'),

    senha: z.string()
        .min(1, 'A senha é obrigatória')
});

// Exporta os dois schemas para usar nas rotas
module.exports = { cadastroSchema, loginSchema };