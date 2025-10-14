import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { loginUser, type LoginRequest, type LoginResponse } from '../services/login.service';

interface AuthContextData {
    user: LoginResponse['user'] | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (data: LoginRequest) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<LoginResponse['user'] | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 🔁 Restaura o login salvo
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (savedToken) {
            setToken(savedToken);
            if (savedUser) setUser(JSON.parse(savedUser));
        }
    }, []);

    async function login(credentials: LoginRequest): Promise<boolean> {
        setLoading(true);
        setError(null);
        try {
            const res = await loginUser(credentials);
            setUser(res.user || null);
            setToken(res.access_token);
            localStorage.setItem('token', res.access_token);
            localStorage.setItem('user', JSON.stringify(res.user || {}));
            return true;
        } catch (err: any) {
            setError(err.message || 'Erro ao autenticar');
            return false;
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                loading,
                error,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext deve ser usado dentro de um AuthProvider');
    }
    return context;
}
