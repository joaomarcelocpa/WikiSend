import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
    darkMode: boolean;
    onLogin: () => void;
}

const LoginForm = ({ darkMode, onLogin }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validação simples
        if (!email || !password) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        if (!email.includes('@')) {
            setError('Por favor, insira um e-mail válido');
            return;
        }

        // Aceita qualquer login válido
        onLogin();
    };

    return (
        <div className={`rounded-2xl border-2 p-8 ${
            darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200 shadow-xl'
        }`}>
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                    <label className={`block text-sm font-bold mb-2 font-heading ${
                        darkMode ? 'text-white' : 'text-max-data'
                    }`}>
                        E-mail
                    </label>
                    <div className="relative">
                        <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                            darkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 outline-none transition-colors ${
                                darkMode
                                    ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500 focus:border-mid-data'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-mid-data'
                            }`}
                        />
                    </div>
                </div>

                {/* Senha */}
                <div>
                    <label className={`block text-sm font-bold mb-2 font-heading ${
                        darkMode ? 'text-white' : 'text-max-data'
                    }`}>
                        Senha
                    </label>
                    <div className="relative">
                        <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                            darkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className={`w-full pl-11 pr-12 py-3 rounded-xl border-2 outline-none transition-colors ${
                                darkMode
                                    ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500 focus:border-mid-data'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-mid-data'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                                darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mensagem de Erro */}
                {error && (
                    <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-3">
                        <p className="text-red-500 text-sm text-center font-medium">
                            {error}
                        </p>
                    </div>
                )}

                {/* Botão de Login */}
                <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-base transition-all hover:shadow-xl hover:opacity-90 bg-high-data text-white"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
};

export default LoginForm;