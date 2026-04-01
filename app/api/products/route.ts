import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';

// GET: Fetch all products
export async function GET() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('rank', { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ products: data, last_updated: new Date().toISOString() });
}

// POST: April pushes new/updated products
export async function POST(request: NextRequest) {
    try {
        const authKey = request.headers.get('x-api-key');
        const expectedKey = process.env.API_KEY || 'topfinds-update-2026';

        if (authKey !== expectedKey) {
            return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
        }

        const body = await request.json();

        if (!body.products || !Array.isArray(body.products)) {
            return NextResponse.json({ error: 'Body must include "products" array.' }, { status: 400 });
        }

        const products = body.products.map((p: Product) => ({
            ...p,
            added_at: p.added_at || new Date().toISOString(),
        }));

        const { error, count } = await supabase
            .from('products')
            .upsert(products, { onConflict: 'asin' });

        if (error) throw new Error(error.message);

        return NextResponse.json({
            success: true,
            updated: count || products.length,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        return NextResponse.json({ error: `Server error: ${error}` }, { status: 500 });
    }
}
