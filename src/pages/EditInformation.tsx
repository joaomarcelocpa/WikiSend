import { Search, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditForm from '../components/EditForm';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';
import { getAllInformation, deleteInformation } from '../shared/services/information.service';
import type { InformationViewResponse } from '../shared/interfaces/information.interface';

interface EditInformationProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
}

const EditInformation = ({ darkMode, setDarkMode }: EditInformationProps) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSection, setSelectedSection] = useState<string>('all');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [informations, setInformations] = useState<InformationViewResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ show: boolean; identifier: string | null }>({
        show: false,
        identifier: null
    });

    // Carregar informações da API
    useEffect(() => {
        loadInformations();
    }, []);

    const loadInformations = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllInformation();
            setInformations(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar informações');
            console.error('Erro ao carregar informações:', err);
        } finally {
            setLoading(false);
        }
    };

    // Extrair categorias principais únicas
    const sections = [
        { id: 'all', label: 'Todas', color: 'bg-high-data' },
        ...Array.from(new Set(informations.map(item => item.main_category)))
            .map(category => ({
                id: category,
                label: category,
                color: 'bg-high-data'
            }))
    ];

    const filteredData = informations.filter(item => {
        const matchesSearch =
            item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sub_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSection = selectedSection === 'all' || item.main_category === selectedSection;
        return matchesSearch && matchesSection;
    });

    const getSectionColor = (section: string) => {
        const colors: Record<string, string> = {
            'SMS': 'bg-high-data',
            'Backoffice': 'bg-mid-data',
            'Dúvidas Gerais': 'bg-max-data'
        };
        return colors[section] || 'bg-high-data';
    };

    const handleDelete = (identifier: string) => {
        setConfirmDelete({ show: true, identifier });
    };

    const confirmDeleteAction = async () => {
        if (!confirmDelete.identifier) return;

        try {
            await deleteInformation(confirmDelete.identifier);
            setToast({ message: 'Informação excluída com sucesso!', type: 'success' });
            // Recarregar lista após exclusão
            await loadInformations();
        } catch (err) {
            setToast({
                message: err instanceof Error ? err.message : 'Erro ao excluir informação',
                type: 'error'
            });
            console.error('Erro ao excluir:', err);
        } finally {
            setConfirmDelete({ show: false, identifier: null });
        }
    };

    const cancelDelete = () => {
        setConfirmDelete({ show: false, identifier: null });
    };

    const handleEdit = (identifier: string) => {
        setEditingId(identifier);
    };

    const handleEditSuccess = async () => {
        setEditingId(null);
        await loadInformations();
    };

    if (editingId) {
        return (
            <div className={`min-h-screen font-sans flex flex-col ${
                darkMode ? 'bg-[#0f0f0f]' : 'bg-gray-50'
            }`}>
                <Navbar darkMode={darkMode} setDarkMode={setDarkMode} showUserInfo={false} />

                <div className="max-w-[1400px] mx-auto px-8 py-8 flex-1 w-full">
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

                    <EditForm
                        darkMode={darkMode}
                        editingId={editingId}
                        onSuccess={handleEditSuccess}
                        onCancel={() => setEditingId(null)}
                    />
                </div>

                <Footer darkMode={darkMode} />
            </div>
        );
    }

    return (
        <div className={`min-h-screen font-sans flex flex-col ${
            darkMode ? 'bg-[#0f0f0f]' : 'bg-gray-50'
        }`}>
            <Navbar darkMode={darkMode} setDarkMode={setDarkMode} showUserInfo={true} />

            <div className="max-w-[1400px] mx-auto px-8 py-8 flex-1 w-full">
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
                            placeholder="Buscar por pergunta, categoria ou conteúdo..."
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

                {/* Loading State */}
                {loading && (
                    <div className={`rounded-xl border-2 p-8 text-center ${
                        darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Carregando informações...
                        </p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className={`rounded-xl border-2 p-8 text-center ${
                        darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
                    }`}>
                        <p className={`text-base ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                            {error}
                        </p>
                        <button
                            onClick={loadInformations}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                {/* Results Count */}
                {!loading && !error && (
                    <div className="mb-4">
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {filteredData.length} {filteredData.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                        </p>
                    </div>
                )}

                {/* Information List */}
                {!loading && !error && (
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
                                    key={item.identifier}
                                    className={`rounded-xl border-2 p-4 transition-all hover:shadow-lg ${
                                        darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getSectionColor(item.main_category)}`}>
                                                    {item.main_category}
                                                </span>
                                                {item.sub_category && (
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                        darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {item.sub_category}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className={`text-base font-bold mb-1 font-heading ${
                                                darkMode ? 'text-white' : 'text-gray-900'
                                            }`}>
                                                {item.question}
                                            </h3>
                                            <p className={`text-sm line-clamp-2 mb-2 ${
                                                darkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}>
                                                {item.content}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs">
                                                <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                                                    Criado em: {new Date(item.created_at).toLocaleDateString('pt-BR')}
                                                </span>
                                                <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                                                    Por: {item.user_name}
                                                </span>
                                                {item.file && (
                                                    <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                                                        1 arquivo anexado
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => handleEdit(item.identifier)}
                                                className="p-2 rounded-lg transition-all hover:bg-mid-data/10 group"
                                                title="Editar"
                                            >
                                                <Edit className="w-5 h-5 text-mid-data" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.identifier)}
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
                )}

                {/* Back Button */}
                <div className="flex justify-start">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 rounded-xl font-medium transition-all hover:opacity-80 bg-high-data text-white"
                    >
                        Voltar
                    </button>
                </div>
            </div>

            <Footer darkMode={darkMode} />

            {/* Confirm Dialog */}
            {confirmDelete.show && (
                <ConfirmDialog
                    title="Excluir Informação"
                    message="Tem certeza que deseja excluir esta informação? Esta ação não pode ser desfeita."
                    confirmText="Sim, excluir"
                    cancelText="Cancelar"
                    onConfirm={confirmDeleteAction}
                    onCancel={cancelDelete}
                    darkMode={darkMode}
                    type="danger"
                />
            )}

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default EditInformation;