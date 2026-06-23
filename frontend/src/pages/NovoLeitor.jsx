// =============================================
// Página: Novo Leitor - LibManager
// =============================================
// Formulário para cadastrar um novo leitor no
// sistema. Valida CPF único, email válido e
// nome completo obrigatório usando Zod no backend.
// =============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

function NovoLeitor() {
    // =============================================
    // Estados do formulário
    // =============================================
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');

    // Feedback
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();

    // Verifica se tá logado
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    // =============================================
    // Função para formatar CPF automaticamente
    // Conforme o usuário digita: 000.000.000-00
    // =============================================
    function formatarCpf(valor) {
        // Remove tudo que não é número
        const numeros = valor.replace(/\D/g, '');

        // Aplica a máscara conforme digita
        if (numeros.length <= 3) {
            return numeros;
        } else if (numeros.length <= 6) {
            return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
        } else if (numeros.length <= 9) {
            return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
        } else {
            return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
        }
    }

    // =============================================
    // Função para formatar telefone automaticamente
    // Conforme o usuário digita: (00) 00000-0000
    // =============================================
    function formatarTelefone(valor) {
        const numeros = valor.replace(/\D/g, '');

        if (numeros.length <= 2) {
            return numeros.length ? `(${numeros}` : '';
        } else if (numeros.length <= 7) {
            return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
        } else {
            return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
        }
    }

    // =============================================
    // Envio do formulário
    // =============================================
    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        setSucesso('');

        // Validações no frontend
        if (!nomeCompleto.trim()) {
            setErro('O nome completo é obrigatório.');
            return;
        }
        if (nomeCompleto.trim().split(' ').length < 2) {
            setErro('Informe o nome completo (nome e sobrenome).');
            return;
        }
        if (cpf.replace(/\D/g, '').length !== 11) {
            setErro('O CPF deve ter 11 dígitos.');
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            setErro('Por favor, insira um email válido.');
            return;
        }

        setCarregando(true);

        try {
            await api.post('/leitores', {
                nome_completo: nomeCompleto.trim(),
                cpf: cpf,
                email: email.trim().toLowerCase(),
                telefone: telefone || null
            });

            setSucesso('Leitor cadastrado com sucesso!');

            // Limpa os campos
            setNomeCompleto('');
            setCpf('');
            setEmail('');
            setTelefone('');

        } catch (error) {
            if (error.response) {
                if (error.response.data.detalhes) {
                    setErro(error.response.data.detalhes.join(', '));
                } else {
                    setErro(error.response.data.erro || 'Erro ao cadastrar leitor');
                }
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
            {/* Sidebar com link "Novo Leitor" ativo */}
            <Sidebar ativa="novo-leitor" />

            {/* =============================================
                CONTEÚDO PRINCIPAL
                ============================================= */}
            <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
                <div className="max-w-2xl">
                    <h1 className="text-xl font-bold text-gray-900 mb-1">
                        CADASTRAR NOVO LEITOR
                    </h1>
                    <p className="text-sm text-gray-500 mb-8">
                        Preencha os dados do leitor para cadastrá-lo no sistema.
                    </p>

                    {/* Mensagem de erro */}
                    {erro && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-5">
                            {erro}
                        </div>
                    )}

                    {/* Mensagem de sucesso */}
                    {sucesso && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-5">
                            {sucesso}
                        </div>
                    )}

                    {/* Formulário */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Nome Completo e CPF lado a lado */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                        Nome Completo
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Digite o nome completo"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 outline-none transition-all duration-200 focus:border-[#2b6cb0] focus:shadow-[0_0_0_3px_rgba(43,108,176,0.15)] focus:bg-white placeholder:text-gray-400"
                                        value={nomeCompleto}
                                        onChange={(e) => setNomeCompleto(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                        CPF
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ex: 000.000.000-00"
                                        maxLength={14}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 outline-none transition-all duration-200 focus:border-[#2b6cb0] focus:shadow-[0_0_0_3px_rgba(43,108,176,0.15)] focus:bg-white placeholder:text-gray-400"
                                        value={cpf}
                                        onChange={(e) => setCpf(formatarCpf(e.target.value))}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email e Telefone lado a lado */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                        E-mail
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Digite o e-mail"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 outline-none transition-all duration-200 focus:border-[#2b6cb0] focus:shadow-[0_0_0_3px_rgba(43,108,176,0.15)] focus:bg-white placeholder:text-gray-400"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                        Telefone/WhatsApp <span className="text-gray-400 font-normal">(opcional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ex: (11) 99999-9999"
                                        maxLength={16}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 outline-none transition-all duration-200 focus:border-[#2b6cb0] focus:shadow-[0_0_0_3px_rgba(43,108,176,0.15)] focus:bg-white placeholder:text-gray-400"
                                        value={telefone}
                                        onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                                    />
                                </div>
                            </div>

                            {/* Botões */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={carregando}
                                    className="px-6 py-3 bg-[#2b6cb0] text-white font-semibold text-sm rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#2c5282] active:scale-[0.99] disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {carregando ? 'Cadastrando...' : 'Cadastrar Leitor'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="px-6 py-3 bg-white text-gray-600 font-medium text-sm rounded-lg border-2 border-gray-200 cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:border-gray-300"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default NovoLeitor;