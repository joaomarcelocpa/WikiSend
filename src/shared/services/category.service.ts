import { getAuthToken } from './login.service';
import type {
    CategoryViewResponse,
    CategoryCreateRequest,
    CategoryCreateResponse,
    CategoryUpdateRequest,
    CategoryUpdateResponse,
    CategoryDeleteResponse,
    SubCategoryCreateRequest,
    SubCategoryCreateResponse,
    SubCategoryDeleteResponse,
} from '../interfaces/category.interface.ts';

const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders(): HeadersInit {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };
}

// Categorias
export async function getAllCategories(): Promise<CategoryViewResponse[]> {
    try {
        const response = await fetch(`${API_URL}/category`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar categorias');
        }

        return await response.json();
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Erro na conexão com o servidor');
    }
}

export async function getCategoryById(identifier: string): Promise<CategoryViewResponse> {
    try {
        const response = await fetch(`${API_URL}/category/${identifier}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Categoria não encontrada');
        }

        return await response.json();
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Erro na conexão com o servidor');
    }
}

export async function createCategory(data: CategoryCreateRequest): Promise<CategoryCreateResponse> {
    try {
        const response = await fetch(`${API_URL}/category`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao criar categoria');
        }

        return await response.json();
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Erro na conexão com o servidor');
    }
}

export async function updateCategory(
    identifier: string,
    data: CategoryUpdateRequest
): Promise<CategoryUpdateResponse> {
    try {
        const response = await fetch(`${API_URL}/category/${identifier}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao atualizar categoria');
        }

        return await response.json();
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Erro na conexão com o servidor');
    }
}

export async function deleteCategory(identifier: string): Promise<CategoryDeleteResponse> {
    try {
        const response = await fetch(`${API_URL}/category/${identifier}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar categoria');
        }

        return await response.json();
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Erro na conexão com o servidor');
    }
}

// Subcategorias
export async function createSubCategory(data: SubCategoryCreateRequest): Promise<SubCategoryCreateResponse> {
    try {
        const response = await fetch(`${API_URL}/category/subcategory`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao criar subcategoria');
        }

        return await response.json();
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Erro na conexão com o servidor');
    }
}

export async function deleteSubCategory(identifier: string): Promise<SubCategoryDeleteResponse> {
    try {
        const response = await fetch(`${API_URL}/category/subcategory/${identifier}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar subcategoria');
        }

        return await response.json();
    } catch (error: unknown) {
        throw new Error(error instanceof Error ? error.message : 'Erro na conexão com o servidor');
    }
}