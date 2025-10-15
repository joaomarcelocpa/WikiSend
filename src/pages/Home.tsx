import { FileText, Wrench, MessageSquare, MailOpen, Edit, FolderPlus, FolderEdit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from "../components/Footer.tsx";

interface HomeProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
}

const Home = ({ darkMode, setDarkMode }: HomeProps) => {
    const navigate = useNavigate();

    const stats = [
        { label: 'Informações SMS', value: '128', colorClass: 'text-high-data', bgClass: 'bg-high-data/10', icon: MessageSquare },
        { label: 'Informações Backoffice', value: '24', colorClass: 'text-high-data', bgClass: 'bg-high-data/10', icon: Wrench },
        { label: 'Informações RCS', value: '45', colorClass: 'text-mid-data', bgClass: 'bg-mid-data/10', icon: FileText },
        { label: 'Informações SMPP', value: '12', colorClass: 'text-low-data', bgClass: 'bg-low-data/10', icon: MailOpen },
    ];

    return (
        <div className={`min-h-screen font-sans flex flex-col ${
            darkMode ? 'bg-[#0f0f0f]' : 'bg-gray-50'
        }`}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} showUserInfo={true} />

            {/* Conteúdo principal com flex-1 para ocupar espaço disponível */}
            <div className="flex-1 flex flex-col">
                <div className="max-w-[1200px] mx-auto px-8 py-12 w-full">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className={`text-5xl font-bold mb-3 font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}>
                            Painel de <span className="text-mid-data">Gerenciamento</span>
                        </h1>
                        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Gerencie todo o conteúdo das informações da Wiki M2C
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={index}
                                    className={`rounded-2xl border-2 p-6 transition-all hover:shadow-xl ${
                                        darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgClass}`}>
                                            <Icon className={`w-6 h-6 ${stat.colorClass}`} />
                                        </div>
                                        <span className={`text-3xl font-bold font-heading ${stat.colorClass}`}>
                                            {stat.value}
                                        </span>
                                    </div>
                                    <p className={`text-sm font-medium ${
                                        darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                        {stat.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Informações Section */}
                    <div className="mb-8">
                        <h2 className={`text-2xl font-bold mb-4 font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}>
                            Gerenciar Informações
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button
                                onClick={() => navigate('/register')}
                                className="group relative p-8 rounded-2xl border-2 border-mid-data text-left transition-all hover:shadow-2xl hover:scale-105 bg-high-data"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-high-data">
                                        <FileText className="w-7 h-7 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 font-heading">
                                    Cadastrar Informação
                                </h3>
                                <p className="text-white/80 text-sm">
                                    Adicione novo conteúdo à base de conhecimento
                                </p>
                            </button>

                            <button
                                onClick={() => navigate('/edit')}
                                className="group relative p-8 rounded-2xl border-2 border-mid-data text-left transition-all hover:shadow-2xl hover:scale-105 bg-mid-data"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                                        darkMode ? 'bg-mid-data' : 'bg-mid-data'
                                    }`}>
                                        <Edit className="w-7 h-7 text-white" />
                                    </div>
                                </div>
                                <h3 className={`text-2xl font-bold mb-2 font-heading ${
                                    darkMode ? 'text-white' : 'text-white'
                                }`}>
                                    Gerenciar Informações
                                </h3>
                                <p className={`text-sm ${darkMode ? 'text-white' : 'text-white'}`}>
                                    Busque e edite o conteúdo existente
                                </p>
                            </button>
                        </div>
                    </div>

                    {/* Categorias Section */}
                    <div>
                        <h2 className={`text-2xl font-bold mb-4 font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}>
                            Gerenciar Categorias
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button
                                onClick={() => navigate('/register-category')}
                                className="group relative p-8 rounded-2xl border-2 border-mid-data text-left transition-all hover:shadow-2xl hover:scale-105 bg-mid-data"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-mid-data">
                                        <FolderPlus className="w-7 h-7 text-white" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 font-heading">
                                    Cadastrar Categoria
                                </h3>
                                <p className="text-white/80 text-sm">
                                    Crie novas categorias e subcategorias
                                </p>
                            </button>

                            <button
                                onClick={() => navigate('/edit-category')}
                                className="group relative p-8 rounded-2xl border-2 border-mid-data text-left transition-all hover:shadow-2xl hover:scale-105 bg-high-data"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                                        darkMode ? 'bg-high-data' : 'bg-high-data'
                                    }`}>
                                        <FolderEdit className="w-7 h-7 text-white" />
                                    </div>
                                </div>
                                <h3 className={`text-2xl font-bold mb-2 font-heading ${
                                    darkMode ? 'text-white' : 'text-white'
                                }`}>
                                    Gerenciar Categorias
                                </h3>
                                <p className={`text-sm ${
                                    darkMode ? 'text-white' : 'text-white'
                                }`}>
                                    Edite ou exclua categorias existentes
                                </p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer sempre no final */}
            <Footer darkMode={darkMode} />
        </div>
    );
};

export default Home;