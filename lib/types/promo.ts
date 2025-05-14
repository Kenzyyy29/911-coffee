export interface Promo {
 id: string;
 name: string;
 description: string;
 category: PromoCategory;
 price: number;
 imageUrl: string;
 isActive: boolean;
 createdAt: string;
 outletId: string;
}

export type PromoCategory =
 | "Sarapan Pagi & Ngopi Pagi"
 | "Makan Siang"
 | "Ngopi Sore";

export const promoCategories: Record<PromoCategory, {timeRange: string}> = {
 "Sarapan Pagi & Ngopi Pagi": {timeRange: "08:00 - 10:00"},
 "Makan Siang": {timeRange: "11:00 - 15:00"},
 "Ngopi Sore": {timeRange: "15:00 - 18:00"},
};

export const categoryOrder: PromoCategory[] = [
 "Sarapan Pagi & Ngopi Pagi",
 "Makan Siang",
 "Ngopi Sore",
];

// Fungsi untuk normalisasi kategori (handle versi lama dan baru)
export const normalizeCategory = (category: string): PromoCategory => {
 const lowerCaseCategory = category.toLowerCase().trim();

 if (
  lowerCaseCategory.includes("sarapan") ||
  lowerCaseCategory.includes("pagi")
 ) {
  return "Sarapan Pagi & Ngopi Pagi";
 }
 if (lowerCaseCategory.includes("siang")) {
  return "Makan Siang";
 }
 if (lowerCaseCategory.includes("sore")) {
  return "Ngopi Sore";
 }

 // Default fallback
 return "Makan Siang";
};
