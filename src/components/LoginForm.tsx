// src/components/LoginForm.tsx
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../shared/hooks/useAuth';

interface LoginFormProps {
    darkMode: boolean;
}

const LoginForm = ({ darkMode }: LoginFormProps) => {
    const { login, loading, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Previne múltiplas submissões
        if (loading) {
            return;
        }

        setLocalError('');

        if (!email || !password) {
            setLocalError('Por favor, preencha todos os campos');
            return;
        }

        console.log('Tentando fazer login...');
        const success = await login({ email, password });

        if (success) {
            console.log('Login realizado com sucesso!');
            // O redirecionamento é feito automaticamente pelo Login.tsx
            // através do useEffect que observa isAuthenticated
        } else {
            console.log('Erro no login:', error);
            setLocalError(error || 'Erro ao efetuar login');
        }
    };

    return (
        <div
            className={`rounded-2xl border-2 p-8 ${
                darkMode ? 'bg-[#1f1f1f] border-gray-700' : 'bg-white border-gray-200 shadow-xl'
            }`}
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                    <label
                        className={`block text-sm font-bold mb-2 font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}
                    >
                        E-mail
                    </label>
                    <div className="relative">
                        <Mail
                            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                                darkMode ? 'text-gray-500' : 'text-gray-400'
                            }`}
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            placeholder="seu@email.com"
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 outline-none transition-colors ${
                                darkMode
                                    ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500 focus:border-mid-data disabled:opacity-50'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-mid-data disabled:opacity-50'
                            }`}
                        />
                    </div>
                </div>

                {/* Senha */}
                <div>
                    <label
                        className={`block text-sm font-bold mb-2 font-heading ${
                            darkMode ? 'text-white' : 'text-max-data'
                        }`}
                    >
                        Senha
                    </label>
                    <div className="relative">
                        <Lock
                            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                                darkMode ? 'text-gray-500' : 'text-gray-400'
                            }`}
                        />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            placeholder="••••••••"
                            className={`w-full pl-11 pr-12 py-3 rounded-xl border-2 outline-none transition-colors ${
                                darkMode
                                    ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500 focus:border-mid-data disabled:opacity-50'
                                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-mid-data disabled:opacity-50'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                                darkMode
                                    ? 'text-gray-500 hover:text-gray-300 disabled:opacity-50'
                                    : 'text-gray-400 hover:text-gray-600 disabled:opacity-50'
                            }`}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mensagem de Erro */}
                {(localError || error) && (
                    <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-3">
                        <p className="text-red-500 text-sm text-center font-medium">
                            {localError || error}
                        </p>
                    </div>
                )}

                {/* Botão */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-bold text-base transition-all hover:shadow-xl hover:opacity-90 bg-high-data text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;