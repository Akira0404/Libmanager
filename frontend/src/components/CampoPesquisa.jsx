// =============================================
// Componente: Campo de Pesquisa
// =============================================
// Campo de input que filtra uma lista de itens
// conforme o usuário digita. Quando clica num
// resultado, seleciona o item e fecha o dropdown.
// =============================================

import { useState, useRef, useEffect } from 'react';

function CampoPesquisa({ label, placeholder, itens, valorSelecionado, onSelect, renderItem, filtroFn }) {
    // Texto que o usuário está digitando
    const [termo, setTermo] = useState('');

    // Controla se o dropdown está aberto
    const [aberto, setAberto] = useState(false);

    // Referência pra detectar clique fora
    const containerRef = useRef(null);

    // =============================================
    // Fecha o dropdown quando clica fora
    // =============================================
    useEffect(() => {
        function handleClickFora(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setAberto(false);
            }
        }

        document.addEventListener('mousedown', handleClickFora);
        return () => document.removeEventListener('mousedown', handleClickFora);
    }, []);

    // =============================================
    // Filtra os itens conforme o termo digitado
    // =============================================
    const resultados = termo.trim()
        ? itens.filter(item => filtroFn(item, termo))
        : [];

    // =============================================
    // Quando o usuário seleciona um item
    // =============================================
    function handleSelect(item) {
        onSelect(item);
        setTermo('');
        setAberto(false);
    }

    // =============================================
    // Quando limpa a seleção
    // =============================================
    function handleLimpar() {
        onSelect(null);
        setTermo('');
    }

    // Se já tem um item selecionado, mostra ele
    if (valorSelecionado) {
        return (
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">
                    {label}
                </label>
                <div className="flex items-center gap-2 px-4 py-3 border-2 border-[#2b6cb0]/30 bg-[#2b6cb0]/5 rounded-lg">
                    <span className="flex-1 text-sm text-gray-800">
                        {renderItem(valorSelecionado)}
                    </span>
                    <button
                        type="button"
                        onClick={handleLimpar}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remover seleção"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
                {label}
            </label>

            {/* Input de pesquisa */}
            <div className="relative">
                {/* Ícone de lupa */}
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg text-sm text-gray-800 bg-gray-50 outline-none transition-all duration-200 focus:border-[#2b6cb0] focus:shadow-[0_0_0_3px_rgba(43,108,176,0.15)] focus:bg-white placeholder:text-gray-400"
                    value={termo}
                    onChange={(e) => {
                        setTermo(e.target.value);
                        setAberto(true);
                    }}
                    onFocus={() => setAberto(true)}
                    autoComplete="off"
                />
            </div>

            {/* Dropdown com resultados */}
            {aberto && termo.trim() && (
                <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {resultados.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-400 text-center">
                            Nenhum resultado encontrado
                        </div>
                    ) : (
                        resultados.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => handleSelect(item)}
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-[#2b6cb0]/5 hover:text-[#2b6cb0] transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                                {renderItem(item)}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default CampoPesquisa;