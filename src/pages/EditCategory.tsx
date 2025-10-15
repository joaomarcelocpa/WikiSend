import { Search, Edit, Trash2, FolderOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditCategoryForm from '../components/EditCategoryForm';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';
import { getAllCategories, deleteCategory } from '../shared/services/category.service';
import type { CategoryViewResponse } from '../shared/interfaces/category.interface';

interface EditCategoryProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
}

const EditCategory = ({ darkMode, setDarkMode }: EditCategoryProps) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [categories, setCategories] = useState<CategoryViewResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{ show: boolean; identifier: string | null }>({
        show: false,
        identifier: null
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllCategories();
            setCategories(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
            console.error('Erro ao carregar categorias:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = categories.filter(category => {
        const matchesSearch =
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.subCategories.some(sub =>
                sub.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        return matchesSearch;
    });

    const handleDelete = (identifier: string) => {
        setConfirmDelete({ show: true, identifier });
    };

    const confirmDeleteAction = async () => {
        if (!confirmDelete.identifier) return;

        try {
            await deleteCategory(confirmDelete.identifier);
            setToast({ message: 'Categoria excluída com sucesso!', type: 'success' });
            await loadCategories();
        } catch (err) {
            setToast({
                message: err instanceof Error ? err.message : 'Erro ao excluir categoria',
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
        await loadCategories();
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
                            Editar Categoria
                        </h1>
                        <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Edite os campos abaixo para atualizar a categoria
                        </p>
                    </div>

                    <EditCategoryForm
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
                        Gerenciar Categorias
                    </h1>
                    <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Busque e edite as categorias cadastradas
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                            darkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <input
                            type="text"
                            placeholder="Buscar por categoria ou subcategoria..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 outline-none transition-colors ${
                                darkMode
                                    ? 'bg-[#1f1f1f] border-gray-700 text-white placeholder-gray-500'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                            }`}
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className={`rounded-xl border-2 p-8 text-center ${
                        darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Carregando categorias...
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
                            onClick={loadCategories}
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
                            {filteredData.length} {filteredData.length === 1 ? 'categoria encontrada' : 'categorias encontradas'}
                        </p>
                    </div>
                )}

                {/* Categories List */}
                {!loading && !error && (
                    <div className="space-y-3 mb-6">
                        {filteredData.length === 0 ? (
                            <div className={`rounded-xl border-2 p-8 text-center ${
                                darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                            }`}>
                                <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Nenhuma categoria encontrada
                                </p>
                            </div>
                        ) : (
                            filteredData.map((category) => (
                                <div
                                    key={category.identifier}
                                    className={`rounded-xl border-2 p-4 transition-all hover:shadow-lg ${
                                        darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FolderOpen className="w-5 h-5 text-high-data" />
                                                <h3 className={`text-lg font-bold font-heading ${
                                                    darkMode ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                    {category.name}
                                                </h3>
                                            </div>

                                            {category.subCategories.length > 0 && (
                                                <div className="ml-7">
                                                    <p className={`text-xs font-medium mb-2 ${
                                                        darkMode ? 'text-gray-400' : 'text-gray-600'
                                                    }`}>
                                                        Subcategorias ({category.subCategories.length}):
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {category.subCategories.map((sub) => (
                                                            <span
                                                                key={sub.identifier}
                                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                                    darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                                                                }`}
                                                            >
                                                                {sub.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4 text-xs mt-3">
                                                <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                                                    Criado em: {new Date(category.created_at).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => handleEdit(category.identifier)}
                                                className="p-2 rounded-lg transition-all hover:bg-mid-data/10 group"
                                                title="Editar"
                                            >
                                                <Edit className="w-5 h-5 text-mid-data" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.identifier)}
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
                    title="Excluir Categoria"
                    message="Tem certeza que deseja excluir esta categoria? Todas as subcategorias também serão excluídas. Esta ação não pode ser desfeita."
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

export default EditCategory;