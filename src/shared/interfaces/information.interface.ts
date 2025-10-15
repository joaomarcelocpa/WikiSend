export interface FileInfo {
    id: number;
    originalName: string;
    fileName: string;
    path: string;
    mimetype: string;
    size: number;
    uploaded_at: Date;
}

export interface CategoryInfoDto {
    identifier: string;
    name: string;
}

export interface SubCategoryInfoDto {
    identifier: string;
    name: string;
    category_identifier: string;
}

export interface InformationCreateRequest {
    question: string;
    content: string;
    file_identifier?: number;
    category_identifier: string;
    sub_category_identifier: string;
}

export interface InformationCreateResponse {
    identifier: string;
    question: string;
    content: string;
    file?: FileInfo;
    file_identifier?: number;
    category_identifier: string;
    category: CategoryInfoDto;
    sub_category_identifier: string;
    subCategory: SubCategoryInfoDto;
    user_identifier: string;
    user_name: string;
    created_at: Date;
    updated_at: Date;
}

export interface InformationViewResponse {
    identifier: string;
    question: string;
    content: string;
    file?: FileInfo;
    file_identifier?: number;
    category_identifier: string;
    category: CategoryInfoDto;
    sub_category_identifier: string;
    subCategory: SubCategoryInfoDto;
    user_identifier: string;
    user_name: string;
    created_at: Date;
    updated_at: Date;
}

export interface InformationUpdateRequest {
    question?: string;
    content?: string;
    file_identifier?: number;
    category_identifier?: string;
    sub_category_identifier?: string;
}

export interface InformationDeleteResponse {
    identifier: string;
    message: string;
    deleted_at: Date;
}