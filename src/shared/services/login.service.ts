// src/shared/services/login.service.ts
export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Credenciais inválidas');
        }

        return await response.json();
    } catch (error: any) {
        console.error('Erro ao fazer login:', error);
        throw new Error(error.message || 'Erro na conexão com o servidor');
    }
}

export function saveAuthToken(token: string): void {
    localStorage.setItem('token', token);
}

export function getAuthToken(): string | null {
    return localStorage.getItem('token');
}

export function removeAuthToken(): void {
    localStorage.removeItem('token');
}

export function isAuthenticated(): boolean {
    return !!getAuthToken();
}