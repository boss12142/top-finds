"use client";

import { Product } from "@/lib/types";

function StarRating({ rating, reviews }: { rating: number | null; reviews: number }) {
    if (!rating) return null;
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.3;

    return (
        <div className="product-card-rating">
            <span className="stars">
                {"★".repeat(full)}
                {hasHalf ? "★" : ""}
                {"☆".repeat(5 - full - (hasHalf ? 1 : 0))}
            </span>
            <span className="review-count">
                {rating.toFixed(1)} · {reviews >= 1000 ? `${(reviews / 1000).toFixed(1)}k` : reviews}
            </span>
        </div>
    );
}

export default function ProductCard({ product, index }: { product: Product; index?: number }) {
    const priceWhole = product.price ? Math.floor(product.price) : null;
    const priceCents = product.price ? Math.round((product.price % 1) * 100).toString().padStart(2, '0') : null;

    return (
        <div className={`product-card animate-in animate-delay-${Math.min((index || 0) % 4 + 1, 4)}`}>
            <a href={product.affiliate_link} target="_blank" rel="noopener noreferrer nofollow sponsored">
                <div className="product-card-image">
                    {product.rank && <span className="product-card-rank">#{product.rank}</span>}
                    {product.image ? (
                        <img src={product.image} alt={product.title} loading="lazy" />
                    ) : (
                        <span style={{ fontSize: 48, opacity: 0.3 }}>📦</span>
                    )}
                </div>
            </a>

            <div className="product-card-body">
                <StarRating rating={product.rating} reviews={product.num_reviews} />

                <h3 className="product-card-title">{product.title}</h3>

                {priceWhole !== null && (
                    <div className="product-card-price">
                        <span className="currency">$</span>
                        {priceWhole}
                        <span style={{ fontSize: 14, verticalAlign: "super" }}>.{priceCents}</span>
                    </div>
                )}

                <a
                    href={product.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer nofollow sponsored"
                    className="product-card-cta"
                >
                    View on Amazon →
                </a>
            </div>
        </div>
    );
}
