import { useState } from 'react';
import Home from './pages/Home';
import RegisterInformation from './pages/RegisterInformation';

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [currentPage, setCurrentPage] = useState<'home' | 'register'>('home');

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
            onNavigate={(page) => setCurrentPage(page as 'home' | 'register')}
        />
    );
}

export default App;