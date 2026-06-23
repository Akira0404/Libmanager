import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

function NovoLivro() {
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [isbn, setIsbn] = useState('');
    const [anoPublicacao, setAnoPublicacao] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        async function carregarCategorias() {
            try {
                const response = await api.get('/livros/categorias');
                setCategorias(response.data);
            } catch (error) {
                setErro('Erro ao carregar categorias.');
            }
        }

        carregarCategorias();
    }, [navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        setSucesso('');

        if (!titulo.trim()) { setErro('O título é obrigatório.'); return; }
        if (!autor.trim()) { setErro('O autor é obrigatório.'); return; }
        if (!categoriaId) { setErro('Selecione uma categoria.'); return; }

        setCarregando(true);

        try {
            await api.post('/livros', {
                titulo: titulo.trim(),
                autor: autor.trim(),
                isbn: isbn.trim() || null,
                ano_publicacao: anoPublicacao ? Number(anoPublicacao) : null,
                categoria_id: Number(categoriaId)
            });

            setSucesso('Livro cadastrado com sucesso!');
            setTitulo('');
            setAutor('');
            setIsbn('');
            setAnoPublicacao('');
            setCategoriaId('');
        } catch (error) {
            if (error.response) {
                if (error.response.data.detalhes) {
                    setErro(error.response.data.detalhes.join(', '));
                } else {
                    setErro(error.response.data.erro || 'Erro ao cadastrar livro');
                }
            } else {
                setErro('Não foi possível conectar ao servidor.');
            }
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar com o link "Novo Livro" ativo */}
            <Sidebar ativa="novo-livro" />

            <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
                <div className="max-w-2xl">
                    <h1 className="text-xl font-bold text-gray-900 mb-1">CADASTRAR NOVO LIVRO</h1>
                    <p className="text-sm text-gray-500 mb-8">Preencha os dados do livro para adicioná-lo ao acervo.</p>

                    {erro && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-5">{erro}</div>
                    )}
                    {sucesso && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-5">{sucesso}</div>
                    )}

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">Título</label>
                                <input
                                    type="text"
                                    placeholder="Digite o título do livro"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 outline-none transition-all duration-200 focus:border-[#2b6cb0] focus:shadow-[0_0_0_3px_rgba(43,108,176,0.15)] focus:bg-white placeholder:text-gray-400"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">Autor</label>
                                <input
                                    type="text"
                                    placeholder="Digite o nome do autor"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 outline-none transition-all duration-200 focus:border-[#2b6cb0] focus:shadow-[0_0_0_3px_rgba(43,108,176,0.15)] focus:bg-white placeholder:text-gray-400"
                                    value={autor}
                                    onChange={(e) => setAutor(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1.5">Categoria</label>
                                <select
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 outline-none transition-all duration-200 focus:border-[#2b6cb0] focus:shadow-[0_0_0_3px_rgba(43,108,176,0.15)] focus:bg-white cursor-pointer"
                                    value={categoriaId}
                                    onChange={(e) => setCategoriaId(e.target.value)}
                                    required
                                >
                                    <option value="">Selecione a categoria</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">ISBN <span className="text-gray-400 font-normal">(opcional)</span></label>
                                    <input
                                        type="text"
                                        placeholder="Ex: 978-0132350884"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 outline-none transition-all duration-200 focus:border-[#2b6cb0] focus:shadow-[0_0_0_3px_rgba(43,108,176,0.15)] focus:bg-white placeholder:text-gray-400"
                                        value={isbn}
                                        onChange={(e) => setIsbn(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Ano de Publicação <span className="text-gray-400 font-normal">(opcional)</span></label>
                                    <input
                                        type="number"
                                        placeholder="Ex: 2024"
                                        min="1000"
                                        max="9999"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 outline-none transition-all duration-200 focus:border-[#2b6cb0] focus:shadow-[0_0_0_3px_rgba(43,108,176,0.15)] focus:bg-white placeholder:text-gray-400"
                                        value={anoPublicacao}
                                        onChange={(e) => setAnoPublicacao(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={carregando}
                                    className="px-6 py-3 bg-[#2b6cb0] text-white font-semibold text-sm rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#2c5282] active:scale-[0.99] disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {carregando ? 'Cadastrando...' : 'Cadastrar Livro'}
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

export default NovoLivro;