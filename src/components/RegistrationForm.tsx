import { useState } from 'react';
import { Save } from 'lucide-react';

type Section = 'general' | 'sms' | 'backoffice';

interface FormData {
    section: Section;
    category: string;
    subcategory: string;
    question: string;
    answer: string;
    tags: string[];
}

interface RegistrationFormProps {
    darkMode: boolean;
}

const RegistrationForm = ({ darkMode }: RegistrationFormProps) => {
    const [currentTag, setCurrentTag] = useState('');
    const [formData, setFormData] = useState<FormData>({
        section: 'general',
        category: '',
        subcategory: '',
        question: '',
        answer: '',
        tags: [],
    });

    const sections = [
        { id: 'general' as Section, label: 'Dúvidas Gerais', color: '#155457' },
        { id: 'sms' as Section, label: 'SMS', color: '#268c90' },
        { id: 'backoffice' as Section, label: 'Backoffice', color: '#3fbec5' },
    ];

    const smsCategories = [
        'Campanhas', 'Blacklist', 'Financeiro', 'Empresas',
        'Serviços', 'Relatórios', 'API Externa', 'FAQ'
    ];

    const backofficeCategories = [
        'Operacional', 'Financeiro', 'Empresas', 'Fornecedores',
        'Mensageria', 'Monitoramento', 'Usuários Backoffice', 'FAQ'
    ];

    const handleAddTag = () => {
        if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
            setFormData({ ...formData, tags: [...formData.tags, currentTag.trim()] });
            setCurrentTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData({ ...formData, tags: formData.tags.filter(tag => tag !== tagToRemove) });
    };

    const handleSubmit = () => {
        if (!formData.question || !formData.answer) {
            alert('Por favor, preencha os campos obrigatórios');
            return;
        }
        console.log('Form submitted:', formData);
        alert('Informação cadastrada com sucesso!');
        // Aqui você pode adicionar a lógica para salvar no backend
    };

    const getCategories = () => {
        if (formData.section === 'sms') return smsCategories;
        if (formData.section === 'backoffice') return backofficeCategories;
        return ['Dúvidas Gerais'];
    };

    return (
        <div className="space-y-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Section Selection */}
            <div className="rounded-2xl border-2 p-6" style={{
                backgroundColor: darkMode ? '#1f1f1f' : '#fff',
                borderColor: darkMode ? '#374151' : '#e5e7eb',
            }}>
                <div className="block mb-4">
                    <span className="text-sm font-bold mb-3 block" style={{
                        fontFamily: 'Poppins, sans-serif',
                        color: darkMode ? '#fff' : '#155457'
                    }}>
                        Seção *
                    </span>
                    <div className="grid grid-cols-3 gap-3">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setFormData({ ...formData, section: section.id, category: '' })}
                                className="p-4 rounded-xl border-2 transition-all font-medium"
                                style={{
                                    backgroundColor: formData.section === section.id ? section.color : 'transparent',
                                    borderColor: formData.section === section.id ? section.color : (darkMode ? '#374151' : '#e5e7eb'),
                                    color: formData.section === section.id ? '#fff' : (darkMode ? '#9ca3af' : '#6b7280'),
                                }}
                            >
                                {section.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Category Selection */}
            {formData.section !== 'general' && (
                <div className="rounded-2xl border-2 p-6" style={{
                    backgroundColor: darkMode ? '#1f1f1f' : '#fff',
                    borderColor: darkMode ? '#374151' : '#e5e7eb',
                }}>
                    <div className="block">
                        <span className="text-sm font-bold mb-3 block" style={{
                            fontFamily: 'Poppins, sans-serif',
                            color: darkMode ? '#fff' : '#155457'
                        }}>
                            Categoria *
                        </span>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full p-3 rounded-xl border-2 outline-none transition-colors"
                            style={{
                                backgroundColor: darkMode ? '#1a1a1a' : '#fff',
                                borderColor: darkMode ? '#374151' : '#e5e7eb',
                                color: darkMode ? '#fff' : '#1f2937',
                            }}
                        >
                            <option value="">Selecione uma categoria</option>
                            {getCategories().map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Subcategory */}
            <div className="rounded-2xl border-2 p-6" style={{
                backgroundColor: darkMode ? '#1f1f1f' : '#fff',
                borderColor: darkMode ? '#374151' : '#e5e7eb',
            }}>
                <div className="block">
                    <span className="text-sm font-bold mb-3 block" style={{
                        fontFamily: 'Poppins, sans-serif',
                        color: darkMode ? '#fff' : '#155457'
                    }}>
                        Subtópico (Opcional)
                    </span>
                    <input
                        type="text"
                        value={formData.subcategory}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        placeholder="Ex: Como criar uma campanha"
                        className="w-full p-3 rounded-xl border-2 outline-none transition-colors"
                        style={{
                            backgroundColor: darkMode ? '#1a1a1a' : '#fff',
                            borderColor: darkMode ? '#374151' : '#e5e7eb',
                            color: darkMode ? '#fff' : '#1f2937',
                        }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="rounded-2xl border-2 p-6" style={{
                backgroundColor: darkMode ? '#1f1f1f' : '#fff',
                borderColor: darkMode ? '#374151' : '#e5e7eb',
            }}>
                <div className="block">
                    <span className="text-sm font-bold mb-3 block" style={{
                        fontFamily: 'Poppins, sans-serif',
                        color: darkMode ? '#fff' : '#155457'
                    }}>
                        Pergunta/Título *
                    </span>
                    <input
                        type="text"
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        placeholder="Digite a pergunta ou título do conteúdo"
                        className="w-full p-3 rounded-xl border-2 outline-none transition-colors"
                        style={{
                            backgroundColor: darkMode ? '#1a1a1a' : '#fff',
                            borderColor: darkMode ? '#374151' : '#e5e7eb',
                            color: darkMode ? '#fff' : '#1f2937',
                        }}
                    />
                </div>
            </div>

            {/* Answer */}
            <div className="rounded-2xl border-2 p-6" style={{
                backgroundColor: darkMode ? '#1f1f1f' : '#fff',
                borderColor: darkMode ? '#374151' : '#e5e7eb',
            }}>
                <div className="block">
                    <span className="text-sm font-bold mb-3 block" style={{
                        fontFamily: 'Poppins, sans-serif',
                        color: darkMode ? '#fff' : '#155457'
                    }}>
                        Resposta/Conteúdo *
                    </span>
                    <textarea
                        value={formData.answer}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        placeholder="Digite o conteúdo detalhado da resposta..."
                        rows={8}
                        className="w-full p-3 rounded-xl border-2 outline-none transition-colors resize-none"
                        style={{
                            backgroundColor: darkMode ? '#1a1a1a' : '#fff',
                            borderColor: darkMode ? '#374151' : '#e5e7eb',
                            color: darkMode ? '#fff' : '#1f2937',
                        }}
                    />
                </div>
            </div>

            {/* Tags */}
            <div className="rounded-2xl border-2 p-6" style={{
                backgroundColor: darkMode ? '#1f1f1f' : '#fff',
                borderColor: darkMode ? '#374151' : '#e5e7eb',
            }}>
                <div className="block">
                    <span className="text-sm font-bold mb-3 block" style={{
                        fontFamily: 'Poppins, sans-serif',
                        color: darkMode ? '#fff' : '#155457'
                    }}>
                        Tags (Opcional)
                    </span>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                            placeholder="Digite uma tag e pressione Enter"
                            className="flex-1 p-3 rounded-xl border-2 outline-none transition-colors"
                            style={{
                                backgroundColor: darkMode ? '#1a1a1a' : '#fff',
                                borderColor: darkMode ? '#374151' : '#e5e7eb',
                                color: darkMode ? '#fff' : '#1f2937',
                            }}
                        />
                        <button
                            onClick={handleAddTag}
                            className="px-6 py-3 rounded-xl font-medium transition-all hover:opacity-90"
                            style={{
                                backgroundColor: '#3fbec5',
                                color: '#fff',
                            }}
                        >
                            Adicionar
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2"
                                style={{
                                    backgroundColor: '#3fbec520',
                                    color: '#155457',
                                }}
                            >
                                {tag}
                                <button
                                    onClick={() => handleRemoveTag(tag)}
                                    className="hover:text-red-500 transition-colors"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                className="w-full p-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:opacity-90"
                style={{
                    background: 'linear-gradient(135deg, #155457 0%, #3fbec5 100%)',
                    color: '#fff',
                }}
            >
                <Save className="w-5 h-5" />
                Salvar Informação
            </button>
        </div>
    );
};

export default RegistrationForm;