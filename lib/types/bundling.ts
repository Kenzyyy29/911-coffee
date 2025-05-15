export interface Bundling {
  id: string;
  name: string;
  description: string;
  outletId: string;
  price: number;
  taxIds: string[];
  imageUrl: string;
  menuItems: {
    id: string;
    name: string;
    quantity: number;
  }[];
  isAvailable: boolean;
  createdAt: string;
}