import { Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../shared/hooks/useAuth';

interface NavbarProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    showUserInfo?: boolean;
}

const Navbar = ({ darkMode, setDarkMode, showUserInfo = true }: NavbarProps) => {
    const { logout } = useAuth();

    return (
        <nav
            className={`sticky top-0 z-50 border-b font-sans ${
                darkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'
            }`}
        >
            <div className="w-full px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <img
                            src="/wiki-logo.png"
                            alt="WIKI SEND Logo"
                            className="h-8 w-auto"
                        />
                    </div>

                    {/* Ações */}
                    <div className="flex items-center space-x-4">
                        {/* Botão Dark Mode */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2 rounded-lg transition-colors ${
                                darkMode
                                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {darkMode ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>

                        {/* Info do Usuário + Logout */}
                        {showUserInfo && (
                            <div
                                className={`flex items-center px-3 py-2 rounded-lg ${
                                    darkMode ? 'bg-gray-800' : 'bg-gray-50'
                                }`}
                            >
                                <div className="w-8 h-8 rounded-full bg-mid-data flex items-center justify-center text-white text-sm font-semibold mr-2">
                                    A
                                </div>
                                <span
                                    className={`text-sm font-medium ${
                                        darkMode ? 'text-white' : 'text-gray-900'
                                    }`}
                                >
                                    Admin
                                </span>

                                {/* Botão de Logout */}
                                <button
                                    onClick={logout}
                                    title="Sair"
                                    className={`ml-3 p-2 rounded-lg transition-colors ${
                                        darkMode
                                            ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700'
                                            : 'text-gray-500 hover:text-red-500 hover:bg-gray-100'
                                    }`}
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
