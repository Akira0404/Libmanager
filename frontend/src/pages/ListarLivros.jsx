// =============================================
// Página: Listar Livros - LibManager
// =============================================
// Exibe todos os livros do banco em cards com
// capa, título, autor e status de disponibilidade.
// Livros indisponíveis aparecem bloqueados.
// Livros disponíveis têm botão "Reservar" que
// leva para a página de empréstimo com o livro
// já selecionado.
// =============================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

function ListarLivros() {
    const [livros, setLivros] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [filtro, setFiltro] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
    const [categorias, setCategorias] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        async function carregarDados() {
            try {
                const [resLivros, resCategorias] = await Promise.all([
                    api.get('/livros'),
                    api.get('/livros/categorias')
                ]);
                setLivros(resLivros.data);
                setCategorias(resCategorias.data);
            } catch (error) {
                setErro('Erro ao carregar livros.');
            } finally {
                setCarregando(false);
            }
        }

        carregarDados();
    }, [navigate]);

    // =============================================
    // Filtra livros por título, autor ou categoria
    // =============================================
    const livrosFiltrados = livros.filter(livro => {
        const termo = filtro.toLowerCase();
        const passaTexto = !termo ||
            livro.titulo.toLowerCase().includes(termo) ||
            livro.autor.toLowerCase().includes(termo);

        const passaCategoria = categoriaFiltro === 'todas' ||
            livro.categoria_id === Number(categoriaFiltro);

        return passaTexto && passaCategoria;
    });

    // =============================================
    // Redireciona para empréstimo com livro selecionado
    // =============================================
    function handleReservar(livro) {
        navigate(`/novo-emprestimo?livro_id=${livro.id}`);
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar ativa="listar-livros" />

            <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
                <div className="mb-8">
                    <h1 className="text-xl font-bold text-gray-900 mb-1">
                        LISTA DE LIVROS
                    </h1>
                    <p className="text-sm text-gray-500">
                        Acervo completo da biblioteca com {livros.length} títulos cadastrados.
                    </p>
                </div>

                {/* =============================================
                    BARRA DE FILTROS
                    ============================================= */}
                <div className="flex gap-4 mb-6 flex-wrap">
                    {/* Pesquisa por texto */}
                    <div className="relative flex-1 min-w-64">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Pesquisar por título ou autor..."
                            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-[#2b6cb0] transition-colors"
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                    </div>

                    {/* Filtro por categoria */}
                    <select
                        className="px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm bg-white outline-none focus:border-[#2b6cb0] cursor-pointer"
                        value={categoriaFiltro}
                        onChange={(e) => setCategoriaFiltro(e.target.value)}
                    >
                        <option value="todas">Todas as categorias</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.nome}</option>
                        ))}
                    </select>
                </div>

                {/* =============================================
                    GRID DE LIVROS
                    ============================================= */}
                {carregando ? (
                    <div className="text-center py-16 text-gray-400">
                        Carregando livros...
                    </div>
                ) : livrosFiltrados.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        Nenhum livro encontrado.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                        {livrosFiltrados.map((livro) => {
                            // Verifica se está totalmente emprestado
                            const indisponivel = Number(livro.disponivel) <= 0;

                            return (
                                <div
                                    key={livro.id}
                                    className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 ${
                                        indisponivel
                                            ? 'opacity-60 grayscale-[30%]'
                                            : 'hover:shadow-md hover:-translate-y-1'
                                    }`}
                                >
                                    {/* Capa do livro */}
                                    <div className="relative h-52 bg-gray-100 overflow-hidden">
                                        {livro.capa_url ? (
                                            <img
                                                src={livro.capa_url}
                                                alt={livro.titulo}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    // Se a imagem falhar, mostra placeholder
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}

                                        {/* Placeholder se não tem capa */}
                                        <div
                                            className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${livro.capa_url ? 'hidden' : 'flex'}`}
                                        >
                                            <div className="text-center">
                                                <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                <span className="text-xs text-gray-400">Sem capa</span>
                                            </div>
                                        </div>

                                        {/* Badge de quantidade */}
                                        <div className="absolute top-2 right-2">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                                                indisponivel
                                                    ? 'bg-red-500/90 text-white'
                                                    : 'bg-green-500/90 text-white'
                                            }`}>
                                                {livro.disponivel}/{livro.quantidade} disponível{livro.disponivel !== 1 ? 'is' : ''}
                                            </span>
                                        </div>

                                        {/* Badge de categoria */}
                                        <div className="absolute top-2 left-2">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-900/70 text-white">
                                                {livro.categoria_nome}
                                            </span>
                                        </div>

                                        {/* Overlay "Emprestado" */}
                                        {indisponivel && (
                                            <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
                                                <div className="bg-white/95 rounded-lg px-4 py-2 text-center">
                                                    <p className="text-sm font-bold text-red-600">EMPRESTADO</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">Indisponível no momento</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Informações do livro */}
                                    <div className="p-4">
                                        <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 leading-tight">
                                            {livro.titulo}
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-1">
                                            {livro.autor}
                                        </p>
                                        {livro.ano_publicacao && (
                                            <p className="text-xs text-gray-400">
                                                {livro.ano_publicacao}
                                            </p>
                                        )}

                                        {/* Botão de ação */}
                                        <div className="mt-4">
                                            {indisponivel ? (
                                                <button
                                                    disabled
                                                    className="w-full py-2.5 bg-gray-200 text-gray-400 text-xs font-semibold rounded-lg cursor-not-allowed"
                                                >
                                                    Indisponível
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleReservar(livro)}
                                                    className="w-full py-2.5 bg-[#2b6cb0] text-white text-xs font-semibold rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#2c5282] active:scale-[0.98]"
                                                >
                                                    Reservar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

export default ListarLivros;