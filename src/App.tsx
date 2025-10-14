import { useState } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import RegisterInformation from './pages/RegisterInformation';
import EditInformation from './pages/EditInformation';

type Page = 'home' | 'register' | 'edit';

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>('home');

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleNavigate = (page: string) => {
        setCurrentPage(page as Page);
    };

    // Se não estiver autenticado, mostra a tela de login
    if (!isAuthenticated) {
        return (
            <Login
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                onLogin={handleLogin}
            />
        );
    }

    // Após login, gerencia as páginas internas
    if (currentPage === 'edit') {
        return (
            <EditInformation
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                onBack={() => setCurrentPage('home')}
            />
        );
    }

    if (currentPage === 'register') {
        return (
            <RegisterInformation
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                onBack={() => setCurrentPage('home')}
            />
        );
    }

    return (
        <Home
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            onNavigate={handleNavigate}
        />
    );
}

export default App;