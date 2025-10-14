import { useState } from 'react';
import Home from './pages/Home';
import RegisterInformation from './pages/RegisterInformation';
import EditInformation from './pages/EditInformation';

type Page = 'home' | 'register' | 'edit';

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>('home');

    const handleNavigate = (page: string) => {
        setCurrentPage(page as Page);
    };

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