import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const dados = localStorage.getItem('usuario');
        if (!dados) {
            navigate('/login');
            return;
        }
        setUsuario(JSON.parse(dados));
    }, [navigate]);

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
    }

    if (!usuario) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-gray-500 text-sm">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            {/* SIDEBAR - Menu lateral */}
            <aside className="w-60 bg-gray-900 text-white flex flex-col shrink-0">
                {/* Logo */}
                <div className="px-5 py-6 border-b border-white/10">
                    <h2 className="text-lg font-bold tracking-tight">LibManager</h2>
                </div>

                {/* Links de navegação */}
                <nav className="flex-1 py-4">
                    <a href="#" className="block px-5 py-3 text-gray-400 text-sm hover:text-white hover:bg-white/5 transition-colors border-l-3 border-transparent">
                        Início
                    </a>
                    <a href="#" className="block px-5 py-3 text-white text-sm font-medium bg-[#2b6cb0]/20 border-l-3 border-[#2b6cb0]">
                        Listar Livros
                    </a>
                    <a href="#" className="block px-5 py-3 text-gray-400 text-sm hover:text-white hover:bg-white/5 transition-colors border-l-3 border-transparent">
                        Novo Livro
                    </a>
                    <a href="#" className="block px-5 py-3 text-gray-400 text-sm hover:text-white hover:bg-white/5 transition-colors border-l-3 border-transparent">
                        Gestão de Usuários
                    </a>
                    <a href="#" className="block px-5 py-3 text-gray-400 text-sm hover:text-white hover:bg-white/5 transition-colors border-l-3 border-transparent">
                        Ajustes
                    </a>
                </nav>

                {/* Botão sair */}
                <button
                    onClick={handleLogout}
                    className="mx-5 mb-5 py-2.5 bg-white/10 text-gray-400 border border-white/15 rounded-md cursor-pointer text-xs hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all"
                >
                    Sair
                </button>
            </aside>

            {/* =============================================
                CONTEÚDO PRINCIPAL
                ============================================= */}
            <main className="flex-1 bg-gray-100 p-8">
                {/* Cabeçalho */}
                <div className="mb-8">
                    <h1 className="text-xl font-bold text-gray-900 mb-1">
                        DASHBOARD DO BIBLIOTECÁRIO
                    </h1>
                    <p className="text-sm text-gray-500">
                        Bem-vindo, <span className="font-semibold text-gray-700">{usuario.nome}</span>!
                    </p>
                </div>

                {/* Cards de informação */}
                <div className="flex gap-5 flex-wrap">
                    <div className="bg-white rounded-xl p-6 shadow-sm min-w-56">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Acervo de Livros
                        </p>
                        <p className="text-4xl font-bold text-gray-900">84</p>
                        <p className="text-xs text-gray-400 mt-1">Livros Cadastrados</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm min-w-56">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Empréstimos Ativos
                        </p>
                        <p className="text-4xl font-bold text-[#2b6cb0]">12</p>
                        <p className="text-xs text-gray-400 mt-1">Livros Emprestados</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm min-w-56">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                            Leitores Cadastrados
                        </p>
                        <p className="text-4xl font-bold text-gray-900">156</p>
                        <p className="text-xs text-gray-400 mt-1">Usuários ativos</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;