import type {LoginRequest, LoginResponse} from "../interfaces/login.interface.ts";

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
    } catch (error: boolean | unknown) {
        throw new Error((error instanceof Error ? error.message : 'Erro na conexão com o servidor'));
    }
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