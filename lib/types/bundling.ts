// /lib/types/bundling.ts
export interface Bundling {
    id: string;
    name: string;
    description: string;
    outletId: string;
    price: number;
    taxIds: string[];
    imageUrl: string;
    menuIds: string[]; // IDs of menus included in this bundle
    isAvailable: boolean;
    createdAt: string;
  }