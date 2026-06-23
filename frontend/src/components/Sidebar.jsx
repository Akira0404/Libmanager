import { Link, useNavigate } from 'react-router-dom';

function Sidebar({ ativa }) {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
    }

    return (
        <aside className="w-60 bg-gray-900 text-white flex flex-col shrink-0">
            <div className="px-5 py-6 border-b border-white/10">
                <h2 className="text-lg font-bold tracking-tight">LibManager</h2>
            </div>

            <nav className="flex-1 py-4">
                <Link
                    to="/dashboard"
                    className={`block px-5 py-3 text-sm border-l-3 transition-colors ${
                        ativa === 'dashboard'
                            ? 'text-white font-medium bg-[#2b6cb0]/20 border-[#2b6cb0]'
                            : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                >
                    Início
                </Link>
                <Link
                    to="/novo-livro"
                    className={`block px-5 py-3 text-sm border-l-3 transition-colors ${
                        ativa === 'novo-livro'
                            ? 'text-white font-medium bg-[#2b6cb0]/20 border-[#2b6cb0]'
                            : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                >
                    Novo Livro
                </Link>
                <Link
                    to="/novo-emprestimo"
                    className={`block px-5 py-3 text-sm border-l-3 transition-colors ${
                        ativa === 'novo-emprestimo'
                            ? 'text-white font-medium bg-[#2b6cb0]/20 border-[#2b6cb0]'
                            : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                >
                    Novo Empréstimo
                </Link>
                <Link
                    to="/novo-leitor"
                    className={`block px-5 py-3 text-sm border-l-3 transition-colors ${
                        ativa === 'novo-leitor'
                            ? 'text-white font-medium bg-[#2b6cb0]/20 border-[#2b6cb0]'
                            : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                >
                    Gestão de Usuários
                </Link>
                <Link
                    to="#"
                    className={`block px-5 py-3 text-sm border-l-3 transition-colors ${
                        ativa === 'ajustes'
                            ? 'text-white font-medium bg-[#2b6cb0]/20 border-[#2b6cb0]'
                            : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                    }`}
                >
                    Ajustes
                </Link>
            </nav>

            <button
                onClick={handleLogout}
                className="mx-5 mb-5 py-2.5 bg-white/10 text-gray-400 border border-white/15 rounded-md cursor-pointer text-xs hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all"
            >
                Sair
            </button>
        </aside>
    );
}

export default Sidebar;