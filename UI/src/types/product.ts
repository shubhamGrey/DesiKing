export interface PriceAndSku {
  id: string;
  price: number;
  isDiscounted: boolean;
  discountPercentage: number;
  discountedAmount: number;
  skuNumber: string;
  weightId: string;
  weightValue: number;
  weightUnit: string;
  currencyCode: string;
  currencyId: string;
  barcode: string;
  createdDate: string;
  modifiedDate: string | null;
  isActive: boolean;
  isDeleted: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  brandId: string;
  categoryId: string;
  categoryName: string;
  manufacturingDate: string;
  createdDate: string;
  modifiedDate: string | null;
  isActive: boolean;
  isDeleted: boolean;
  metaTitle: string;
  metaDescription: string;
  imageUrls: string[];
  keyFeatures: string[];
  uses: string[];
  origin: string;
  shelfLife: string;
  storageInstructions: string;
  certifications: string[];
  isPremium: boolean;
  isFeatured: boolean;
  ingredients: string;
  nutritionalInfo: string;
  thumbnailUrl?: string;
  pricesAndSkus: PriceAndSku[];
}
export interface ProductFormData {
  // Product fields
  id?: string;
  name: string;
  description: string;
  brandId?: string;
  brand?: string;
  categoryId?: string;
  category?: string;
  categoryName?: string;
  manufacturingDate?: string;
  createdDate?: string;
  modifiedDate?: string | null;
  isActive?: boolean;
  isDeleted?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  imageUrls?: (string | File)[];
  keyFeatures: string[];
  uses: string[];
  origin: string;
  shelfLife: string;
  storageInstructions: string;
  certifications: string[];
  isPremium: boolean;
  isFeatured: boolean;
  ingredients?: string;
  nutritionalInfo?: string;
  thumbnailUrl?: string;
  thumbnailImage?: File | null;
  stock?: number;
  // PriceAndSku fields (as array)
  pricesAndSkus: Array<{
    id?: string;
    price: number;
    isDiscounted: boolean;
    discountPercentage: number;
    discountedAmount: number;
    skuNumber: string;
    weightId: string;
    weightValue: number;
    weightUnit: string;
    currencyCode: string;
    currencyId: string;
    barcode: string;
    createdDate?: string;
    modifiedDate?: string | null;
    isActive?: boolean;
    isDeleted?: boolean;
  }>;
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
  id: string;
  title: string;
  image: string;
};

export interface Weight {
  id: string;
  value: number;
  unit: string;
}

export interface FormattedWeight {
  label: string;
  value: string;
}

export interface Currency {
  id: string;
  code: string;
  name: string;
}

export interface FormattedCurrency {
  label: string;
  value: string;
}
