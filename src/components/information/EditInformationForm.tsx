import { useState, useEffect } from 'react';
import { Save, Upload, X } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Toast from '../utils/Toast.tsx';
import {
    getInformationById,
    updateInformation,
} from '../../shared/services/information.service.ts';
import { getAllCategories } from '../../shared/services/category.service.ts';
import type { InformationUpdateRequest } from '../../shared/interfaces/information.interface.ts';
import type { CategoryViewResponse } from '../../shared/interfaces/category.interface.ts';

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
    files: File[];
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

const EditInformationForm = ({ darkMode, editingId, onSuccess, onCancel }: EditFormProps) => {
    const [formData, setFormData] = useState<FormData>({
        category_identifier: '',
        sub_category_identifier: '',
        question: '',
        content: '',
        file_identifier: undefined,
        files: [],
    });
    const [categories, setCategories] = useState<CategoryViewResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentFile, setCurrentFile] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

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
            setFormData(prev => ({ ...prev, content: editor.getHTML() }));
        },
    });

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
                files: [],
            });

            // Carrega o conteúdo no editor
            if (editor) {
                editor.commands.setContent(informationData.content);
            }

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

    // Atualiza o editor quando o conteúdo é carregado
    useEffect(() => {
        if (editor && formData.content && !loading) {
            editor.commands.setContent(formData.content);
        }
    }, [editor, loading]);

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
                setToast({
                    message: 'Alguns arquivos foram ignorados. Apenas PDF e DOCX são permitidos.',
                    type: 'warning'
                });
            }

            setFormData({ ...formData, files: [...formData.files, ...validFiles] });
        }
    };

    const handleRemoveFile = (index: number) => {
        setFormData({ ...formData, files: formData.files.filter((_, i) => i !== index) });
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
                            Subtópico/Pergunta *
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

                    {/* File Upload */}
                    <div className={`rounded-xl border-2 p-4 ${
                        darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <span className={`text-xs font-bold mb-2 block font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}>
                            Arquivos (Opcional)
                        </span>

                        {/* Current File Display */}
                        {currentFile && (
                            <div className="mb-3">
                                <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Arquivo atual:
                                </p>
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
                            </div>
                        )}

                        <div className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                            darkMode
                                ? 'border-gray-700 hover:border-gray-600'
                                : 'border-gray-300 hover:border-gray-400'
                        }`}>
                            <input
                                type="file"
                                id="file-upload-edit"
                                multiple
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={submitting}
                            />
                            <label
                                htmlFor="file-upload-edit"
                                className={`cursor-pointer flex flex-col items-center gap-2 ${
                                    submitting ? 'opacity-50 pointer-events-none' : ''
                                }`}
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
                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Novos arquivos:
                                </p>
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
                                            disabled={submitting}
                                            className="p-1 hover:bg-red-500/10 rounded transition-colors flex-shrink-0 disabled:opacity-50"
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
                    onClick={onCancel}
                    disabled={submitting}
                    className="px-6 py-2 rounded-xl font-medium transition-all hover:opacity-80 bg-high-data text-white disabled:opacity-50"
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

export default EditInformationForm;