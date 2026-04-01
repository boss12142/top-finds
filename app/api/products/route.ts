import { NextRequest, NextResponse } from 'next/server';
import { getProducts, addProducts } from '@/lib/products';

// GET: Fetch all products
export async function GET() {
    const data = getProducts();
    return NextResponse.json(data);
}

// POST: Add or update products (used by April/Cinema Agent)
export async function POST(request: NextRequest) {
    try {
        // Simple auth via header
        const authKey = request.headers.get('x-api-key');
        const expectedKey = process.env.API_KEY || 'topfinds-update-2026';

        if (authKey !== expectedKey) {
            return NextResponse.json(
                { error: 'Unauthorized. Include x-api-key header.' },
                { status: 401 }
            );
        }

        const body = await request.json();

        if (!body.products || !Array.isArray(body.products)) {
            return NextResponse.json(
                { error: 'Body must include "products" array.' },
                { status: 400 }
            );
        }

        const updated = addProducts(body.products);

        return NextResponse.json({
            success: true,
            total_products: updated.products.length,
            last_updated: updated.last_updated,
        });
    } catch (error) {
        return NextResponse.json(
            { error: `Server error: ${error}` },
            { status: 500 }
        );
    }
}
