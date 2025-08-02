
export interface ProductInterface {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    description?: string;
    rating: number;
    reviews: number;
    badge?: string | null;
    category: string;
}

export interface CategoryInterface {
    id: string;
    name: string;
    slug: string;
    count: string;
    image: string;
    description?: string;
    products: ProductInterface[];
}