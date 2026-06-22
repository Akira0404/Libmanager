// Controller: Autenticação (Cadastro e Login)

// O Controller recebe as requisições HTTP,
// valida os dados, aplica as regras de negócio
// e retorna a resposta ao cliente.
// recebe → valida → processa → responde.

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { cadastroSchema, loginSchema } = require('../validators/authValidator');

// Quantas vezes o algoritmo de hash "embaralha" a senha
// Quanto maior, mais seguro (mas mais lento).
const SALT_ROUNDS = 10;

const authController = {

    // Rota: POST /api/auth/cadastro
    // Função: Registra um novo usuário no sistema

    async cadastro(req, res) {
        try {
            // 1) VALIDAÇÃO: Verifica se os dados enviados estão corretos
            const dadosValidados = cadastroSchema.parse(req.body);

            // 2) VERIFICAÇÃO: Já existe alguém com esse email?
            const usuarioExistente = await Usuario.findByEmail(dadosValidados.email);
            if (usuarioExistente) {
                // 409 = (conflito: recurso já existe)
                return res.status(409).json({
                    erro: 'Este email já está cadastrado'
                });
            }

            // 3) CRIPTOGRAFIA: Transforma a senha em hash
            // Exemplo: "minhasenha123" vira "$2b$10$X7kB3F..."
            const senhaCriptografada = await bcrypt.hash(
                dadosValidados.senha,
                SALT_ROUNDS
            );

            // 4) CRIAÇÃO: Salva o usuário no banco com a senha já criptografada
            const novoUsuario = await Usuario.create({
                nome: dadosValidados.nome,
                email: dadosValidados.email,
                senha: senhaCriptografada
            });

            // 5) SUCESSO: Retorna o usuário criado (sem a senha!)
            // 201 = Created (recurso criado com sucesso)
            return res.status(201).json({
                mensagem: 'Usuário cadastrado com sucesso!',
                usuario: novoUsuario
            });

        } catch (error) {
            // Se o Zod rejeitou os dados, error.issues terá os detalhes
            if (error.name === 'ZodError') {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: error.issues.map(i => i.message)
                });
            }

            // Erro inesperado do servidor
            console.error('Erro no cadastro:', error);
            return res.status(500).json({
                erro: 'Erro interno do servidor'
            });
        }
    },

    // ==========================================
    // Rota: POST /api/auth/login
    // Função: Autentica um usuário e retorna um token JWT
    // ==========================================
    async login(req, res) {
        try {
            // 1) VALIDAÇÃO: Verifica se email e senha foram enviados
            const dadosValidados = loginSchema.parse(req.body);

            // 2) BUSCA: Procura o usuário pelo email no banco
            const usuario = await Usuario.findByEmail(dadosValidados.email);
            if (!usuario) {
                // 401 = Unauthorized (não autorizado)
                // Retornamos "Email ou senha incorretos" em vez de
                // "Email não encontrado" por segurança
                // (não queremos revelar quais emails existem no sistema)
                return res.status(401).json({
                    erro: 'Email ou senha incorretos'
                });
            }

            // 3) COMPARAÇÃO: A senha enviada bate com a do banco?
            // bcrypt.compare descriptografa e compara automaticamente
            const senhaCorreta = await bcrypt.compare(
                dadosValidados.senha,    // Senha que o usuário digitou
                usuario.senha            // Hash salvo no banco
            );

            if (!senhaCorreta) {
                return res.status(401).json({
                    erro: 'Email ou senha incorretos'
                });
            }

            // 4) TOKEN: Gera o token JWT (o "crachá digital" do usuário)
            // O token contém o ID e o email do usuário (codificado)
            // e expira em 24 horas
            const token = jwt.sign(
                {
                    // Payload: dados que ficam dentro do token
                    id: usuario.id,
                    email: usuario.email
                },
                process.env.JWT_SECRET,    // Chave secreta para assinar o token
                { expiresIn: '24h' }       // Token válido por 24 horas
            );

            // 5) SUCESSO: Retorna o token e os dados do usuário
            return res.status(200).json({
                mensagem: 'Login realizado com sucesso!',
                token: token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                }
            });

        } catch (error) {
            if (error.name === 'ZodError') {
                return res.status(400).json({
                    erro: 'Dados inválidos',
                    detalhes: error.issues.map(i => i.message)
                });
            }

            console.error('Erro no login:', error);
            return res.status(500).json({
                erro: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = authController;