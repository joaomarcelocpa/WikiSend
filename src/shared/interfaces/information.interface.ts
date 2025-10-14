export interface CategoryInfo {
    value: string;
    label: string;
}

export interface CategoryHierarchyResponse {
    mainCategories: CategoryInfo[];
    subCategories: Record<string, CategoryInfo[]>;
}

export interface FileInfo {
    id: number;
    originalName: string;
    fileName: string;
    path: string;
    mimetype: string;
    size: number;
    uploaded_at: Date;
}

export interface InformationCreateRequest {
    question: string;
    content: string;
    file_identifier?: number;
    main_category: string;
    sub_category: string;
}

export interface InformationCreateResponse {
    identifier: string;
    question: string;
    content: string;
    file?: FileInfo;
    file_identifier?: number;
    main_category: string;
    sub_category: string;
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
    main_category: string;
    sub_category: string;
    user_identifier: string;
    user_name: string;
    created_at: Date;
    updated_at: Date;
}

export interface InformationUpdateRequest {
    question?: string;
    content?: string;
    file_identifier?: number;
    main_category?: string;
    sub_category?: string;
}

export interface InformationDeleteResponse {
    identifier: string;
    message: string;
    deleted_at: Date;
}