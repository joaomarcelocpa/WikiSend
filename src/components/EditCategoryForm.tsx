import { useState, useEffect } from 'react';
import { Save, Plus, X } from 'lucide-react';
import Toast from './Toast';
import {
    getCategoryById,
    updateCategory,
    createSubCategory,
    deleteSubCategory,
} from '../shared/services/category.service';
import type { SubCategoryInfo } from '../shared/interfaces/category.interface';

interface EditCategoryFormProps {
    darkMode: boolean;
    editingId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

const EditCategoryForm = ({ darkMode, editingId, onSuccess, onCancel }: EditCategoryFormProps) => {
    const [categoryName, setCategoryName] = useState('');
    const [subCategories, setSubCategories] = useState<SubCategoryInfo[]>([]);
    const [newSubCategoryName, setNewSubCategoryName] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

    useEffect(() => {
        loadCategory();
    }, [editingId]);

    const loadCategory = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getCategoryById(editingId);
            setCategoryName(data.name);
            setSubCategories(data.subCategories || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar categoria');
            console.error('Erro ao carregar categoria:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCategory = async () => {
        if (!categoryName.trim()) {
            setToast({ message: 'Por favor, preencha o nome da categoria', type: 'warning' });
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            await updateCategory(editingId, { name: categoryName });
            setToast({ message: 'Categoria atualizada com sucesso!', type: 'success' });

            setTimeout(() => {
                onSuccess();
            }, 1500);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar categoria';
            setError(errorMessage);
            setToast({ message: errorMessage, type: 'error' });
            console.error('Erro ao atualizar:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddSubCategory = async () => {
        if (!newSubCategoryName.trim()) {
            setToast({ message: 'Por favor, preencha o nome da subcategoria', type: 'warning' });
            return;
        }

        try {
            await createSubCategory({
                name: newSubCategoryName,
                category_identifier: editingId,
            });

            setToast({ message: 'Subcategoria adicionada com sucesso!', type: 'success' });
            setNewSubCategoryName('');
            await loadCategory();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar subcategoria';
            setToast({ message: errorMessage, type: 'error' });
            console.error('Erro ao adicionar subcategoria:', err);
        }
    };

    const handleDeleteSubCategory = async (subCategoryId: string) => {
        if (!confirm('Tem certeza que deseja excluir esta subcategoria?')) {
            return;
        }

        try {
            await deleteSubCategory(subCategoryId);
            setToast({ message: 'Subcategoria excluída com sucesso!', type: 'success' });
            await loadCategory();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir subcategoria';
            setToast({ message: errorMessage, type: 'error' });
            console.error('Erro ao excluir subcategoria:', err);
        }
    };

    if (loading) {
        return (
            <div className={`rounded-xl border-2 p-8 text-center ${
                darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
            }`}>
                <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Carregando categoria...
                </p>
            </div>
        );
    }

    if (error && !categoryName) {
        return (
            <div className={`rounded-xl border-2 p-8 text-center ${
                darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
            }`}>
                <p className={`text-base mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    {error}
                </p>
                <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-high-data text-white rounded-lg hover:opacity-80 transition-all"
                >
                    Voltar
                </button>
            </div>
        );
    }

    return (
        <div className="font-sans">
            <div className="space-y-4">
                {/* Category Name */}
                <div className={`rounded-xl border-2 p-4 ${
                    darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                }`}>
                    <span className={`text-xs font-bold mb-2 block font-heading ${
                        darkMode ? 'text-white' : 'text-max-data'
                    }`}>
                        Nome da Categoria *
                    </span>
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        disabled={submitting}
                        className={`w-full p-2 text-sm rounded-lg border-2 outline-none transition-colors ${
                            darkMode
                                ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500'
                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                        } disabled:opacity-50`}
                    />
                </div>

                {/* Current SubCategories */}
                <div className={`rounded-xl border-2 p-4 ${
                    darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                }`}>
                    <span className={`text-xs font-bold mb-3 block font-heading ${
                        darkMode ? 'text-white' : 'text-max-data'
                    }`}>
                        Subcategorias Existentes
                    </span>

                    {subCategories.length === 0 ? (
                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Nenhuma subcategoria cadastrada
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {subCategories.map((subCat) => (
                                <div
                                    key={subCat.identifier}
                                    className={`flex items-center justify-between p-2 rounded-lg ${
                                        darkMode ? 'bg-[#1a1a1a]' : 'bg-gray-50'
                                    }`}
                                >
                                    <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {subCat.name}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteSubCategory(subCat.identifier)}
                                        className="p-1 hover:bg-red-500/10 rounded transition-colors"
                                    >
                                        <X className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add New SubCategory */}
                <div className={`rounded-xl border-2 p-4 ${
                    darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                }`}>
                    <span className={`text-xs font-bold mb-2 block font-heading ${
                        darkMode ? 'text-white' : 'text-max-data'
                    }`}>
                        Adicionar Nova Subcategoria
                    </span>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newSubCategoryName}
                            onChange={(e) => setNewSubCategoryName(e.target.value)}
                            placeholder="Nome da nova subcategoria"
                            className={`flex-1 p-2 text-sm rounded-lg border-2 outline-none transition-colors ${
                                darkMode
                                    ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                            }`}
                        />
                        <button
                            onClick={handleAddSubCategory}
                            className="px-4 py-2 rounded-lg font-medium transition-all bg-mid-data text-white hover:opacity-80 flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" />
                            Adicionar
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={onCancel}
                    disabled={submitting}
                    className="px-8 py-3 rounded-xl font-medium transition-all hover:opacity-80 bg-high-data text-white disabled:opacity-50"
                >
                    Cancelar
                </button>

                <button
                    onClick={handleUpdateCategory}
                    disabled={submitting}
                    className="px-8 py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:opacity-90 bg-high-data text-white disabled:opacity-50"
                >
                    {submitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Atualizando...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Atualizar Categoria
                        </>
                    )}
                </button>
            </div>

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

export default EditCategoryForm;