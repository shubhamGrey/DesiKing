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
  hsnCode: string;
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
  hsnCode?: string;
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

export interface BrandInfo {
  isSuccess: boolean;
  code: string;
  message: string;
}

export interface BrandData {
  id: string;
  name: string;
  code: string;
  description: string | null;
  logoUrl: string | null;
  createdDate: string;
  modifiedDate: string | null;
  isActive: boolean;
  isDeleted: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface Brand {
  info: BrandInfo;
  id: string | null;
  data: BrandData[];
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

export interface CategoryFormData {
  name: string;
  description: string;
  brandId?: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive?: boolean;
  imageUrl?: string;
}

export interface BrandFormData {
  name: string;
  code?: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive?: boolean;
  logoUrl?: string;
}

export interface FormattedCategory {
  id: string;
  title: string;
  image: string;
}

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
