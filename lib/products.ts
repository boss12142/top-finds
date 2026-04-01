import { supabase } from './supabase';
import { Product, ProductsData } from './types';

export async function getProducts(): Promise<ProductsData> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('added_at', { ascending: false })
        .limit(6);

    if (error || !data) {
        return { products: [], last_updated: new Date().toISOString(), featured_category: 'electronics' };
    }

    // Sort the most recent products by their rank so they display in the correct order
    const sortedProducts = (data as Product[]).sort((a, b) => (a.rank || 99) - (b.rank || 99));

    return {
        products: sortedProducts,
        last_updated: new Date().toISOString(),
        featured_category: 'electronics',
    };
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
    if (!category || category === 'all') {
        const data = await getProducts();
        return data.products;
    }

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('category', category)
        .order('added_at', { ascending: false })
        .limit(6);

    return error ? [] : (data as Product[]).sort((a, b) => (a.rank || 99) - (b.rank || 99));
}

export async function getLatestProducts(limit: number = 10): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('added_at', { ascending: false })
        .limit(limit);

    return error ? [] : (data as Product[]);
}

export async function addProducts(newProducts: Product[]): Promise<{ count: number }> {
    // Upsert based on ASIN (insert or update if exists)
    const productsWithTimestamp = newProducts.map(p => ({
        ...p,
        added_at: p.added_at || new Date().toISOString(),
    }));

    const { error, count } = await supabase
        .from('products')
        .upsert(productsWithTimestamp, { onConflict: 'asin' });

    if (error) throw new Error(error.message);
    return { count: count || newProducts.length };
}

export async function getCategories(): Promise<string[]> {
    const { data } = await supabase
        .from('products')
        .select('category');

    if (!data) return [];
    const cats = new Set<string>(data.map((p: { category: string }) => p.category));
    return Array.from(cats);
}

export function generateStars(rating: number | null): string {
    if (!rating) return '';
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

export function formatReviews(count: number): string {
    if (!count) return '';
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
}
