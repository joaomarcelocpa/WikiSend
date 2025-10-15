import { getAuthToken } from './login.service';
import type {
    CategoryHierarchyResponse,
    InformationCreateRequest,
    InformationCreateResponse,
    InformationViewResponse,
    InformationUpdateRequest,
    InformationDeleteResponse,
} from '../interfaces/information.interface';

const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders(): HeadersInit {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
}

export async function getCategories(): Promise<CategoryHierarchyResponse> {
    try {
        const response = await fetch(`${API_URL}/information/types/categories`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar categorias');
        }

        return await response.json();
    } catch (error: string | unknown) {
        throw new Error((error instanceof Error ? error.message : 'Erro na conexão com o servidor'));
    }
}

export async function createInformation(
    data: InformationCreateRequest
): Promise<InformationCreateResponse> {
    try {
        const response = await fetch(`${API_URL}/information`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao criar informação');
        }

        return await response.json();
    } catch (error: string | unknown) {
        throw new Error((error instanceof Error ? error.message : 'Erro na conexão com o servidor'));
    }
}

export async function getAllInformation(): Promise<InformationViewResponse[]> {
    try {
        const response = await fetch(`${API_URL}/information`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar informações');
        }

        return await response.json();
    } catch (error: string | unknown) {
        throw new Error((error instanceof Error ? error.message : 'Erro na conexão com o servidor'));
    }
}

export async function getInformationByMainCategory(
    mainCategory: string
): Promise<InformationViewResponse[]> {
    try {
        const response = await fetch(
            `${API_URL}/information?mainCategory=${encodeURIComponent(mainCategory)}`,
            {
                method: 'GET',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao buscar informações por categoria');
        }

        return await response.json();
    } catch (error: string | unknown) {
        throw new Error((error instanceof Error ? error.message : 'Erro na conexão com o servidor'));
    }
}

export async function getInformationBySubCategory(
    subCategory: string
): Promise<InformationViewResponse[]> {
    try {
        const response = await fetch(
            `${API_URL}/information?subCategory=${encodeURIComponent(subCategory)}`,
            {
                method: 'GET',
                headers: getAuthHeaders(),
            }
        );

        if (!response.ok) {
            throw new Error('Erro ao buscar informações por subcategoria');
        }

        return await response.json();
    } catch (error: string | unknown) {
        throw new Error((error instanceof Error ? error.message : 'Erro na conexão com o servidor'));
    }
}

export async function getInformationById(
    identifier: string
): Promise<InformationViewResponse> {
    try {
        const response = await fetch(`${API_URL}/information/${identifier}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Informação não encontrada');
        }

        return await response.json();
    } catch (error: string | unknown) {
        throw new Error((error instanceof Error ? error.message : 'Erro na conexão com o servidor'));
    }
}

export async function updateInformation(
    identifier: string,
    data: InformationUpdateRequest
): Promise<InformationCreateResponse> {
    try {
        const response = await fetch(`${API_URL}/information/${identifier}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao atualizar informação');
        }

        return await response.json();
    } catch (error: string | unknown) {
        throw new Error((error instanceof Error ? error.message : 'Erro na conexão com o servidor'));
    }
}

export async function deleteInformation(
    identifier: string
): Promise<InformationDeleteResponse> {
    try {
        const response = await fetch(`${API_URL}/information/${identifier}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar informação');
        }

        return await response.json();
    } catch (error: string | unknown) {
        throw new Error((error instanceof Error ? error.message : 'Erro na conexão com o servidor'));
    }
}