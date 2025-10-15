// interfaces/category.interface.ts

export interface SubCategoryInfo {
    identifier: string;
    name: string;
    category_identifier: string;
    created_at: Date;
    updated_at: Date;
}

export interface CategoryViewResponse {
    identifier: string;
    name: string;
    subCategories: SubCategoryInfo[];
    created_at: Date;
    updated_at: Date;
}

export interface CategoryCreateRequest {
    name: string;
    subCategoryNames?: string[];
}

export interface CategoryCreateResponse {
    identifier: string;
    name: string;
    subCategories: SubCategoryInfo[];
    created_at: Date;
    updated_at: Date;
}

export interface CategoryUpdateRequest {
    name?: string;
}

export interface CategoryUpdateResponse {
    identifier: string;
    name: string;
    subCategories: SubCategoryInfo[];
    created_at: Date;
    updated_at: Date;
}

export interface CategoryDeleteResponse {
    identifier: string;
    message: string;
    deleted_at: Date;
}

export interface SubCategoryCreateRequest {
    name: string;
    category_identifier: string;
}

export interface SubCategoryCreateResponse {
    identifier: string;
    name: string;
    category_identifier: string;
    created_at: Date;
    updated_at: Date;
}

export interface SubCategoryDeleteResponse {
    identifier: string;
    message: string;
    deleted_at: Date;
}