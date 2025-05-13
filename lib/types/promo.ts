export interface Promo {
 id: string;
 name: string;
 description: string;
 category: string;
 price: number;
 imageUrl: string;
 isActive: boolean;
 createdAt: string;
 outletId: string;
}

export type PromoCategory =
 | "sarapan & ngopi pagi"
 | "makan siang"
 | "ngopi sore";
