import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

function NovoLeitor() {
    // =============================================
    // Estados
    // =============================================
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');

    // Foto
    const [fotoPreview, setFotoPreview] = useState(null);  // URL da preview
    const [fotoArquivo, setFotoArquivo] = useState(null);   // Arquivo real
    const [mostrarCamera, setMostrarCamera] = useState(false);

    // Refs
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // Feedback
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/login');
    }, [navigate]);

    // =============================================
    // Selecionar arquivo (galeria)
    // =============================================
    function handleSelecionarFoto(e) {
        const arquivo = e.target.files[0];
        if (!arquivo) return;

        // Valida tipo
        if (!arquivo.type.startsWith('image/')) {
            setErro('Selecione uma imagem (JPG, PNG ou WEBP).');
            return;
        }

        // Valida tamanho (5MB)
        if (arquivo.size > 5 * 1024 * 1024) {
            setErro('A imagem deve ter no máximo 5MB.');
            return;
        }

        setFotoArquivo(arquivo);
        setFotoPreview(URL.createObjectURL(arquivo));
        setErro('');
    }

    // =============================================
    // Abrir câmera
    // =============================================
    async function handleAbrirCamera() {
        setErro('');
        setMostrarCamera(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 480 }
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            setErro('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
            setMostrarCamera(false);
        }
    }

    // =============================================
    // Tirar foto da câmera
    // =============================================
    function handleTirarFoto() {
        const video = videoRef.current;
        if (!video) return;

        // Cria um canvas e desenha o frame atual do vídeo
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        // Converte o canvas para arquivo
        canvas.toBlob((blob) => {
            const arquivo = new File([blob], 'foto-camera.jpg', { type: 'image/jpeg' });
            setFotoArquivo(arquivo);
            setFotoPreview(URL.createObjectURL(arquivo));

            // Para a câmera
            handleFecharCamera();
        }, 'image/jpeg', 0.9);
    }

    // =============================================
    // Fechar câmera
    // =============================================
    function handleFecharCamera() {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setMostrarCamera(false);
    }

    // =============================================
    // Remover foto selecionada
    // =============================================
    function handleRemoverFoto() {
        setFotoArquivo(null);
        setFotoPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    // =============================================
    // Formatação de CPF
    // =============================================
    function formatarCpf(valor) {
        const numeros = valor.replace(/\D/g, '');
        if (numeros.length <= 3) return numeros;
        if (numeros.length <= 6) return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
        if (numeros.length <= 9) return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
        return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
    }

    // =============================================
    // Formatação de Telefone
    // =============================================
    function formatarTelefone(valor) {
        const numeros = valor.replace(/\D/g, '');
        if (numeros.length <= 2) return numeros.length ? `(${numeros}` : '';
        if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
    }

    // =============================================
    // Envio do formulário
    // =============================================
    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        setSucesso('');

        if (!nomeCompleto.trim()) { setErro('O nome completo é obrigatório.'); return; }
        if (nomeCompleto.trim().split(' ').length < 2) { setErro('Informe nome e sobrenome.'); return; }
        if (cpf.replace(/\D/g, '').length !== 11) { setErro('O CPF deve ter 11 dígitos.'); return; }
        if (!email.includes('@') || !email.includes('.')) { setErro('Insira um email válido.'); return; }

        setCarregando(true);

        try {
            // Usa FormData porque agora enviamos arquivo + dados
            const formData = new FormData();
            formData.append('nome_completo', nomeCompleto.trim());
            formData.append('cpf', cpf);
            formData.append('email', email.trim().toLowerCase());
            formData.append('telefone', telefone || '');

            // Só adiciona a foto se o usuário selecionou uma
            if (fotoArquivo) {
                formData.append('foto', fotoArquivo);
            }

            await api.post('/leitores', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSucesso('Leitor cadastrado com sucesso!');
            setNomeCompleto('');
            setCpf('');
            setEmail('');
            setTelefone('');
            handleRemoverFoto();

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
            <Sidebar ativa="novo-leitor" />

            <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
                <div className="max-w-2xl">
                    <h1 className="text-xl font-bold text-gray-900 mb-1">
                        CADASTRAR NOVO LEITOR
                    </h1>
                    <p className="text-sm text-gray-500 mb-8">
                        Preencha os dados e adicione uma foto do leitor.
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

                            {/* =============================================
                                SEÇÃO DA FOTO
                                ============================================= */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-3">
                                    Foto do Leitor
                                </label>

                                <div className="flex items-start gap-6">
                                    {/* Preview da foto */}
                                    <div className="w-32 h-32 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0">
                                        {fotoPreview ? (
                                            <img
                                                src={fotoPreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-center">
                                                <svg className="w-10 h-10 text-gray-300 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                </svg>
                                                <span className="text-xs text-gray-400">Sem foto</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Botões de ação */}
                                    <div className="flex flex-col gap-2">
                                        {/* Input de arquivo escondido */}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleSelecionarFoto}
                                            className="hidden"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Selecionar Arquivo
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleAbrirCamera}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Tirar Foto
                                        </button>

                                        {fotoPreview && (
                                            <button
                                                type="button"
                                                onClick={handleRemoverFoto}
                                                className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-200 cursor-pointer hover:bg-red-100 transition-colors"
                                            >
                                                Remover Foto
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Modal da câmera */}
                                {mostrarCamera && (
                                    <div className="mt-4 p-4 bg-gray-900 rounded-xl">
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className="w-full max-w-sm rounded-lg mx-auto block"
                                        />
                                        <div className="flex gap-3 justify-center mt-4">
                                            <button
                                                type="button"
                                                onClick={handleTirarFoto}
                                                className="px-5 py-2.5 bg-[#2b6cb0] text-white text-sm font-semibold rounded-lg hover:bg-[#2c5282] transition-colors cursor-pointer"
                                            >
                                                Capturar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleFecharCamera}
                                                className="px-5 py-2.5 bg-white text-gray-600 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <p className="text-xs text-gray-400 mt-2">
                                    JPG, PNG ou WEBP. Máximo 5MB.
                                </p>
                            </div>

                            {/* =============================================
                                CAMPOS DO FORMULÁRIO
                                ============================================= */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Nome Completo</label>
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
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">CPF</label>
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">E-mail</label>
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
                                        Telefone <span className="text-gray-400 font-normal">(opcional)</span>
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