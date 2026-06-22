import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
    // Estados do formulário
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();

    // Envio do formulário
    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        setCarregando(true);

        try {
            const response = await api.post('/auth/login', { email, senha });

            // Salva token e dados do usuário no navegador
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('usuario', JSON.stringify(response.data.usuario));

            // Redireciona pro dashboard
            navigate('/dashboard');

        } catch (error) {
            if (error.response) {
                setErro(error.response.data.erro || 'Erro ao fazer login');
            } else if (error.request) {
                setErro('Não foi possível conectar ao servidor.');
            } else {
                setErro('Erro inesperado. Tente novamente.');
            }
        } finally {
            setCarregando(false);
        }
    }

    return (

        <div className="flex min-h-screen">
        
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e3a5f] via-[#2c5282] to-[#2b6cb0] items-center justify-center p-10 relative overflow-hidden">
                {/* Efeito de brilho sutil no fundo */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08)_0%,transparent_40%)]" />

                <div className="relative z-10 text-white text-center max-w-md">
                    <h1 className="text-5xl font-bold tracking-tight mb-3">LibManager</h1>
                    <p className="text-lg font-light opacity-85 mb-12 leading-relaxed">
                        Sistema de Gerenciamento de Biblioteca
                    </p>

                    <div className="flex flex-col gap-5 text-left">
                        <div className="flex items-center gap-3 text-sm opacity-90">
                            <span className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center text-base">
                                📚
                            </span>
                            <span>Gestão completa do acervo</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm opacity-90">
                            <span className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center text-base">
                                👥
                            </span>
                            <span>Controle de empréstimos</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm opacity-90">
                            <span className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center text-base">
                                🔒
                            </span>
                            <span>Acesso seguro e protegido</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    {/* Logo mobile (aparece só em telas pequenas) */}
                    <div className="lg:hidden text-center mb-8">
                        <h1 className="text-3xl font-bold text-[#1e3a5f] tracking-tight">LibManager</h1>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        Login do Bibliotecário
                    </h2>
                    <p className="text-sm text-gray-500 mb-8">
                        Entre com suas credenciais para acessar o sistema.
                    </p>

                    {/* Mensagem de erro */}
                    {erro && (
                        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm mb-5 leading-relaxed">
                            {erro}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Campo Email */}
                        <div className="mb-5">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1.5">
                                E-mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Ex: bibliotecario@biblioteca.com"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 outline-none transition-all duration-200 focus:border-[#2b6cb0] focus:shadow-[0_0_0_3px_rgba(43,108,176,0.15)] focus:bg-white placeholder:text-gray-400"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Campo Senha */}
                        <div className="mb-6">
                            <label htmlFor="senha" className="block text-sm font-medium text-gray-600 mb-1.5">
                                Senha
                            </label>
                            <input
                                type="password"
                                id="senha"
                                placeholder="Digite sua senha"
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 outline-none transition-all duration-200 focus:border-[#2b6cb0] focus:shadow-[0_0_0_3px_rgba(43,108,176,0.15)] focus:bg-white placeholder:text-gray-400"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />
                        </div>

                        {/* Botão Entrar */}
                        <button
                            type="submit"
                            disabled={carregando}
                            className="w-full py-3.5 bg-[#2b6cb0] text-white font-semibold text-sm rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#2c5282] active:scale-[0.99] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {carregando ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    {/* Link pro cadastro */}
                    <p className="text-center mt-6 text-sm text-gray-500">
                        Não tem uma conta?{' '}
                        <Link to="/cadastro" className="text-[#2b6cb0] font-medium no-underline hover:underline">
                            Cadastre-se aqui
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;