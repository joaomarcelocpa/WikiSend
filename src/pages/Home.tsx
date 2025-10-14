import { FileText, Tag, BookOpen, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface HomeProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    onNavigate: (page: string) => void;
}

const Home = ({ darkMode, setDarkMode, onNavigate }: HomeProps) => {
    const stats = [
        { label: 'Total de Artigos', value: '128', color: '#155457', icon: FileText },
        { label: 'Categorias', value: '24', color: '#268c90', icon: BookOpen },
        { label: 'Tags', value: '45', color: '#3fbec5', icon: Tag },
        { label: 'Colaboradores', value: '12', color: '#6ed3d8', icon: Users },
    ];

    return (
        <div className="min-h-screen" style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            backgroundColor: darkMode ? '#0f0f0f' : '#f9fafb'
        }}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} showUserInfo={true} />

            <div className="max-w-[1200px] mx-auto px-8 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-bold mb-3" style={{
                        fontFamily: 'Poppins, sans-serif',
                        color: darkMode ? '#fff' : '#155457'
                    }}>
                        Painel de <span style={{ color: '#3fbec5' }}>Gerenciamento</span>
                    </h1>
                    <p className="text-lg" style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
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
                                className="rounded-2xl border-2 p-6 transition-all hover:shadow-xl"
                                style={{
                                    backgroundColor: darkMode ? '#1f1f1f' : '#fff',
                                    borderColor: darkMode ? '#374151' : '#e5e7eb',
                                }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: `${stat.color}20` }}
                                    >
                                        <Icon className="w-6 h-6" style={{ color: stat.color }} />
                                    </div>
                                    <span className="text-3xl font-bold" style={{
                                        fontFamily: 'Poppins, sans-serif',
                                        color: stat.color
                                    }}>
                                        {stat.value}
                                    </span>
                                </div>
                                <p className="text-sm font-medium" style={{
                                    color: darkMode ? '#9ca3af' : '#6b7280'
                                }}>
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
                        className="group relative p-8 rounded-2xl border-2 text-left transition-all hover:shadow-2xl hover:scale-105"
                        style={{
                            background: 'linear-gradient(135deg, #155457 0%, #3fbec5 100%)',
                            borderColor: '#3fbec5',
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-white/20">
                                <FileText className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-white/60 text-sm">Novo</div>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Cadastrar Informação
                        </h3>
                        <p className="text-white/80 text-sm">
                            Adicione novo conteúdo à base de conhecimento
                        </p>
                    </button>

                    <button
                        className="group relative p-8 rounded-2xl border-2 text-left transition-all hover:shadow-xl"
                        style={{
                            backgroundColor: darkMode ? '#1f1f1f' : '#fff',
                            borderColor: darkMode ? '#374151' : '#e5e7eb',
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: darkMode ? '#374151' : '#f3f4f6' }}
                            >
                                <BookOpen className="w-7 h-7 text-[#3fbec5]" />
                            </div>
                            <div style={{ color: darkMode ? '#6b7280' : '#9ca3af' }} className="text-sm">
                                Em breve
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-2" style={{
                            fontFamily: 'Poppins, sans-serif',
                            color: darkMode ? '#fff' : '#155457'
                        }}>
                            Gerenciar Artigos
                        </h3>
                        <p className="text-sm" style={{ color: darkMode ? '#9ca3af' : '#6b7280' }}>
                            Edite e organize o conteúdo existente
                        </p>
                    </button>
                </div>
            </div>

            <Footer darkMode={darkMode} />
        </div>
    );
};

export default Home;