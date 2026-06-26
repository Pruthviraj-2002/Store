export interface Product {
  id: string;
  brand: string;
  title: string;
  price: number;
  stock: number;
  stockText: string;
  imageUrl: string;
  // Add these missing properties:
  mfrPartNo: string;
  sktPartNo: string;
  rating: number;
  reviews: number;
  features: string[];
  description: string;
  specifications: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
}