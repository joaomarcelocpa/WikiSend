import { useState } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import RegisterInformation from './pages/RegisterInformation';
import EditInformation from './pages/EditInformation';
import { AuthProvider } from './shared/contexts/AuthContext';
import { useAuth } from './shared/hooks/useAuth';

type Page = 'home' | 'register' | 'edit';

function AppContent() {
    const [darkMode, setDarkMode] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const { isAuthenticated } = useAuth();

    const handleNavigate = (page: string) => setCurrentPage(page as Page);

    if (!isAuthenticated) {
        return <Login darkMode={darkMode} setDarkMode={setDarkMode} />;
    }

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

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;