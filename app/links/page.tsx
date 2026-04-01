import { Metadata } from "next";
import { getLatestProducts } from "@/lib/products";
import { Product } from "@/lib/types";

export const metadata: Metadata = {
    title: "Latest Picks | Top Finds Store",
    description: "Our latest curated product picks from Amazon. Click to shop the deals featured in our latest videos.",
};

export const revalidate = 30;

export default async function LinksPage() {
    const products = await getLatestProducts(12);

    return (
        <div className="linkinbio">
            <div className="linkinbio-avatar">TF</div>
            <h1>Top Finds</h1>
            <p>🔥 Shop our latest picks from our videos</p>

            {products.length > 0 ? (
                products.map((product: Product) => (
                    <a
                        key={product.asin}
                        href={product.affiliate_link}
                        target="_blank"
                        rel="noopener noreferrer nofollow sponsored"
                        className="linkinbio-item"
                    >
                        {product.image ? (
                            <img src={product.image} alt={product.title} className="linkinbio-item-image" loading="lazy" />
                        ) : (
                            <div className="linkinbio-item-image" style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                                📦
                            </div>
                        )}
                        <div className="linkinbio-item-info">
                            <div className="linkinbio-item-title">{product.title}</div>
                            <div className="linkinbio-item-price">{product.price_display || `$${product.price}`}</div>
                        </div>
                        <span className="linkinbio-item-arrow">→</span>
                    </a>
                ))
            ) : (
                <div className="empty-state" style={{ padding: 40 }}>
                    <div className="empty-state-icon">🔍</div>
                    <h3>New picks coming soon!</h3>
                    <p>Check back after our next video drops.</p>
                </div>
            )}

            <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 24, textAlign: "center", lineHeight: 1.4 }}>
                As an Amazon Associate, I earn from qualifying purchases. (paid links)
            </p>
        </div>
    );
}
