import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Plus } from 'lucide-react';
import { createCategory } from '../shared/services/category.service';
import Toast from './Toast';

interface RegisterCategoryFormProps {
    darkMode: boolean;
}

interface ToastState {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning';
}

const RegisterCategoryForm = ({ darkMode }: RegisterCategoryFormProps) => {
    const navigate = useNavigate();
    const [categoryName, setCategoryName] = useState('');
    const [subCategories, setSubCategories] = useState<string[]>(['']);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: '',
        type: 'success'
    });

    const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
        setToast({ show: true, message, type });
    };

    const closeToast = () => {
        setToast({ ...toast, show: false });
    };

    const handleAddSubCategory = () => {
        setSubCategories([...subCategories, '']);
    };

    const handleRemoveSubCategory = (index: number) => {
        setSubCategories(subCategories.filter((_, i) => i !== index));
    };

    const handleSubCategoryChange = (index: number, value: string) => {
        const updated = [...subCategories];
        updated[index] = value;
        setSubCategories(updated);
    };

    const handleSubmit = async () => {
        if (!categoryName.trim()) {
            showToast('Por favor, preencha o nome da categoria.', 'warning');
            return;
        }

        const validSubCategories = subCategories.filter(sub => sub.trim() !== '');

        setSubmitting(true);

        try {
            await createCategory({
                name: categoryName,
                subCategoryNames: validSubCategories.length > 0 ? validSubCategories : undefined,
            });

            showToast('Categoria cadastrada com sucesso!', 'success');

            setTimeout(() => {
                navigate('/edit-category');
            }, 1500);

            setCategoryName('');
            setSubCategories(['']);
        } catch (error: any) {
            console.error('Erro ao cadastrar categoria:', error);
            const errorMessage = error.message || 'Ocorreu um erro ao salvar a categoria. Tente novamente.';
            showToast(errorMessage, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="font-sans">
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}

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
                        placeholder="Ex: PAINEL SMS"
                        className={`w-full p-2 text-sm rounded-lg border-2 outline-none transition-colors ${
                            darkMode
                                ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500'
                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                        }`}
                    />
                </div>

                {/* SubCategories */}
                <div className={`rounded-xl border-2 p-4 ${
                    darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                }`}>
                    <div className="flex justify-between items-center mb-3">
                        <span className={`text-xs font-bold font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}>
                            Subcategorias (Opcional)
                        </span>
                        <button
                            onClick={handleAddSubCategory}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all bg-high-data text-white hover:opacity-80"
                        >
                            <Plus className="w-4 h-4" />
                            Adicionar
                        </button>
                    </div>

                    <div className="space-y-2">
                        {subCategories.map((subCat, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={subCat}
                                    onChange={(e) => handleSubCategoryChange(index, e.target.value)}
                                    placeholder={`Subcategoria ${index + 1}`}
                                    className={`flex-1 p-2 text-sm rounded-lg border-2 outline-none transition-colors ${
                                        darkMode
                                            ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500'
                                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                                    }`}
                                />
                                {subCategories.length > 1 && (
                                    <button
                                        onClick={() => handleRemoveSubCategory(index)}
                                        className="p-2 hover:bg-red-500/10 rounded transition-colors"
                                    >
                                        <X className="w-4 h-4 text-red-500" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-6">
                <button
                    onClick={() => navigate('/')}
                    disabled={submitting}
                    className="px-6 py-2 rounded-xl font-medium transition-all hover:opacity-80 bg-high-data text-white disabled:opacity-50"
                >
                    Voltar
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-8 py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:opacity-90 bg-high-data text-white disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {submitting ? 'Salvando...' : 'Salvar Categoria'}
                </button>
            </div>
        </div>
    );
};

export default RegisterCategoryForm;