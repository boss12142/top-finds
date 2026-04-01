import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Proxy Amazon images to bypass CDN hotlink protection
export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    // Only proxy Amazon CDN domains
    const allowed = [
        'm.media-amazon.com',
        'images-na.ssl-images-amazon.com',
        'images-eu.ssl-images-amazon.com',
        'images.unsplash.com',
    ];

    const isAllowed = allowed.some(domain => url.includes(domain));
    if (!isAllowed) {
        return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
    }

    try {
        const res = await fetch(url, {
            headers: {
                // Fetch without referer so Amazon CDN doesn't block us
                'User-Agent': 'Mozilla/5.0 (compatible; TopFindsBot/1.0)',
                'Accept': 'image/webp,image/avif,image/*,*/*',
            },
            next: { revalidate: 86400 }, // Cache for 24 hours
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch image' }, { status: 502 });
        }

        const contentType = res.headers.get('content-type') || 'image/jpeg';
        const buffer = await res.arrayBuffer();

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch {
        return NextResponse.json({ error: 'Proxy error' }, { status: 500 });
    }
}
