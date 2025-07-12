export interface BaseContent {
    id: string;
    plainTextContent: string;
    tiptapSchemaContent: string;
}

export interface PostContent extends BaseContent {
    likes: number;
    comments: number;
}