import { Sun, Moon } from 'lucide-react';

interface NavbarProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    showUserInfo?: boolean;
}

const Navbar = ({ darkMode, setDarkMode, showUserInfo = true }: NavbarProps) => {
    return (
        <nav className={`sticky top-0 z-50 border-b font-sans ${
            darkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'
        }`}>
            <div className="w-full px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <img
                            src="/wiki-logo.png"
                            alt="WIKI SEND Logo"
                            className="h-8 w-auto"
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2 rounded-lg transition-colors ${
                                darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {showUserInfo && (
                            <div className={`flex items-center px-3 py-2 rounded-lg ${
                                darkMode ? 'bg-gray-800' : 'bg-gray-50'
                            }`}>
                                <div className="w-8 h-8 rounded-full bg-mid-data flex items-center justify-center text-white text-sm font-semibold mr-2">
                                    A
                                </div>
                                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Admin
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;