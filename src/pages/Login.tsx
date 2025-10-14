import { Sun, Moon } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../shared/hooks/useAuth';

interface LoginProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
}

const Login = ({ darkMode, setDarkMode }: LoginProps) => {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            console.log('Usuário já autenticado, redirecionando para home...');
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center font-sans ${
                darkMode ? 'bg-[#0f0f0f]' : 'bg-gray-50'
            }`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mid-data mx-auto"></div>
                    <p className={`mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Verificando autenticação...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen flex items-center justify-center font-sans ${
                darkMode ? 'bg-[#0f0f0f]' : 'bg-gray-50'
            }`}
        >
            {/* Botão Dark Mode */}
            <button
                onClick={() => setDarkMode(!darkMode)}
                className={`fixed top-6 right-6 p-3 rounded-xl transition-colors ${
                    darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 shadow-lg'
                }`}
            >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <div className="w-full max-w-md px-6">
                {/* Logo e Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <img src="/wiki-logo.png" alt="M2C Wiki Logo" className="h-16 w-auto" />
                    </div>
                    <h1
                        className={`text-3xl font-bold mb-2 font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}
                    >
                        Wiki <span className="text-mid-data">Administrativo</span>
                    </h1>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Faça login para acessar o painel
                    </p>
                </div>

                {/* Formulário */}
                <LoginForm darkMode={darkMode} />
            </div>
        </div>
    );
};

export default Login;