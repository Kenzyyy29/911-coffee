export interface Menu {
    id: string;
    name: string;
    description: string;
    price: number;
    taxIds: string[];
    outletId: string;
    imageUrl: string;
    isAvailable: boolean;
    createdAt: string;
    category: string;
}