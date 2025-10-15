import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Toast from './Toast';
import {
    getInformationById,
    updateInformation,
} from '../shared/services/information.service';
import { getAllCategories } from '../shared/services/category.service';
import type { InformationUpdateRequest } from '../shared/interfaces/information.interface';
import type { CategoryViewResponse } from '../shared/interfaces/category.interface';

interface EditFormProps {
    darkMode: boolean;
    editingId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

interface FormData {
    category_identifier: string;
    sub_category_identifier: string;
    question: string;
    content: string;
    file_identifier?: number;
}

const EditForm = ({ darkMode, editingId, onSuccess, onCancel }: EditFormProps) => {
    const [formData, setFormData] = useState<FormData>({
        category_identifier: '',
        sub_category_identifier: '',
        question: '',
        content: '',
        file_identifier: undefined,
    });
    const [categories, setCategories] = useState<CategoryViewResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentFile, setCurrentFile] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

    useEffect(() => {
        loadData();
    }, [editingId]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [categoriesData, informationData] = await Promise.all([
                getAllCategories(),
                getInformationById(editingId)
            ]);

            setCategories(categoriesData);
            setFormData({
                category_identifier: informationData.category_identifier,
                sub_category_identifier: informationData.sub_category_identifier,
                question: informationData.question,
                content: informationData.content,
                file_identifier: informationData.file_identifier,
            });

            if (informationData.file) {
                setCurrentFile(informationData.file.originalName);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
            console.error('Erro ao carregar dados:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.question.trim()) {
            setToast({ message: 'Por favor, preencha a pergunta', type: 'warning' });
            return;
        }
        if (!formData.content.trim()) {
            setToast({ message: 'Por favor, preencha o conteúdo', type: 'warning' });
            return;
        }
        if (!formData.category_identifier) {
            setToast({ message: 'Por favor, selecione uma categoria', type: 'warning' });
            return;
        }
        if (!formData.sub_category_identifier) {
            setToast({ message: 'Por favor, selecione uma subcategoria', type: 'warning' });
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const updateData: InformationUpdateRequest = {
                question: formData.question,
                content: formData.content,
                category_identifier: formData.category_identifier,
                sub_category_identifier: formData.sub_category_identifier,
                file_identifier: formData.file_identifier,
            };

            await updateInformation(editingId, updateData);
            setToast({ message: 'Informação atualizada com sucesso!', type: 'success' });

            setTimeout(() => {
                onSuccess();
            }, 1500);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar informação';
            setError(errorMessage);
            setToast({ message: errorMessage, type: 'error' });
            console.error('Erro ao atualizar:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const getSubCategories = () => {
        if (!formData.category_identifier) return [];
        const selectedCategory = categories.find(cat => cat.identifier === formData.category_identifier);
        return selectedCategory?.subCategories || [];
    };

    if (loading) {
        return (
            <div className={`rounded-xl border-2 p-8 text-center ${
                darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
            }`}>
                <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Carregando informação...
                </p>
            </div>
        );
    }

    if (error && !formData.question) {
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="space-y-4">
                    {/* Category Selection */}
                    <div className={`rounded-xl border-2 p-4 ${
                        darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <span className={`text-xs font-bold mb-2 block font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}>
                            Categoria *
                        </span>
                        <select
                            value={formData.category_identifier}
                            onChange={(e) => setFormData({
                                ...formData,
                                category_identifier: e.target.value,
                                sub_category_identifier: ''
                            })}
                            disabled={submitting}
                            className={`w-full p-2 text-sm rounded-lg border-2 outline-none transition-colors ${
                                darkMode
                                    ? 'bg-[#1a1a1a] border-gray-700 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'
                            } disabled:opacity-50`}
                        >
                            <option value="">Selecione uma categoria</option>
                            {categories.map((cat) => (
                                <option key={cat.identifier} value={cat.identifier}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* SubCategory Selection */}
                    {formData.category_identifier && getSubCategories().length > 0 && (
                        <div className={`rounded-xl border-2 p-4 ${
                            darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                        }`}>
                            <span className={`text-xs font-bold mb-2 block font-heading ${
                                darkMode ? 'text-white' : 'text-max-data'
                            }`}>
                                Subcategoria *
                            </span>
                            <select
                                value={formData.sub_category_identifier}
                                onChange={(e) => setFormData({ ...formData, sub_category_identifier: e.target.value })}
                                disabled={submitting}
                                className={`w-full p-2 text-sm rounded-lg border-2 outline-none transition-colors ${
                                    darkMode
                                        ? 'bg-[#1a1a1a] border-gray-700 text-white'
                                        : 'bg-white border-gray-200 text-gray-900'
                                } disabled:opacity-50`}
                            >
                                <option value="">Selecione uma subcategoria</option>
                                {getSubCategories().map((cat) => (
                                    <option key={cat.identifier} value={cat.identifier}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Question */}
                    <div className={`rounded-xl border-2 p-4 ${
                        darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <span className={`text-xs font-bold mb-2 block font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}>
                            Pergunta *
                        </span>
                        <input
                            type="text"
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            placeholder="Ex: Como criar uma campanha"
                            disabled={submitting}
                            className={`w-full p-2 text-sm rounded-lg border-2 outline-none transition-colors ${
                                darkMode
                                    ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                            } disabled:opacity-50`}
                        />
                    </div>

                    {/* Current File Info */}
                    {currentFile && (
                        <div className={`rounded-xl border-2 p-4 ${
                            darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                        }`}>
                            <span className={`text-xs font-bold mb-2 block font-heading ${
                                darkMode ? 'text-white' : 'text-max-data'
                            }`}>
                                Arquivo Atual
                            </span>
                            <div className={`flex items-center gap-2 p-2 rounded-lg ${
                                darkMode ? 'bg-[#1a1a1a]' : 'bg-gray-50'
                            }`}>
                                <div className="w-8 h-8 rounded flex items-center justify-center bg-mid-data/10 flex-shrink-0">
                                    <span className="text-xs font-bold text-mid-data">
                                        {currentFile.split('.').pop()?.toUpperCase()}
                                    </span>
                                </div>
                                <p className={`text-xs font-medium flex-1 ${
                                    darkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                    {currentFile}
                                </p>
                            </div>
                            <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                Nota: A atualização de arquivos não está disponível nesta versão.
                            </p>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className={`rounded-xl border-2 p-4 flex flex-col ${
                    darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                }`}>
                    <span className={`text-xs font-bold mb-2 block font-heading ${
                        darkMode ? 'text-white' : 'text-max-data'
                    }`}>
                        Conteúdo/Resposta *
                    </span>
                    <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Digite o conteúdo detalhado da resposta..."
                        disabled={submitting}
                        className={`w-full flex-1 p-3 text-sm rounded-lg border-2 outline-none transition-colors resize-none ${
                            darkMode
                                ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500'
                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                        } disabled:opacity-50`}
                        rows={20}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
                <button
                    onClick={onCancel}
                    disabled={submitting}
                    className="px-8 py-3 rounded-xl font-medium transition-all hover:opacity-80 bg-high-data text-white disabled:opacity-50"
                >
                    Cancelar
                </button>

                <button
                    onClick={handleSubmit}
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
                            Atualizar Informação
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

export default EditForm;