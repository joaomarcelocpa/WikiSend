import { Search, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditForm from '../components/EditForm';

interface Information {
    id: string;
    section: string;
    category: string;
    subtopic: string;
    answer: string;
    files: string[];
    createdAt: string;
}

interface EditInformationProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    onBack: () => void;
}

const EditInformation = ({ darkMode, setDarkMode, onBack }: EditInformationProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSection, setSelectedSection] = useState<string>('all');
    const [editingId, setEditingId] = useState<string | null>(null);

    // Dados mockados - substitua por dados reais da API
    const mockData: Information[] = [
        {
            id: '1',
            section: 'SMS',
            category: 'Campanhas',
            subtopic: 'Como criar uma campanha',
            answer: 'Para criar uma campanha, acesse o menu...',
            files: ['guia_campanha.pdf'],
            createdAt: '2025-01-10'
        },
        {
            id: '2',
            section: 'Backoffice',
            category: 'Financeiro',
            subtopic: 'Como gerar relatório mensal',
            answer: 'Para gerar o relatório mensal, siga os passos...',
            files: [],
            createdAt: '2025-01-12'
        },
        {
            id: '3',
            section: 'Dúvidas Gerais',
            category: '',
            subtopic: 'Como recuperar senha',
            answer: 'Para recuperar sua senha, clique em...',
            files: [],
            createdAt: '2025-01-15'
        },
        {
            id: '4',
            section: 'SMS',
            category: 'Blacklist',
            subtopic: 'Como adicionar número na blacklist',
            answer: 'Para adicionar um número na blacklist...',
            files: ['tutorial_blacklist.pdf'],
            createdAt: '2025-01-18'
        },
    ];

    const sections = [
        { id: 'all', label: 'Todas', color: 'bg-gray-500' },
        { id: 'Dúvidas Gerais', label: 'Dúvidas Gerais', color: 'bg-max-data' },
        { id: 'SMS', label: 'SMS', color: 'bg-high-data' },
        { id: 'Backoffice', label: 'Backoffice', color: 'bg-mid-data' },
    ];

    const filteredData = mockData.filter(item => {
        const matchesSearch = item.subtopic.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSection = selectedSection === 'all' || item.section === selectedSection;
        return matchesSearch && matchesSection;
    });

    const getSectionColor = (section: string) => {
        if (section === 'SMS') return 'bg-high-data';
        if (section === 'Backoffice') return 'bg-mid-data';
        return 'bg-max-data';
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta informação?')) {
            console.log('Deletando informação:', id);
            alert('Informação excluída com sucesso!');
        }
    };

    const handleEdit = (id: string) => {
        setEditingId(id);
    };

    const handleBackFromEdit = () => {
        setEditingId(null);
    };

    // Se está editando, mostra o formulário
    if (editingId) {
        return (
            <div className={`min-h-screen font-sans ${
                darkMode ? 'bg-[#0f0f0f]' : 'bg-gray-50'
            }`}>
                <Navbar darkMode={darkMode} setDarkMode={setDarkMode} showUserInfo={false} />

                <div className="max-w-[1400px] mx-auto px-8 py-8">
                    <div className="mb-6">
                        <h1 className={`text-3xl font-bold mb-3 font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}>
                            Editar Informação
                        </h1>
                        <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Edite os campos abaixo para atualizar o conteúdo
                        </p>
                    </div>

                    <EditForm darkMode={darkMode} onBack={handleBackFromEdit} editingId={editingId} />
                </div>

                <Footer darkMode={darkMode} />
            </div>
        );
    }

    // Senão, mostra a lista
    return (
        <div className={`min-h-screen font-sans ${
            darkMode ? 'bg-[#0f0f0f]' : 'bg-gray-50'
        }`}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} showUserInfo={true} />

            <div className="max-w-[1400px] mx-auto px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className={`text-3xl font-bold mb-3 font-heading ${
                        darkMode ? 'text-white' : 'text-max-data'
                    }`}>
                        Editar Informações
                    </h1>
                    <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Busque e edite as informações cadastradas na Wiki
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                            darkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <input
                            type="text"
                            placeholder="Buscar por subtópico ou categoria..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 outline-none transition-colors ${
                                darkMode
                                    ? 'bg-[#1f1f1f] border-gray-700 text-white placeholder-gray-500'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                            }`}
                        />
                    </div>

                    {/* Section Filter */}
                    <div className="flex gap-2 flex-wrap">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setSelectedSection(section.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    selectedSection === section.id
                                        ? `${section.color} text-white`
                                        : darkMode
                                            ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {section.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {filteredData.length} {filteredData.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                    </p>
                </div>

                {/* Information List */}
                <div className="space-y-3 mb-6">
                    {filteredData.length === 0 ? (
                        <div className={`rounded-xl border-2 p-8 text-center ${
                            darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                        }`}>
                            <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Nenhuma informação encontrada
                            </p>
                        </div>
                    ) : (
                        filteredData.map((item) => (
                            <div
                                key={item.id}
                                className={`rounded-xl border-2 p-4 transition-all hover:shadow-lg ${
                                    darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getSectionColor(item.section)}`}>
                                                {item.section}
                                            </span>
                                            {item.category && (
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {item.category}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className={`text-base font-bold mb-1 font-heading ${
                                            darkMode ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {item.subtopic}
                                        </h3>
                                        <p className={`text-sm line-clamp-2 mb-2 ${
                                            darkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            {item.answer}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs">
                                            <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                                                Criado em: {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                                            </span>
                                            {item.files.length > 0 && (
                                                <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                                                    {item.files.length} {item.files.length === 1 ? 'arquivo' : 'arquivos'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => handleEdit(item.id)}
                                            className="p-2 rounded-lg transition-all hover:bg-mid-data/10 group"
                                            title="Editar"
                                        >
                                            <Edit className="w-5 h-5 text-mid-data" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 rounded-lg transition-all hover:bg-red-500/10 group"
                                            title="Excluir"
                                        >
                                            <Trash2 className="w-5 h-5 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Back Button */}
                <div className="flex justify-start">
                    <button
                        onClick={onBack}
                        className="px-6 py-2 rounded-xl font-medium transition-all hover:opacity-80 bg-high-data text-white"
                    >
                        Voltar
                    </button>
                </div>
            </div>

            <Footer darkMode={darkMode} />
        </div>
    );
};

export default EditInformation;