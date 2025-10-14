import { useState } from 'react';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';

type Section = 'general' | 'sms' | 'backoffice';

interface FormData {
    section: Section;
    category: string;
    subtopic: string;
    answer: string;
    files: File[];
}

interface RegistrationFormProps {
    darkMode: boolean;
    onBack: () => void;
}

const RegistrationForm = ({ darkMode, onBack }: RegistrationFormProps) => {
    const [formData, setFormData] = useState<FormData>({
        section: 'general',
        category: '',
        subtopic: '',
        answer: '',
        files: [],
    });

    const sections = [
        { id: 'sms' as Section, label: 'SMS', colorClass: 'bg-high-data border-high-data' },
        { id: 'backoffice' as Section, label: 'Backoffice', colorClass: 'bg-high-data border-mid-data' },
        { id: 'general' as Section, label: 'Dúvidas Gerais', colorClass: 'bg-high-data border-max-data' },
    ];

    const smsCategories = [
        'Campanhas', 'Blacklist', 'Financeiro', 'Empresas',
        'Serviços', 'Relatórios', 'API Externa', 'FAQ'
    ];

    const backofficeCategories = [
        'Operacional', 'Financeiro', 'Empresas', 'Fornecedores',
        'Mensageria', 'Monitoramento', 'Usuários Backoffice', 'FAQ'
    ];

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
                alert('Apenas arquivos PDF e DOCX são permitidos');
            }

            setFormData({ ...formData, files: [...formData.files, ...validFiles] });
        }
    };

    const handleRemoveFile = (index: number) => {
        setFormData({ ...formData, files: formData.files.filter((_, i) => i !== index) });
    };

    const handleSubmit = () => {
        if (!formData.subtopic || !formData.answer) {
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

                    {/* Subtopic/Question */}
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
                            value={formData.subtopic}
                            onChange={(e) => setFormData({ ...formData, subtopic: e.target.value })}
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

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
                <button
                    onClick={onBack}
                    className="flex items-center text-mid-data hover:text-high-data transition-colors font-medium"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Voltar
                </button>

                <button
                    onClick={handleSubmit}
                    className="px-8 py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:opacity-90 bg-high-data text-white"
                >
                    <Save className="w-5 h-5" />
                    Salvar Informação
                </button>
            </div>
        </div>
    );
};

export default RegistrationForm;