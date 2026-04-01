export interface Product {
    asin: string;
    title: string;
    price: number | null;
    price_display: string;
    rating: number | null;
    num_reviews: number;
    image: string;
    affiliate_link: string;
    category: string;
    rank?: number;
    features?: string[];
    description?: string;
    added_at?: string;
    video_url?: string;
}

export interface ProductsData {
    products: Product[];
    last_updated: string;
    featured_category: string;
}
