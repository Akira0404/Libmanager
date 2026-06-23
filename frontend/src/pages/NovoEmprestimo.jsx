// =============================================
// Página: Novo Empréstimo - LibManager
// =============================================
// Formulário para registrar um novo empréstimo.
// Seleciona um leitor e um livro cadastrados,
// define as datas (padrão 30 dias) e cria o
// registro no banco de dados.
// =============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

function NovoEmprestimo() {
    // =============================================
    // Estados
    // =============================================
    const [leitorId, setLeitorId] = useState('');
    const [livroId, setLivroId] = useState('');
    const [dataEmprestimo, setDataEmprestimo] = useState('');
    const [dataDevolucao, setDataDevolucao] = useState('');

    // Listas que vêm do backend
    const [leitores, setLeitores] = useState([]);
    const [livros, setLivros] = useState([]);

    // Feedback
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();

    // =============================================
    // Carrega leitores e livros ao abrir a página
    // =============================================
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Define a data de hoje como padrão
        const hoje = new Date();
        const hojeStr = hoje.toISOString().split('T')[0];
        setDataEmprestimo(hojeStr);

        // Define devolução padrão: 30 dias a partir de hoje
        const devolucao = new Date(hoje);
        devolucao.setDate(devolucao.getDate() + 30);
        setDataDevolucao(devolucao.toISOString().split('T')[0]);

        // Busca leitores e livros do backend
        async function carregarDados() {
            try {
                const [resLeitores, resLivros] = await Promise.all([
                    api.get('/leitores'),
                    api.get('/livros')
                ]);
                setLeitores(resLeitores.data);
                setLivros(resLivros.data);
            } catch (error) {
                setErro('Erro ao carregar dados. Verifique se o servidor está rodando.');
            }
        }

        carregarDados();
    }, [navigate]);

    // =============================================
    // Quando a data de empréstimo muda, recalcula
    // a devolução para 30 dias depois
    // =============================================
    function handleDataEmprestimoChange(data) {
        setDataEmprestimo(data);

        if (data) {
            const inicio = new Date(data + 'T00:00:00');
            inicio.setDate(inicio.getDate() + 30);
            setDataDevolucao(inicio.toISOString().split('T')[0]);
        }
    }

    // =============================================
    // Envio do formulário
    // =============================================
    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        setSucesso('');

        if (!leitorId) {
            setErro('Selecione um leitor.');
            return;
        }
        if (!livroId) {
            setErro('Selecione um livro.');
            return;
        }
        if (!dataEmprestimo) {
            setErro('A data de empréstimo é obrigatória.');
            return;
        }
        if (!dataDevolucao) {
            setErro('A data de devolução é obrigatória.');
            return;
        }

        // Verifica se a devolução é depois do empréstimo
        if (new Date(dataDevolucao) <= new Date(dataEmprestimo)) {
            setErro('A data de devolução deve ser posterior à data de empréstimo.');
            return;
        }

        setCarregando(true);

        try {
            await api.post('/emprestimos', {
                leitor_id: Number(leitorId),
                livro_id: Number(livroId),
                data_emprestimo: dataEmprestimo,
                data_devolucao_prevista: dataDevolucao
            });

            setSucesso('Empréstimo registrado com sucesso!');

            // Limpa o formulário
            setLeitorId('');
            setLivroId('');

            // Reseta as datas
            const hoje = new Date();
            setDataEmprestimo(hoje.toISOString().split('T')[0]);
            const devolucao = new Date(hoje);
            devolucao.setDate(devolucao.getDate() + 30);
            setDataDevolucao(devolucao.toISOString().split('T')[0]);

        } catch (error) {
            if (error.response) {
                if (error.response.data.detalhes) {
                    setErro(error.response.data.detalhes.join(', '));
                } else {
                    setErro(error.response.data.erro || 'Erro ao registrar empréstimo');
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
            {/* Sidebar */}
            <Sidebar ativa="novo-emprestimo" />

            {/* Conteúdo */}
            <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
                <div className="max-w-2xl">
                    <h1 className="text-xl font-bold text-gray-900 mb-1">
                        NOVO EMPRÉSTIMO
                    </h1>
                    <p className="text-sm text-gray-500 mb-8">
                        Selecione um leitor e um livro para registrar o empréstimo.
                    </p>

                    {erro && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-5">
                            {erro}
                        </div>
                    )}

                    {sucesso && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-5">
                            {sucesso}
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Selecionar Leitor */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    Leitor
                                </label>
                                <select
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 outline-none transition-all duration-200 focus:border-[#2b6cb0] focus:shadow-[0_0_0_3px_rgba(43,108,176,0.15)] focus:bg-white cursor-pointer"
                                    value={leitorId}
                                    onChange={(e) => setLeitorId(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione o leitor</option>
                                    {leitores.map((l) => (
                                        <option key={l.id} value={l.id}>
                                            {l.nome_completo} — {l.cpf}
                                        </option>
                                    ))}
                                </select>
                                {leitores.length === 0 && (
                                    <p className="text-xs text-amber-600 mt-1.5">
                                        Nenhum leitor cadastrado. Cadastre um leitor primeiro.
                                    </p>
                                )}
                            </div>

                            {/* Selecionar Livro */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                    Livro
                                </label>
                                <select
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 outline-none transition-all duration-200 focus:border-[#2b6cb0] focus:shadow-[0_0_0_3px_rgba(43,108,176,0.15)] focus:bg-white cursor-pointer"
                                    value={livroId}
                                    onChange={(e) => setLivroId(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione o livro</option>
                                    {livros.map((lv) => (
                                        <option key={lv.id} value={lv.id}>
                                            {lv.titulo} — {lv.autor}
                                        </option>
                                    ))}
                                </select>
                                {livros.length === 0 && (
                                    <p className="text-xs text-amber-600 mt-1.5">
                                        Nenhum livro cadastrado. Cadastre um livro primeiro.
                                    </p>
                                )}
                            </div>

                            {/* Datas lado a lado */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                        Data do Empréstimo
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 outline-none transition-all duration-200 focus:border-[#2b6cb0] focus:shadow-[0_0_0_3px_rgba(43,108,176,0.15)] focus:bg-white cursor-pointer"
                                        value={dataEmprestimo}
                                        onChange={(e) => handleDataEmprestimoChange(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">
                                        Data de Devolução
                                        <span className="text-gray-400 font-normal ml-1">(padrão: 30 dias)</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 outline-none transition-all duration-200 focus:border-[#2b6cb0] focus:shadow-[0_0_0_3px_rgba(43,108,176,0.15)] focus:bg-white cursor-pointer"
                                        value={dataDevolucao}
                                        onChange={(e) => setDataDevolucao(e.target.value)}
                                        required
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
                                    {carregando ? 'Registrando...' : 'Registrar Empréstimo'}
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

export default NovoEmprestimo;