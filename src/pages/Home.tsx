import { FileText, Tag, BookOpen, Users, Edit } from 'lucide-react';
import Navbar from '../components/Navbar';

interface HomeProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    onNavigate: (page: string) => void;
}

const Home = ({ darkMode, setDarkMode, onNavigate }: HomeProps) => {
    const stats = [
        { label: 'Total de Artigos', value: '128', colorClass: 'text-max-data', bgClass: 'bg-max-data/10', icon: FileText },
        { label: 'Categorias', value: '24', colorClass: 'text-high-data', bgClass: 'bg-high-data/10', icon: BookOpen },
        { label: 'Tags', value: '45', colorClass: 'text-mid-data', bgClass: 'bg-mid-data/10', icon: Tag },
        { label: 'Colaboradores', value: '12', colorClass: 'text-low-data', bgClass: 'bg-low-data/10', icon: Users },
    ];

    return (
        <div className={`min-h-screen font-sans ${
            darkMode ? 'bg-[#0f0f0f]' : 'bg-gray-50'
        }`}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} showUserInfo={true} />

            <div className="max-w-[1200px] mx-auto px-8 py-12">
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

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                        onClick={() => onNavigate('register')}
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
                        onClick={() => onNavigate('edit')}
                        className="group relative p-8 rounded-2xl border-2 border-mid-data text-left transition-all hover:shadow-2xl hover:scale-105 bg-low-data"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                                darkMode ? 'bg-low-data' : 'bg-low-data'
                            }`}>
                                <Edit className="w-7 h-7 text-max-data" />
                            </div>
                        </div>
                        <h3 className={`text-2xl font-bold mb-2 font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}>
                            Editar Informação
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                            Busque e edite o conteúdo existente
                        </p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;