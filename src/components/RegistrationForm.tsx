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
        { id: 'general' as Section, label: 'Dúvidas Gerais', colorClass: 'bg-max-data border-max-data', inactiveColorClass: 'text-gray-500' },
        { id: 'sms' as Section, label: 'SMS', colorClass: 'bg-high-data border-high-data', inactiveColorClass: 'text-gray-500' },
        { id: 'backoffice' as Section, label: 'Backoffice', colorClass: 'bg-mid-data border-mid-data', inactiveColorClass: 'text-gray-500' },
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
    };

    const getCategories = () => {
        if (formData.section === 'sms') return smsCategories;
        if (formData.section === 'backoffice') return backofficeCategories;
        return ['Dúvidas Gerais'];
    };

    return (
        <div className="font-sans">
            {/* Grid com 2 colunas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Coluna 1 */}
                <div className="space-y-4">
                    {/* Section Selection */}
                    <div className={`rounded-xl border-2 p-4 ${
                        darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <span className={`text-xs font-bold mb-2 block font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}>
                            Seção *
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => setFormData({ ...formData, section: section.id, category: '' })}
                                    className={`p-2 rounded-lg border-2 transition-all font-medium text-sm ${
                                        formData.section === section.id
                                            ? `${section.colorClass} text-white`
                                            : darkMode
                                                ? 'border-gray-700 text-gray-400'
                                                : 'border-gray-200 text-gray-600'
                                    }`}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Category Selection */}
                    {formData.section !== 'general' && (
                        <div className={`rounded-xl border-2 p-4 ${
                            darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                        }`}>
                            <span className={`text-xs font-bold mb-2 block font-heading ${
                                darkMode ? 'text-white' : 'text-max-data'
                            }`}>
                                Categoria *
                            </span>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className={`w-full p-2 text-sm rounded-lg border-2 outline-none transition-colors ${
                                    darkMode
                                        ? 'bg-[#1a1a1a] border-gray-700 text-white'
                                        : 'bg-white border-gray-200 text-gray-900'
                                }`}
                            >
                                <option value="">Selecione uma categoria</option>
                                {getCategories().map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Subcategory */}
                    <div className={`rounded-xl border-2 p-4 ${
                        darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <span className={`text-xs font-bold mb-2 block font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}>
                            Subtópico (Opcional)
                        </span>
                        <input
                            type="text"
                            value={formData.subcategory}
                            onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                            placeholder="Ex: Como criar uma campanha"
                            className={`w-full p-2 text-sm rounded-lg border-2 outline-none transition-colors ${
                                darkMode
                                    ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                            }`}
                        />
                    </div>

                    {/* Question */}
                    <div className={`rounded-xl border-2 p-4 ${
                        darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <span className={`text-xs font-bold mb-2 block font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}>
                            Pergunta/Título *
                        </span>
                        <input
                            type="text"
                            value={formData.question}
                            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                            placeholder="Digite a pergunta ou título do conteúdo"
                            className={`w-full p-2 text-sm rounded-lg border-2 outline-none transition-colors ${
                                darkMode
                                    ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                            }`}
                        />
                    </div>

                    {/* Tags */}
                    <div className={`rounded-xl border-2 p-4 ${
                        darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                        <span className={`text-xs font-bold mb-2 block font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}>
                            Tags (Opcional)
                        </span>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                placeholder="Digite uma tag e pressione Enter"
                                className={`flex-1 p-2 text-sm rounded-lg border-2 outline-none transition-colors ${
                                    darkMode
                                        ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500'
                                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                                }`}
                            />
                            <button
                                onClick={handleAddTag}
                                className="px-4 py-2 text-sm rounded-lg font-medium transition-all hover:opacity-90 bg-mid-data text-white"
                            >
                                +
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {formData.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-1 rounded text-xs font-medium flex items-center gap-1.5 bg-mid-data/10 text-max-data"
                                >
                                    {tag}
                                    <button
                                        onClick={() => handleRemoveTag(tag)}
                                        className="hover:text-red-500 transition-colors text-base leading-none"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Coluna 2 - Answer (textarea grande) */}
                <div className={`rounded-xl border-2 p-4 flex flex-col ${
                    darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200'
                }`}>
                    <span className={`text-xs font-bold mb-2 block font-heading ${
                        darkMode ? 'text-white' : 'text-max-data'
                    }`}>
                        Resposta/Conteúdo *
                    </span>
                    <textarea
                        value={formData.answer}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        placeholder="Digite o conteúdo detalhado da resposta..."
                        className={`w-full flex-1 p-3 text-sm rounded-lg border-2 outline-none transition-colors resize-none ${
                            darkMode
                                ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500'
                                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                        }`}
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                className="w-full p-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:opacity-90 bg-gradient-to-br from-max-data to-mid-data text-white"
            >
                <Save className="w-5 h-5" />
                Salvar Informação
            </button>
        </div>
    );
};

export default RegistrationForm;