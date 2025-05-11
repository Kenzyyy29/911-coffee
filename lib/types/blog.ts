export interface BlogPost {
    id?: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featuredImage: string;
    author: string;
    tags: string[];
    isPublished: boolean;
    publishedAt?: Date | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}