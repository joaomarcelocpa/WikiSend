import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Upload, X } from 'lucide-react';
import { getCategories, createInformation } from '../shared/services/information.service';
import type { CategoryHierarchyResponse } from '../shared/interfaces/information.interface';
import Toast from './Toast';

interface FormData {
    mainCategory: string;
    subCategory: string;
    question: string;
    content: string;
    files: File[];
}

interface RegistrationFormProps {
    darkMode: boolean;
    onBack?: () => void;
}

interface ToastState {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning';
}

const RegistrationForm = ({ darkMode }: RegistrationFormProps) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        mainCategory: '',
        subCategory: '',
        question: '',
        content: '',
        files: [],
    });

    const [categories, setCategories] = useState<CategoryHierarchyResponse | null>(null);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);

            if (data.mainCategories.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    mainCategory: data.mainCategories[0].value
                }));
            }
        } catch (error) {
            console.error('Erro ao carregar categorias:', error);
            showToast('Não foi possível carregar as categorias. Por favor, recarregue a página.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            const filesArray = Array.from(selectedFiles);
            const validFiles = filesArray.filter(file =>
                file.type === 'application/pdf' ||
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.type === 'application/msword'
            );

            if (validFiles.length !== filesArray.length) {
                showToast('Alguns arquivos foram ignorados. Apenas PDF e DOCX são permitidos.', 'warning');
            }

            setFormData({ ...formData, files: [...formData.files, ...validFiles] });
        }
    };

    const handleRemoveFile = (index: number) => {
        setFormData({ ...formData, files: formData.files.filter((_, i) => i !== index) });
    };

    const handleMainCategoryChange = (value: string) => {
        setFormData({
            ...formData,
            mainCategory: value,
            subCategory: ''
        });
    };

    const handleSubmit = async () => {
        if (!formData.question.trim() || !formData.content.trim()) {
            showToast('Por favor, preencha a pergunta e o conteúdo antes de continuar.', 'warning');
            return;
        }

        if (!formData.subCategory) {
            showToast('Por favor, selecione uma categoria antes de salvar.', 'warning');
            return;
        }

        setSubmitting(true);

        try {
            const fileIdentifier = undefined;

            await createInformation({
                question: formData.question,
                content: formData.content,
                file_identifier: fileIdentifier,
                main_category: formData.mainCategory,
                sub_category: formData.subCategory,
            });

            showToast('Informação cadastrada com sucesso!', 'success');


            setTimeout(() => {
                navigate('/register');
            }, 1500);

            setFormData({
                mainCategory: categories?.mainCategories[0]?.value || '',
                subCategory: '',
                question: '',
                content: '',
                files: [],
            });

        } catch (error: any) {
            console.error('Erro ao cadastrar informação:', error);
            const errorMessage = error.message || 'Ocorreu um erro ao salvar a informação. Tente novamente.';
            showToast(errorMessage, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const getCurrentSubCategories = () => {
        if (!categories || !formData.mainCategory) return [];
        return categories.subCategories[formData.mainCategory] || [];
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className={`text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Carregando formulário...
                </div>
            </div>
        );
    }

    return (
        <div className="font-sans">
            {/* Toast Notification */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}

            {/* Grid com 2 colunas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Coluna 1 */}
                <div className="space-y-4">
                    {/* Main Category Selection */}
                    <div className={`rounded-xl border-2 p-4 ${
                        darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <span className={`text-xs font-bold mb-2 block font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}>
                            Seção *
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                            {categories?.mainCategories.map((category) => (
                                <button
                                    key={category.value}
                                    onClick={() => handleMainCategoryChange(category.value)}
                                    className={`p-2 rounded-lg border-2 transition-all font-medium text-sm ${
                                        formData.mainCategory === category.value
                                            ? 'bg-high-data border-high-data text-white'
                                            : darkMode
                                                ? 'border-gray-700 text-gray-400'
                                                : 'border-gray-200 text-gray-600'
                                    }`}
                                >
                                    {category.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sub Category Selection */}
                    <div className={`rounded-xl border-2 p-4 ${
                        darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <span className={`text-xs font-bold mb-2 block font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}>
                            Categoria *
                        </span>
                        <select
                            value={formData.subCategory}
                            onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                            className={`w-full p-2 text-sm rounded-lg border-2 outline-none transition-colors ${
                                darkMode
                                    ? 'bg-[#1a1a1a] border-gray-700 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'
                            }`}
                        >
                            <option value="">Selecione uma categoria</option>
                            {getCurrentSubCategories().map((subCat) => (
                                <option key={subCat.value} value={subCat.value}>
                                    {subCat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Question */}
                    <div className={`rounded-xl border-2 p-4 ${
                        darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <span className={`text-xs font-bold mb-2 block font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}>
                            Subtópico/Pergunta *
                        </span>
                        <input
                            type="text"
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            placeholder="Ex: Como criar uma campanha"
                            className={`w-full p-2 text-sm rounded-lg border-2 outline-none transition-colors ${
                                darkMode
                                    ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                            }`}
                        />
                    </div>

                    {/* File Upload */}
                    <div className={`rounded-xl border-2 p-4 ${
                        darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <span className={`text-xs font-bold mb-2 block font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}>
                            Arquivos (Opcional)
                        </span>
                        <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                            darkMode
                                ? 'border-gray-700 hover:border-gray-600'
                                : 'border-gray-300 hover:border-gray-400'
                        }`}>
                            <input
                                type="file"
                                id="file-upload"
                                multiple
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer flex flex-col items-center gap-2"
                            >
                                <Upload className={`w-8 h-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Clique ou arraste arquivos
                                </span>
                                <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                    PDF ou DOCX (máx 10MB)
                                </span>
                            </label>
                        </div>

                        {/* Lista de arquivos */}
                        {formData.files.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {formData.files.map((file, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between p-2 rounded-lg ${
                                            darkMode ? 'bg-[#1a1a1a]' : 'bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <div className="w-8 h-8 rounded flex items-center justify-center bg-mid-data/10 flex-shrink-0">
                                                <span className="text-xs font-bold text-mid-data">
                                                    {file.name.split('.').pop()?.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-medium truncate ${
                                                    darkMode ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                    {file.name}
                                                </p>
                                                <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFile(index)}
                                            className="p-1 hover:bg-red-500/10 rounded transition-colors flex-shrink-0"
                                        >
                                            <X className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Coluna 2 - Content (textarea grande) */}
                <div className={`rounded-xl border-2 p-4 flex flex-col ${
                    darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                }`}>
                    <span className={`text-xs font-bold mb-2 block font-heading ${
                        darkMode ? 'text-white' : 'text-max-data'
                    }`}>
                        Resposta/Conteúdo *
                    </span>
                    <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Digite o conteúdo detalhado da resposta..."
                        className={`w-full flex-1 p-3 text-sm rounded-lg border-2 outline-none transition-colors resize-none ${
                            darkMode
                                ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500'
                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                        }`}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
                <div className="flex justify-start">
                    <button
                        onClick={() => navigate('/')}
                        disabled={submitting}
                        className="px-6 py-2 rounded-xl font-medium transition-all hover:opacity-80 bg-high-data text-white disabled:opacity-50"
                    >
                        Voltar
                    </button>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-8 py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:opacity-90 bg-high-data text-white disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {submitting ? 'Salvando...' : 'Salvar Informação'}
                </button>
            </div>
        </div>
    );
};

export default RegistrationForm;