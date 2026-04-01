import { Product, ProductsData } from './types';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

function getDefaultData(): ProductsData {
    return {
        products: [],
        last_updated: new Date().toISOString(),
        featured_category: "electronics",
    };
}

export function getProducts(): ProductsData {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return getDefaultData();
        }
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw) as ProductsData;
    } catch {
        return getDefaultData();
    }
}

export function getProductsByCategory(category: string): Product[] {
    const data = getProducts();
    if (!category || category === 'all') return data.products;
    return data.products.filter(p => p.category.toLowerCase() === category.toLowerCase());
}

export function getLatestProducts(limit: number = 10): Product[] {
    const data = getProducts();
    return [...data.products]
        .sort((a, b) => {
            const dateA = a.added_at ? new Date(a.added_at).getTime() : 0;
            const dateB = b.added_at ? new Date(b.added_at).getTime() : 0;
            return dateB - dateA;
        })
        .slice(0, limit);
}

export function saveProducts(data: ProductsData): void {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function addProducts(newProducts: Product[]): ProductsData {
    const data = getProducts();

    for (const product of newProducts) {
        const existingIndex = data.products.findIndex(p => p.asin === product.asin);
        if (existingIndex >= 0) {
            // Update existing
            data.products[existingIndex] = { ...data.products[existingIndex], ...product };
        } else {
            // Add new with timestamp
            data.products.push({
                ...product,
                added_at: product.added_at || new Date().toISOString(),
            });
        }
    }

    data.last_updated = new Date().toISOString();
    saveProducts(data);
    return data;
}

export function getCategories(): string[] {
    const data = getProducts();
    const cats = new Set(data.products.map(p => p.category));
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
