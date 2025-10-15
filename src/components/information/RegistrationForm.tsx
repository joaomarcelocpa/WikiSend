import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Upload, X } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { createInformation } from '../../shared/services/information.service.ts';
import { getAllCategories } from '../../shared/services/category.service.ts';
import type { CategoryViewResponse } from '../../shared/interfaces/category.interface.ts';
import Toast from '../utils/Toast.tsx';

interface FormData {
    categoryIdentifier: string;
    subCategoryIdentifier: string;
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

// Componente da barra de ferramentas do editor
const EditorMenuBar = ({ editor, darkMode }: { editor: any; darkMode: boolean }) => {
    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt('URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const buttonClass = `px-3 py-1.5 border rounded hover:opacity-80 text-xs font-medium transition-all ${
        darkMode
            ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
            : 'border-gray-300 text-gray-700 hover:bg-gray-100'
    }`;

    const activeClass = darkMode
        ? 'bg-high-data border-high-data text-white'
        : 'bg-high-data border-high-data text-white';

    return (
        <div className={`border-b p-2 flex flex-wrap gap-2 ${
            darkMode ? 'border-gray-700 bg-[#1a1a1a]' : 'border-gray-200 bg-gray-50'
        }`}>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`${buttonClass} font-bold ${editor.isActive('bold') ? activeClass : ''}`}
            >
                B
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`${buttonClass} italic ${editor.isActive('italic') ? activeClass : ''}`}
            >
                I
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`${buttonClass} underline ${editor.isActive('underline') ? activeClass : ''}`}
            >
                U
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                className={`${buttonClass} ${editor.isActive('highlight') ? activeClass : ''}`}
            >
                Destacar
            </button>

            <div className={`w-px h-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`${buttonClass} ${editor.isActive('heading', { level: 1 }) ? activeClass : ''}`}
            >
                H1
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`${buttonClass} ${editor.isActive('heading', { level: 2 }) ? activeClass : ''}`}
            >
                H2
            </button>

            <div className={`w-px h-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />

            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`${buttonClass} ${editor.isActive({ textAlign: 'left' }) ? activeClass : ''}`}
            >
                ⬅
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`${buttonClass} ${editor.isActive({ textAlign: 'center' }) ? activeClass : ''}`}
            >
                ↔
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`${buttonClass} ${editor.isActive({ textAlign: 'right' }) ? activeClass : ''}`}
            >
                ➡
            </button>

            <div className={`w-px h-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`${buttonClass} ${editor.isActive('bulletList') ? activeClass : ''}`}
            >
                • Lista
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`${buttonClass} ${editor.isActive('orderedList') ? activeClass : ''}`}
            >
                1. Lista
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`${buttonClass} ${editor.isActive('blockquote') ? activeClass : ''}`}
            >
                " Citação
            </button>

            <div className={`w-px h-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />

            <button
                type="button"
                onClick={addLink}
                className={`${buttonClass} ${editor.isActive('link') ? activeClass : ''}`}
            >
                🔗 Link
            </button>

            <div className={`w-px h-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />

            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                className={buttonClass}
                disabled={!editor.can().undo()}
            >
                ↶
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                className={buttonClass}
                disabled={!editor.can().redo()}
            >
                ↷
            </button>
        </div>
    );
};

const RegistrationForm = ({ darkMode }: RegistrationFormProps) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        categoryIdentifier: '',
        subCategoryIdentifier: '',
        question: '',
        content: '',
        files: [],
    });

    const [categories, setCategories] = useState<CategoryViewResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: '',
        type: 'success'
    });

    // Configuração do editor Tiptap
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Highlight,
            Link.configure({
                openOnClick: false,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: '',
        onUpdate: ({ editor }) => {
            // Atualiza o conteúdo do formulário quando o editor muda
            setFormData(prev => ({ ...prev, content: editor.getHTML() }));
        },
        editorProps: {
            attributes: {
                class: `prose prose-sm max-w-none focus:outline-none ${
                    darkMode ? 'prose-invert' : ''
                }`,
            },
        },
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
            const data = await getAllCategories();
            setCategories(data);

            if (data.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    categoryIdentifier: data[0].identifier
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

    const handleCategoryChange = (value: string) => {
        setFormData({
            ...formData,
            categoryIdentifier: value,
            subCategoryIdentifier: ''
        });
    };

    const handleSubmit = async () => {
        if (!formData.question.trim() || !formData.content.trim()) {
            showToast('Por favor, preencha a pergunta e o conteúdo antes de continuar.', 'warning');
            return;
        }

        if (!formData.subCategoryIdentifier) {
            showToast('Por favor, selecione uma subcategoria antes de salvar.', 'warning');
            return;
        }

        setSubmitting(true);

        try {
            const fileIdentifier = undefined;

            await createInformation({
                question: formData.question,
                content: formData.content, // Já está em HTML do editor
                file_identifier: fileIdentifier,
                category_identifier: formData.categoryIdentifier,
                sub_category_identifier: formData.subCategoryIdentifier,
            });

            showToast('Informação cadastrada com sucesso!', 'success');

            setTimeout(() => {
                navigate('/register');
            }, 1500);

            // Limpa o editor e o formulário
            editor?.commands.setContent('');
            setFormData({
                categoryIdentifier: categories[0]?.identifier || '',
                subCategoryIdentifier: '',
                question: '',
                content: '',
                files: [],
            });

        } catch (error: any) {
            const errorMessage = error.message || 'Ocorreu um erro ao salvar a informação. Tente novamente.';
            showToast(errorMessage, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const getCurrentSubCategories = () => {
        if (!formData.categoryIdentifier) return [];
        const selectedCategory = categories.find(cat => cat.identifier === formData.categoryIdentifier);
        return selectedCategory?.subCategories || [];
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
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}

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
                        <div className="grid grid-cols-3 gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category.identifier}
                                    type="button"
                                    onClick={() => handleCategoryChange(category.identifier)}
                                    className={`p-2 rounded-lg border-2 transition-all font-medium text-sm ${
                                        formData.categoryIdentifier === category.identifier
                                            ? 'bg-high-data border-high-data text-white'
                                            : darkMode
                                                ? 'border-gray-700 text-gray-400'
                                                : 'border-gray-200 text-gray-600'
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SubCategory Selection */}
                    <div className={`rounded-xl border-2 p-4 ${
                        darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <span className={`text-xs font-bold mb-2 block font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}>
                            Subcategoria *
                        </span>
                        <select
                            value={formData.subCategoryIdentifier}
                            onChange={(e) => setFormData({ ...formData, subCategoryIdentifier: e.target.value })}
                            className={`w-full p-2 text-sm rounded-lg border-2 outline-none transition-colors ${
                                darkMode
                                    ? 'bg-[#1a1a1a] border-gray-700 text-white'
                                    : 'bg-white border-gray-200 text-gray-900'
                            }`}
                        >
                            <option value="">Selecione uma subcategoria</option>
                            {getCurrentSubCategories().map((subCat) => (
                                <option key={subCat.identifier} value={subCat.identifier}>
                                    {subCat.name}
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
                                            type="button"
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

                {/* Content with Tiptap Editor */}
                <div className={`rounded-xl border-2 flex flex-col overflow-hidden ${
                    darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                }`}>
                    <div className="p-4 pb-2">
                        <span className={`text-xs font-bold block font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}>
                            Conteúdo *
                        </span>
                    </div>

                    <EditorMenuBar editor={editor} darkMode={darkMode} />

                    <div className={`flex-1 overflow-y-auto ${
                        darkMode ? 'bg-[#1a1a1a]' : 'bg-white'
                    }`}>
                        <EditorContent
                            editor={editor}
                            className={`p-4 min-h-[400px] ${
                                darkMode ? 'text-white' : 'text-gray-900'
                            }`}
                        />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    disabled={submitting}
                    className="px-6 py-2 rounded-xl font-medium transition-all hover:opacity-80 bg-high-data text-white disabled:opacity-50"
                >
                    Voltar
                </button>

                <button
                    type="button"
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