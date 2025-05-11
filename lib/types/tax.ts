// types/tax.ts
export interface Tax {
 id: string;
 name: string;
 rate: number; // percentage
 description?: string;
 isActive: boolean;
 createdAt?: string;
 updatedAt?: string;
}
