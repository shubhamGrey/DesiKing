export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  brand: string;
  price: {
    amount: string;
    currency: string;
    isDiscounted: boolean;
    discountPercentage: number;
    discountedAmount: string;
    weight: string;
  }[];
  sku: {
    sku: string;
    weight: string;
    barcode: string;
  }[];
  stock: number;
  keyFeatures: string[];
  uses: string[];
  ingredients?: string;
  origin: string;
  shelfLife: string;
  manufacturingDate?: string;
  storageInstructions: string;
  nutritionalInfo?: string;
  certifications: string[];
  isPremium: boolean;
  isFeatured: boolean;
  isActive?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  imageUrls?: File[];
  thumbnailImage?: File | null;
}

export interface Brand {
  name: string;
  id: string;
  isActive: boolean;
}

export interface FormattedBrand {
  label: string;
  value: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  isActive: boolean;
}

export interface FormattedCategory {
  label: string;
  value: string;
}
