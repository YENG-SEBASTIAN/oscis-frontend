
// export interface ProductInterface {
//     id: string;
//     name: string;
//     price: number;
//     originalPrice: number;
//     image: string;
//     description?: string;
//     rating: number;
//     reviews: number;
//     badge?: string | null;
//     category: string;
// }



export interface CategoryInterface {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: ImageInterface;
  alt_text: string;
  display_order: number;
  is_active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}


export interface ImageInterface {
  id: string;
  name: string;
  url: string;
  file_type: string;
  mime_type: string;
  file_size: string;
  dimensions: {
    width: number;
    height: number;
  };
  alt_text?: string | null;
  created_at: string;
}


export interface ProductImage {
  id: string;
  name: string;
  url: string;
  file_type: string;
  mime_type: string;
  file_size: string;
  dimensions: {
    width: number;
    height: number;
  };
  alt_text?: string | null;
  created_at: string;
}

export interface ProductImageWrapper {
  id: string;
  image: ProductImage;
  alt_text?: string | null;
  display_order: number;
}

export interface ProductFeature {
  product?: string;
  title?: string;
  description: string;
  order?: number;
}

export interface ConditionGuideItem {
  product?: string;
  rating: string;
  description: string;
  order?: number;
}

export interface ProductInterface {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number;
  rating: number;
  review_count: number;
  badge?: string;
  is_featured: boolean;
  is_active: boolean;
  category: CategoryInterface;
  primary_image?: ProductImage;
  images: ProductImageWrapper[];
  discount_percentage: number;
  features: ProductFeature[];
  condition_guide: ConditionGuideItem[];
  created_at: string;
  updated_at: string;
}
