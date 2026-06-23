import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

function Dashboard() {
    const [usuario, setUsuario] = useState(null);
    const [emprestimos, setEmprestimos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const dados = localStorage.getItem('usuario');
        if (!dados) {
            navigate('/login');
            return;
        }
        setUsuario(JSON.parse(dados));
        buscarEmprestimos();
    }, [navigate]);

    async function buscarEmprestimos() {
        try {
            setCarregando(true);
            setErro('');
            const response = await api.get('/emprestimos');
            setEmprestimos(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate('/login');
            } else {
                setErro('Erro ao carregar empréstimos.');
            }
        } finally {
            setCarregando(false);
        }
    }

    async function handleDevolver(id) {
        const confirmar = window.confirm('Confirmar devolução deste livro?');
        if (!confirmar) return;
        try {
            await api.put(`/emprestimos/${id}/devolver`);
            setEmprestimos(emprestimos.map(emp =>
                emp.id === id ? { ...emp, status: 'devolvido' } : emp
            ));
        } catch (error) {
            alert('Erro ao devolver livro.');
        }
    }

    function formatarData(data) {
        if (!data) return '-';
        const [ano, mes, dia] = data.split('T')[0].split('-');
        return `${dia}/${mes}/${ano}`;
    }

    function diasRestantes(dataDevolucao) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const devolucao = new Date(dataDevolucao + 'T00:00:00');
        return Math.ceil((devolucao - hoje) / (1000 * 60 * 60 * 24));
    }

    // =============================================
    // URL base do backend (para buscar as fotos)
    // Em desenvolvimento, é localhost:3001
    // =============================================
    const API_URL = 'http://localhost:3001';

    if (!usuario) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-gray-500">Carregando...</p>
            </div>
        );
    }

    const emprestados = emprestimos.filter(e => e.status === 'emprestado').length;
    const devolvidos = emprestimos.filter(e => e.status === 'devolvido').length;

    return (
        <div className="flex min-h-screen">
            <Sidebar ativa="dashboard" />

            <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
                <div className="mb-8">
                    <h1 className="text-xl font-bold text-gray-900 mb-1">
                        DASHBOARD DO BIBLIOTECÁRIO
                    </h1>
                    <p className="text-sm text-gray-500">
                        Bem-vindo, <span className="font-semibold text-gray-700">{usuario.nome}</span>!
                    </p>
                </div>

                {/* Cards */}
                <div className="flex gap-5 flex-wrap mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm min-w-52 flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Empréstimos Ativos</p>
                        <p className="text-4xl font-bold text-[#2b6cb0]">{emprestados}</p>
                        <p className="text-xs text-gray-400 mt-1">Livros emprestados</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm min-w-52 flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Devoluções</p>
                        <p className="text-4xl font-bold text-green-600">{devolvidos}</p>
                        <p className="text-xs text-gray-400 mt-1">Livros devolvidos</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm min-w-52 flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Total</p>
                        <p className="text-4xl font-bold text-gray-900">{emprestimos.length}</p>
                        <p className="text-xs text-gray-400 mt-1">Registros no sistema</p>
                    </div>
                </div>

                {/* Tabela */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100">
                        <h2 className="text-base font-bold text-gray-900">Gestão de Empréstimos</h2>
                        <p className="text-xs text-gray-400 mt-1">
                            INNER JOIN — Leitores + Livros + Empréstimos
                        </p>
                    </div>

                    {erro && (
                        <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{erro}</div>
                    )}

                    {carregando ? (
                        <div className="px-6 py-12 text-center text-gray-400 text-sm">Carregando empréstimos...</div>
                    ) : emprestimos.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-400 text-sm">Nenhum empréstimo registrado.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Leitor</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">CPF</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Livro</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Empréstimo</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Devolução</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {emprestimos.map((emp) => {
                                        const dias = emp.status === 'emprestado'
                                            ? diasRestantes(emp.data_devolucao_prevista)
                                            : null;

                                        return (
                                            <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                                                {/* Leitor com foto */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {/* Foto do leitor */}
                                                        {emp.leitor_foto ? (
                                                            <img
                                                                src={`${API_URL}${emp.leitor_foto}`}
                                                                alt={emp.leitor_nome}
                                                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-full bg-[#2b6cb0]/10 flex items-center justify-center border-2 border-[#2b6cb0]/20">
                                                                <span className="text-sm font-bold text-[#2b6cb0]">
                                                                    {emp.leitor_nome?.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        )}
                                                        <span className="text-sm text-gray-900 font-medium">
                                                            {emp.leitor_nome}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-500">{emp.leitor_cpf}</td>
                                                <td className="px-6 py-4 text-sm text-gray-500">{emp.leitor_email}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{emp.livro_titulo}</td>

                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {formatarData(emp.data_emprestimo)}
                                                </td>

                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {formatarData(emp.data_devolucao_prevista)}
                                                    {dias !== null && dias >= 0 && (
                                                        <span className="block text-xs text-gray-400 mt-0.5">
                                                            {dias === 0 ? 'Vence hoje' : `${dias} dia${dias > 1 ? 's' : ''} restante${dias > 1 ? 's' : ''}`}
                                                        </span>
                                                    )}
                                                    {dias !== null && dias < 0 && (
                                                        <span className="block text-xs text-red-500 mt-0.5">
                                                            Atrasado {Math.abs(dias)} dia{Math.abs(dias) > 1 ? 's' : ''}
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {emp.status === 'emprestado' ? (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                            Emprestado
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Devolvido
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-6 py-4">
                                                    {emp.status === 'emprestado' ? (
                                                        <button
                                                            onClick={() => handleDevolver(emp.id)}
                                                            className="px-3 py-1.5 bg-[#2b6cb0] text-white text-xs font-medium rounded-md hover:bg-[#2c5282] transition-colors cursor-pointer"
                                                        >
                                                            Devolver
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Dashboard;