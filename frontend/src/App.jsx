import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import NovoLivro from './pages/NovoLivro';
import NovoLeitor from './pages/NovoLeitor';
import NovoEmprestimo from './pages/NovoEmprestimo';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/novo-livro" element={<NovoLivro />} />
                <Route path="/novo-leitor" element={<NovoLeitor />} />
                <Route path="/novo-emprestimo" element={<NovoEmprestimo />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;