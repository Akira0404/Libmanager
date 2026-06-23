// Script: Seed de Livros via Open Library API
// Busca livros da API do Open Library e insere
// no banco de dados com imagem, título, autor
// e ano de publicação.

const pool = require('../config/database');
const https = require('https');

// Função para fazer requisição HTTP
function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Livros que vamos buscar na API
const livrosParaBuscar = [
    { query: 'Clean Code Robert Martin', categoria: 1, quantidade: 3 },
    { query: 'Refactoring Martin Fowler', categoria: 1, quantidade: 2 },
    { query: 'Design Patterns Gang of Four', categoria: 1, quantidade: 2 },
    { query: '1984 George Orwell', categoria: 2, quantidade: 4 },
    { query: 'Fahrenheit 451 Ray Bradbury', categoria: 2, quantidade: 2 },
    { query: 'Dom Casmurro Machado de Assis', categoria: 4, quantidade: 3 },
    { query: 'Harry Potter Philosopher Stone', categoria: 8, quantidade: 5 },
    { query: 'Lord of the Rings Tolkien', categoria: 8, quantidade: 3 },
    { query: 'Sapiens Yuval Harari', categoria: 3, quantidade: 2 },
    { query: 'Pride and Prejudice Jane Austen', categoria: 4, quantidade: 2 },
    { query: 'Steve Jobs Walter Isaacson', categoria: 7, quantidade: 2 },
    { query: 'Brave New World Aldous Huxley', categoria: 2, quantidade: 3 },
    { query: 'O Cortiço Aluísio Azevedo', categoria: 4, quantidade: 2 },
    { query: 'O Príncipe Maquiavel', categoria: 3, quantidade: 2 },
    { query: 'Meditações Marco Aurélio', categoria: 9, quantidade: 2 },
    { query: 'The Pragmatic Programmer', categoria: 1, quantidade: 3 },
    { query: 'Uma Breve História do Tempo Hawking', categoria: 5, quantidade: 2 },
    { query: 'Elon Musk Walter Isaacson', categoria: 7, quantidade: 2 },
    { query: 'O Mundo de Sofia Gaarder', categoria: 9, quantidade: 2 },
    { query: 'A Arte da Guerra Sun Tzu', categoria: 3, quantidade: 3 },
];

async function seedLivros() {
    console.log('Iniciando seed de livros via Open Library API...\n');

    for (const livro of livrosParaBuscar) {
        try {
            // Busca o livro na API
            const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(livro.query)}&limit=1`;
            const resultado = await fetch(url);

            if (!resultado.docs || resultado.docs.length === 0) {
                console.log(`Não encontrado: ${livro.query}`);
                continue;
            }

            const doc = resultado.docs[0];
            const titulo = doc.title || livro.query;
            const autor = doc.author_name ? doc.author_name[0] : 'Desconhecido';
            const ano = doc.first_publish_year || null;
            const isbn = doc.isbn ? doc.isbn[0] : null;

            // URL da capa do Open Library (usa o ISBN)
            // Se não tem ISBN, tenta pela cover_i (ID da capa)
            let capaUrl = null;
            if (isbn) {
                capaUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
            } else if (doc.cover_i) {
                capaUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
            }

            // Verifica se já existe no banco
            const [existente] = await pool.query(
                'SELECT id FROM livros WHERE titulo = ? AND autor = ?',
                [titulo, autor]
            );

            if (existente.length > 0) {
                console.log(`Já existe: ${titulo}`);
                continue;
            }

            // Insere no banco
            await pool.query(
                `INSERT INTO livros (titulo, autor, isbn, ano_publicacao, categoria_id, quantidade, capa_url)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [titulo, autor, isbn, ano, livro.categoria, livro.quantidade, capaUrl]
            );

            console.log(`Cadastrado: ${titulo} - ${autor} (${ano}) | ${livro.quantidade} cópias`);

        } catch (error) {
            console.error(`Erro ao buscar "${livro.query}":`, error.message);
        }
    }

    console.log('\nSeed finalizado!');
    process.exit(0);
}

seedLivros();